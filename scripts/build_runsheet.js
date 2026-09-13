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
        page: {
          margin: { top: 1000, right: 1134, bottom: 1000, left: 1134 },
        },
      },
      children: [
        // ------------------------------------------------------------ title
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
            text: "TechIreland National AI Challenge, 14 September 2026.  Two minutes forty, between slide 3 and slide 5.",
            size: 19, color: SLATE, font: "Calibri" })],
        }),

        // --------------------------------------------------- before you start
        h("Before you walk on", { before: 0 }),
        bullet("Open https://naic-2026-coaching-engine.vercel.app in ONE browser tab. Never two windows."),
        bullet("Load it once a few minutes early so the first page is warm."),
        bullet("Have Diego's line and Marta's line on your clipboard, in case the microphone fails."),
        bullet("Check the site answers: Diego's Recovery row should read about 4.8 against 1.6."),
        bullet("The practice notes are at /staff/results/8a4e-diego if you would rather not navigate to them."),
        bullet("Know your two exits: \"Type it instead\" on the staff page, \"Tap it through\" on the manager page."),

        new Paragraph({
          spacing: { before: 200, after: 300 },
          children: [new TextRun({
            text: "The left column tells you where to be and what to press. The right column is what you say. Nothing else on the page matters.",
            size: 19, color: SLATE, italics: true, font: "Calibri" })],
        }),

        // ------------------------------------------------------ START BRIDGE
        h("Getting in", { before: 100 }),
        screenBar("Slide 3, The Solution", "you are still on the deck"),
        beat(
          [{ label: "DO", text: "Finish the slide. Do not switch yet." },
           { label: "THEN", text: "Switch to the browser as you say the last word." }],
          [{ text: "That is the idea. Now here are those two signals arriving on a real shift, from two people who do not agree about what happened.", italics: false }],
          { shade: "F7F9F9" }
        ),

        // ----------------------------------------------------- LANDING, 0:10
        screenBar("Landing page", "0:00 to 0:08"),
        beat(
          [{ label: "GO TO", text: "naic-2026-coaching-engine.vercel.app" },
           { label: "DO", text: "Let it sit. Do not read the screen aloud." },
           { label: "THEN", text: "Click \"Open as Diego, Front Desk\"" }],
          ["Last Tuesday, a guest shouted at Diego on a Dublin front desk. His manager watched the whole thing. You are about to hear both of their versions, and they do not match."]
        ),
        note("\"They do not match\" is the hook. Your closing line is the answer to it, so do not give it away here."),

        // ------------------------------------------------------ DIEGO, ACT 1
        h("Act one, Diego"),
        screenBar("Staff app, his practice", "0:08 to 0:23"),
        beat(
          [{ label: "GO TO", text: "My practice, in the bottom bar, then Details on the Aug 30 run" },
           { label: "OR", text: "/staff/results/8a4e-diego" },
           { label: "ON SCREEN", text: "Three labels reading Confident here, his own words quoted, and a note under them." },
           { label: "DO", text: "Point at the note under the quote." }],
          ["Before we get to the shift, here is Diego practising the same situation. A guest checking in, room not ready, waiting an hour.",
           "Look at what he does. Apologises for the specific problem, takes ownership, commits to staying with her until it is sorted. He knows the sequence cold.",
           { text: "Now look at what it says he did not do. Stops short of an offer. He never offers her anything. Hold onto that.", bold: true },
           "And he never sees a score. He sees a label and the exact words that earned it. Give a twenty three year old a number and it stops being coaching and starts being a ranking."]
        ),
        note("Use the Aug 30 run, not one you record on the day. It loads with no model call and it cannot drift. This is the beat that makes the ending land."),

        screenBar("Staff app, his shift", "0:23 to 0:37"),
        beat(
          [{ label: "GO TO", text: "/staff  (you are already here)" },
           { label: "DO", text: "Click into the debrief box, press \"Speak and send\", and talk." }],
          ["He is twenty three, he is on the front desk, and this is the first thing he does after a shift like that.",
           { text: "[speak]  The guest was really angry because her room wasn't ready and the airport bus never turned up. I told her to wait, but it got bad and I had to call my manager.", italics: true, color: VIOLET, size: 22 },
           "He is not filling in a form. He is talking, the way he would tell a colleague on the way out."]
        ),
        note("About three seconds to come back. The last line is what you say while it thinks. Say the middle line like somebody at the end of a bad shift, not like a script."),

        screenBar("Staff app, the answer", "0:37 to 0:50"),
        beat(
          [{ label: "ON SCREEN", text: "One card. His own words, then the quoted clause, tagged Escalation and Logging, Escalation > Rule 1." },
           { label: "DO", text: "Point at the words inside the quote marks." }],
          ["That is not advice from the internet. That is his own employer's escalation procedure, quoted, with the rule number on it. Seat the guest, brief the manager, log it in the complaint log.",
           "Ninety seconds after the shift that needed it. And underneath, it tells him why it chose that rule: he described a room that was not ready."]
        ),
        note("It all fits on one screen, so do not scroll. Nothing below the card is worth five seconds."),

        screenBar("Handover", "0:50 to 0:55"),
        beat(
          [{ label: "DO", text: "Click \"Switch role\", then \"Open as Marta, Duty Manager\"." }],
          [{ text: "So that is Diego's side of Tuesday. Here is his manager's.", bold: true }]
        ),

        // ------------------------------------------------------ MARTA, ACT 2
        h("Act two, Marta"),
        screenBar("Manager console, Log observation", "0:55 to 1:07"),
        beat(
          [{ label: "GO TO", text: "Log observation, in the left sidebar" },
           { label: "ON SCREEN", text: "You land on the \"Speak it\" tab." },
           { label: "DO", text: "Press the microphone and talk." }],
          [{ text: "[speak]  Diego handled that checkout dispute at the front desk. He stayed completely calm even though the guest was shouting at him, but he never actually offered her anything to fix it.", italics: true, color: VIOLET, size: 22 }]
        ),

        screenBar("Manager console, the draft", "1:07 to 1:17"),
        beat(
          [{ label: "ON SCREEN", text: "Her words, with parts underlined. Below: Diego, Composure 4, Recovery 1." },
           { label: "DO", text: "Point at the underlining." }],
          ["It has drafted the observation for her. Diego, composure four, recovery one. And read her own sentence: he never actually offered her anything to fix it.",
           { text: "There it is again.", bold: true },
           "And look at the underline. Every score has to quote the words she actually said. If it ever scores something she did not say, that rating is thrown away before she sees it."]
        ),

        note("Those three words are the highest value in the demo: the machine said it in practice with nobody watching, and his manager wrote the same thing about a real shift. Slow down. Do not explain it."),

        screenBar("Manager console, press Log this", "1:17 to 1:27"),
        beat(
          [{ label: "DO", text: "Press \"Log this\" and KEEP TALKING. It takes about eight seconds." }],
          ["And there is a rule underneath this. A manager cannot read a staff member's practice scores until she has logged her own observation of them. Not greyed out in the interface. Refused by the database. Because if you read the machine's opinion first, you will agree with it, and then you have two opinions and no evidence."]
        ),
        note("Say the rule. Do not say it is unlocking right now, because in this data Marta has already observed everyone and nothing visibly changes."),

        // ------------------------------------------------------- THE PAYOFF
        h("The payoff"),
        screenBar("Manager console, Transfer gap", "1:27 to 1:50"),
        beat(
          [{ label: "GO TO", text: "Transfer gap, in the left sidebar" },
           { label: "ON SCREEN", text: "Recovery, 4.8 against about 1.4, marked Blocked." },
           { label: "DO", text: "Slow down. Hands off the keyboard for the last three lines." }],
          ["Two independent streams. In practice, Diego scores four point eight on service recovery. On the floor, about one and a half. That is a gap of more than three points on a five point scale.",
           { text: "Every learning platform in the world looks at that and books him a training course. Ours says the opposite. Do not train him. He has proved he knows how to do it.", bold: true },
           { text: "You have now watched him not make an offer twice. In practice, with nobody watching. On the floor, with his manager watching. The verdict is not train. It is blocked.", bold: true }]
        ),
        note("Read the floor number off the screen. Before you log it says 1.6, straight after it says about 1.4. Both are right. \"About one and a half\" is safe either way."),

        screenBar("Verify queue, Diego's card", "1:50 to 2:25"),
        beat(
          [{ label: "GO TO", text: "Verify queue, in the left sidebar, then Diego's card marked New" },
           { label: "DO", text: "Point at Confirm / Correct / Reject. DO NOT PRESS THEM." },
           { label: "THEN", text: "Expand \"Why is the AI saying this?\"" },
           { label: "ON SCREEN", text: "Three claims, four sources. Practice turn, Floor observation, Hotel standard." }],
          ["Here is what it wants to do about Diego. And here is the part I care most about. It has not done anything. It drafted, and it stopped.",
           "Confirm, correct or reject. Nothing reaches Diego until his manager decides. That is not a setting we could switch off. It is the shape of the product, and under the EU AI Act it is the difference between a tool a hotel can deploy and one it cannot.",
           { text: "And I am not going to press it. That is not my call to make. It is Marta's, which is the whole point.", bold: true },
           "And before she decides, it shows its work. Three claims, four sources. In practice he offers a breakfast tray and drinks. On the floor he offers nothing. And then this one.",
           { text: "Their own standard operating procedure requires him to tell a manager about every guest complaint, even one he has already fixed. That is what makes him hesitate. The blocker is not Diego and it is not his training. It is a sentence in their own procedures manual, and the system found it and quoted it.", bold: true },
           "So it does not book a course. It tells the front office manager to clarify what he may offer without approval, and it hands her the question to open with."]
        ),
        note("Pressing a verdict is a one way door: the card leaves the queue, the banner recounts, and the same card cannot be decided twice. Never press it on stage and never in rehearsal on Diego."),
        note("Read the three claims off the screen in order, do not paraphrase. And do not read the 100% line at the bottom: three checks is not a result. If a judge spots it, own it first."),

        screenBar("Verify queue, the banner at the top", "2:25 to 2:32"),
        beat(
          [{ label: "DO", text: "Scroll back up to the green banner. READ IT OFF THE SCREEN." },
           { label: "ON SCREEN", text: "N of these M say the same thing. 5 people, the same missing authority." }],
          ["And this is where it stops being about Diego. Eight of these twelve say the same thing. Five different people, the same missing authority.",
           { text: "That is one policy to write, not five conversations to have.", bold: true }]
        ),
        note("The two counts move every time you rehearse, because act two writes a new recommendation on every run. Read them, do not recite them. The number that holds is five people, and that is the one the line rests on."),

        screenBar("The close", "2:32 to 2:40"),
        beat(
          [{ label: "DO", text: "Hands off the keyboard. Do not click anything else." }],
          [{ text: "Training would have cost that hotel money and taught Diego something he already knew. The fix is one line in a policy document, and it fixes it for five people at once.", bold: true }]
        ),

        // -------------------------------------------------------- END BRIDGE
        h("Getting out"),
        screenBar("Back to slide 5, Under the Hood", "2:40"),
        beat(
          [{ label: "DO", text: "Switch back to the deck as you start speaking." }],
          [{ text: "You just watched software tell a hotel not to spend money, and then refuse to send that anywhere until a human agreed with it. Here is what is underneath that.", bold: true }],
          { shade: "F7F9F9" }
        ),
        note("Shorter version if you are behind: \"It did not act on that alone. Here is what is underneath it.\""),

        // ------------------------------------------------------- FALLBACKS
        new Paragraph({ children: [], pageBreakBefore: true }),
        h("If something breaks", { before: 0 }),
        body("None of these are disasters. All of them have a line.", { after: 240 }),

        beat(
          [{ label: "PROBLEM", text: "The microphone does not work, or the room is too loud." }],
          ["Click \"Type it instead\" on the staff page, or \"Tap it through\" on the manager page. Paste from your clipboard.",
           { text: "Say: I will type it, because a conference room is not a hotel lobby.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "The transcription comes back wrong." }],
          ["Do not fight it. His own words are shown back to him on the card, which is the point.",
           { text: "Say: And that is why he sees his own words first. If we hear him wrong, he says so, and it changes what he gets coached on.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "\"Log this\" hangs past fifteen seconds." }],
          ["Go straight to Transfer gap. It already shows the gap from the fifty observations before this one.",
           { text: "Say: It has logged fifty of these already. Here is what they add up to.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "The site is down, or the wifi has gone." }],
          ["Play demo-video/coaching-engine-demo.mp4 from the laptop. It is silent. Narrate it with this same sheet. You can pause it to take a question.",
           { text: "Say: I am going to play this from the laptop, because I do not trust conference wifi and neither should you.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "A judge asks about staff whose English is weak." }],
          [{ text: "Say: He can do all of that in his own language. We built a dialect layer on top of translation, because guagua is a bus in Havana and a baby in Lima, and scoring somebody on a sentence they did not say is worse than not scoring them at all. It is live, I just did not want to spend your two minutes on it.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "A judge asks you to actually press one." }],
          ["Press Confirm, not Correct or Reject. It is a one way door, so only do it if asked.",
           { text: "Say: Confirmed. And that verdict is now evidence about us, not about Diego. Every decision a manager makes is scored against what our model said, dimension by dimension. A rejection counts for more than a confirmation, not less. If we start drifting away from her judgement, the product says so on its own face.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "A judge spots the 100% agreement line on the verify card." }],
          [{ text: "Say: Three checks. That number means nothing yet and we are not going to pretend it does. What matters is that it is there: every verdict a manager gives is scored against what the model said, and when agreement is low the product says so on its own face and routes to a human first. We would rather show you a number that is not ready than not measure it.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "A judge asks whether it ever says anything except do not train." }],
          ["Point at Tomas, three rows down the queue: excels in real situations but struggles with simulations.",
           { text: "Say: That is the opposite corner. He is fine on the floor and poor in practice, so the measurement is what is wrong, not the person. We do not send him training either, we recalibrate. Four quadrants, and only one of them is book a course.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "A judge says he cannot do it in practice either, so train him." }],
          [{ text: "Say: In practice he scores four point eight out of five. That note is the difference between a four and a five, not between competent and not. On the floor the same man scores one point four. A training course closes a gap of nought point two. It does nothing to a gap of three. And look at what is missing in both: only the offer. Not the empathy, not the composure, not the procedure. Only the one thing that needs somebody's permission.", italics: true, color: SLATE, size: 20 }]
        ),
        beat(
          [{ label: "PROBLEM", text: "A judge asks why the guest has no voice." }],
          [{ text: "Say: It speaks, using ElevenLabs. We turned it off for this demo because we are on a free tier and would rather spend the last of it on you than on us.", italics: true, color: SLATE, size: 20 }]
        ),

        // ------------------------------------------------------------ timing
        h("The shape of it", { pageBreak: true, before: 0 }),
        new Table({
          columnWidths: [5200, CONTENT - 5200],
          width: { size: CONTENT, type: WidthType.DXA },
          borders: {
            top: NONE, left: NONE, right: NONE, bottom: NONE,
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: RULE },
            insideVertical: NONE,
          },
          rows: [
            ["Landing page, the story", "0:08"],
            ["Diego's practice, and the offer he never makes", "0:15"],
            ["Diego's shift, his words and his hotel's standard", "0:32"],
            ["Marta, what she saw, and \"there it is again\"", "0:32"],
            ["The transfer gap, two bars and the verdict", "0:23"],
            ["The verify queue: it stopped, and here is why", "0:35"],
            ["Five people one policy, and the close", "0:15"],
            ["Total", "2:40"],
          ].map(([a, b], i) => new TableRow({
            children: [a, b].map((t, j) => new TableCell({
              width: { size: j === 0 ? 5200 : CONTENT - 5200, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: [new Paragraph({
                alignment: j === 1 ? AlignmentType.RIGHT : AlignmentType.LEFT,
                children: [new TextRun({
                  text: t, size: 20, color: INK, font: "Calibri",
                  bold: i === 7,
                })],
              })],
            })),
          })),
        }),
        new Paragraph({
          spacing: { before: 240 },
          children: [new TextRun({
            text: "If you only have 2:10: cut the Transfer gap page and go from Marta's log straight to the verify queue, opening with \"Two streams, and here is what the system made of them.\" You lose the two bars and the three point number, and you keep the evidence, the gate, the SOP and the team pattern. The verify queue is the better screen; the transfer gap is the better number. Keep the screen.",
            size: 20, color: INK, italics: true, font: "Calibri" })],
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
