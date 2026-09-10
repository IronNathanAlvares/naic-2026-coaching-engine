# The Coaching Engine

**TechIreland National AI Challenge 2026** · Team: The Coaching Engine · Hub: Dogpatch Labs, Dublin

> Every learning platform in the world measures training **completion**. Nobody measures whether
> the behaviour actually showed up on the floor. We watch the same person from two independent
> angles and treat **the gap between them** as the product.

---

## ⚠️ Read before your first commit

**This repository is PUBLIC.** Anything you push is world-readable, permanently, including in
the git history after you delete it. Assume a competing team can read every commit.

**Never commit the hotel SOPs.** `Docs/SOPs/` in the shared drive contains a real property's
internal operations manuals, shared with Mary-Susan for prototype use only. They are somebody
else's confidential material and they are not ours to publish. `.gitignore` blocks them; do not
work around it. This one is absolute.

**Never commit real staff data.** Synthetic personas only, everywhere. We are pitching
governance; being casual here would be indefensible.

**Never commit secrets.** No API keys, no service-account JSON, no `.env`. Use `.env.example`
for the shape and share actual values another way.

---

## Deadlines

| Date | What |
|---|---|
| **Mon 8 Sept** | Feature freeze. Nothing new starts after this |
| **Fri 11 Sept, 18:00** | **Code freeze.** Only demo-breaking bugs after this |
| Sat 12 Sept | Rehearsal day. Fallback demo video recorded |
| **Sun 13 Sept, 14:00** | **SUBMISSION.** Slides (Google Slides or PowerPoint, **not PDF**) + demo link to Emily@TechIreland.org |
| Mon 14 Sept | Dogpatch Labs. Registration 10:00, pitch 14:00-15:00 |

**The real deadline is the 13th, not the 14th.** Teams that miss it are not permitted to pitch.

---

## Who owns what

| Person | Lane | Directories |
|---|---|---|
| **Mary-Susan** | Team lead, domain | BARS rubric, golden-set ground truth, scope |
| **Nathan** | Backend AI | `services/agent`, retrieval, calibration, `data-generation` |
| **Ziyi** | Full-stack | `services/api`, `web/`, `db/`, deployment, n8n |
| **Thapelo** | Data science | Scoring engine, rules engine, cohort routing |
| **Puneet** | AI/ML + QA | Session service, model routing, tests |

Riyaz (commercial) and Ievgeniia (product/BA) work in `docs/` rather than code.

**As of 10 Sept the table above is a statement of lanes, not of who typed what.**
Ziyi built the whole of `web/`. Nathan built `db/`, `services/api` and
`services/agent` on top of it, and consolidated the backend so it would be
finished before the freeze. If you are picking something up, the directory
READMEs are more current than this table.

---

## Layout

```
contracts/        API contract. Frozen: see CONTRIBUTING before changing
db/
  schema.sql      22 tables. The canonical schema for a FRESH database
  policies.sql    Row level security. The most important file in the repo
  roles.sql       ce_app, the role the API connects as
  migrations/     For databases that are already running
  seed.py         Loads the generated corpus
  test_rls.py     Ten negative tests. They must all pass
services/
  agent/          The tested deterministic core: transfer gap, cite gate,
                  calibration, routing. 72 unit tests, no I/O, no model calls
  api/            FastAPI. Every endpoint, the agent graph, the providers
web/              Next.js. Manager console, staff PWA, and /glassbox
scripts/          bootstrap.py
tests/            test_e2e.py, the whole system over HTTP
data-generation/  Deterministic synthetic dataset
```

Each directory has its own README explaining what belongs there. The LaTeX
documents live in the shared drive, not here: see CONTRIBUTING for why.

---

## Getting started

You need **Docker Desktop running**, Python 3.11+, and pnpm.

```bash
git clone https://github.com/IronNathanAlvares/naic-2026-coaching-engine.git
cd naic-2026-coaching-engine
cp .env.example .env          # then add at least OPENAI_API_KEY
python scripts/bootstrap.py --coach
```

That one command starts Postgres, applies the schema and migrations, seeds the
synthetic corpus, **embeds the standards**, checks every AI provider, and fills
the verify queue. It is idempotent, so run it as often as you like. Add
`--reset` to destroy the database and start clean.

Then two terminals:

```bash
cd services/api && python -m uvicorn app.main:app --reload --port 8000
cd web && pnpm install && pnpm dev
```

- Manager console: <http://localhost:3000/manager>
- Staff app: <http://localhost:3000/staff>
- **Glass box**: <http://localhost:3000/glassbox>

---

## Before you demo

Run these three, in this order. They take about a minute together.

```bash
cd services/agent && python -m pytest -q     # 72 tests, the reasoning
python db/test_rls.py                        # 10 negative tests, the isolation
python tests/test_e2e.py                     # 15 checks, the whole system
```

`tests/test_e2e.py --skip-ai` skips anything that spends tokens, which is the
one to run in a loop while you are working.

**The failure that does not look like a failure.** If the SOP chunks have no
embeddings, hybrid search returns nothing, the agent cannot ground a single
claim, and it abstains on every person with a reason that reads like good
judgement. Every page still answers 200. `/health` reports `search_index`, and
the e2e suite asserts it, precisely because this one is invisible otherwise.
`scripts/bootstrap.py` backfills it.

---

## The glass box

`/glassbox` exists for the person who has just been told this is a wrapper
around a language model. Three panels, each calling production code live:

1. **Run the agent on someone** and watch every step declare who made it. A
   typical run is 7 decisions by code and 1 by the model, and that one was
   chosen from an enum code had already narrowed. When the model cites a span
   a standard does not contain, you watch the gate reject it and the model
   redraft.
2. **Try to get a lie past the cite gate.** Five handcrafted claims through the
   same `run_gate()` the agent calls.
3. **Ask one question as three different people.** Identical SQL; the colleague
   reads nothing, the observing manager reads both streams, L&D reads no
   individual practice scores. The filtering is in Postgres, so a bug in our
   API cannot return a row the policy forbids.

---

## AI providers

`python services/api/check_providers.py` calls every provider for real and
prints what each one does. Run it before a demo: "the key is set" has never
meant "the call works" on this project.

| Task | Provider | Why |
|---|---|---|
| Guest turn in practice | Groq `qwen3.8-27b` | ~700ms vs ~1400ms. The only task a human waits on live |
| Debrief transcription | Groq `whisper-large-v3-turbo` | Audio is transcribed then deleted |
| Guest voice | ElevenLabs | Cached on disk; the free tier is 10,000 characters for the life of the account |
| Coaching, scoring, embeddings | OpenAI | Latency buys nothing behind a spinner |
| Weekly operations brief | Manus | k-anonymised aggregates only |

### What it costs

Measured, not estimated. `/health` reports the running total and the trace
carries a per-call figure.

| | |
|---|---|
| One agent run (classify + draft) | **$0.005** |
| Same run when the cite gate forces a repair | $0.010 |
| Whole team, 13 staff (`bootstrap --coach`) | $0.07 |
| Full end-to-end suite, 17 calls | **$0.02** |

`CE_DAILY_USD_LIMIT` (default $5) is a runaway-loop stop, not a budget. At
these numbers it is thousands of recommendations.

**OpenAI is not the resource to ration. ElevenLabs is.** The free tier is
10,000 characters for the LIFE of the account with no way to buy more, and a
guest line is about 120 characters. Synthesis stops while
`CE_VOICE_RESERVE` (default 1,200) characters remain, so the pitch always has
voice. Cached lines still play, which is why the warmed demo lines are
committed into the image.

Free commands: `pytest`, `test_rls.py`, `test_e2e.py --skip-ai`,
`evals/redteam`, `evals/retrieval` (without `--ragas`).

If a provider fails, `FALLBACKS` carries the task elsewhere **and records the
switch in the trace**. A demo that silently swaps models is telling you
something untrue about what you just saw.

---

## The three principles

**1. Deterministic where it must be, LLM where it adds value.** Escalation thresholds, BARS
anchors, routing rules and audit logging are code: same input, same output, explainable to a
works council. Synthesis, conversation and scenario generation are the model. Both sides share
one 1-5 scale, so the rules engine and the model can never contradict each other in front of a
manager.

**2. Cite or stay silent.** If the agent cannot cite the specific scenario turn, the specific
observation and the specific SOP clause, it does not emit a recommendation. It abstains and
says what evidence is missing. The gate is **code**, not a prompt asking the model to behave.

**3. Reasoning in code, plumbing in n8n.** Anything a judge should be able to watch the system
think through lives in code where we can trace and test it. Notifications and scheduling live in
n8n.

---

## Three things we never cut

Under time pressure we cut scope in the order set out in `docs/pdf/05-Sprint-Plan.pdf` §3.3.
These three are not on that list:

- **The cite gate**, including its abstain path
- **The verify interrupt**: no coaching action on AI output alone, no timeout, no auto-approve
- **The calibration number**: the system reports its own accuracy, including where it is weak

Those three are the product.
