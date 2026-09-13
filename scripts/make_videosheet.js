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
          [{ label: "DO", text: "Your last line on slide 3 is the handover. Start the video as you say it, not after." },
           { label: "YOU", text: "One step back toward the laptop, eyes still on the room." }],
          [{ text: "Let me show you, on a real shift.", bold: true }],
          { shade: "F7F9F9" }
        ),
        note("Same words as the pitch run sheet, so the two sheets cannot drift. Slide 3 ends on the line about that distance almost never meaning another course, and this is the sentence straight after it."),

        h("The video"),
        note("Every line here is short on purpose. The video does not wait for you. If you finish a line early, STOP: the silence is correct and the next screen is already coming."),

        screenBar("Landing page", "0:00 to 0:06"),
        beat(
          [{ label: "ON SCREEN", text: "Training shows completion. This shows what changed on the floor." },
           { label: "YOU", text: "Beside the screen. Do not look at it." }],
          ["A guest shouted at Diego on a Dublin front desk last Tuesday."]
        ),

        screenBar("His debrief, answered", "0:06 to 0:10"),
        beat(
          [{ label: "ON SCREEN", text: "His words, then the hotel's own Escalation Rule 1, quoted." },
           { label: "YOU", text: "One tap at the quote. Four seconds only." }],
          ["His own words. His hotel's own rule, quoted back."]
        ),

        screenBar("The practice conversation", "0:10 to 0:25"),
        beat(
          [{ label: "ON SCREEN", text: "The guest, then Diego's reply, then the guest calming." },
           { label: "YOU", text: "Three fingers on bags, coffee, a time. Fifteen seconds, so you can breathe here." }],
          ["Same situation, in practice.",
           { text: "Watch what he offers her. The bags. A coffee. And a time he will come back with.", bold: true }]
        ),

        screenBar("His notes, today", "0:25 to 0:31"),
        beat(
          [{ label: "ON SCREEN", text: "Leading here, on all three." },
           { label: "YOU", text: "Flat, almost bored. Then STOP." }],
          ["Leading on all three. That is today."]
        ),

        screenBar("His notes, two weeks ago", "0:31 to 0:39    THE MOMENT"),
        beat(
          [{ label: "ON SCREEN", text: "The Aug 30 run. Stops short of an offer, which is the 5." },
           { label: "YOU", text: "Turn away from the screen. One step toward them. Eight seconds, use all of it." }],
          ["Same exercise, two weeks ago. Stops short of an offer.",
           { text: "So he learned it. Training worked.", bold: true }],
          { shade: "F7F9F9" }
        ),

        screenBar("Switch to Marta", "0:39 to 0:44"),
        beat(
          [{ label: "YOU", text: "Three words. Then let the console load in silence." }],
          ["Now his manager."]
        ),

        screenBar("Her console", "0:44 to 0:50"),
        beat(
          [{ label: "ON SCREEN", text: "Radar, verify queue 11, team patterns 7." }],
          ["Eleven waiting on her read. Nothing routes until she verifies it."]
        ),

        screenBar("The queue, scrolling", "0:50 to 0:56"),
        beat(
          [{ label: "ON SCREEN", text: "Adaeze, Diego, Tomas, Zofia, Chloe, Sean, Kwame, Niamh." },
           { label: "YOU", text: "Four words. Let them read the names." }],
          [{ text: "Different people. Same sentence.", bold: true }]
        ),

        screenBar("The observation", "0:56 to 1:03"),
        beat(
          [{ label: "ON SCREEN", text: "Composure 4, underlined. And: one rating was thrown away for quoting words you did not say." },
           { label: "YOU", text: "Flat palm at the screen on the second line." }],
          ["Twenty seconds of what she saw.",
           { text: "And it threw a rating away. She never said those words.", bold: true }]
        ),

        screenBar("She adds it back", "1:03 to 1:08"),
        beat(
          [{ label: "ON SCREEN", text: "Recovery 1. You added this one." },
           { label: "YOU", text: "Warmer. Five seconds." }],
          ["So she adds that one herself."]
        ),

        screenBar("The banner", "1:08 to 1:14"),
        beat(
          [{ label: "ON SCREEN", text: "7 of these 11 say the same thing. 5 people, the same missing authority." },
           { label: "YOU", text: "One finger up, and keep it up." }],
          ["Seven of eleven, the same thing.",
           { text: "One policy to write, not five conversations.", bold: true }]
        ),

        screenBar("The verify card", "1:14 to 1:26"),
        beat(
          [{ label: "ON SCREEN", text: "Confirm / Correct / Reject, and the glass box open underneath." },
           { label: "YOU", text: "Flat palm on stopped. Twelve seconds, the longest hold in the video." }],
          ["And it still has not done anything.",
           { text: "It drafted, it cited, and it stopped.", bold: true },
           "Nothing reaches Diego until she decides."]
        ),

        screenBar("The transfer gap", "1:26 to 1:35"),
        beat(
          [{ label: "ON SCREEN", text: "Recovery 4.8 vs 1.4, Blocked." },
           { label: "YOU", text: "Two hands apart, wide then low." }],
          ["Practice, four point eight. Floor, one point four.",
           { text: "Every platform books him a course. This one says do not.", bold: true }]
        ),

        screenBar("The brief for the GM", "1:35 to 1:45"),
        beat(
          [{ label: "ON SCREEN", text: "Commission the brief, then the written brief with Download." }],
          ["And it writes the week up for the general manager.",
           { text: "One action. Give the front desk clear authority on what they may offer.", bold: true }]
        ),

        screenBar("The patterns", "1:45 to 1:55"),
        beat(
          [{ label: "ON SCREEN", text: "9 staff, room not ready. Hidden until at least 5 share a pattern." },
           { label: "YOU", text: "Ten seconds. Two short lines and a gap between them." }],
          ["Nine people, the same blocker.",
           "And nothing shows until five share it, so no one person can be singled out."]
        ),

        screenBar("Glass box, last frame", "1:55 to 1:58"),
        beat(
          [{ label: "YOU", text: "Say nothing. Let it end." }],
          [{ text: "[ silence ]", italics: true, color: VIOLET, size: 22 }]
        ),

        screenBar("THE CLOSE", "after the video, to the room"),
        beat(
          [{ label: "YOU", text: "Video has stopped. Turn to them. Hands at your sides. This is not narration any more." },
           { label: "THEN", text: "Hand to Thapelo." }],
          [{ text: "That is not a skill gap. It is an authority gap. And it was never Diego's to fix.", bold: true },
           { text: "Thapelo will show you what is underneath it.", bold: true }],
          { shade: "F7F9F9" }
        ),
        note("About ten seconds. The close is deliberately OUT of the video: there is no room for it inside 1:58, and it lands better said to their faces with a still frame behind you than talked over a moving screen."),

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
