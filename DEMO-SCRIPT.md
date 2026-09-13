# The two minute demo

For the TechIreland National AI Challenge pitch, Mon 14 Sept.
Written 13 Sept against the deployed site, with every timing measured.

**Live site:** https://naic-2026-coaching-engine.vercel.app
**API:** Cloud Run, europe-west1, warm. First call 0.4s, no cold start.

**The demo is the video.** `demo-video/Demo_Video_Coaching_Engine.mp4`, 1:58,
silent, narrated live by you. Run sheet: **Demo-Run-Sheet.docx**.

The narration is the next section. Everything after it is the live walkthrough,
kept because the words are the same and because you need it if a judge asks to
drive the product in questions.

---

## Read this first: four decisions already made for you

**1. The demo costs zero ElevenLabs credits.**

You have 1,221 characters left on a lifetime free tier, and the code holds back
1,200 as a reserve. That is about 21 characters of headroom, which is four
words. Worse, the practice guest's opening line is generated fresh every run at
temperature 0.8, so it can never be pre-cached: every run would try to
synthesise, and fail.

So the practice conversation is **not in this demo**. Nothing here plays
synthesised audio. The voice you hear is yours, speaking into a microphone, and
that is transcribed by Groq Whisper, which has a generous free tier and is not
the thing that is nearly empty.

If a judge asks about the guest's voice, the honest answer is a strength:
*"It speaks, using ElevenLabs, and we turned it off for this demo because we
are on a free tier and would rather spend the last of it on you than on us."*

**2. The whole demo is in English, and the dialect layer is a Q&A card.**

Diego's debrief used to be in Spanish, and it is the single best-looking thing
the system does. It is out of the two minutes anyway, for two reasons. Most
guests and most shifts are in English, so the Spanish version demos the edge
case rather than the product. And on the English path the answer comes back as
**one card instead of three**, with nothing below the fold, which takes fifteen
seconds out of act one and puts them into the ending.

It is not dropped, it is held. The moment a judge asks how this works for staff
whose English is weak, you have a better answer than a feature list, and you
have it on demand rather than unprompted. The words are in the fallbacks below.

**3. Diego goes first, not Marta.**

The order matters more than the split. The payoff of this product is the
collision of two independent streams, and a collision needs both sides to
arrive in order. Diego gives his account, Marta gives hers, and the system puts
them together in front of the room. If Marta goes first the ending is just a
screen.

It also puts the sequencing rule in the right place. Marta commits her own
judgement first and the two streams then collide, which is the order the
product actually enforces, so the story you tell matches the rule underneath
it.

**4. You are running the whole thing from one browser tab.**

Use the role switch, never two windows. The mentor note was explicit: switching
between separate instances makes judges suspect the parts are not one product.

---

# NARRATING THE VIDEO


## 0:00 — The landing page

**On screen:** *Training shows completion. This shows what changed on the floor.*

> "Last Tuesday, a guest shouted at Diego on a Dublin front desk. His manager
> saw the whole thing. You are about to get both of their versions, and they do
> not match."

---

## 0:08 — Diego's debrief, already answered

**On screen:** his own words, then *Escalation and Logging · Escalation > Rule 1*,
then *Why you're seeing this: you described a room not ready.*

> "Ninety seconds after the shift, he says what happened. Back comes his own
> hotel's escalation rule, quoted, with the rule number on it. Not advice from
> the internet. Their manual."

---

## 0:18 — The practice conversation

**On screen:** the guest, then Diego's reply, then *the guest seems satisfied*.

> "This is him practising the same situation. Watch what he offers her. The
> bags. A coffee in the lounge. And a time he will come back with."

---

## 0:30 — His practice notes, today

**On screen:** *Leading here* on Composure, Empathy and Service Recovery.

> "Leading on all three. That is today."

**Then stop talking for two seconds.** The next screen is the whole pitch and it
needs a clear run at them.

---

## 0:36 — His practice notes, two weeks ago  ← THE MOMENT

**On screen:** the Aug 30 run. *"Stops short of an offer, which is the 5."*

> "And this is the same exercise, two weeks ago. Stops short of an offer. Back
> then he never offered her anything."
>
> "So he learned it. Training worked."

**Land that, then let the video move.** Everything after this is the
consequence of those two screens sitting next to each other: the thing he
learned in practice is the exact thing he still does not do on the floor. You
are not going to say that yet. You are going to let his manager say it for you.

---

## 0:48 — Marta's console

> "Now his manager. Eleven recommendations waiting on her read, and nothing
> routes anywhere until she verifies it."

---

## 1:00 — The observation

**On screen:** *he never actually offered her anything to fix it*, composure 4,
and the line *one rating was thrown away for quoting words you did not say*.

> "Twenty seconds of what she saw. It scores composure four and underlines the
> words that earned it."
>
> "And there. It threw a rating away, because it had quoted something she never
> said."

---

## 1:06 — She adds it back herself

**On screen:** Recovery 1, *"Did they fix the problem for the guest? You added
this one."*

> "So she adds that one by hand. Recovery, one. And it records that the judgement
> was hers, not ours."

---

## 1:12 — The queue

**On screen:** *7 of these 11 say the same thing. 5 people, the same missing
authority.*

> "Seven of these eleven say the same thing. Five people, the same missing
> authority. That is one policy to write, not five conversations to have."

---

## 1:18 — The verify card

**On screen:** Confirm / Correct / Reject, and the glass box open underneath.

> "And it still has not done anything. It drafted, it cited, and it stopped."

---

## 1:30 — The transfer gap

**On screen:** Recovery **4.8 vs 1.4, Blocked**.

> "Two streams, one reading. In practice, four point eight. On the floor, one
> point four."
>
> "Every learning platform in the world looks at that and books him a course.
> This one says do not. He has already proved he knows how."

**Optional, if the room is warm. One joke only, delivered flat:**

> "We built an AI whose best answer is quite often 'do not buy the thing we are
> selling'. Our investors love that about us."

---

## 1:42 — The brief for the GM

**On screen:** the written brief, with Download, Copy, Print or PDF.

> "And it does not stop at Diego. The same finding across five people becomes one
> brief for the general manager. Give the front desk clear authority on what they
> may offer. Written, sourced, ready to send."

---

## 1:52 — Close, over the glass box

> "Training would have cost that hotel money to teach Diego something he had
> already learned. The fix was one sentence about what he is allowed to offer."
>
> "That is not a skill gap. It is an authority gap, and it was never Diego's to
> fix."

**[1:58] Stop. Let the last frame sit.**

---

## If you are running short

Cut in this order. Each one is a whole paragraph, so you lose time without
losing a thread:

1. 0:48, Marta's console. The queue count is not load bearing.
2. 1:18, the verify card. Painful, but the gate is stated again in questions.
3. 1:42, the GM brief. Only if you must: it is the scale argument.

Never cut 0:36 or the close. Those two are the pitch.

---

## What to say if they ask

**"Does it ever recommend training?"**
Do not answer from memory. It is on the transfer gap screen, one row below
Recovery: *Communication, 2.4 versus 1.0, Needs practice. Weak in both.
Targeted practice is the right answer.*

> "Weak in practice and weak on the floor means he has not learned it yet, and
> that is what a course is for. Four quadrants. Only one of them is 'book
> training', and only one of them is 'do not'."

**"How do you know the AI is right?"**

> "We do not assume it. Every verdict a manager gives is scored against what the
> model said, per dimension. You can see the agreement rate on the card. It reads
> one hundred percent on service recovery, over five checks, and five checks is
> not a result, it is five checks. We would rather show you a number that is not
> ready than not measure it."

**"What stops this becoming staff surveillance?"**
It is written on the team insights screen: *5 patterns hidden, group smaller
than 5 staff, so they can't be shown without identifying someone.*

> "Patterns only appear once at least five people share them. Below that the
> system refuses to show you anything, because at four people you are not looking
> at a pattern, you are looking at a person."

**"Why is there no sound?"**

> "Because I would rather talk to you than play you a voiceover."

---

# THE LIVE WALKTHROUGH

Everything below drives the product live. Same words, same order, but the
product has to cooperate. Use it in questions, or if you decide on the day
that you would rather do it for real.

---

## The state it starts in, verified today

| | |
|---|---|
| Diego, service recovery | practice **4.79**, floor **1.62**, gap **3.17**, BLOCKED (floor drops to about 1.4 once you log in act two, which is correct) |
| Marta's verify queue | **10** waiting, 6 of them the policy cluster across 4 people (13 Sept; read it off the screen on the day) |
| Team patterns | **7**, k-anonymity threshold 5 |

Check these before you walk on. If Diego's numbers have drifted, the story
still works: the words to use are in the fallbacks at the end.

---

## Timings, measured against the live API

| Step | Real time |
|---|---|
| Debrief, submit to answer | **about 3s** |
| Observation draft from spoken note | **1.6s** |
| Log observation, including the full agent run | **7.6s** |
| Any page load | under 1s |

The 7.6 seconds is the only real wait. It is scripted over, below. Do not fill
it with silence and do not apologise for it.

---

# THE BRIDGE IN

**Slide 3, The Solution. Finish the slide before you switch. Say this as you
move to the browser:**

> "That is the idea. Now here are those two signals arriving on a real shift,
> from two people who do not agree about what happened."

---

# THE LANDING PAGE, 0:00 TO 0:08

**Open on:** the site's front page. Let it sit. Do not read the screen aloud.

> "Last Tuesday, a guest shouted at Diego on a Dublin front desk. His manager
> watched the whole thing. You are about to hear both of their versions, and
> they do not match."

**Then click "Open as Diego, Front Desk".**

*"They do not match" is the hook, and your closing line is the answer to it, so
do not give the answer away here.*

---

# ACT ONE, DIEGO, 0:08 TO 0:55

**On screen:** the staff app, phone-shaped, logged in as Diego.

---

## [0:08] His practice, and the one thing he never does

**Go to "My practice" in the bottom bar, then "Details" on the Aug 30 run,
"Room not ready at check-in".** Direct link, if you would rather not navigate:
`/staff/results/8a4e-diego`.

Use **that** run, not one you record on the day. It is stable, it loads with no
model call, and it contains the best sentence in the product.

> "Before we get to the shift, here is Diego practising the same situation. A
> guest checking in, room not ready, and she has been waiting an hour."
>
> "Look at what he does. Apologises for the specific problem, takes ownership,
> commits to staying with her until it is sorted. That is the recovery
> sequence, and he knows it cold."

**Point at the note under the quote.**

> "Now look at what the system says he did not do. *Stops short of an offer.*
> He never offers her anything. Hold onto that."
>
> "And notice he never sees a score. He sees a label, and the exact words that
> earned it. The moment you give a twenty three year old a number, it stops
> being coaching and starts being a ranking."

**What is on that screen, verified:**

- *"Strong recovery sequence: acknowledge first, then act. To reach a 5, add a
  concrete gesture, a lounge seat, a drink, a call-back, once you know what the
  guest expects."*
- his own words, quoted, under **What earned this**
- *"Resolved + Ownership... **Stops short of an offer, which is the 5.**"*
- three dimensions labelled **Confident here**, two left blank because the
  conversation gave no evidence for them. Blank is a real answer here.

*This beat is what makes the payoff land. Without it, the 4.8 at the transfer
gap is a number you assert. With it, the room has already watched him do
everything right except the one thing he is not allowed to do.*

---

## [0:23] His shift, in his own words

**Click into the debrief box, press "Speak and send", and talk.**

> "He is twenty three, he is on the front desk, and this is the first thing he
> does after a shift like that."

**Speak this into the mic:**

> *"The guest was really angry because her room wasn't ready and the airport
> bus never turned up. I told her to wait, but it got bad and I had to call my
> manager."*

**[0:33] While it thinks, about three seconds:**

> "He is not filling in a form. He is talking, the way he would tell a
> colleague on the way out."

Say the debrief line like somebody at the end of a bad shift, not like a
script. It is meant to sound like a person.

**[0:37] The answer lands. One card, checked against the live site:**

- the heading *"Your hotel's own standard, straight after your shift"*
- his own words, given back to him
- the clause itself, tagged *Escalation and Logging · Escalation > Rule 1*:
  *"Escalate to manager: seat the guest, brief the manager, manager logs in
  complaint log."*
- and under it, *"Why you're seeing this: You described a room not ready."*

**Point at the words inside the quote marks.**

> "That is not advice from the internet. That is his own employer's escalation
> procedure, quoted, with the rule number on it. Seat the guest, brief the
> manager, log it in the complaint log."
>
> "Ninety seconds after the shift that needed it. And underneath, it tells him
> why it chose that rule: he described a room that was not ready."

**Do not scroll.** It all fits on one screen. Nothing below the card is worth
five seconds of a two minute demo.

**[0:50] The handover line. Say it, then switch role.**

> "So that is Diego's side of Tuesday. Here is his manager's."

---

# ACT TWO, MARTA, 0:55 TO 1:27

**[0:55] Click "Switch role", then "Open as Marta, Duty Manager". Go to
"Log observation". You land on "Speak it".**

**Speak this into the mic:**

> *"Diego handled that checkout dispute at the front desk. He stayed completely
> calm even though the guest was shouting at him, but he never actually offered
> her anything to fix it."*

**[1:07] The draft appears in about two seconds. Point at the underline.**

> "It has drafted the observation for her. Diego, composure four, recovery
> one. And read her own sentence back: *he never actually offered her anything
> to fix it.* There it is again."
>
> "And look at the underline: every score has to quote the words she actually
> said. If it ever scores something she did not say, that rating is thrown away
> before she sees it."

***"There it is again"* is the highest value three words in the demo.** The room
saw the machine say *stops short of an offer* sixty seconds ago, in practice,
with nobody watching. Now his manager, independently, writes down the same
thing about a real shift. Two streams, same finding, and neither one knew about
the other. Do not rush it and do not explain it.

**Do not promise a rating was discarded on this run.** Whether one gets thrown
away depends on what the model quotes, and on a clean run nothing is dropped
and the line under the transcript simply reads "Underlined words are the
evidence behind a rating." The sentence above is true every time. If you do see
"one rating was thrown away for quoting words you did not say", point at it,
because it is the better version of the same claim.

**[1:17] Press "Log this". THE 7.6 SECOND WAIT STARTS. Talk through it:**

> "And there is a rule underneath this. A manager cannot read a staff member's
> practice scores until she has logged her own observation of them. Not greyed
> out in the interface. Refused by the database, on a different row than the
> one our API asks for. Because if you read the machine's opinion first, you
> will agree with it, and then you have two opinions and no evidence."

**Say the rule, do not claim it is unlocking on screen right now.** Marta has
already observed all forty six people on her team in this seeded data, so the
gate is open for everyone and nothing visibly changes when you press Log. The
rule is real and enforced; this particular manager has simply already earned
her way past it. If a judge pushes, that is the glass box's third panel, and
you can show it in questions in about fifteen seconds.

---

# THE PAYOFF, 1:27 TO 2:40

## [1:27] The gap, in two bars

**The result lands. Go to "Transfer gap".**

> "Two independent streams. In practice, Diego scores four point eight on
> service recovery. On the floor, about one and a half. That is a gap of more
> than three points on a five point scale."

**Read the floor number off the screen rather than memorising it.** Before you
log, it sits at 1.6. The observation you just logged is real evidence and it
pulls the mean down, so immediately afterwards it reads about 1.4. Both are
right; saying "about one and a half" is right either way, and a judge who sees
you read your own screen trusts the number more than one you recite.

**[1:38] Slow down here.**

> "Every learning platform in the world looks at that and books him a training
> course. Ours says the opposite. Do not train him. He has proved he knows how
> to do it."
>
> "You have now watched him not make an offer twice. In practice, with nobody
> watching. On the floor, with his manager watching. The system's verdict is
> not *train*. It is *blocked*."

---

## [1:50] The verify queue, where it stops

**Go to "Verify queue" in the left sidebar, then open Diego's card, the one
marked New.**

This is the part that answers "why would a GM ever trust this", and it is the
strongest thirty seconds in the demo. Do not rush it.

**First, the three buttons. Point at them before you say anything else.**

> "Here is what it wants to do about Diego. And here is the part I care most
> about: it has not done anything. It drafted, and it stopped."
>
> "Confirm, correct, or reject. Nothing reaches Diego, nothing routes anywhere,
> until his manager decides. That is not a setting we could switch off. It is
> the shape of the product, and under the EU AI Act it is the difference
> between a tool a hotel can deploy and one it cannot."
>
> "And I'm not going to press it. That's not my call to make. It's Marta's,
> which is the whole point."

### Do not press any of the three. Two reasons.

**It is a one way door.** `recommendations.py` flips the recommendation's status
from `pending_verify` to the verdict, and refuses a second verdict on the same
card with `already_decided`. Press it and Diego's card leaves the queue, the
banner recounts from twelve to eleven, and you cannot replay the beat. Every
rehearsal that presses it burns a card and writes a calibration label.

**It is the better line anyway.** The standard objection to human in the loop is
that the human just clicks yes. A presenter rubber stamping his own product's
recommendation in two seconds on stage proves the objection right. Declining to
press it, because you are not the manager, answers the objection before anybody
raises it, and it rhymes with Diego's whole problem: a person acting without the
authority to.

**If a judge asks you to press one**, press **Confirm**, and use it:

> "Confirmed. And that verdict is now evidence about *us*, not about Diego.
> Every decision a manager makes is scored against what our model said,
> dimension by dimension. A rejection counts for more than a confirmation, not
> less: the code treats it as the most valuable label the product generates. If
> we start drifting away from her judgement, this thing says so on its own
> face."

**Then expand "Why is the AI saying this?"**

> "And before she decides, it shows its work. Three claims, four sources."

**Read the three claims off the screen, in order. Do not paraphrase them.**

1. *"Diego successfully offered complimentary services during practice, such as
   a breakfast tray and drinks."* — tagged **Practice turn**, twice
2. *"On the floor, Diego handled a checkout dispute but did not offer any
   complimentary services."* — tagged **Floor observation**
3. *"The SOP requires informing the department manager about all guest
   complaints even when already resolved, which may cause hesitation in
   offering immediate solutions."* — tagged **Hotel standard**

**Point at the third one. This is the single best moment in the demo.**

> "In practice he offers a breakfast tray and drinks. On the floor he offers
> nothing. And then this."
>
> "Their own standard operating procedure requires him to tell a manager about
> every guest complaint, even one he has already fixed. That is what is making
> him hesitate. The blocker is not Diego, and it is not his training. It is a
> sentence in their own procedures manual, and the system found it and quoted
> it."

**And read the action out.**

> "So it does not book a course. It tells the front office manager to clarify
> what Diego may offer without approval, and it gives her the question to open
> with. *Diego, what do you feel is stopping you from offering solutions on the
> floor?*"

---

## [2:25] Five people, one policy

**Scroll back to the top of the verify queue, to the banner. Read it off the
screen.**

> "And this is where it stops being about Diego. *[read the banner]* Six of
> these ten say the same thing. Four different people, the same missing
> authority."
>
> "That is one policy to write, not four conversations to have."

**Every number in that line moves, including the people count.** Act two writes
a new recommendation on every run, so the queue grows with each rehearsal; and
deciding a card can take a person out of the cluster altogether, which has
already happened once. As of the evening of 13 Sept the live queue holds ten
pending, of which six are the policy cluster, across four people.

So read all three off the screen, and note that the people number is said
**twice** in that line: once as the count, once as the number of conversations.
They have to match. If the banner says three people, it is "not three
conversations to have".

---

## [2:32] The close

**Hands off the keyboard.**

> "Training would have cost that hotel money and taught Diego something he
> already knew. The fix is one line in a policy document, and it fixes it for
> five people at once."

**[2:40] Stop.**

---

# THE BRIDGE OUT

**Switch back to the deck as you start speaking. This lands you on slide 5,
Under the Hood.**

> "You just watched software tell a hotel not to spend money, and then refuse
> to send that anywhere until a human agreed with it. Here is what is
> underneath that."

Shorter version if you are behind:

> "It did not act on that alone. Here is what is underneath it."

---

## The shape of it

| | |
|---|---|
| Landing page, the story | 0:08 |
| Diego's practice, and the offer he never makes | 0:15 |
| Diego's shift, his own words and his hotel's standard | 0:32 |
| Marta, what she saw, and "there it is again" | 0:32 |
| The transfer gap, two bars and the verdict | 0:23 |
| The verify queue: it stopped, and here is why | 0:35 |
| Five people one policy, and the close | 0:15 |
| **Total** | **2:40** |

**If you only have 2:10.** Cut the transfer gap page entirely and go from
Marta's log straight to the verify queue. You lose the two bars and the "gap of
three points" number, and you keep the evidence, the human gate, the SOP cause
and the team pattern. Open the verify queue with: *"Two streams, and here is
what the system made of them."* The verify queue is the better screen; the
transfer gap is the better number. If you can only have one, keep the screen.

If you are running long, the time comes out of the landing page, Diego's second
narration line on the answer card, and the transfer gap. It never comes out of
the practice notes, "there it is again", the third claim about the SOP, or the
close. Those four are the pitch.

---

## Why this ending wins a Dragons' Den room

Every other AI training product sells more training. This one, on stage, looks
at a struggling employee and says *do not buy training for this man.* That is
the most investable sentence in the pitch, because it is the one a competitor
cannot say, and a GM who has ever bought training that did nothing will feel it
in their stomach.

If you only have ten seconds of the demo left, it is those three lines. Cut
anything above them first.

---

## Humour, used sparingly

Two options. Use one, not both. A pitch that jokes twice reads as a pitch that
is not sure of its numbers.

**If a judge asks about non-English speakers and the room is warm:**

> "Guagua is a bus in Havana and a baby in Lima. Same word. You can see how a
> shift handover might go sideways."

**On the training recommendation, which is the stronger one:**

> "We built an AI product whose best answer, quite often, is 'do not buy the
> thing we are selling'. Our investors love that about us."

Deliver the second one flat, then move straight on. Do not wait for the laugh.

---

## If something breaks

**The microphone does not work, or the room is too loud.**
Click "Type it instead" (Diego) or "Tap it through" (Marta). Both lines are in
this document; have them on the clipboard. Say:

> "I will type it, because a conference room is not a hotel lobby."

**The transcription comes back wrong.**
Do not fight it. His own words are shown back to him on the card, which is the
point:

> "And that is why he sees his own words first. If we hear him wrong, he says
> so, and it changes what he gets coached on."

**"Log this" fails or hangs past fifteen seconds.**
Go straight to Transfer gap, which already shows the gap from the existing
data:

> "It has logged fifty of these already. Here is what they add up to."

**The whole site is down.**
Play `demo-video/coaching-engine-demo.mp4` from the laptop. It is silent, so
you narrate it with this script and can pause it to take a question.

> "I am going to play this from the laptop, because I do not trust conference
> wifi and neither should you."

**Note:** the video currently on disk was recorded against the **Spanish**
debrief, so act one in it does not match act one as written above. Either
re-record it with `python scripts/record_demo.py` before the day, or, if you
are forced onto it live, use the dialect answer below as your narration while
that part plays.

**A judge asks about staff whose English is weak.**

> "He can do all of that in his own language. We built a dialect layer on top
> of translation, because *guagua* is a bus in Havana and a baby in Lima, and
> scoring somebody on a sentence they did not say is worse than not scoring
> them at all. It is live. I just did not want to spend your two minutes on
> it."

If they want the detail: we retrieve regional vocabulary before we translate,
116 entries across 21 countries, and it takes dialect comprehension from 31.2%
to 46.5% on a 157-item set, replicated at 40.5% to 70.3% on a second set. That
is the thesis work behind it, and the numbers are in TECHNICAL-REFERENCE.md.

**The 100% line at the bottom of the card.**

The verify card ends with *"Agrees with your managers 100% of the time on
service recovery, over 3 checks."* **Do not point at it and do not read it
out.** One hundred percent over three checks is not a result, it is three
checks, and a sharp judge will say so.

If somebody spots it, say it before they finish the sentence:

> "Three checks. That number means nothing yet and we are not going to pretend
> it does. What matters is that it is *there*: every verdict a manager gives is
> scored against what the model said, per dimension, and when agreement is low
> the product says so on its own face and routes to a human first. We would
> rather show you a number that is not ready than not measure it."

That is a stronger answer than a good accuracy figure would be, because it is
the answer of a team that knows what its own evidence is worth.

**A judge asks: "does it ever say anything except *don't train*?"**

Point at Tomas, three rows down the queue: *"Tomas excels in real situations but
struggles with simulations."*

> "That is the opposite corner. He is fine on the floor and poor in practice,
> so the practice score is the thing that is wrong, not the person. We do not
> send him training either. We recalibrate the measurement. Four quadrants,
> and only one of them is 'book a course'."

**A judge says: "so he cannot do it in practice either. Train him."**

This is the sharpest question in the room and it has a clean answer.

> "In practice he scores four point eight out of five on recovery. The note you
> saw is the difference between a four and a five, not between competent and
> not. On the floor the same man scores one point four. A training course
> closes a gap of nought point two. It does nothing to a gap of three."
>
> "And look at *what* is missing in both: the offer. Not the empathy, not the
> composure, not the procedure. Only the one thing that needs somebody's
> permission. That is not what a skill gap looks like."

**A judge asks why the guest has no voice.**

> "It speaks, using ElevenLabs. We turned it off for this demo because we are
> on a free tier and would rather spend the last of it on you than on us."

---

## Appendix: the practice conversation, turn by turn

You do not run this in the two minutes. It is five turns of typing and you have
eight seconds. This is here for **rehearsal**, and for the case where a judge
says "show me the practice bit" in questions.

Scenario: **Room not ready at check-in**, Empathy · Composure · Recovery. The
guest opens with something close to:

> *"Hi, I'm checking in for the reservation under Smith. My room isn't ready
> yet, and I've already been waiting in the lobby for over an hour."*

The guest is model generated at temperature 0.8, so her wording changes every
run. Yours does not have to.

**Turn 1.**

> "I'm really sorry, Mr Smith. You've been waiting far too long for this and
> I'd be annoyed too. Let me find out exactly where your room is right now, and
> while I do, can I take your bags and get you a coffee in the lounge on us?
> I'll come back to you with a real time, not a guess."

Acknowledge with the specific problem, stay off the defensive, take ownership,
make a concrete offer, commit to a time. That is every dimension in one breath.

**It used to say "an hour in the lobby", and that is a trap.** The guest's
opening line is generated fresh every run, so how long she has been waiting
changes: in the recorded video she says *twenty minutes* and the reply still
says *an hour*, which is visible in the chat bubbles if anybody reads them.
"You've been waiting far too long" is true whatever number she gives, and it
scores the same.

**Turn 2, after she says some version of "make sure it's actually ready".**

> "That's fair, you've already been told once that it was ready. So I won't come
> back to you until I've seen the room myself. I'll check with housekeeping, go
> up and look at it, then come and get you. And if it slips again, you'll hear
> it from me before you have to come and ask."

Her complaint is about trust, not time, so answer with verification rather than
a new estimate.

**Turn 3, once she is calm.**

> "Thank you for being patient with me, not everyone would be. I'm going up to
> check it now. I'll also put a note on your booking about the wait, so the team
> tonight knows and nobody asks you to explain it twice. Give me ten minutes and
> I'll come and find you."

Stop apologising the moment she is calm; the rubric marks repetition down.
Putting a note on the booking is *logging the incident*, which is the same
behaviour the hotel's own escalation rule asks for in act one.

**Turn 4, closing.**

> "Perfect. I'll let the lounge know you're on your way so you're not explaining
> it a third time. Your bags are behind the desk, here's your ticket. I'll come
> and find you as soon as the room's yours."

No new promises, no fourth apology. Close the loop and stop.

**If she goes somewhere else,** match the shape rather than the words:

| She… | You |
|---|---|
| presses for an exact time | "Housekeeping have it as forty minutes. I'm not going to promise you twenty and be wrong. If it slips, I'll come and tell you before you have to come and ask me." |
| asks what you'll do about it | "I can sort the coffee and flag your check-out time so you're not rushed tomorrow. Anything beyond that I'd have to ask my manager, and I'd rather ask than promise you something and take it back." |
| asks for the manager | "Of course, I'll get her. Before I do, I've got your bags stored and a seat in the lounge, so you're not standing here while we sort it." |

That middle answer is worth using if it fits. *"I'd rather ask than promise you
something and take it back"* is Diego saying out loud that he does not know his
own authority, which is the thing the transfer gap infers from the numbers.

**Rehearse as somebody other than Diego.** A completed practice writes real
scores and moves the 4.79 the pitch quotes.

---

## The one claim not to overreach on

The sequencing rule is genuinely enforced in Postgres, and the glass box proves
it live: ask as Diego, a colleague, and the database returns nothing; ask as
Marta, who has observed him, and it returns eight practice rows and six floor.
Same query, sent unchanged, three different answers.

What you cannot say is "watch it unlock now", because in this dataset Marta has
observed everyone and there is nothing left to unlock. Say the rule, offer the
proof, and let a judge ask for it. A claim you can demonstrate on request is
worth more than one you assert and cannot.

---

## Rehearsal notes

**Rehearse on someone other than Diego.** Every rehearsal that presses "Log
this" writes a real observation. Logging low service recovery on Diego actually
reinforces the story, because it holds his floor score down, but composure and
the others will drift. Use the staff picker to choose anyone else while
practising, and only use Diego on the day.

**Check the state before you walk on:**

```bash
curl -s https://coaching-engine-api-w5wg47f7gq-ew.a.run.app/health
```

Expect `"status":"ok"`, `"database":"up"` and every provider `true`.

**Warm the first page** by loading the site once a few minutes before. Cloud
Run holds an instance awake, so this is belt and braces rather than necessary,
but it costs nothing.

**Time it out loud, twice.** The script is 2:00 with about ten seconds of
slack. The two places that run long are the answer card and the closing three
lines. The closing lines are the ones to protect.
