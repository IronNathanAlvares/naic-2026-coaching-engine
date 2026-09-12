# The two minute demo

For the TechIreland National AI Challenge pitch, Mon 14 Sept.
Written 13 Sept against the deployed site, with every timing measured.

**Live site:** https://naic-2026-coaching-engine.vercel.app
**API:** Cloud Run, europe-west1, warm. First call 0.4s, no cold start.

---

## Read this first: three decisions already made for you

**1. The demo costs zero ElevenLabs credits.**

You have 1,221 characters left on a lifetime free tier, and the code holds back
1,200 as a reserve. That is about 21 characters of headroom, which is four
words. Worse, the practice guest's opening line is generated fresh every run at
temperature 0.8, so it can never be pre-cached: every run would try to
synthesise, and fail.

So the practice conversation is **not in this demo**. Nothing here plays
synthesised audio. The voice you hear is yours, speaking into a microphone, and
that is transcribed by Groq Whisper which has a generous free tier and is not
the thing that is nearly empty.

If a judge asks about the guest's voice, the honest answer is a strength:
*"It speaks, using ElevenLabs, and we turned it off for this demo because we
are on a free tier and would rather spend the last of it on you than on us."*

**2. Diego goes first, not Marta.**

The order matters more than the split. The payoff of this product is the
collision of two independent streams, and a collision needs both sides to
arrive in order. Diego gives his account, Marta gives hers, and the system puts
them together in front of the room. If Marta goes first the ending is just a
screen.

It also puts the sequencing rule in the right place. Marta commits her own
judgement first and the two streams then collide, which is the order the
product actually enforces, so the story you tell matches the rule underneath
it.

**3. You are running the whole thing from one browser tab.**

Use the role switch, never two windows. The mentor note was explicit: switching
between separate instances makes judges suspect the parts are not one product.

---

## The state it starts in, verified today

| | |
|---|---|
| Diego, service recovery | practice **4.79**, floor **1.62**, gap **3.17**, BLOCKED |
| Marta's verify queue | **11** waiting |
| Team patterns | **7**, k-anonymity threshold 5 |

Check these before you walk on. If Diego's numbers have drifted, the story
still works: the words to use are in the fallbacks at the end.

---

## Timings, measured against the live API

| Step | Real time |
|---|---|
| Spanish debrief, submit to answer | **3.2s** |
| Observation draft from spoken note | **1.6s** |
| Log observation, including the full agent run | **7.6s** |
| Any page load | under 1s |

The 7.6 seconds is the only real wait. It is scripted over, below. Do not fill
it with silence and do not apologise for it.

---

# ACT ONE, DIEGO, 60 SECONDS

**Open on:** the site, already on `/staff`, logged in as Diego. Phone-shaped
layout on screen.

---

**[0:00] You, while the screen is still still]**

> "This is Diego. He is on the front desk of a Dublin hotel, he is twenty three,
> and Spanish is his first language. Last Tuesday a guest shouted at him."

**[0:07] Click into the debrief box. Tap "Speak and send". Speak this, in
Spanish, into the phone or laptop mic:**

> *"El señor estaba muy molesto porque la guagua no llegó y su pieza no estaba
> lista. Le dije que esperara, parce, pero la vaina se puso fea y tuve que
> llamar al manager."*

**[0:18] While it transcribes, about three seconds, keep talking:**

> "He is not filling in a form. He is talking, in his own words, in his own
> Spanish."

**[0:22] The answer appears. Three cards stack down the page, in this order,
checked against the live site:**

1. *"Your hotel's own standard, straight after your shift"*, the English
2. *"You said it in your own words"*, his Spanish and the words looked up
3. The clause itself, *Escalation and Logging · Escalation > Rule 1*

**Point at the second card.**

> "Now. Every translation tool on earth would turn *guagua* into *baby*,
> because in Peru it is. In the Caribbean it is the airport bus. Get that
> wrong and you have just scored Diego on a sentence he never said."
>
> "We looked up his regional vocabulary before we translated. *Guagua*, bus.
> *Vaina*, the all purpose noun. *Parce*, which is how a Colombian says mate.
> It read him as Colombian and it says so."

**[0:40] Scroll down one card, to the quoted clause.**

> "And this is not advice from the internet. That is his own employer's
> escalation procedure: seat the guest, brief the manager, log it. Retrieved
> from the hotel's own manuals and quoted back to him ninety seconds after the
> shift that needed it."

**[0:52] The handover line. Say it, then switch role.**

> "So that is Diego's side of Tuesday. Here is his manager's."

---

# ACT TWO, MARTA, 60 SECONDS

**[0:60] Click "Switch role", then "Open as Marta, Duty Manager". Go to
"Log observation". You land on "Speak it".**

**Speak this into the mic:**

> *"Diego handled that checkout dispute at the front desk. He stayed completely
> calm even though the guest was shouting at him, but he never actually offered
> her anything to fix it."*

**[1:12] The draft appears in about two seconds. Point at the underline.**

> "It has drafted the observation for her. Diego, composure four. And look at
> the underline: every score has to quote the words she actually said. If it
> ever scores something she did not say, that rating is thrown away before she
> sees it."

**Do not promise a rating was discarded on this run.** Whether one gets thrown
away depends on what the model quotes, and on a clean run nothing is dropped
and the line under the transcript simply reads "Underlined words are the
evidence behind a rating." The sentence above is true every time. If you do see
"one rating was thrown away for quoting words you did not say", point at it,
because it is the better version of the same claim.

**[1:22] Press "Log this". THE 7.6 SECOND WAIT STARTS. Talk through it:**

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

**[1:32] The result lands. Go to "Transfer gap".**

> "Two independent streams. In practice, Diego scores four point eight on
> service recovery. On the floor, one point six. That is a three point two
> gap."

**[1:45] The closing lines. Slow down. This is the whole pitch.**

> "Every learning platform in the world looks at that and books him a training
> course. Ours says the opposite. Do not train him. He has proved he knows how
> to do it."
>
> "He is *blocked*. Nobody has told him what he is allowed to offer a guest
> without asking permission. That is not a skill gap, it is an authority gap,
> and it is not Diego's to fix."
>
> "Training would have cost that hotel money and taught him something he
> already knew. The fix is a five minute conversation about what he may offer."

**[2:00] Stop. Hands off the keyboard.**

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

**On the guagua moment, if the room is warm:**

> "Guagua is a bus in Havana and a baby in Lima. Same word. You can see how a
> shift handover might go sideways."

**On the training recommendation, which is the stronger one:**

> "We built an AI product whose best answer, quite often, is 'do not buy the
> thing we are selling'. Our investors love that about us."

Deliver the second one flat, then move straight on. Do not wait for the laugh.

---

## If something breaks

**The microphone does not work, or the room is too loud.**
Click "Type it instead" (Diego) or "Tap it through" (Marta). The Spanish text
is in this document, copy it in beforehand and have it on the clipboard. Say:

> "I will type it, because a conference room is not a hotel lobby."

**The Spanish transcription comes back wrong.**
Do not fight it. The panel shows the original and the English side by side,
which is the point:

> "And that is exactly why the staff member sees both. If we read a word wrong,
> he tells us, and it changes what he gets coached on."

**"Log this" fails or hangs past fifteen seconds.**
Go straight to Transfer gap, which already shows the gap from the existing
data:

> "It has logged fifty of these already. Here is what they add up to."

**The whole site is down.**
Play the backup video. Record it on Saturday and have it on the laptop, not in
the cloud.

---

## The parts I could not do for you

**Recording the backup video.** Needs a screen recorder and a human. Do a dry
run of this exact script, screen and audio, and keep it locally.

**Your Spanish delivery.** Say it at ordinary speed, the way somebody actually
talks after a bad shift. Reading it carefully and slowly makes the transcription
better and the demo worse. It is meant to sound like a person, not a language
lesson.

**Choosing the one joke.** That is a read of the room, not a script decision.

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

**Time it out loud, twice.** The script is 2:00 exactly with no slack. The two
places that run long are the Spanish sentence and the closing three lines. The
closing lines are the ones to protect.
