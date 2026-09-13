// Builds the run sheet for narrating Demo_Video_Coaching_Engine.mp4.
// Reuses the helpers from build_runsheet.js by reading its head and appending
// a new body, so the two sheets cannot drift apart visually.
const fs = require("fs");

const head = fs.readFileSync("build_runsheet.js", "utf8");
let helpers = head.slice(0, head.indexOf("const doc = new Document("));
helpers = helpers.replace(
  'color: l.label === "GO TO" ? TEAL : SLATE,',
  'color: l.label === "GO TO" ? TEAL : (l.label === "YOU" ? VIOLET : SLATE),');
if (!helpers.includes('l.label === "YOU"')) throw new Error("label colour patch missed");

const body = `
const doc = new Document({
  creator: "The Coaching Engine",
  title: "Demo run sheet",
  styles: {
    default: { document: { run: { font: "Calibri", size: 20, color: INK } } },
  },
  sections: [
    {
      properties: {
        page: { margin: { top: 1000, right: 1134, bottom: 1000, left: 1134 } },
      },
      children: [
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: "The Coaching ", bold: true, size: 40, color: INK, font: "Calibri" }),
            new TextRun({ text: "Engine", size: 40, color: SLATE, font: "Calibri" }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: "Demo run sheet", bold: true, size: 30, color: TEAL, font: "Calibri" })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({
            text: "Narrating Demo_Video_Coaching_Engine.mp4.  One minute fifty eight, silent, between slide 3 and slide 5.",
            size: 19, color: SLATE, font: "Calibri" })],
        }),

        h("Before you walk on", { before: 0 }),
        bullet("The video is on the laptop, not in the cloud. Open it once before you go on so it is loaded."),
        bullet("Full screen, and check the projector is showing 1918 by 910 without cropping the left sidebar."),
        bullet("It is silent on purpose. Do not apologise for that, and do not let anyone hunt for the volume."),
        bullet("You can pause it at any point to take a question. Space bar. Know that before you need it."),
        bullet("Roughly 250 words across 118 seconds. That is slower than you can talk, deliberately: they have to read the screens too."),

        new Paragraph({
          spacing: { before: 200, after: 300 },
          children: [new TextRun({
            text: "The left column is the clock and what is on screen. The right column is what you say. Where a line runs out early, stop talking and let them look.",
            size: 19, color: SLATE, italics: true, font: "Calibri" })],
        }),

        h("Getting in", { before: 100 }),
        screenBar("Slide 3, The Solution", "before you press play"),
        beat(
          [{ label: "DO", text: "Finish the slide. Then start the video as you say the last word." }],
          ["That is the idea. Here it is on a real shift, from two people who do not agree about what happened."],
          { shade: "F7F9F9" }
        ),

        h("The video"),

        screenBar("Landing page", "0:00"),
        beat(
          [{ label: "ON SCREEN", text: "Training shows completion. This shows what changed on the floor." }].concat([{ label: "YOU", text: "Stand BESIDE the screen, not in front. Do not look at it. You know what it says; they do not know you yet." }]),
          ["Last Tuesday, a guest shouted at Diego on a Dublin front desk. His manager saw the whole thing. You are about to get both of their versions, and they do not match."]
        ),

        screenBar("Diego's debrief, already answered", "0:08"),
        beat(
          [{ label: "ON SCREEN", text: "His own words, the hotel's Escalation Rule 1 quoted, and \\"Why you're seeing this\\"." }].concat([{ label: "YOU", text: "On the words their manual, tap the screen once at the quote. One tap, then hand down." }]),
          ["Ninety seconds after the shift, he says what happened. Back comes his own hotel's escalation rule, quoted, with the rule number on it.",
           { text: "Not advice from the internet. Their manual.", bold: true }]
        ),

        screenBar("The practice conversation", "0:18"),
        beat(
          [{ label: "ON SCREEN", text: "The guest, Diego's reply, then \\"the guest seems satisfied\\"." }].concat([{ label: "YOU", text: "Count the three offers on your fingers as you say them. Bags. Coffee. A time." }]),
          ["This is him practising the same situation. Watch what he offers her. The bags. A coffee in the lounge. And a time he will come back with."]
        ),

        screenBar("His practice notes, today", "0:30"),
        beat(
          [{ label: "ON SCREEN", text: "Leading here on Composure, Empathy and Service Recovery." },
           { label: "THEN", text: "STOP TALKING for two seconds." }].concat([{ label: "YOU", text: "Say it flat, almost bored. You are setting a trap and you do not want them to see it yet." }]),
          ["Leading on all three. That is today."]
        ),
        note("The next screen is the whole pitch. Give it a clear run at them."),

        screenBar("His practice notes, two weeks ago", "0:36    THE MOMENT"),
        beat(
          [{ label: "ON SCREEN", text: "The Aug 30 run. \\"Stops short of an offer, which is the 5.\\"" },
           { label: "DO", text: "Slow right down." }].concat([{ label: "YOU", text: "TURN AWAY from the screen and take one step toward them. Say training worked to their faces, not to the projector. It is the only line in the demo you deliver to the room." }]),
          ["And this is the same exercise, two weeks ago. Stops short of an offer. Back then he never offered her anything.",
           { text: "So he learned it. Training worked.", bold: true }],
          { shade: "F7F9F9" }
        ),
        note("Do not draw the conclusion yet. The thing he learned in practice is the exact thing he still does not do on the floor, and you are going to let his manager say that for you. Holding it here is what makes the ending land."),

        screenBar("Marta's console", "0:48"),
        beat(
          [{ label: "ON SCREEN", text: "Radar, verify queue, team patterns." }].concat([{ label: "YOU", text: "Back to neutral. Brisk. This is connective tissue, not a beat." }]),
          ["Now his manager. Eleven recommendations waiting on her read, and nothing routes anywhere until she verifies it."]
        ),

        screenBar("The observation", "1:00"),
        beat(
          [{ label: "ON SCREEN", text: "\\"He never actually offered her anything to fix it.\\" Composure 4. And: one rating was thrown away for quoting words you did not say." }].concat([{ label: "YOU", text: "On the words and there, stop walking. Flat palm at the screen, hold two seconds, drop it. Let them find the line themselves." }]),
          ["Twenty seconds of what she saw. It scores composure four and underlines the words that earned it.",
           { text: "And there. It threw a rating away, because it had quoted something she never said.", bold: true }]
        ),

        screenBar("She adds it back herself", "1:06"),
        beat(
          [{ label: "ON SCREEN", text: "Recovery 1. \\"Did they fix the problem for the guest? You added this one.\\"" }].concat([{ label: "YOU", text: "Warmer here. This is the human winning, and it should sound like you like her." }]),
          ["So she adds that one by hand. Recovery, one. And it records that the judgement was hers, not ours."]
        ),

        screenBar("The queue", "1:12"),
        beat(
          [{ label: "ON SCREEN", text: "7 of these 11 say the same thing. 5 people, the same missing authority." }].concat([{ label: "YOU", text: "Hold up ONE finger on the words one policy, and keep it up through not five conversations. Cheapest gesture in the pitch and the one they remember." }]),
          ["Seven of these eleven say the same thing. Five people, the same missing authority.",
           { text: "That is one policy to write, not five conversations to have.", bold: true }]
        ),

        screenBar("The verify card", "1:18"),
        beat(
          [{ label: "ON SCREEN", text: "Confirm / Correct / Reject, with the glass box open underneath." }].concat([{ label: "YOU", text: "Flat palm out, like stopping traffic, on the words and stopped. Then hands down and still." }]),
          ["And it still has not done anything. It drafted, it cited, and it stopped."]
        ),

        screenBar("The transfer gap", "1:30"),
        beat(
          [{ label: "ON SCREEN", text: "Recovery 4.8 vs 1.4, Blocked." }].concat([{ label: "YOU", text: "Two hands apart to show the gap, wide on four point eight and low on one point four. Do not bring them together again afterwards." }]),
          ["Two streams, one reading. In practice, four point eight. On the floor, one point four.",
           { text: "Every learning platform in the world looks at that and books him a course. This one says do not. He has already proved he knows how.", bold: true }]
        ),
        note("One joke, only if the room is warm, delivered flat and then move on: \\"We built an AI whose best answer is quite often, do not buy the thing we are selling. Our investors love that about us.\\""),

        screenBar("The brief for the GM", "1:42"),
        beat(
          [{ label: "ON SCREEN", text: "A written brief with Download, Copy, Print or PDF." }].concat([{ label: "YOU", text: "Pace picks up slightly. This is the part a GM is buying, so sound like you have sold it before." }]),
          ["And it does not stop at Diego. The same finding across five people becomes one brief for the general manager. Give the front desk clear authority on what they may offer. Written, sourced, ready to send."]
        ),

        screenBar("The close, over the glass box", "1:52"),
        beat(
          [{ label: "DO", text: "Hands still. Let the last frame sit after you finish." }].concat([{ label: "YOU", text: "Hands at your sides. Nothing in them. Do not step, do not nod, do not fill the silence. Count three before you move." }]),
          [{ text: "Training would have cost that hotel money to teach Diego something he had already learned. The fix was one sentence about what he is allowed to offer.", bold: true },
           { text: "That is not a skill gap. It is an authority gap, and it was never Diego's to fix.", bold: true }],
          { shade: "F7F9F9" }
        ),

        h("Getting out"),
        screenBar("Back to slide 5, Under the Hood", "1:58"),
        beat(
          [{ label: "DO", text: "Switch back to the deck as you start speaking." }],
          [{ text: "You just watched software tell a hotel not to spend money, and refuse to send that anywhere until a human agreed with it. Here is what is underneath that.", bold: true }],
          { shade: "F7F9F9" }
        ),

        new Paragraph({ children: [], pageBreakBefore: true }),
        h("How to perform it", { before: 0 }),
        body("The video runs itself, so the only thing they are watching is you. Three gestures, two gears, three silences. That is the whole performance, and it is deliberately small: a pitch with choreography in it looks rehearsed, and rehearsed looks like you are hiding something.", { after: 240 }),

        h("Three gestures, and only these three", { size: 24, before: 200 }),
        bullet("THE GAP. Two hands apart, one high one low, on four point eight and one point four. Use it once. It is the shape of the entire product."),
        bullet("THE STOP. Flat palm out, like stopping traffic, when the system stops and waits for a human. Twice at most: on it stopped, and again if a judge asks about the gate."),
        bullet("THE ONE. A single finger on one policy. Hold it up through the rest of the sentence."),
        body("Everything else: hands at your sides, or one hand loosely at waist height. If you catch yourself gesturing on ordinary words, drop your hands and carry on.", { after: 200 }),

        h("Two gears", { size: 24 }),
        body("Gear one, flat and unhurried, for everything up to 0:36. You are laying out facts and you are slightly bored by how obvious they are. Gear two, warmer and slower, from the Aug 30 screen onward. Not louder. Slower.", { after: 120 }),
        body("The one place to speed up is the GM brief at 1:42, which should sound like somebody who has sold this before, and then drop back down for the close.", { after: 200 }),

        h("Three silences, and they are the hardest part", { size: 24 }),
        bullet("Two seconds before the Aug 30 screen. You have just said leading on all three, flat. Let it sit."),
        bullet("Two seconds after training worked. Do not explain it. The next screen explains it."),
        bullet("Three seconds after the last word, before you touch anything. Count them."),
        body("Silence feels about three times longer on stage than it does in the room. It will feel like you have forgotten your line. You have not.", { after: 200 }),

        h("Where to stand", { size: 24 }),
        body("Beside the screen, never in front of it, and angled so you can see their faces without turning your back. Move once, on the Aug 30 line, one step toward them. A presenter who moves once is emphatic. A presenter who paces is nervous.", { after: 120 }),
        body("Do not read the screen aloud. They can read. Your job is to say the thing that is NOT on the screen.", { after: 200 }),

        h("The joke", { size: 24 }),
        body("One joke, at 1:30, and only if the room has already warmed. Deliver it completely flat, do not smile at your own line, and move straight on without waiting for the laugh. If it lands you get the room. If it does not, nobody noticed you told a joke.", { after: 200 }),

        h("If your hands shake or your mouth dries", { size: 24 }),
        body("Both are normal and neither is visible from four metres. Put the laptop between you and them so your hands have somewhere to be. Take the breath before Last Tuesday, not during it. And remember the video cannot fail: whatever happens to you, the product on screen keeps working.", { after: 200 }),

        new Paragraph({ children: [], pageBreakBefore: true }),
        h("If they ask", { before: 0 }),
        body("Three questions this video invites. All three are answered on screens they have just seen, so pause the video and point rather than asserting.", { after: 240 }),

        beat(
          [{ label: "ASKED", text: "Does it ever recommend training?" }],
          ["Pause on the transfer gap, one row under Recovery: Communication, 2.4 versus 1.0, Needs practice. Weak in both. Targeted practice is the right answer.",
           { text: "Say: Weak in practice and weak on the floor means he has not learned it yet, and that is what a course is for. Four quadrants. Only one of them is book training, and only one of them is do not.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "ASKED", text: "How do you know the AI is right?" }],
          [{ text: "Say: We do not assume it. Every verdict a manager gives is scored against what the model said, per dimension, and the agreement rate is on the card. It reads one hundred percent on service recovery over five checks, and five checks is not a result, it is five checks. We would rather show you a number that is not ready than not measure it.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "ASKED", text: "What stops this becoming staff surveillance?" }],
          ["It is written on the team insights screen: 5 patterns hidden, group smaller than 5 staff, so they can't be shown without identifying someone.",
           { text: "Say: Patterns only appear once at least five people share them. Below that it refuses to show you anything, because at four people you are not looking at a pattern, you are looking at a person.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "ASKED", text: "Why is there no sound?" }],
          [{ text: "Say: Because I would rather talk to you than play you a voiceover.", italics: true, color: SLATE, size: 20 }]
        ),

        h("If you are running short"),
        body("Cut in this order. Each is a whole paragraph, so you lose time without losing a thread.", { after: 160 }),
        bullet("0:48, Marta's console. The queue count is not load bearing."),
        bullet("1:18, the verify card. Painful, but you restate the gate in questions."),
        bullet("1:42, the GM brief. Only if you must: it is the scale argument."),
        new Paragraph({
          spacing: { before: 240 },
          children: [new TextRun({
            text: "Never cut 0:36 or the close. Those two are the pitch.",
            size: 20, color: INK, bold: true, font: "Calibri" })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = process.argv[2] || "Demo-Run-Sheet.docx";
  fs.writeFileSync(out, buf);
  console.log("written:", out, buf.length, "bytes");
});
`;

fs.writeFileSync("build_videosheet.js", helpers + body, "utf8");
console.log("generated build_videosheet.js");
