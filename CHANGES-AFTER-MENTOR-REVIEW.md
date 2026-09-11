# What has to change, after the two meetings

Written 11 Sept 2026. Sources: the internal team readiness meeting, and the
mentor session with Nikita and Mary.

This is the working list. When a future session asks "what were we meant to
change", this is the file. Each item says what is true now, what has to become
true, and who owns it. Nothing here is done unless the box is ticked.

**The clock.** Deck submitted Sun 13 Sept 14:00, PowerPoint or Google Slides,
not PDF, plus the demo link, to Emily@TechIreland.org. Pitch Mon 14 Sept,
7 minutes with a 3 minute Q&A, 10 minutes hard cap. Team meets Sunday, BrewDog
Grand Canal, around 16:00, to rehearse.

---

## 1. The three decisions only the team can make

These are not tasks. They are forks, and the work downstream of each one is
different. They should be settled on Sunday, early, before the rehearsal.

### 1.1 How many people present

| | |
|---|---|
| **Now** | Five speakers: Mary-Susan, Thapelo, Nathan, Ziyi, Ievgeniia. Run sheet and 797 word script both written for five. |
| **Mentors said** | "A single confident and highly knowledgeable presenter was recommended when stage time and audience attention are limited." Mary named as the likely one. Nikita separately: one person presents. Fallback offered: one business presenter plus one technical presenter. |
| **The tension** | Five handovers cost roughly 30 to 40 seconds of dead air in a 7 minute slot, and every handover is a place where nerves can break the thread. Against that, the brief that produced the five speaker plan was "give everyone a chance and equal opportunity". |

The mentors are not saying the team should be hidden. They said the full team
should still be visible. Visible and speaking are different things.

**Recommendation: two voices.** Mary-Susan carries problem, solution, market
and close. Nathan carries how it works plus the demo. Everyone else stands with
the team, answers in Q&A, and is named on the closing slide. That keeps the
mentors' advice, keeps a technical voice on stage for the judges' "how did you
build it" question, and loses only the handover tax. If the team wants all five
regardless, the script has to be recut anyway (see 1.2) so the cost is the same
either way, but rehearsal time on Sunday is the real constraint.

- [ ] Decide. If it changes, `Technical Docs/17-Pitch-Script.tex` and
      `PITCH-RUN-SHEET.md` both need rewriting, not editing.

### 1.2 The timing is currently over

| | |
|---|---|
| **Now** | 797 spoken words, planned 6:32 at 125 wpm, plus a 1 minute demo. That is 7:32 against a 7:00 limit, and it assumes nothing goes wrong. |
| **Mentors said** | "Approximately five minutes for the presentation and two minutes for the demo." |
| **Target** | Slides about 5:00, which is roughly 620 spoken words at 125 wpm. Demo 2:00. Total 7:00 with the demo absorbing any slack. |

So the script loses about 175 words and the demo doubles. That is a real cut,
not a trim: one whole section has to go or fold into another.

- [ ] Recut the script to about 620 words.
- [ ] Rebuild the demo as a 2 minute scripted run (see section 3).

### 1.3 How wide the market story goes

| | |
|---|---|
| **Now** | The deck is hotels. TAM EUR 245M, SAM EUR 19.6M, SOM EUR 979k, all bottom up from four and five star hotels with 70 or more rooms across the EU and UK. |
| **Mentors said** | "The market narrative should broaden from hotels to the much larger cross-industry need for employee training, skills development, and performance tracking." Medical, construction, education named. "Hospitality should remain the demonstrated entry point while the broader opportunity is framed as training and performance measurement for many industries." Ireland first, then UK, then Dubai. |

The hotel numbers are the credible ones because they were built bottom up and
they tie to the finance model. Do not throw them away to chase a bigger number
that cannot be defended. Frame it as: here is the beachhead, costed to the
euro, and here is why the same engine reads any industry that has procedures
and a floor.

- [ ] Keep the three hotel figures as the SOM and SAM.
- [ ] Add one line, and one slide element, on the cross-industry TAM.

---

## 2. The deck

Current deck: `The-Coaching-Engine-NAIC2026.pptx`, 12 slides.

### 2.1 Statistics that are not yet safe to say

Both meetings raised this and it is the single most dangerous item in the deck.
"Statistics such as 35% and 30% turnover require verification before
inclusion." The reason given: "the team currently lacks external authority or
named experts to substantiate the claims."

A judge who asks "where is that from" and gets a shrug does more damage than
the stat ever earned.

- [ ] Find a citable source for the 35% figure, or cut it.
- [ ] Find a citable source for the 30% figure, or cut it.
- [ ] Put the source link in the slide notes, not just in someone's head, so
      whoever presents can answer on the spot.
- [ ] Sweep every other number on every slide for the same problem.

### 2.2 Structure the judges were told to expect

Nikita's order: **problem, solution, demo, market or scaling, business model
and route to market.**

The internal meeting's narrative: **the problem, who it affects with evidence,
the solution as the painkiller, how it works, market opportunity and value.**

Those are compatible. The deck should read in that order and nothing should sit
between the problem and the solution.

- [ ] Reorder the deck against that spine and cut anything that does not serve it.

### 2.3 Missing slides

- [ ] **Competitors.** "Competitor analysis should address role-play and
      performance platforms already operating in areas such as medical training
      and sales. The team should define its unique selling proposition rather
      than assuming the absence of competitors." We already have the
      empty-quadrant analysis and the Alkimii and Retorio work. Put it on a
      slide.
- [ ] **Why not ChatGPT.** Flagged as a likely judge question. The answer we
      have: structured organisation-wide context instead of isolated question
      and answer. The hotel's own roles, standards and policies modelled, plus
      the transfer gap, which ChatGPT cannot compute because it never sees the
      floor. Plus convenience: nobody walks back to a workstation mid-shift.
      This needs to be a rehearsed answer and probably a backup slide.
- [ ] **Route to market and pricing.** "The team should explain how the product
      would reach customers and become a viable business." Pricing exists in
      the finance model. It is not on a slide.

### 2.4 Technical depth

"The main presentation should explain the technical implementation enough for
judges to understand how the product was built, without allowing technical
detail to overwhelm the value proposition." And: "Judges are unlikely to
evaluate the code directly."

The glass box page is the answer to this, not a slide full of architecture. One
slide that names the stack, then let the demo prove it.

- [ ] Cut any slide that is architecture for its own sake.

### 2.5 Admin

- [ ] Every team member updates their competition profile to **Nova UCD**.
      Some still show Dogpatch or Work IQ.
- [ ] Nathan shares the deck and supporting material in the team group for
      review, before Sunday, not on Sunday.
- [ ] Mentor approval and invitations were judged administrative, not blocking.
      No action beyond not worrying about it.

---

## 3. The demo, which is now 2 minutes and must be scripted

The demo stops being a tour and becomes a rehearsed scene. Mentors were
explicit: "The demo should supplement the slides rather than repeat them."

### 3.1 The scene

A guest dispute at checkout. Chosen because it can be scripted and rehearsed
identically every time.

- Staff side, about 1 minute: the employee describes the incident, gets
  immediate feedback and a score.
- Manager side, about 1 minute: pick Diego, log an observation against him, show
  the resulting queue.
- Practice flow itself runs roughly 45 to 50 seconds for one scenario.

- [ ] Write the demo as a word for word script, the same way the pitch is.
- [ ] Rehearse it until it takes 2:00 and not 2:40.

### 3.2 Decisions inside the demo

- [ ] **Diego is the staff member.** He has been used since the beginning and is
      already configured. Give him exactly two dimensions relevant to a checkout
      dispute, not five. The dimensions must match the role.
- [ ] **Use the role switch control, not two tabs.** "Switching between separate
      instances may make judges suspect that different parts of the product are
      not integrated." Whatever happens, do not present from two browser windows
      pointed at two deployments.
- [ ] **Do not show the back page** in the demo. Returning to the home page was
      called confusing. Browser back works. Plan a route through the product
      that never needs the ambiguous path.
- [ ] **Manager overview shown briefly**, not walked through screen by screen.
- [ ] **Decide whether the manager half of the demo is spoken.** Saying
      "Diego handled the checkout dispute, he stayed calm but never offered her
      anything to fix it" and watching the form fill itself, with the evidence
      underlined, is a stronger 30 seconds than tapping through a wizard, and it
      is the mentor's own "phone, voice note, transcription, resulting analysis"
      suggestion. The tap-through path stays one tap away if the room is loud.

### 3.3 The voice question, which the two meetings answer differently

- Internal meeting: "Demo text can be prepared in advance and pasted or edited
  to avoid delays caused by speech to text processing."
- Mentor: "Use the existing 11 Labs voice integration to make the live
  demonstration more compelling," and a phone, a voice note, a transcription and
  the analysis would be impactful.

Both are right. Voice is the thing that makes the room lean in, and it is also
the thing most likely to eat 15 seconds of a 120 second demo.

**Do this:** run the voice note live, once, on the phone, for the staff note.
It is the moment worth risking. Have the same text pre-typed and one paste away
if the transcription stalls. Everything else in the demo is typed. Rehearse the
failure, not just the success, so the recovery looks deliberate.

- [ ] Prepare the typed fallback text and know the key combination cold.
- [ ] Test the phone, on the venue's network if possible, before Monday.

---

## 4. Product and UI

These came out of the internal test of the deployed prototype.

### 4.1 Broken, or suspected broken

- [ ] **"Some messenger and counting-related functionality did not work during
      testing."** Cause not identified. Three candidates were raised: a wrong
      link, backend behaviour, or "connections between different deployed
      versions". The third is the likely one, because more than one Vercel
      deployment exists and they do not all point at the same API. **Reproduce
      this first.** It is the only item on this list that could kill the demo
      outright, and it is currently undiagnosed.
- [ ] Test the complete prototype end to end on the deployment that will be used
      on Monday. Not on localhost.

### 4.2 Copy and language

- [ ] **The opening journey reads as challenge-centric, not product-centric.**
      It currently sounds like an entry to a competition rather than a product
      someone bought. Rewrite the landing copy so a hotel GM would recognise
      themselves in it.
- [ ] **Explanatory text throughout is challenge-centric.** Same fix, wider
      sweep.
- [ ] **"Floor score" needs simplifying.** A manager should understand what it
      is without a paragraph of context.
- [ ] **Button wording.** Change only if a genuinely clearer user-facing label
      exists. The team understood the current labels, so this is low priority.

### 4.3 Mobile

"Desktop interaction works better than the phone version."

Work already landed on this: touch targets, back navigation, the responsive
audit across 360, 768 and 1280. The complaint may predate that work, or may be
about something the audit does not catch.

- [ ] Retest on a real phone, not an emulated viewport, and write down what
      specifically is worse.

### 4.4 The manager queue at scale, which is also a Q&A question

"A manager with 40 or even 250 staff cannot manually verify every item in a
large queue." And: "The manager experience may need a more concise overview or
prioritisation pattern so verification is low-effort rather than another
administrative burden."

Partly answered already: the queue is a table now, the pattern band collapses
eleven items that say the same thing into one line counting distinct people,
and the recommendation card opens at about four lines. That is the right
direction and it should be said out loud in the pitch, because it is the
difference between a demo and a product.

- [ ] Prepare the spoken answer: at 250 staff the manager does not read 250
      items, they read the patterns, and the queue ranks by who is blocked.
- [ ] Consider whether anything more is needed before Monday. Probably not.
      This is a Q&A answer, not a build.

### 4.5 Spoken observations, BUILT

The mentors listed this as roadmap: "Voice-recorded manager observations were
proposed as a future feature that could reduce manual input and allow AI to
analyse recurring pain points", plus "Voice notes and voice control were
identified as especially valuable for recording observations during a busy
workday" and "employees are unlikely to return to a workstation to enter
detailed information."

It is now built and tested. `/manager/observe` has two tabs: **Speak it**
(default) and **Tap it through** (the original wizard, unchanged).

What it does:

- One recording covers **several people**. "Diego handled the checkout dispute,
  he stayed calm but never offered her anything. Amara was excellent on the
  phone. Bogdan froze when the guest asked about the spa" becomes three separate
  draft observations. This is the part that answers "reduce manual input":
  a walk back from the restaurant covers the section.
- **Nothing is written until the manager taps Log** on each draft. The
  extraction proposes; the manager decides. Confirming goes through the
  existing POST /observations with every existing rule intact.
- **Every rating must quote the manager's own words**, and the quote must
  actually appear in the transcript. A rating the model cannot point at is
  dropped before the manager ever sees it. This is the cite gate turned round
  to face the input, and it is testable: with a deliberately fabricating model,
  both inventions are dropped and only the supported rating survives.
- The transcript is shown with the evidence **underlined in the dimension's
  colour**, so "why does it say 2" is answered by looking.
- A name it cannot resolve is a **question, not a guess**. Two Marias produce
  "which one?"; a name nobody has asks the manager to choose.
- **Offline**: if the upload fails, the recording is kept in IndexedDB and
  sends itself when the signal returns. Hotel basements and service corridors
  are exactly where a manager is when they see something worth logging.
- **Type it instead** is one tap away, which is also the stage fallback if
  transcription stalls in front of judges.

**What was deliberately NOT built: tone analysis.** The same meeting floated it.
Inferring emotion from a worker's voice in a workplace is prohibited outright
by EU AI Act **Article 5(1)(f)**, not merely high risk, and it is the same line
we already refused under Annex III 4(c). Our governance answer in the Q&A rests
on having refused things, so this one is worth refusing out loud. The audio is
used for transcription and then dropped: no voiceprint, no speaker ID, no
affect scoring.

### 4.6 Still explicitly roadmap, not build

Say these are coming. Do not try to build them this week.

- Role-based authentication and per-role dashboards. "Full authentication and
  role restrictions were considered too much to add immediately for the
  competition demo." Present as roadmap and acknowledge openly that it is not
  built. Do not imply it is.
- AI triage across accumulated voice notes, surfacing the high priority ones.
  The pattern band in the verify queue is the first half of this.
- Performance management, succession planning, promotions. Flagged with a
  warning: "Privacy and surveillance boundaries require careful consideration if
  the platform expands into formal performance management." That is our Annex
  III 4(c) line. If this comes up, the answer is that we refused live monitoring
  and emotion inference by design, and that refusal is in the docs.

### 4.7 One thing to be careful how we say

"The team clarified that the AI generates the feedback while relying on
human-created frameworks and procedures; the distinction between human context
and AI-generated analysis should be explained carefully to judges."

The humans wrote the rubric, the dimensions and the SOPs. The AI reads them and
analyses against them. The human verifies before anything reaches a staff
member. If that line blurs in the pitch, the governance story blurs with it.

---

## 5. Deployment

### 5.1 GCP instead of Render: status, blocked, one person can unblock it

Reason for moving: Render's free tier sleeps after about 15 idle minutes and
takes 25 to 50 seconds to wake. A judge staring at a spinner is the whole risk.
Cloud Run can hold one warm instance and that removes the cold start.

**What is ready:**

- `services/api/Dockerfile` is already Cloud Run compatible. It sets
  `ENV PORT=8000` and uses a shell form CMD so `${PORT}` expands at runtime, and
  its own comment says "Render, Cloud Run and Fly all inject the port". No
  change needed.
- `scripts/deploy_cloudrun.py` is written and working. It builds, pushes to
  Artifact Registry, creates or updates the Cloud Run service with
  `--min-instances 1`, opens it to the public and waits for the revision. It
  needs no gcloud SDK, which is good, because gcloud is not installed on this
  machine and Docker 29.7.2 is.
- The service account
  `vertexairunner@project-7ffd39d7-3c02-4599-ae9.iam.gserviceaccount.com`
  already holds the four roles Mary-Susan granted: Cloud Run Admin, Service
  Account User, Artifact Registry Writer, Storage Object Admin. Secret Manager
  Secret Accessor is not needed, because the deploy sends environment variables
  directly with the service definition, the same trust model as pasting them
  into the Render dashboard.

**What is blocking:**

Two APIs are not enabled on the project, and the service account cannot enable
them. Every attempt returns `403 Permission denied to enable service`. Only a
project Owner can do it. That is Mary-Susan.

```
https://console.cloud.google.com/apis/library/run.googleapis.com?project=project-7ffd39d7-3c02-4599-ae9
https://console.cloud.google.com/apis/library/artifactregistry.googleapis.com?project=project-7ffd39d7-3c02-4599-ae9
```

Press ENABLE on both. It costs nothing and takes about a minute. Then:

```bash
python scripts/deploy_cloudrun.py --check
```

If both lines read `ready`, run it without `--check` and it deploys.

- [ ] Ask Mary-Susan to enable those two APIs.
- [ ] Run the deploy.
- [ ] Check `/health` reports the database up and every provider true.
- [ ] Only then point `NEXT_PUBLIC_API_BASE_URL` in Vercel at the new URL.
- [ ] **Leave Render running until the day after the pitch.** Two working APIs
      beats one new one. Switching back is one environment variable.

**Judgement call:** if the APIs are not enabled by Saturday evening, stop and
stay on Render. Warm it with a request a few minutes before the pitch and the
cold start never happens. Do not be mid-migration on Sunday.

### 5.2 The credits

"The team believed approximately $150 in Google Cloud credits might be
available, but availability and usage still needed confirmation."

- [ ] Confirm with Mary-Susan whether the credits exist and are on this project.
      Cloud Run with one warm instance is a few dollars a month, so this does not
      block anything, but the answer matters for the deck's cost slide and for
      the "what tools did you use" scoring criterion.

### 5.3 The front end merge

"One developer had deployed a version through their own Vercel link and advised
merging the code into the main branch before deploying to Nathan's Vercel
environment."

Checked: `origin/ziyi` is **zero commits ahead of main**. So either the work is
already merged, or it was never pushed and lives only on Ziyi's machine and
their own Vercel.

- [ ] Ask Ziyi directly which it is. If it was never pushed, get it pushed
      before Sunday. This matters because of 4.1: two deployments pointing at
      different APIs is the best explanation for the functionality that did not
      work during testing.
- [ ] Whatever is presented on Monday comes from `main`, deployed to Nathan's
      Vercel, pointed at one API.

---

## 6. Logistics and everything else still open

- [ ] **Sunday 13 Sept 14:00**: deck submitted, PowerPoint or Google Slides, not
      PDF, with the demo link, to Emily@TechIreland.org.
- [ ] **Deck finished Saturday**, so Sunday is rehearsal and not authoring. This
      was the stated intent and it is the only way the Sunday meeting is worth
      having.
- [ ] **Sunday meeting**, BrewDog Grand Canal around 16:00, to be confirmed in
      the group chat. Check no event is on that would make it unworkable.
      Fallbacks discussed: a central cafe or a hotel lobby.
- [ ] **Backup demo video**, recorded Saturday. If the network fails on Monday
      this is the whole demo. Record it against the deployment that will be live.
- [ ] **Golden set labels**, Mary-Susan. 45 items, every `ground_truth_scores`
      still null, only 2 distinct SOP chunks referenced and both are wrong (a
      noise complaint mapped to "make eye contact"). This does not block the
      pitch. It does block claiming an evaluation number, so if it is not done,
      nobody says one.
- [ ] The four manual steps that need a microphone and a human are still manual.

---

## Quick reference: what changed against what we already built

| Already built | What the meetings want |
|---|---|
| 5 speakers, 797 word script, 6:32 | 1 or 2 speakers, about 620 words, 5:00 |
| 1 minute demo | 2 minute scripted demo, checkout dispute |
| Hotels only market story | Hotels as beachhead, cross-industry vision |
| 12 slides | Same spine, plus competitors, plus why-not-ChatGPT, plus route to market |
| Render backend | Cloud Run, blocked on two API switches |
| Turnover stats stated | Turnover stats sourced, or cut |
| Challenge-centric copy | Product-centric copy |
