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

---

## Layout

```
contracts/      API contract. Frozen: see CONTRIBUTING before changing
db/             Schema and migrations
services/
  api/          API gateway / BFF          (Ziyi)
  agent/        The coaching agent graph   (Nathan)
  worker/       Transcription, ingestion   (Nathan/Puneet)
web/
  staff-pwa/       Mobile-first staff app  (Ziyi)
  manager-console/ Manager interface       (Ziyi)
data-generation/  Deterministic synthetic dataset  (Nathan)
docs/             21 LaTeX documents + built PDFs
```

Each directory has its own README explaining what belongs there.

---

## Getting started

```bash
git clone https://github.com/IronNathanAlvares/naic-2026-coaching-engine.git
cd naic-2026-coaching-engine
```

**Generate the test dataset.** It is deterministic, so everyone gets identical data:

```bash
cd data-generation && python generate_corpus.py
```

Produces 62 SOP chunks, 65 shift debriefs, 53 practice attempts, 28 observations, a 45-item
golden set, and `seed.sql`. Verified on generation: Diego lands in the BLOCKED quadrant at gap
2.2; cohort of 9 on room-not-ready.

**Read the docs.** Start with `docs/pdf/00-Index.pdf`, which tells you what to read for your
role. If you are not technical, read `06-Plain-English-Guide.pdf` and stop there.

**Rebuild the docs** (needs a LaTeX distribution):

```bash
cd docs && pwsh ./build.ps1
```

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
