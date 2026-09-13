const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  PageOrientation,
} = require("docx");

// A4 content width: 11906 - (2 * 1134) ~= 9638 DXA.
const CONTENT = 9638;
const COL_LEFT = 3300;
const COL_RIGHT = CONTENT - COL_LEFT;

const INK = "1A2233";
const TEAL = "0E7C86";
const VIOLET = "5B4B8A";
const SLATE = "5A6472";
const RULE = "D7DBE2";

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE };

function spacer(after = 120) {
  return new Paragraph({ spacing: { after }, children: [] });
}

/** A full width bar that introduces a screen. */
function screenBar(label, time) {
  return new Table({
    columnWidths: [CONTENT],
    width: { size: CONTENT, type: WidthType.DXA },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: "EEF2F1" },
            margins: { top: 90, bottom: 90, left: 140, right: 140 },
            borders: noBorders,
            children: [
              new Paragraph({
                keepNext: true,
                children: [
                  new TextRun({ text: label, bold: true, size: 22, color: INK,
                               font: "Calibri", allCaps: true }),
                  new TextRun({ text: time ? "        " + time : "", size: 20,
                               color: SLATE, font: "Calibri" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/** One beat: the left column tells you where to be, the right what to say. */
function beat(doLines, sayLines, opts = {}) {
  const left = doLines.map((l, i) =>
    new Paragraph({
      spacing: { after: i === doLines.length - 1 ? 0 : 80 },
      children: [
        l.label
          ? new TextRun({ text: l.label + "  ", bold: true, size: 18,
                          color: l.label === "GO TO" ? TEAL : SLATE,
                          font: "Calibri", allCaps: true })
          : new TextRun({ text: "" }),
        new TextRun({ text: l.text, size: 19, color: INK, font: "Calibri" }),
      ],
    }));

  const right = sayLines.map((s, i) =>
    new Paragraph({
      spacing: { after: i === sayLines.length - 1 ? 0 : 140 },
      children: [
        new TextRun({
          text: typeof s === "string" ? s : s.text,
          size: typeof s === "string" ? 24 : (s.size || 24),
          color: typeof s === "string" ? INK : (s.color || INK),
          italics: typeof s === "string" ? false : !!s.italics,
          bold: typeof s === "string" ? false : !!s.bold,
          font: "Calibri",
        }),
      ],
    }));

  return new Table({
    columnWidths: [COL_LEFT, COL_RIGHT],
    width: { size: CONTENT, type: WidthType.DXA },
    borders: {
      top: NONE, left: NONE, right: NONE,
      bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE },
      insideHorizontal: NONE, insideVertical: NONE,
    },
    rows: [
      new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: COL_LEFT, type: WidthType.DXA },
            margins: { top: 160, bottom: 160, left: 140, right: 200 },
            shading: opts.shade
              ? { type: ShadingType.CLEAR, fill: opts.shade }
              : undefined,
            children: left,
          }),
          new TableCell({
            width: { size: COL_RIGHT, type: WidthType.DXA },
            margins: { top: 160, bottom: 160, left: 140, right: 140 },
            children: right,
          }),
        ],
      }),
    ],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 100, after: 200 },
    indent: { left: COL_LEFT + 140 },
    children: [new TextRun({ text, size: 18, color: SLATE, italics: true,
                             font: "Calibri" })],
  });
}

function h(text, opts = {}) {
  return new Paragraph({
    keepNext: true,
    pageBreakBefore: !!opts.pageBreak,
    spacing: { before: opts.before ?? 360, after: opts.after ?? 160 },
    children: [new TextRun({ text, bold: true, size: opts.size || 28,
                             color: opts.color || INK, font: "Calibri" })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120 },
    children: [new TextRun({ text, size: opts.size || 20,
                             color: opts.color || INK, font: "Calibri" })],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 20, color: INK, font: "Calibri" })],
  });
}


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
          [{ label: "ON SCREEN", text: "Training shows completion. This shows what changed on the floor." }],
          ["Last Tuesday, a guest shouted at Diego on a Dublin front desk. His manager saw the whole thing. You are about to get both of their versions, and they do not match."]
        ),

        screenBar("Diego's debrief, already answered", "0:08"),
        beat(
          [{ label: "ON SCREEN", text: "His own words, the hotel's Escalation Rule 1 quoted, and \"Why you're seeing this\"." }],
          ["Ninety seconds after the shift, he says what happened. Back comes his own hotel's escalation rule, quoted, with the rule number on it.",
           { text: "Not advice from the internet. Their manual.", bold: true }]
        ),

        screenBar("The practice conversation", "0:18"),
        beat(
          [{ label: "ON SCREEN", text: "The guest, Diego's reply, then \"the guest seems satisfied\"." }],
          ["This is him practising the same situation. Watch what he offers her. The bags. A coffee in the lounge. And a time he will come back with."]
        ),

        screenBar("His practice notes, today", "0:30"),
        beat(
          [{ label: "ON SCREEN", text: "Leading here on Composure, Empathy and Service Recovery." },
           { label: "THEN", text: "STOP TALKING for two seconds." }],
          ["Leading on all three. That is today."]
        ),
        note("The next screen is the whole pitch. Give it a clear run at them."),

        screenBar("His practice notes, two weeks ago", "0:36    THE MOMENT"),
        beat(
          [{ label: "ON SCREEN", text: "The Aug 30 run. \"Stops short of an offer, which is the 5.\"" },
           { label: "DO", text: "Slow right down." }],
          ["And this is the same exercise, two weeks ago. Stops short of an offer. Back then he never offered her anything.",
           { text: "So he learned it. Training worked.", bold: true }],
          { shade: "F7F9F9" }
        ),
        note("Do not draw the conclusion yet. The thing he learned in practice is the exact thing he still does not do on the floor, and you are going to let his manager say that for you. Holding it here is what makes the ending land."),

        screenBar("Marta's console", "0:48"),
        beat(
          [{ label: "ON SCREEN", text: "Radar, verify queue, team patterns." }],
          ["Now his manager. Eleven recommendations waiting on her read, and nothing routes anywhere until she verifies it."]
        ),

        screenBar("The observation", "1:00"),
        beat(
          [{ label: "ON SCREEN", text: "\"He never actually offered her anything to fix it.\" Composure 4. And: one rating was thrown away for quoting words you did not say." }],
          ["Twenty seconds of what she saw. It scores composure four and underlines the words that earned it.",
           { text: "And there. It threw a rating away, because it had quoted something she never said.", bold: true }]
        ),

        screenBar("She adds it back herself", "1:06"),
        beat(
          [{ label: "ON SCREEN", text: "Recovery 1. \"Did they fix the problem for the guest? You added this one.\"" }],
          ["So she adds that one by hand. Recovery, one. And it records that the judgement was hers, not ours."]
        ),

        screenBar("The queue", "1:12"),
        beat(
          [{ label: "ON SCREEN", text: "7 of these 11 say the same thing. 5 people, the same missing authority." }],
          ["Seven of these eleven say the same thing. Five people, the same missing authority.",
           { text: "That is one policy to write, not five conversations to have.", bold: true }]
        ),

        screenBar("The verify card", "1:18"),
        beat(
          [{ label: "ON SCREEN", text: "Confirm / Correct / Reject, with the glass box open underneath." }],
          ["And it still has not done anything. It drafted, it cited, and it stopped."]
        ),

        screenBar("The transfer gap", "1:30"),
        beat(
          [{ label: "ON SCREEN", text: "Recovery 4.8 vs 1.4, Blocked." }],
          ["Two streams, one reading. In practice, four point eight. On the floor, one point four.",
           { text: "Every learning platform in the world looks at that and books him a course. This one says do not. He has already proved he knows how.", bold: true }]
        ),
        note("One joke, only if the room is warm, delivered flat and then move on: \"We built an AI whose best answer is quite often, do not buy the thing we are selling. Our investors love that about us.\""),

        screenBar("The brief for the GM", "1:42"),
        beat(
          [{ label: "ON SCREEN", text: "A written brief with Download, Copy, Print or PDF." }],
          ["And it does not stop at Diego. The same finding across five people becomes one brief for the general manager. Give the front desk clear authority on what they may offer. Written, sourced, ready to send."]
        ),

        screenBar("The close, over the glass box", "1:52"),
        beat(
          [{ label: "DO", text: "Hands still. Let the last frame sit after you finish." }],
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
