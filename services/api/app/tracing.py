"""
tracing.py
==========
Optional export of agent runs to Langfuse.

Off by default. With no keys set every function here is a no-op and the API
behaves exactly as it does without this file, which is the only acceptable
shape for observability added three days before a submission: it must not be
able to break the thing it is observing.

Why Langfuse when we already built the glass box: they answer different
questions. /glassbox shows ONE run in full, live, to convince a person in the
room that the reasoning is code. Langfuse shows EVERY run over time, which is
what tells us the corpus has a gap.

The number worth watching is the abstention rate. A rising one is the earliest
signal that the SOP corpus no longer covers what staff are actually hitting,
and it is invisible in any single run.

Nothing here is on the request path: export happens after the response is
built, failures are swallowed, and there is no network call the user waits on.
"""

from __future__ import annotations

import os
from typing import Any

LANGFUSE_PUBLIC = os.environ.get("LANGFUSE_PUBLIC_KEY", "")
LANGFUSE_SECRET = os.environ.get("LANGFUSE_SECRET_KEY", "")
LANGFUSE_HOST = os.environ.get("LANGFUSE_HOST", "https://cloud.langfuse.com")

_client: Any = None
_disabled = False


def enabled() -> bool:
    return bool(LANGFUSE_PUBLIC and LANGFUSE_SECRET) and not _disabled


def _client_or_none():
    """Import lazily. langfuse is an optional dependency and the service must
    start without it installed."""
    global _client, _disabled
    if _client is not None or _disabled or not enabled():
        return _client
    try:
        from langfuse import Langfuse                         # noqa: PLC0415
        _client = Langfuse(public_key=LANGFUSE_PUBLIC,
                           secret_key=LANGFUSE_SECRET,
                           host=LANGFUSE_HOST)
    except Exception:                                         # noqa: BLE001
        # Missing package, bad keys, unreachable host. Any of them means we
        # carry on without tracing rather than fail a coaching run.
        _disabled = True
        _client = None
    return _client


def export_run(*, staff_id: str, result: dict, trace: dict | None) -> None:
    """Record one agent run. Never raises."""
    client = _client_or_none()
    if client is None:
        return
    try:
        trace = trace or {}
        status = result.get("status", "unknown")
        span = client.trace(
            name="coaching_run",
            user_id=staff_id,
            # Tagged so the two views a reviewer wants are one filter away:
            # every abstention, and every run where a provider fell back.
            tags=[status,
                  result.get("classification") or "unclassified",
                  *(["fell_back"] if any(c.get("fell_back")
                                         for c in trace.get("calls", [])) else [])],
            metadata={
                "citations": len(result.get("citations", [])),
                "repair_attempts": result.get("repair_attempts"),
                "abstain_reason": result.get("abstain_reason"),
                "escalation": (result.get("escalation") or {}).get("rule_id"),
                "decisions_by_code": trace.get("decisions_by_code"),
                "decisions_by_model": trace.get("decisions_by_model"),
                "total_ms": trace.get("total_ms"),
            },
        )
        for call in trace.get("calls", []):
            span.generation(
                name=call.get("task"),
                model=call.get("model"),
                metadata={"provider": call.get("provider"),
                          "fell_back": call.get("fell_back", False)},
                usage_details={
                    "input": call.get("prompt_tokens", 0),
                    "output": call.get("completion_tokens", 0),
                },
            )
        # The pipeline is short-lived per request, so flush rather than rely on
        # an atexit hook that a container will not run.
        client.flush()
    except Exception:                                         # noqa: BLE001
        pass


def status() -> dict:
    """Surfaced on /health so a misconfigured key is visible before a demo."""
    if not (LANGFUSE_PUBLIC and LANGFUSE_SECRET):
        return {"configured": False}
    return {"configured": True, "host": LANGFUSE_HOST,
            "connected": _client_or_none() is not None}
