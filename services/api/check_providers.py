"""
check_providers.py
==================
Call every provider for real and report exactly what each one does.

Run this before a demo. "The key is set" is not the same as "the call works",
and the difference has bitten us on three of the five providers already: Groq
403s without a User-Agent, Manus wants its key in a header nobody would guess,
and the Google key was live but the API was switched off on the project. A
health check that only looks for a non-empty environment variable would have
reported all three as fine.

    python services/api/check_providers.py
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from app import providers as P                                    # noqa: E402

UA = "Mozilla/5.0 (compatible; CoachingEngine/1.0)"
TIMEOUT = 45

OK, WARN, FAIL, SKIP = "PASS", "WARN", "FAIL", "SKIP"


def _post(url: str, payload: dict | bytes, headers: dict,
          limit: int = 4000) -> tuple[int, str]:
    """limit is generous because the useful part of a cloud error, the project
    number and the machine-readable reason, sits at the END of the body, after
    the human-readable message. Truncating early throws away the half that
    tells you which console to open."""
    body = payload if isinstance(payload, bytes) else json.dumps(payload).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status, r.read()[:limit].decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:limit].decode("utf-8", "replace")
    except Exception as e:                                  # noqa: BLE001
        return 0, f"{type(e).__name__}: {e}"


def _get(url: str, headers: dict, limit: int = 400) -> tuple[int, str]:
    """limit defaults to an excerpt for error reporting. Pass a bigger one when
    the caller needs to parse the body: a truncated JSON document is not a
    parse failure worth swallowing, it is a check that silently stops
    checking."""
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status, r.read()[:limit].decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:400].decode("utf-8", "replace")
    except Exception as e:                                  # noqa: BLE001
        return 0, f"{type(e).__name__}: {e}"


# --------------------------------------------------------------- the checks

def check_openai() -> tuple[str, str]:
    key = os.environ.get("OPENAI_API_KEY", "")
    if not key:
        return SKIP, "OPENAI_API_KEY not set"
    code, body = _post(
        "https://api.openai.com/v1/chat/completions",
        {"model": "gpt-4o-mini", "max_tokens": 5,
         "messages": [{"role": "user", "content": "Reply with the word ok."}]},
        {"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    if code == 200:
        return OK, "chat + embeddings + structured output"
    return FAIL, f"HTTP {code}: {body[:150]}"


def check_groq_chat() -> tuple[str, str]:
    key = os.environ.get("GROQ_API_KEY", "")
    if not key:
        return SKIP, "GROQ_API_KEY not set"
    code, body = _post(
        "https://api.groq.com/openai/v1/chat/completions",
        # Read the model from ROUTES rather than hardcoding one. Groq retired
        # llama-3.3 under us; a check that pins its own model tests a model we
        # do not use and passes while production is broken.
        {"model": P.ROUTES["guest_turn"][1], "max_tokens": 200,
         "messages": [{"role": "user", "content": "Reply with the word ok."}]},
        {"Authorization": f"Bearer {key}", "Content-Type": "application/json",
         "User-Agent": UA})
    if code == 200:
        return OK, f"{P.ROUTES['guest_turn'][1]} chat"
    if code == 429:
        # The free tier is generous but finite. This is a WARN because the
        # wiring is correct and FALLBACKS will carry the task to OpenAI; it
        # still needs saying, because the demo gets slower when it happens.
        fb = P.FALLBACKS.get("guest_turn")
        return WARN, (f"rate limited on the free tier. Falls back to "
                      f"{fb[0]}/{fb[1]}" if fb else "rate limited, no fallback")
    return FAIL, f"HTTP {code}: {' '.join(body.split())[:130]}"


def check_groq_whisper() -> tuple[str, str]:
    """Transcribe a real WAV we synthesise here, so the check needs no fixture."""
    key = os.environ.get("GROQ_API_KEY", "")
    if not key:
        return SKIP, "GROQ_API_KEY not set"
    wav = _silence_wav()
    boundary = "----ce-check"
    parts = [
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\n"
        f"{P.ROUTES['transcribe'][1]}\r\n".encode(),
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
        f"filename=\"a.wav\"\r\nContent-Type: audio/wav\r\n\r\n".encode(),
        wav, f"\r\n--{boundary}--\r\n".encode(),
    ]
    code, body = _post(
        "https://api.groq.com/openai/v1/audio/transcriptions", b"".join(parts),
        {"Authorization": f"Bearer {key}", "User-Agent": UA,
         "Content-Type": f"multipart/form-data; boundary={boundary}"})
    if code == 200:
        return OK, f"{P.ROUTES['transcribe'][1]} accepted audio"
    return FAIL, f"HTTP {code}: {body[:150]}"


def check_elevenlabs() -> tuple[str, str]:
    key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not key:
        return SKIP, "ELEVENLABS_API_KEY not set"
    code, body = _get("https://api.elevenlabs.io/v1/user/subscription",
                      {"xi-api-key": key, "User-Agent": UA}, limit=20000)
    if code != 200:
        return FAIL, f"HTTP {code}: {body[:150]}"
    try:
        sub = json.loads(body)
        used = sub.get("character_count", 0)
        cap = sub.get("character_limit", 0)
        left = cap - used
        state = OK if left > 500 else WARN
        return state, f"{left} of {cap} characters left on {sub.get('tier','?')}"
    except Exception as e:                                  # noqa: BLE001
        # Reachable but unreadable is a warning, not a pass. Silence here is
        # how we would walk into a demo with no character budget left.
        return WARN, f"reachable, could not read quota: {type(e).__name__}"


def check_manus() -> tuple[str, str]:
    key = os.environ.get("MANUS_API_KEY", "")
    if not key:
        return SKIP, "MANUS_API_KEY not set"
    # Manus authenticates with a bare API_KEY header, not a bearer token. That
    # is the whole reason this check exists.
    code, body = _post(
        "https://api.manus.ai/v1/tasks",
        {"prompt": "Reply with the single word ok.", "mode": "fast"},
        {"API_KEY": key, "Content-Type": "application/json", "User-Agent": UA})
    if code in (200, 201, 202):
        return OK, "task accepted"
    return FAIL, f"HTTP {code}: {body[:150]}"


def check_google() -> tuple[str, str]:
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        return SKIP, "GEMINI_API_KEY not set (no Google model in use)"
    code, body = _post(
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={key}",
        {"contents": [{"parts": [{"text": "Reply with the word ok."}]}]},
        {"Content-Type": "application/json", "User-Agent": UA})
    if code == 200:
        return OK, "gemini-2.0-flash"
    if code == 429:
        return WARN, "quota exhausted, which is not a configuration problem"

    # Read the structured reason, never a substring of the message. Google's
    # prose mentions several failure modes in one body and grepping it told us
    # to open the wrong console page: the two 403s below look identical in a
    # log and need opposite fixes.
    reason, project = "", ""
    try:
        err = json.loads(body).get("error", {})
        for detail in err.get("details", []):
            if detail.get("@type", "").endswith("ErrorInfo"):
                reason = detail.get("reason", "")
                project = (detail.get("metadata", {})
                           .get("consumer", "")).replace("projects/", "")
    except Exception:                                       # noqa: BLE001
        pass

    where = f"project {project}" if project else "the GCP project"
    if reason == "SERVICE_DISABLED":
        return FAIL, (f"the Generative Language API is switched OFF on {where}. "
                      f"Enable it at console.cloud.google.com/apis/library/"
                      f"generativelanguage.googleapis.com, then re-run.")
    if reason == "API_KEY_SERVICE_BLOCKED":
        return FAIL, (f"the key is valid but RESTRICTED away from this API on "
                      f"{where}. At console.cloud.google.com/apis/credentials "
                      f"open the key, and under 'API restrictions' either pick "
                      f"Don't restrict key, or add Generative Language API to "
                      f"the allowed list.")
    if reason == "API_KEY_INVALID":
        return FAIL, "the key itself is not valid; issue a new one."
    return FAIL, f"HTTP {code} {reason}: {' '.join(body.split())[:130]}"


def check_ollama() -> tuple[str, str]:
    host = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
    code, body = _get(f"{host}/api/tags", {"User-Agent": UA})
    if code == 200:
        try:
            names = [m["name"] for m in json.loads(body).get("models", [])]
            return OK, f"local, {len(names)} model(s)"
        except Exception:                                   # noqa: BLE001
            return OK, "local daemon reachable"
    return SKIP, "no local daemon (optional, offline fallback only)"


def _silence_wav(ms: int = 400, rate: int = 16000) -> bytes:
    """A valid, tiny mono WAV. Enough to prove the endpoint accepts audio."""
    import struct
    n = int(rate * ms / 1000)
    data = b"\x00\x00" * n
    return (b"RIFF" + struct.pack("<I", 36 + len(data)) + b"WAVEfmt "
            + struct.pack("<IHHIIHH", 16, 1, 1, rate, rate * 2, 2, 16)
            + b"data" + struct.pack("<I", len(data)) + data)


CHECKS = [
    ("OpenAI          chat/embeddings", check_openai),
    ("Groq            chat", check_groq_chat),
    ("Groq            whisper", check_groq_whisper),
    ("ElevenLabs      text to speech", check_elevenlabs),
    ("Manus           agent tasks", check_manus),
    ("Google          gemini", check_google),
    ("Ollama          local fallback", check_ollama),
]


def main() -> int:
    print(f"\nProvider check   routes in use: "
          f"{', '.join(sorted({p for p, _ in P.ROUTES.values()}))}")
    for task, (prov, model) in sorted(P.ROUTES.items()):
        fb = P.FALLBACKS.get(task)
        tail = f"   fallback {fb[0]}/{fb[1]}" if fb else ""
        print(f"    {task:20} {prov}/{model}{tail}")
    print()
    results = []
    for label, fn in CHECKS:
        t0 = time.time()
        try:
            state, detail = fn()
        except Exception as e:                              # noqa: BLE001
            state, detail = FAIL, f"{type(e).__name__}: {e}"
        ms = int((time.time() - t0) * 1000)
        results.append((label, state, detail))
        print(f"  [{state}] {label:32} {ms:>5}ms  {detail}")

    warned = [r for r in results if r[1] == WARN]
    for label, _, detail in warned:
        print(f"  note  {label.split()[0]}: {detail}")
    failed = [r for r in results if r[1] == FAIL]
    print()
    if failed:
        print(f"{len(failed)} provider(s) failing:")
        for label, _, detail in failed:
            print(f"  - {label.split()[0]}: {detail}")
    else:
        print("Every configured provider answered.")
    # A skipped optional provider is not a failure.
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
