"""
providers.py
============
One door to every model provider.

Nothing else in the system calls an AI provider directly. That is deliberate
and it buys three things:

* Tracing. Every call, its token count and its latency pass through one place,
  so "show me what the agent actually did" is a query rather than an
  archaeology exercise.
* Provider swap. Gemini is wired and ready; it is disabled only because the
  Generative Language API has not been enabled on the GCP project. When it is,
  routing a task to Gemini is a one-line change here, not a change at seven
  call sites.
* Failing loudly. A provider outage raises. It never silently falls back to a
  different model, because a silent swap would pollute the calibration series
  that the accuracy claim on stage depends on.

Routing follows 01B section 7: cheap models for schema-constrained extraction,
better models for anything a manager will read.
"""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any

# A bare urllib User-Agent gets a 403 Cloudflare 1010 from Groq. Cost an hour
# to find; leave this here.
UA = "coaching-engine/0.1 (+https://github.com/IronNathanAlvares)"

OPENAI_KEY = os.environ.get("OPENAI_API_KEY", "")
GROQ_KEY = os.environ.get("GROQ_API_KEY", "")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")


class ProviderError(RuntimeError):
    """Raised when a provider fails. Never swallowed, never silently retried
    against a different model."""


@dataclass
class ModelCall:
    """One call, recorded. Collected per agent run for the trace view."""
    task: str
    provider: str
    model: str
    ms: int
    prompt_tokens: int = 0
    completion_tokens: int = 0


@dataclass
class Trace:
    calls: list[ModelCall] = field(default_factory=list)

    @property
    def total_ms(self) -> int:
        return sum(c.ms for c in self.calls)

    @property
    def total_tokens(self) -> int:
        return sum(c.prompt_tokens + c.completion_tokens for c in self.calls)

    def as_dict(self) -> dict:
        return {
            "calls": [vars(c) for c in self.calls],
            "total_ms": self.total_ms,
            "total_tokens": self.total_tokens,
        }


# --------------------------------------------------------------------------
# Task routing. Change these, not the call sites.
# --------------------------------------------------------------------------

ROUTES: dict[str, tuple[str, str]] = {
    # task                     provider   model
    "score":                   ("openai", "gpt-4o-mini"),
    "coach":                   ("openai", "gpt-4o"),
    "classify":                ("openai", "gpt-4o-mini"),
    "guest_turn":              ("openai", "gpt-4o-mini"),
    "extract_incident":        ("openai", "gpt-4o-mini"),
    "embed":                   ("openai", "text-embedding-3-small"),
    "transcribe":              ("groq",   "whisper-large-v3-turbo"),
}

# Matches the vector(768) column in db/schema.sql. OpenAI supports shortening
# an embedding via the dimensions parameter, and Gemini's text-embedding-004 is
# natively 768, so both providers land on the same column without a migration.
EMBED_DIMS = 768


def _post(url: str, payload: dict, headers: dict, timeout: int = 90) -> dict:
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"),
        headers={"User-Agent": UA, "Content-Type": "application/json", **headers})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read()[:400].decode("utf-8", "replace")
        raise ProviderError(f"HTTP {e.code} from {url.split('/')[2]}: {body}") from None
    except Exception as e:
        raise ProviderError(f"{type(e).__name__} calling {url.split('/')[2]}: {e}") from None


# --------------------------------------------------------------------------
# Chat / structured output
# --------------------------------------------------------------------------

def complete(task: str, system: str, user: str, *, schema: dict | None = None,
             temperature: float = 0.0, trace: Trace | None = None,
             max_tokens: int = 1500) -> Any:
    """Run a task. Returns parsed JSON when a schema is given, else text.

    temperature defaults to 0: scoring a transcript against a written anchor is
    a matching problem, not a creative one, and non-determinism here shows up
    later as noise in the calibration statistic.
    """
    provider, model = ROUTES[task]
    started = time.time()

    if provider == "openai":
        if not OPENAI_KEY:
            raise ProviderError("OPENAI_API_KEY is not set")
        payload: dict = {
            "model": model,
            "messages": [{"role": "system", "content": system},
                         {"role": "user", "content": user}],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if schema is not None:
            payload["response_format"] = {
                "type": "json_schema",
                "json_schema": {"name": "result", "strict": True, "schema": schema},
            }
        data = _post("https://api.openai.com/v1/chat/completions", payload,
                     {"Authorization": f"Bearer {OPENAI_KEY}"})
        text = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})

    elif provider == "gemini":
        if not GEMINI_KEY:
            raise ProviderError("GEMINI_API_KEY is not set")
        url = (f"https://generativelanguage.googleapis.com/v1/models/"
               f"{model}:generateContent?key={GEMINI_KEY}")
        gen: dict = {"temperature": temperature, "maxOutputTokens": max_tokens}
        if schema is not None:
            gen["responseMimeType"] = "application/json"
            gen["responseSchema"] = _to_gemini_schema(schema)
        data = _post(url, {
            "systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"parts": [{"text": user}]}],
            "generationConfig": gen,
        }, {})
        text = data["candidates"][0]["content"]["parts"][0]["text"]
        usage = {}

    else:
        raise ProviderError(f"unknown provider '{provider}' for task '{task}'")

    if trace is not None:
        trace.calls.append(ModelCall(
            task=task, provider=provider, model=model,
            ms=int((time.time() - started) * 1000),
            prompt_tokens=usage.get("prompt_tokens", 0),
            completion_tokens=usage.get("completion_tokens", 0)))

    if schema is None:
        return text
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        raise ProviderError(f"task '{task}' returned malformed JSON") from None


def _to_gemini_schema(schema: dict) -> dict:
    """Gemini rejects the JSON Schema keywords OpenAI accepts."""
    drop = {"additionalProperties", "$schema", "strict"}
    out = {}
    for k, v in schema.items():
        if k in drop:
            continue
        if k == "properties":
            out[k] = {pk: _to_gemini_schema(pv) for pk, pv in v.items()}
        elif k == "items":
            out[k] = _to_gemini_schema(v)
        else:
            out[k] = v
    return out


# --------------------------------------------------------------------------
# Embeddings
# --------------------------------------------------------------------------

def embed(texts: list[str], trace: Trace | None = None) -> list[list[float]]:
    """Embed a batch. Always EMBED_DIMS long, whichever provider serves it."""
    if not texts:
        return []
    provider, model = ROUTES["embed"]
    started = time.time()

    if provider == "openai":
        if not OPENAI_KEY:
            raise ProviderError("OPENAI_API_KEY is not set")
        data = _post("https://api.openai.com/v1/embeddings",
                     {"model": model, "input": texts, "dimensions": EMBED_DIMS},
                     {"Authorization": f"Bearer {OPENAI_KEY}"}, timeout=120)
        vectors = [d["embedding"] for d in sorted(data["data"], key=lambda d: d["index"])]
    else:
        raise ProviderError(f"embeddings not wired for provider '{provider}'")

    if trace is not None:
        trace.calls.append(ModelCall("embed", provider, model,
                                     int((time.time() - started) * 1000)))
    return vectors


# --------------------------------------------------------------------------
# Speech to text
# --------------------------------------------------------------------------

def transcribe(audio: bytes, filename: str = "debrief.webm",
               trace: Trace | None = None) -> str:
    """Groq Whisper. Batch, not streaming: post-shift capture has no latency
    requirement and streaming would add a failure mode for nothing."""
    provider, model = ROUTES["transcribe"]
    if provider != "groq":
        raise ProviderError(f"transcription not wired for '{provider}'")
    if not GROQ_KEY:
        raise ProviderError("GROQ_API_KEY is not set")

    boundary = "----coachingengine"
    parts: list[bytes] = []

    def field(name: str, value: str):
        parts.append(
            f"--{boundary}\r\nContent-Disposition: form-data; name=\"{name}\"\r\n\r\n"
            f"{value}\r\n".encode())

    parts.append(
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
        f"filename=\"{filename}\"\r\nContent-Type: application/octet-stream\r\n\r\n"
        .encode())
    parts.append(audio)
    parts.append(b"\r\n")
    field("model", model)
    field("response_format", "json")
    field("language", "en")
    parts.append(f"--{boundary}--\r\n".encode())
    body = b"".join(parts)

    started = time.time()
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/audio/transcriptions", data=body,
        headers={"User-Agent": UA,
                 "Authorization": f"Bearer {GROQ_KEY}",
                 "Content-Type": f"multipart/form-data; boundary={boundary}"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise ProviderError(
            f"HTTP {e.code} from groq: {e.read()[:300].decode('utf-8','replace')}") from None

    if trace is not None:
        trace.calls.append(ModelCall("transcribe", provider, model,
                                     int((time.time() - started) * 1000)))
    return data.get("text", "").strip()


def available() -> dict[str, bool]:
    """What is actually configured. Surfaced on /health so a missing key is
    visible before the demo rather than during it."""
    return {"openai": bool(OPENAI_KEY), "groq": bool(GROQ_KEY),
            "gemini": bool(GEMINI_KEY)}
