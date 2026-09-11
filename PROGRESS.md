# Where we are

Last updated 11 September 2026.

Written so everyone can read it, not just the developers. If a section looks
technical, skip it. The first two parts are the ones that matter to everybody.

---

## The short version

**The product is built and running online.** You can open it right now:

- Manager console: https://naic-2026-coaching-engine.vercel.app/manager
- Staff app: https://naic-2026-coaching-engine.vercel.app/staff
- Glass box: https://naic-2026-coaching-engine.vercel.app/glassbox

It is not a mock or a slideshow. When you click something it talks to a real
server, which reads a real database and calls real AI models.

What is left is mostly not code. Slides, a rehearsal, and a backup video.

---

## What it does today

A manager opens the console and sees a queue of coaching suggestions the AI
has written. Each one says what it thinks is going on with one staff member,
and every claim points at the evidence behind it. The manager confirms,
corrects or rejects it. Nothing happens until they do.

Underneath that:

- **Staff practise** with an AI guest that reacts to what they actually say.
  If you acknowledge the problem the guest softens. If you lead with a free
  drink they push back. The guest has a voice you can hear.
- **Staff talk about their shift** afterwards, out loud into their phone. We
  transcribe it, pull out what happened, and show them their own hotel's
  standard for that situation. The recording is deleted straight away.
- **Managers write down what they saw** on the floor.
- **The system compares the two.** Good in practice, poor on the floor, means
  something is stopping them, and more training will not help. That comparison
  is the product.
- **Patterns across the team** are shown only when at least five people share
  them, so no one is identifiable.

---

## What we can prove, not just claim

This is the part worth knowing before the pitch, because judges will push on
it and we have answers.

**"It's just a wrapper around ChatGPT."**
Open the glass box and run it. A typical run is 7 decisions made by our code
and 1 by the AI, and the AI's one decision was picked from a short list our
code had already narrowed. You watch this happen live.

**"It will make things up."**
Also in the glass box. We throw nine fabricated claims at our own system, the
kind a real AI failure looks like, and none of them get through. The honest
one does. This runs on the real code, not a recording.

**"Staff data will leak between roles."**
Third panel. We run one identical database query as three different people. A
colleague sees nothing. The manager who observed them sees everything. L&D
sees team patterns but no individual scores. The rules live in the database,
so a bug in our app cannot get around them.

**"You are just showing us the good cases."**
Roughly a third of the time the system refuses to give advice and says why.
That is deliberate. If it cannot point at a specific standard, it says
nothing.

---

## Done

| | |
|---|---|
| Database with access rules built in | done, 10 out of 10 security tests pass |
| The scoring and reasoning engine | done, 75 tests, no AI involved |
| The API | done, every part tested end to end |
| Manager console and staff app | done, live online |
| Glass box | done, all three panels working |
| Voice for the practice guest | done |
| Spoken shift debriefs | done |
| Deployed and public | done |
| Red team against our own AI | done, nothing got through |

Live right now: 48 staff, 9 suggestions waiting, 7 team patterns shown and 2
hidden for privacy.

---

## Tools we use

Worth knowing because the competition scores us on this.

| Tool | What it does for us |
|---|---|
| **Google Cloud (Vertex AI)** | works out why a gap exists |
| **OpenAI** | writes the coaching, scores practice |
| **Groq** | the practice guest replies fast, and transcribes speech |
| **ElevenLabs** | gives the guest a voice |
| **Manus** | writes the weekly operations brief |
| **Langfuse** | records every AI run so we can see cost and failures |
| **Neon / Render / Vercel** | the database and hosting |

All of them are connected and checked automatically before a demo.

---

## Still to do

**Needs a person, not code:**

1. **Slides.** Due Sunday at 2pm with the demo link. This is the main thing
   left and nobody has started it as far as I know.
2. **Backup video.** Record the demo on Saturday. The free hosting goes to
   sleep after fifteen minutes and takes a minute to wake up, so we want a
   video in case that bites us on stage.
3. **Pick one link for the submission.** There are two versions of the site
   live. We should agree which one goes in.
4. **Evaluation labels (Mary-Susan).** We have 45 test cases, but the
   "correct answers" were generated automatically and they are wrong. One
   labels a phone complaint about noise as being about eye contact. Until
   someone who knows the SOPs fixes them, we should not call it a golden set
   in the pitch.

**Small technical things:**

5. Do not push code during the pitch. It restarts the server for three
   minutes.
6. Open the site a few minutes before presenting so it is awake.

---

## Honest list of what is not real

We will be asked, so we should be first to say it.

- **All staff are invented.** Names, scores, shifts, all generated. Real staff
  performance data is personal data. We have no hotel partner and no data
  agreement, so using real people would be indefensible for a team pitching
  governance. This is a choice, not a gap.
- **The SOPs are real**, from a working hotel, used with permission, but the
  situations around them are made up.
- **There are no live guests.** We left that out on purpose. Watching guests
  would put us in a different and much heavier legal category.
- **The evaluation labels are not trustworthy yet.** See item 4 above.

---

## Who did what

Ziyi built the whole frontend. Nathan built the database, the API and the
reasoning engine on top of it, and finished the backend before the freeze.
Mary-Susan supplied the hotel SOPs that everything is grounded in, and set up
the Google Cloud project.

The directory READMEs are more current than any of this if you are looking for
detail.
