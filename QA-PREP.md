# Q&A preparation

Three minutes of questions after a seven minute pitch. You do not know whether
the judges are technical.

**Four rules before the answers.**

1. **Answer the question asked, then stop.** The most common way to lose a Q&A
   is to answer a small question at length and invite a bigger one.
2. **If you do not know, say so, then say what you would do.** "We have not
   measured that. Here is how we would" beats a guess every time, and judges
   have heard a thousand guesses.
3. **Never quote an accuracy number.** The golden set is unlabelled. There is
   no measured accuracy figure and inventing one is the single worst thing that
   could happen in this room.
4. **The glass box is your weapon.** Any challenge of the form "how do I know
   that is true" has a live answer on one page, in fifteen seconds.
5. **You showed a recording, so expect to be asked to prove it.** The answer is
   never to argue. It is to open the laptop. The site is live, it is the same
   build they just watched, and the first person to suggest that is you.

---

# PART ONE: NON-TECHNICAL AND COMMERCIAL

### "So it's ChatGPT for hotels?"

No, and the difference is the whole product. ChatGPT can roleplay a guest. It
cannot know that Diego scored 4.8 in practice and 1.6 on the floor, because it
never sees the floor. The product is not the conversation, it is the
measurement of the distance between what someone can do and what they did.

Also structure: this models a hotel's actual roles, its own written standards
and who is allowed to see what. A chat window has none of that.

### "Why wouldn't a hotel just use ChatGPT and save the money?"

Three reasons a GM cares about.

One, nobody walks back to a workstation mid shift to type into a chat window.
Our capture is twenty seconds on a phone or thirty seconds of talking.

Two, ChatGPT will cheerfully invent a policy. Ours quotes the hotel's own
manual with a section path, and if it cannot, it says nothing.

Three, and this is the one: ChatGPT has no memory of what actually happened on
the floor, so it cannot tell you that your training budget is being spent on
people who already know the material.

### "Who exactly pays for this?"

The person who owns the training budget: HR or L&D in a group, the GM in a
single property. The buyer is the person currently unable to answer "did the
training work" when the owner asks.

### "How much?"

€12 per user per month. A typical property is 68 seats, 60 frontline and 8
managers, so €9,792 a year. Three year plan: 5 properties year one, 30 year
two, 100 year three, which is €979k ARR.

### "How do you get the first customers?"

Ireland first, direct, because it is small enough to walk into. The route is
hotel groups rather than singles: one conversation covers eight properties.
Then the UK, then Dubai where we have industry familiarity.

The wedge is a free transfer gap audit on one department for one month. It
costs them nothing and it produces the one number they cannot currently get.

### "What if the big LMS players just build this?"

They can build the feature. They will not build the incentive. Every LMS makes
money when more training is assigned, and our headline output is frequently
"do not assign training, fix the process". That is a hard thing to ship when
your commercial model depends on the opposite.

By the time they want to, the defensible asset is the labelled transfer data
per property, which takes months of real observations to accumulate.

### "Is the market big enough?"

Hospitality is the beachhead, not the market. 25,000 four and five star hotels
of 70+ rooms in the EU and UK is €245M. Ireland and the UK alone is €19.6M.

But the engine reads any industry with written procedures and a floor:
healthcare, construction, retail, education. We are demonstrating hospitality
because it is where we have the SOPs and the domain knowledge, not because it
is the limit.

### "What is the real problem, in one sentence?"

Hotels spend money training people and have no idea whether anything changed,
and the honest reason is that measuring behaviour on a floor is hard and
measuring course completion is easy.

### "Why should we believe these numbers?"

Be careful here. The market numbers are bottom up and defensible: property
counts, seats, price. The turnover statistics are **not yet sourced**, so
either cite the source or do not say the number. If pushed on a stat you cannot
source, say: "That one I would want to give you a citation for rather than a
figure from memory."

### "What happens if the AI is wrong about someone?"

Three things stop it reaching them. The recommendation cites its evidence, so
wrong is visible rather than plausible. It abstains rather than guessing when
the evidence does not support it. And a human manager verifies before anything
routes anywhere, with no timeout and no auto approve.

A wrong recommendation that a manager rejects costs thirty seconds. That is the
design.

### "Isn't this surveillance?"

This is the question to answer carefully, because the honest answer is strong.

We refused to build the surveillance version. No live guest monitoring, no
emotion inference, no tone analysis of staff voices, no audio retention. The
last one is worth dwelling on: recordings are transcribed and dropped in the
same call, so there is no voiceprint in this system to leak.

What it does record is what a manager already writes in a notebook, with an
audit trail so the staff member can see it.

### "Would staff accept it?"

The design decision that answers this: a manager never sees an individual's
practice scores until they have logged their own observation first. Practice is
the staff member's own space. And when five or more people hit the same wall,
individual coaching is suppressed entirely and it goes to operations, because
telling five people to try harder at a broken process is how you lose five
people.

### "What is the one thing that could kill this company?"

No hotel is willing to let managers spend twenty seconds a day observing. The
whole product depends on that floor data existing. It is why the capture is
twenty seconds and not a form, and why we built voice: if we make it slower
than that, nobody does it, and we have half a product.

### "Why should we back this team?"

Say something true and short. The technical claim is that the backend, the
governance model and the reasoning engine are built and deployed, not
described, and there is a page that lets you verify the three hardest claims
live, right now, on your own phone.

---

# PART ONE AND A HALF: QUESTIONS THE DEMO ITSELF CREATES

These come straight off screens the judges have just watched. Do not answer
them from memory when you can point instead.

### "Hold on. You showed us a video. How do I know any of that was real?"

**This is the most likely hard question and the answer is an action, not a
sentence.** Open the laptop.

> "Fair. It is a recording because conference wifi is not something I am
> willing to bet the pitch on. But it is a recording of the live site, and the
> live site is right here. Tell me what you want me to do and I will do it in
> front of you."

Then go to the glass box and let them press the buttons. The page asks a
colleague, a manager and the staff member the same database question and gets
three different answers, live.

If they want something faster: `naic-2026-coaching-engine.vercel.app`, on their
own phone, while you keep talking.

### "You showed his practice notes twice. What was the point of that?"

**This is the question you want.** It is the whole thesis and they have just
walked into it.

> "The first screen is from two weeks ago and the system's note says he stops
> short of an offer. He never offered the guest anything."
>
> "The second is from today. Same exercise. He offers the bags, a coffee, a
> time he will come back with, and he scores leading on all three dimensions.
> He learned it. Training worked."
>
> "And on the floor, that same week, his manager writes: he never actually
> offered her anything to fix it."
>
> "So the training was not the problem and more training is not the fix. The
> thing he learned is the exact thing he still cannot do when it is real,
> because nobody has told him what he is allowed to give away."

### "Does it ever recommend training, or does it always say don't?"

Do not answer from memory. It is on the transfer gap screen, one row under
Recovery: *Communication, 2.4 versus 1.0, Needs practice. Weak in both.
Targeted practice is the right answer.*

> "Weak in practice and weak on the floor means he has not learned it yet, and
> that is exactly what a course is for. Four quadrants. One says train, one says
> do not train, one says the measurement is wrong, one says he is fine. Only one
> of the four sells you training, which is unusual for a company selling
> training."

### "It threw a rating away. Doesn't that mean it got it wrong?"

> "It means it caught itself. Every score has to quote the manager's own words,
> and that one quoted something she never said, so the gate discarded it before
> she ever saw it. You are not watching a model that does not make mistakes. You
> are watching one that is not allowed to ship them."

If pushed on how: four checks. The source exists, the quoted span is really in
it, there is at least one practice citation and one floor citation, and no
evidence from another staff member. Fail any one and the claim is dropped; drop
enough and the whole recommendation abstains.

### "The manager added the score herself. So what did your AI actually do?"

> "It read twenty seconds of dictated speech, scored the dimension it could
> evidence, refused the one it could not, and then recorded that the human
> supplied the missing judgement. That is not the AI failing to do its job. That
> is the division of labour we are selling."

### "Why is the video silent?"

> "Because I would rather talk to you than play you a voiceover."

### "Why not just demo it live?"

> "I will, in about ten seconds, if you want. The recording is so that the two
> minutes I have are spent on the argument rather than on a loading spinner."

---

# PART TWO: TECHNICAL

### "Is this just a wrapper around GPT?"

Open the glass box and run it. A typical run is **6 or 7 decisions by code and
1 by the model**. The model drafts prose and classifies a cause from options
that code has already narrowed. Code computes the gap, picks the focus
dimension, constrains what may be concluded, checks the citations and routes
the escalation.

### "What stops the model just ignoring your prompt?"

The best technical answer you have.

Before the model is called, code **deletes options from the JSON schema** it is
allowed to return. When the quadrant is BLOCKED, the skill is proven present,
so `behavioural` is removed from the enum of causes.

The model cannot return it. Not "is instructed not to". It is not in the
grammar it decodes against. Prompt injection does not help, because there is no
prompt to injure.

### "How do you stop hallucination?"

A four check gate on every claim before anything ships:

1. the cited source exists in the evidence bundle
2. the quoted span genuinely appears in that chunk
3. at least one practice citation AND one floor citation
4. no evidence about a different staff member

Any failure and the whole recommendation **abstains**. It does not degrade
gracefully, it declines.

In the glass box, panel two runs five claims through the live gate. One is
honest, four are realistic failure modes. Watch four get rejected with reasons.

### "Abstains? So it just gives up?"

Yes, deliberately. In a system that evaluates people at work, a confident wrong
answer is worse than no answer, because a manager will act on it. Abstention is
a first class outcome with its own status, and it appears in the interface as
one.

### "How do you know the quoted text is really in the source?"

Exact substring first. That is too brittle for real text, so it falls back to a
similarity ratio against the best matching window.

A detail worth knowing: `SequenceMatcher`'s default heuristic marks any element
appearing in more than 1% of a long sequence as junk, and on character
sequences that is most of the alphabet. It scored real quotes as noise. It runs
with `autojunk=False`.

### "How does the permission model work?"

There is **no authorisation logic in the API**. Identity is resolved per
request and pushed into the Postgres session as transaction-local settings.
Every table has row level security, `AS RESTRICTIVE`, `FORCE ROW LEVEL
SECURITY`. The API connects as a role that owns nothing.

If a manager may not see a practice score, the database returns no row. A bug
in our API cannot return a row the policy forbids.

Glass box panel three sends the **same query** as three different people and
returns three different answers.

### "Why not just filter in the application?"

Because then a single missing `WHERE` clause is a data breach. Filtering in the
application means authorisation is implemented twice, in the policy and in
every query, and the second one is the one that eventually gets it wrong.

### "What is this 409 I saw?"

Not an error. A manager requesting practice scores for someone they have not
yet observed gets 409 with a message explaining they have to log their own
observation first. They have done nothing wrong; they simply have to go first.

Why: if you read the machine's opinion before forming your own, you will agree
with it. Then you have two opinions and no evidence.

### "How does retrieval work?"

Hybrid. `pgvector(768)` embeddings plus Postgres full text, fused with
reciprocal rank fusion, with a cosine floor of 0.30 to reject the merely
topical. One table carries both the vector and a generated `tsvector`.

Scoped to the property, so a hotel's standards never leak into another's
coaching.

### "Why 768 dimensions?"

It matches the `vector(768)` column and is what both candidate embedding models
can produce: OpenAI supports shortening via the `dimensions` parameter, and
Google's `text-embedding-004` is natively 768. Keeping the column fixed means
the provider can change without a migration.

### "How do you know your scoring is calibrated?"

We measure agreement between the agent's read and the manager's verdict:
**Wilson interval** for the proportion, **weighted kappa** for ordinal
agreement. It is shown in the console, and when the sample is small it says so
rather than showing a confident percentage.

**Be honest about the limit:** the sample is currently tiny. The right answer
is "we built the instrument, and we do not yet have enough verified decisions
to make a claim from it".

### "What's your accuracy?"

**Do not invent a number.**

"We cannot give you one honestly. The golden set is built, 45 items, but the
ground truth labels are not filled in yet, so any accuracy figure would be
manufactured. What we can show you is the reasoning, live, and let you check
it."

Then open the glass box. A judge who hears "we won't make up a number" and is
then shown live verification usually trusts you more, not less.

**If they point at the 100% on the verify card,** they have found the one number
on screen and you must get to it before they finish the sentence. It reads
*"Agrees with your managers 100% of the time on service recovery, over 5
checks."*

> "Five checks. That is not a result, it is five checks, and we are not going to
> dress it up as one. What matters is that the instrument is there and running:
> every verdict a manager gives is scored against what the model said, per
> dimension. The product hedges that number on its own face when the sample is
> small, and routes to a human first when agreement is low. We would rather show
> you a number that is not ready than not measure it at all."

That answer is worth more than a good accuracy figure would be, because it is
the answer of a team that knows what its own evidence is worth.

### "What if a provider goes down mid pitch?"

Every task has a fallback provider, recorded in the trace so the glass box
shows what actually happened rather than what we hoped. Groq retired a pinned
model id under us once already, which is why this exists.

### "What does it cost to run?"

About half a cent per agent run. Inference is **1.8% of revenue** against a
23% benchmark for scaling stage AI products, because our cost is bounded by
how many shifts somebody works, not by how much they feel like chatting: about
four practice attempts, four debriefs and two recommendations a month, with
the rubric and standards prompt cached.

There is a hard daily spend ceiling checked **before** each call, not after. A
ceiling that notices it has been exceeded is not a ceiling.

### "Why these models?"

Chosen per task, not one model for everything. Groq for the guest turn because
it is the only thing a human waits on live and it returns in half the time.
GPT-4o for the coaching draft because writing quality shows there. Vertex AI
Gemini for classification, one call against a strict enum that code has already
constrained. Whisper for transcription.

### "You're using Google Cloud how, exactly?"

The API runs on **Cloud Run** in europe-west1 with one warm instance, and cause
classification runs on **Vertex AI**. Not a credit we claimed and did not spend.

### "Why did you move off Render?"

Measured, three consecutive calls to the same endpoint: Cloud Run 0.40s, 0.44s,
0.45s. Render 14.81s, then 0.53s, 0.53s. That first number is a free tier
waking from sleep, and it is what you would have watched.

### "How does the Spanish thing work?"

*(It is deliberately not in the two minute demo any more: most shifts are in
English, and the English path returns one card instead of three. It is live, and
this is the answer when somebody asks how the product handles staff whose first
language is not English.)*

Regional terms present in the utterance are retrieved from a curated lexicon,
116 entries across 21 countries, and their glosses go into the translation
prompt. No retraining, no extra model: the knowledge goes in the prompt, which
is why it can live inside the API.

Measured: a regionally marked term survives translation 31.2% of the time
without retrieval and 46.5% with it, n=157, exact McNemar p=8.05e-07,
replicated 40.5% to 70.3%.

It is from an MSc thesis by one of us, *Context-Aware Real-Time Speech
Translation Using LLMs*, NCI 2026.

### "Why does that matter for a coaching product?"

Because a debrief is evidence, not chat. It gets scored, it becomes half a
transfer gap, and it can send somebody on training. `guagua` is a bus in the
Caribbean and a baby in the Andes. Mistranslate it and you have assessed
somebody on a sentence they never said, and it only ever happens to the people
not working in their first language.

### "What about GDPR?"

Performance data is personal data. Everything is synthetic today, so there is
no live personal data in the system. The architecture that matters for when
there is: row level security means access is enforced at the data layer, the
audit trail is append only, and audio is transcribed and destroyed in the same
call so no biometric data is retained.

### "You said EU AI Act. Which part?"

**Annex III 4(b)**: AI used to evaluate performance and behaviour of people in
a work relationship. High risk. We classify ourselves there rather than waiting
to be told.

We deliberately do not do **4(c)**, and we refused **Article 5(1)(f)**, emotion
inference in the workplace, when it was suggested to us. That one is prohibited
outright, not merely high risk.

### "How would you scale to 250 staff per manager?"

The manager does not read 250 items. The queue collapses repeated findings into
patterns: "seven of these eleven say the same thing, four people". Verification
is on the pattern, not on each row.

And once five or more people share a pattern, it stops being individual
coaching entirely and routes to operations. The queue gets *shorter* as the
organisation gets bigger, because more people sharing a problem means fewer
individual items.

### "Is it fast enough?"

Measured on the live deployment: a spoken observation becomes a draft in 1.6s,
a Spanish debrief is understood in 3.2s, and a full agent run including the
coaching draft is 7.6s. Pages load in under a second.

### "How do you test something non-deterministic?"

By making most of it deterministic. The reasoning is pure functions with no
I/O: the transfer gap, the cite gate, calibration, routing. **75 tests, no API
keys, no network, no database.** Plus 10 negative row level security tests that
each try to read something they must not, and 11 more on the observation
extractor including one that feeds it a deliberately fabricating model and
checks every unsupported rating is dropped.

96 tests run with no credentials at all.

### "Show me it isn't canned."

`/glassbox`. Three panels, each calls the same code the product runs. Press a
button and watch a trace assemble in the order the agent actually ran. If a
panel says the gate rejected a fabricated citation, it rejected it a moment ago.

---

# PART THREE: THE HOSTILE ONES

Expect these. They are the ones that decide the room.

### "This is a solution looking for a problem. No hotel asked for this."

Fair challenge. The problem hotels articulate is turnover and inconsistent
service. They do not articulate "I cannot measure training transfer", because
nobody has offered them the measurement.

What they do recognise instantly is the specific case: you paid for service
recovery training, and your front desk still escalates everything to a manager.
Our answer is why, per person, with evidence.

### "You have no customers and no real data. Why is this not a student project?"

Because the hard part is built and deployed rather than described. The
governance model, the row level security, the abstention behaviour and the
citation gate are the parts that take months and that a pilot cannot start
without.

What we do not have is a design partner, and that is the next thing, not a
missing feature.

### "Your demo data is fake. How do I know any of this works?"

The data is synthetic and we say so, because performance data is personal data
and we have no agreement to use anyone's. The *system* is not synthetic. Open
the glass box and it runs on demand. The SOPs are real, from a working hotel,
used with permission.

### "The AI gave a recommendation. Who is liable if it is wrong?"

The hotel, and they should be, because a human made the decision. Nothing
reaches a staff member without a named manager confirming it, there is no
timeout and no auto approve, and the audit trail records who decided what.

We are deliberately not in the business of making employment decisions
automatically. That is the line, and the EU AI Act agrees with us about where
it is.

### "What stops a manager rubber-stamping everything?"

Honestly, nothing perfect. What we do: the recommendation opens as four lines
rather than a wall of text, so reading it is cheaper than skipping it; the
evidence is one click away; and we measure agreement between the agent and the
manager, so a manager who agrees with everything becomes visible in the
calibration.

That is a detection mechanism, not a prevention one, and I would not claim
otherwise.

### "This will be used to fire people."

It is a risk and the design takes it seriously. Debriefs never route to a
disciplinary path and the interface says so to the staff member. Individual
coaching is suppressed when the cause is process. The audit trail means a staff
member can see what was said about them.

What we cannot do is stop a determined employer misusing any record. What we
can do is not build the tools that make it easy, which is why there is no
emotion inference, no live monitoring and no audio retention.

### "Your accuracy number?"

See above. **Do not invent one.** "We cannot give you one honestly" is the
answer, followed by the glass box.

### "Five staff for k-anonymity is arbitrary. Why not ten?"

It is a judgement, and I would defend it as the point where a pattern stops
being attributable in a department of that size. In a bigger property it should
be higher, and it is a per property setting rather than a constant.

Below the threshold nothing is shown at all, which is the part that matters.

### "You are two people and a laptop. Why won't a funded competitor crush you?"

They will build the feature. The thing they cannot easily copy is the position:
our product's most valuable output is often "do not buy training", and that is
very hard to ship inside a company whose revenue depends on training being
bought.

And the asset compounds: labelled transfer data per property takes months of
real observations, and it is the thing that makes the next recommendation
better.

### "What have you got wrong so far?"

Answer this one honestly. It is a trust question, not a technical one.

Three real examples: we shipped a version that pinned every transcription to
English, which silently mangled Spanish speakers and then scored them on the
result. We had a permission check that looked correct and never fired, because
the language detector returns "spanish" and we tested for "es". And we had an
API that reported healthy while its database was unreachable, because we shipped
a developer's local connection string to production.

Two more from the last day of the build, both in the same place and both worth
telling because they are the most honest thing in this document.

The manager's verdict button did not work against live data at all. The request
used a relative URL, so it reached our own mock route instead of the API, and
the mock looked recommendations up in a list baked in at build time. Every card
the real agent produced came back "not found". It had never worked; it only
looked like it did, because the seeded data the mock knew about was the data we
kept testing with.

Then, with that fixed, submitting a verdict recorded the verdict correctly and
crashed the page, because the API returned one shape and the frontend contract
promised another, and the missing field was dereferenced during render. The
screen whose entire argument is "a human decides" broke at the exact moment the
human decided.

All five were found by running the thing rather than reasoning about it, which
is the actual lesson. The second pair also says something about where the risk
lives in AI products: neither bug was in the model, the prompting, or the
reasoning. They were in the plumbing between a mock and the real thing, which is
where they usually are.

### "What happens when you leave and this becomes unmaintained?"

The reasoning core is 691 lines of pure Python with 75 tests and no
dependencies on any provider. The authorisation is in the database, not in
application code. Both survive us. The model routing is a table you can edit.

### "Why should we give this a prize over a product with paying customers?"

Do not get defensive. Something like: because this is the part of the problem
that is hard to retrofit. Anyone can add an AI roleplay feature; almost nobody
starts by deciding what the system is not allowed to conclude, or by putting
the permission model in the database, or by making abstention a first class
outcome. That foundation is what a pilot in a regulated workplace needs and it
is the part you cannot bolt on afterwards.

---

# PART FOUR: THINGS YOU CANNOT ANSWER, AND WHAT TO SAY

Say these plainly. Judges respect a bounded "no".

| If asked | Say |
|---|---|
| Accuracy or F1 | "The golden set is not labelled yet, so any number would be manufactured." |
| Real customer results | "We have no design partner yet. That is the next step, not a missing feature." |
| Retention or churn | "No customers, so no data. The figure we would watch is observations logged per manager per week." |
| Exact turnover stats | "I would rather give you the source afterwards than a figure from memory." |
| Cost at 10,000 users | "Modelled, not measured. The shape holds because cost is bounded by shifts worked, not by usage." |
| Scores for a manager with 250 staff | "Not tested at that size. The queue collapses into patterns, and the design intent is that it gets shorter as the org grows, but I have not measured it." |
| Non-Spanish languages | "Only Spanish has a curated lexicon. The method is language agnostic; each one needs its own lexicon." |
| Offline working | "Recordings queue on the device and send when the signal returns. Full offline is roadmap." |
| Mobile app | "It is a responsive web app, not a native app. Deliberate: a hotel will not manage device installs for seasonal staff." |

---

## The one line to have ready for anything

If a question wanders somewhere you cannot follow:

> "I would rather show you than tell you. There is a page that runs the real
> thing on demand and I can have it on screen in ten seconds."

It is true, it works, and it changes the conversation from claims to evidence.
