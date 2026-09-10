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

from . import demo
from . import queries as q
from . import practice
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
        staff_id = q.resolve_staff_ref(cur, staff_id) or staff_id
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
        staff_id = q.resolve_staff_ref(cur, staff_id) or staff_id
        if not q.staff_by_id(cur, staff_id):
            raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                      "detail": "No such staff member"})
        return q.transfer_gap(cur, staff_id)


# ---------------------------------------------------------------- observations

@app.get("/api/v1/observations")
def get_observations(x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        return q.list_observations(cur)


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
        payload["staff_id"] = (q.resolve_staff_ref(cur, payload["staff_id"])
                               or payload["staff_id"])
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
        return recs.listing(cur, status)


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
        staff_id = q.resolve_staff_ref(cur, staff_id) or staff_id
        result = run_coaching(cur, actor, staff_id, trace=Trace())
        rec_id = recs.persist(cur, actor, staff_id, result)
    return {"recommendation_id": rec_id, **result}


# ---------------------------------------------------------------- insights

@app.get("/api/v1/insights/team")
def team_insights(x_ce_actor: str | None = Header(default=None)):
    """k-anonymised cohort patterns.

    `suppressed` is deliberately visible. Telling a manager that two patterns
    were hidden because the group was too small demonstrates the control is
    working; silently omitting them would look like there was nothing there.
    """
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        return q.team_insights(cur)


# ---------------------------------------------------------------- glass box
#
# Three endpoints whose only job is to let someone check our claims instead of
# believing them. They call production code paths; see demo.py.

@app.post("/api/v1/demo/trace/{staff_id}")
def demo_trace(staff_id: str, x_ce_actor: str | None = Header(default=None)):
    """Run the agent and return the whole pipeline, step by step."""
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        staff_id = q.resolve_staff_ref(cur, staff_id) or staff_id
        return demo.trace_run(cur, actor, staff_id)


@app.get("/api/v1/demo/gate")
def demo_gate(staff_id: str = "Diego",
              x_ce_actor: str | None = Header(default=None)):
    """Put deliberately bad citations through the real cite gate."""
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        resolved = q.resolve_staff_ref(cur, staff_id) or staff_id
        return demo.gate_probe(cur, resolved)


@app.get("/api/v1/demo/rls")
def demo_rls(staff_id: str = "Aoife",
             x_ce_actor: str | None = Header(default=None)):
    """Ask one question as three different people."""
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        resolved = q.resolve_staff_ref(cur, staff_id) or staff_id
        return demo.rls_proof(cur, resolved)


# ---------------------------------------------------------------- practice

@app.get("/api/v1/scenarios")
def get_scenarios(x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        return practice.list_scenarios(cur, actor.staff_id)


@app.post("/api/v1/scenarios/{scenario_id}/attempts", status_code=201)
def start_attempt(scenario_id: str, x_ce_actor: str | None = Header(default=None),
                  idempotency_key: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        return practice.start_attempt(cur, actor, scenario_id, actor.staff_id)


@app.post("/api/v1/attempts/{attempt_id}/turns")
def add_turn(attempt_id: str, payload: dict,
             x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    content = (payload.get("content") or "").strip()
    if not content:
        raise HTTPException(422, {"type": "empty-turn", "title": "Empty turn",
                                  "detail": "content is required"})
    with session(actor) as cur:
        out = practice.add_turn(cur, actor, attempt_id, content, trace=Trace())
    if out.get("error"):
        raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                  "detail": "No such attempt"})
    return out


@app.post("/api/v1/attempts/{attempt_id}/complete")
def finish_attempt(attempt_id: str, x_ce_actor: str | None = Header(default=None),
                   idempotency_key: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        out = practice.complete_attempt(cur, actor, attempt_id, trace=Trace())
    if out.get("error"):
        raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                  "detail": "No such attempt"})
    return out


@app.get("/api/v1/attempts/{attempt_id}")
def read_attempt(attempt_id: str, x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        a = practice.get_attempt(cur, attempt_id)
    if not a:
        raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                  "detail": "No such attempt"})
    return a


# ---------------------------------------------------------------- debrief

@app.post("/api/v1/debriefs", status_code=202)
def post_debrief(payload: dict, x_ce_actor: str | None = Header(default=None),
                 idempotency_key: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        out = practice.create_debrief(cur, actor, actor.staff_id,
                                      text=payload.get("text"), trace=Trace())
    # 202 with a registration, not the finished object. The pipeline is
    # synchronous today, but the client polls by id either way, so the contract
    # already holds when transcription moves off the request thread.
    return {"id": out["id"], "status": out["status"], "poll_after_ms": 400}


@app.get("/api/v1/debriefs/{debrief_id}")
def get_debrief(debrief_id: str, x_ce_actor: str | None = Header(default=None)):
    actor = actor_from(x_ce_actor)
    with session(actor) as cur:
        cur.execute("""
            SELECT d.id::text, d.status, d.transcript, d.incident,
                   d.standard_why,
                   c.id::text AS chunk_id, c.section_path, c.step_number,
                   c.content AS excerpt, doc.title AS document
            FROM shift_debrief d
            LEFT JOIN sop_chunk c ON c.id = d.standard_chunk_id
            LEFT JOIN sop_document doc ON doc.id = c.document_id
            WHERE d.id = %s
        """, (debrief_id,))
        d = cur.fetchone()
    if not d:
        raise HTTPException(404, {"type": "not-found", "title": "Not found",
                                  "detail": "No such debrief"})

    chunk_id = d.pop("chunk_id", None)
    standard = {
        "chunk_id": chunk_id,
        "document": d.get("document"),
        "section_path": d.get("section_path"),
        "step_number": d.get("step_number") or 0,
        "excerpt": (d.get("excerpt") or "")[:600],
        "why_shown": d.get("standard_why") or "",
    } if chunk_id else None
    for k in ("document", "section_path", "step_number", "excerpt",
              "standard_why"):
        d.pop(k, None)
    d["standard"] = standard
    d["generated_scenario_id"] = None
    return d
