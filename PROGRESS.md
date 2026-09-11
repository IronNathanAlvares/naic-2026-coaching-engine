# Where we are

Last updated 11 September 2026, evening.

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

**It also works properly on a phone now**, which it did not this morning.

What is left is a rehearsal and a backup video.

---

## What changed today

Worth reading if you looked at the site earlier and something annoyed you.

**You can now say an observation instead of tapping one.** The mentors put it
plainly: managers are on the floor, not at a workstation, and a form nobody
stops to fill in produces no data. `/manager/observe` has two tabs now, and
Speak it is the default.

One recording can cover several people. "Diego handled that checkout dispute,
he stayed calm but never offered her anything to fix it. Amara was excellent on
the phone. Bogdan froze when the guest asked about the spa" comes back as three
separate drafts, each with the right person, the right kind of moment, and
whether you saw the whole thing or only part of it.

Nothing is logged until you tap Log on each one. And every rating has to quote
words you actually said: the quote is checked against your own transcript, and
a rating the model cannot point at is thrown away before you ever see it. Your
words are shown back to you with the evidence underlined in the colour of the
dimension it scored, so "why does it say 2" is a glance rather than an act of
faith.

If it cannot work out who you meant, it asks. Two Marias is a question, never a
guess, because a floor observation lands in somebody's record and moves their
transfer gap.

If there is no signal where you are standing, the recording waits on the phone
and sends itself when there is. That is most of a hotel basement.

We did not build tone analysis, which was also suggested. Reading emotion from
a worker's voice at work is banned outright by the EU AI Act, Article 5(1)(f),
and it is the same line we already refused to cross when we left live guest
monitoring out. The audio is turned into text and dropped: no voiceprint, no
speaker identification, nothing about how anything was said.

**Buttons that looked broken.** Clicking "Open as Marta" appeared to do
nothing for up to a minute, so people clicked again. The link was always
right: the page was loading with no sign that anything was happening. Every
screen now shows a skeleton straight away, and says "waking the server" if the
wait runs long, which only happens on the free hosting after fifteen quiet
minutes.

**A crash.** Opening "Why is the AI saying this?" took the whole page down
with the browser's own error screen. Our code expected one calibration reading
and the server sends a list of them. Fixed, and the same wrong assumption was
found in four other places that were failing silently, including the screen a
manager uses to verify a recommendation.

**No way back.** Ten of the thirteen screens had no back link. The glass box
had no navigation at all, which mattered because it is linked from the manager
menu, so anyone who opened it was stuck. Every screen now has a back link that
goes up exactly one level and says where it goes, plus a "Switch role" link
for getting out to the other app.

**Phones.** A script now checks all ten screens at phone, tablet and laptop
width for the three things that make a site unusable: content wider than the
screen, buttons too small to tap, and screens with no way out. It found eleven
problems. All eleven are fixed and it now passes everywhere.

**Writing.** Every em dash is gone from the site, so it reads the same way as
the slides and the documents.

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
| Database with access rules built in | done, 10 out of 10 negative tests pass |
| The scoring and reasoning engine | done, 75 tests, no AI involved |
| Works on a phone as well as a laptop | done, checked at three screen widths |
| A way back from every screen | done, all 13 |
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

1. **Backup video.** Record the demo on Saturday. This is now the biggest
   risk left. The free hosting goes to sleep after fifteen minutes and takes
   up to a minute to wake, so we want a recording in case that bites us on
   stage.
2. **Rehearsal.** The pitch script is written and timed to 6:32 against a
   7:00 hard stop, with five speakers and the handovers written out. It has
   not been read aloud by the people saying it.
3. **Pick one link for the submission.** There are two versions of the site
   live. Ziyi's is still on mock data. We should agree which one goes in and
   pause the other.
4. **Evaluation labels (Mary-Susan).** We have 45 test cases, but the
   "correct answers" were generated automatically and they are wrong. One
   labels a phone complaint about noise as being about eye contact. Until
   someone who knows the SOPs fixes them, we should not call it a golden set
   in the pitch.
5. **The four things nobody has clicked.** Hearing the guest voice, speaking a
   reply, recording a debrief, and logging an observation to watch the gate
   open. They need a microphone and a person, so they cannot be tested
   automatically, and they are the parts most likely to surprise us on stage.

**Done since the last update:** the slides (12, with speaker notes), the
pitch script, the product walkthrough, and the four rounds of site fixes
above.

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
