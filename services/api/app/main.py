"""
main.py
=======
The Coaching Engine API. Serves contracts/openapi.yaml over the real database.

Design notes worth knowing before changing anything:

* Identity comes from the X-CE-Actor header (a display name or staff id) and is
  resolved per request. That is demo-grade on purpose: real deployment reads a
  verified JWT, and swapping it means changing one function. What is NOT
  demo-grade is what happens next, because the resolved identity is pushed into
  the database session and every policy in db/policies.sql applies from there.

* There is no permission checking in this file. If a manager may not see a
  practice score, the database returns no row. Authorisation implemented twice
  is authorisation implemented wrong.

* The 409 on GET /staff/{id}/scores?source=practice is not a permission error.
  It is a sequencing rule, and the message says so, because the manager has
  done nothing wrong: they simply have to log their own observation first.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from . import queries as q
from . import recommendations as recs
from .agent import run_coaching
from .db import Actor, pool, resolve_actor, session
from .providers import Trace, available

DEFAULT_ACTOR = os.environ.get("CE_DEFAULT_ACTOR", "Marta")


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool.open()
    yield
    pool.close()


app = FastAPI(
    title="The Coaching Engine API",
    version="0.1.0",
    description="Two independent evidence streams per staff member, reasoned "
                "over to produce grounded, cited coaching a manager verifies.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------- errors

def problem(status: int, type_: str, title: str, detail: str, instance=None):
    """RFC 9457 problem+json, matching what the frontend already parses."""
    return JSONResponse(
        status_code=status,
        media_type="application/problem+json",
        content={"type": f"https://coachingengine.app/errors/{type_}",
                 "title": title, "status": status, "detail": detail,
                 "instance": instance},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return problem(exc.status_code, exc.detail.get("type", "error"),
                       exc.detail.get("title", "Error"),
                       exc.detail.get("detail", ""), str(request.url.path))
    return problem(exc.status_code, "error", "Error", str(exc.detail),
                   str(request.url.path))


def actor_from(header: str | None) -> Actor:
    a = resolve_actor(header or DEFAULT_ACTOR)
    if a is None:
        raise HTTPException(401, {
            "type": "unknown-actor", "title": "Unknown actor",
            "detail": f"No staff member matches '{header or DEFAULT_ACTOR}'. "
                      f"Send X-CE-Actor with a display name, e.g. Marta or Diego."})
    return a


# ---------------------------------------------------------------- meta

@app.get("/health")
def health():
    try:
        with session() as cur:
            cur.execute("SELECT 1 AS ok")
            cur.fetchone()
        return {"status": "ok", "database": "up", "providers": available()}
    except Exception as e:
        return JSONResponse(status_code=503,
                            content={"status": "degraded", "database": str(e)[:120]})


@app.get("/api/v1/staff")
def get_staff(x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        return {"staff": q.list_staff(cur), "viewer": {
            "id": actor.staff_id, "name": actor.display_name, "role": actor.role}}


# ---------------------------------------------------------------- scores

@app.get("/api/v1/staff/{staff_id}/scores")
def get_scores(staff_id: str, source: str = "floor",
               x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    if source not in ("practice", "floor"):
        raise HTTPException(422, {"type": "bad-source", "title": "Invalid source",
                                  "detail": "source must be practice or floor"})

    with session(actor) as cur:
        # The sequencing gate. Checked explicitly so we can return a 409 that
        # explains itself, rather than an empty list the UI would have to guess
        # the meaning of. RLS enforces it regardless; this is the good error.
        if (source == "practice" and actor.role == "manager"
                and not q.has_observed(cur, actor.staff_id, staff_id)):
            raise HTTPException(409, {
                "type": "observation-required",
                "title": "Observation required before practice scores are readable",
                "detail": "Log your own observation of this staff member before "
                          "viewing their practice history. This keeps the two "
                          "evidence streams independent, which is what makes the "
                          "transfer gap mean anything."})
        return q.scores_response(cur, staff_id, source)


@app.get("/api/v1/staff/{staff_id}/gap")
def get_gap(staff_id: str, x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        if not q.staff_by_id(cur, staff_id):
            raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                      "detail": "No such staff member"})
        return q.transfer_gap(cur, staff_id)


# ---------------------------------------------------------------- observations

@app.post("/api/v1/observations", status_code=201)
def post_observation(payload: dict, x_ce_actor: str | None = Header(default=None),
                     idempotency_key: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    if actor.role not in ("manager", "ld_admin"):
        raise HTTPException(403, {"type": "role-required", "title": "Manager only",
                                  "detail": "Only a manager can log an observation."})
    for field in ("staff_id", "observed_at", "context", "what_happened"):
        if not payload.get(field):
            raise HTTPException(422, {"type": "missing-field", "title": "Missing field",
                                      "detail": f"'{field}' is required"})

    with session(actor) as cur:
        obs_id = q.create_observation(cur, actor, payload)
        q.audit(cur, actor, "observation.logged", obs_id,
                {"staff_id": payload["staff_id"],
                 "dimensions": [r["dimension"] for r in payload.get("ratings", [])]})
        cur.connection.commit()

        # True from this moment: the manager's own judgement is recorded, so
        # the practice history is no longer capable of anchoring it.
        unlocked = q.has_observed(cur, actor.staff_id, payload["staff_id"])

    # The agent runs now, synchronously. It takes a few seconds and the manager
    # has just spent twenty of them writing the observation, so making them poll
    # would be worse than making them wait.
    with session(actor) as cur:
        result = run_coaching(cur, actor, payload["staff_id"], trace=Trace())
        rec_id = recs.persist(cur, actor, payload["staff_id"], result)

    return {
        "id": obs_id,
        "unlocked_practice_history": unlocked,
        "recommendation_id": rec_id,
        "recommendation_status": result["status"],
    }


# ---------------------------------------------------------------- calibration

@app.get("/api/v1/calibration")
def get_calibration(x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        return q.calibration(cur)


# ---------------------------------------------------------------- recommendations

@app.get("/api/v1/recommendations")
def list_recommendations(status: str | None = None,
                         x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        return {"recommendations": recs.listing(cur, status)}


@app.get("/api/v1/recommendations/{rec_id}")
def get_recommendation(rec_id: str, x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        rec = recs.get(cur, rec_id)
        if not rec:
            raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                      "detail": "No such recommendation"})
        rec["calibration"] = q.calibration(cur)
        return rec


@app.post("/api/v1/recommendations/{rec_id}/verify")
def verify_recommendation(rec_id: str, payload: dict,
                          x_ce_actor: str | None = Header(default=None),
                          idempotency_key: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    if actor.role not in ("manager", "ld_admin"):
        raise HTTPException(403, {"type": "role-required", "title": "Manager only",
                                  "detail": "Only a manager can verify."})
    verdict = payload.get("verdict")
    if verdict not in ("confirmed", "corrected", "rejected"):
        raise HTTPException(422, {"type": "bad-verdict", "title": "Invalid verdict",
                                  "detail": "verdict must be confirmed, corrected or rejected"})

    with session(actor) as cur:
        out = recs.verify(cur, actor, rec_id, verdict,
                          payload.get("dimension_verdicts", []),
                          payload.get("reason"),
                          payload.get("seconds_to_decide"))
    if out.get("error") == "not_found":
        raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                  "detail": "No such recommendation"})
    if out.get("error") == "already_decided":
        raise HTTPException(409, {"type": "already-decided",
                                  "title": "Already decided",
                                  "detail": f"This was already {out['status']}."})
    return out


@app.post("/api/v1/staff/{staff_id}/coach")
def coach_now(staff_id: str, x_ce_actor: str | None = Header(default=None)):
    """Run the agent on demand. Used by the demo to re-generate without
    logging another observation."""
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        result = run_coaching(cur, actor, staff_id, trace=Trace())
        rec_id = recs.persist(cur, actor, staff_id, result)
    return {"recommendation_id": rec_id, **result}
