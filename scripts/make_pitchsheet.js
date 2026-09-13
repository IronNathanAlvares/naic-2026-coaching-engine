// Builds the whole-pitch run sheet for V4, reusing the run sheet's visual system.
const fs = require("fs");

const head = fs.readFileSync("build_runsheet.js", "utf8");
let helpers = head.slice(0, head.indexOf("const doc = new Document("));
helpers = helpers.replace(
  'color: l.label === "GO TO" ? TEAL : SLATE,',
  'color: l.label === "GO TO" ? TEAL : (l.label === "YOU" ? VIOLET : SLATE),');

// action(): a bracketed stage direction inside the spoken column.
const extra = `
function act(text) {
  return { text: "[ " + text + " ]", italics: true, color: VIOLET, size: 21 };
}
function say(text, bold) {
  return { text, bold: !!bold, size: 24, color: INK };
}
`;

const body = `
const doc = new Document({
  creator: "The Coaching Engine",
  title: "Pitch run sheet",
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
          children: [new TextRun({ text: "Pitch run sheet", bold: true, size: 30, color: TEAL, font: "Calibri" })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({
            text: "V4 deck, 14 September 2026.  Seven minutes: five of slides, two of demo.  Mary-Susan 1 and 2, Nathan 3 and the demo, Thapelo 5, Eugenia 6 and 7, Mary-Susan 8.",
            size: 19, color: SLATE, font: "Calibri" })],
        }),

        h("Before you go on", { before: 0 }),
        bullet("ONE person drives the slides for the whole pitch. Nathan, because the demo runs off his laptop. Speakers never touch the clicker; a passed clicker is four chances to fumble."),
        bullet("Agree the click cue now: the driver advances when the speaker finishes their last sentence, not when they pause mid-thought."),
        bullet("Stand in speaking order, left to right, so nobody crosses in front of anyone."),
        bullet("Whoever is speaking steps FORWARD half a pace. Everyone else stands still and looks at the speaker, not at the audience, and not at the laptop."),
        bullet("Nobody says \\"thank you\\" to the previous speaker. The handover line already does that work, and four thank-yous in seven minutes sounds like a school assembly."),
        bullet("Slides 9 and 10 are Q&A backup. Do not present them. Know they exist and jump to them if asked."),

        new Paragraph({
          spacing: { before: 200, after: 300 },
          children: [new TextRun({
            text: "Square brackets in the right column are actions and delivery, not words to say.",
            size: 19, color: SLATE, italics: true, font: "Calibri" })],
        }),

        // ------------------------------------------------------------ 1
        h("Mary-Susan", { before: 100 }),
        screenBar("Slide 1  ·  Title", "0:00 to 0:25"),
        beat(
          [{ label: "ON SCREEN", text: "The Coaching Engine. The coaching layer that tells hotels who is actually ready to perform under pressure." },
           { label: "YOU", text: "Do not read the slide. Do not look at it. Start before anyone has settled." }],
          [act("no notes, centre, straight to the room"),
           say("Every hotel in this room trains its people."),
           act("beat"),
           say("Almost none of them can tell you what actually changed on the floor afterwards."),
           act("small, warm"),
           say("We are The Coaching Engine. I am Mary-Susan.")]
        ),
        note("Twenty five seconds. Resist introducing all five of you by name: it costs thirty seconds and nobody remembers it."),

        // ------------------------------------------------------------ 2
        screenBar("Slide 2  ·  The Problem", "0:25 to 1:15"),
        beat(
          [{ label: "ON SCREEN", text: "44% regularly measure. 24 of 35. 8 linked the gap to unprepared managers. 56% still not measuring." },
           { label: "YOU", text: "Point at the quote, not at the percentages. The quote is the argument; the numbers are the proof." }],
          [say("We interviewed more than thirty people who run hospitality operations. Thirty five of them we asked the same question: how do you know the training worked?"),
           act("hand to the 24/35"),
           say("Twenty four of them had no real way to see it."),
           act("turn to the quote, let them read it first"),
           say("That is a food and beverage manager at a seven hundred person resort. I cannot watch everyone."),
           act("flat, not sympathetic"),
           say("That is not a complaint about effort. That is arithmetic."),
           act("open hand across the two percentages"),
           say("And it is not just our sample. Over half the sector still does not measure whether training changed anything. The money is being spent. The measuring is not."),
           say("Eight named the same cause: managers promoted for being good at the job, never shown how to coach.")]
        ),
        beat(
          [{ label: "HANDOVER", text: "to Nathan. Step back as you say his name." }],
          [say("So the problem is not the training. It is everything that happens after it. Nathan.", true)],
          { shade: "F7F9F9" }
        ),

        // ------------------------------------------------------------ 3
        h("Nathan"),
        screenBar("Slide 3  ·  The Solution", "1:15 to 2:05"),
        beat(
          [{ label: "ON SCREEN", text: "01 Practice. 02 The floor. 03 Next step. LMS shows completion, role-play scores practice, Coaching Engine connects practice to behaviour." },
           { label: "YOU", text: "Two fingers, then bring your hands together. It is the only gesture this slide needs." }],
          [act("step forward, one finger up"),
           say("Two signals. What somebody can do in practice, in a guest scenario scored against their own hotel's standards."),
           act("second finger"),
           say("And what their manager actually saw on the floor, written down in twenty seconds after service."),
           act("bring both hands together, hold"),
           say("On their own, neither is worth much. A learning system tells you someone finished. A role-play tells you they can do it in a quiet room. Neither tells you what happened at eleven at night with a queue at the desk."),
           act("slower"),
           say("Put the two side by side, and the distance between them is the coaching signal."),
           say("And the part we did not expect is what that distance tells you to do. Very often it is not send them on a course.", true)]
        ),
        beat(
          [{ label: "HANDOVER", text: "into the demo. Start the video as you finish the sentence." }],
          [say("Let me show you, on a real shift.", true)],
          { shade: "F7F9F9" }
        ),

        // ------------------------------------------------------------ 4
        screenBar("Slide 4  ·  THE DEMO", "2:05 to 4:03"),
        beat(
          [{ label: "ON SCREEN", text: "Demo_Video_Coaching_Engine.mp4, 1:58, silent." },
           { label: "YOU", text: "Separate sheet. Demo-Run-Sheet.docx has the beat by beat narration and the stage directions." }],
          [act("the whole narration is on the other sheet, do not try to hold both"),
           say("Sixteen short lines, about two hundred words across the whole video. It moves faster than you think: the practice conversation starts at ten seconds, not eighteen.")]
        ),
        screenBar("The close, to the room", "4:03 to 4:13"),
        beat(
          [{ label: "YOU", text: "Video has stopped on the glass box. Turn away from it. Hands at your sides. This is not narration any more." },
           { label: "HANDOVER", text: "to Thapelo on his name." }],
          [act("let the last frame sit for two seconds before you speak"),
           say("That is not a skill gap. It is an authority gap. And it was never Diego's to fix.", true),
           say("Thapelo will show you what is underneath it.", true)],
          { shade: "F7F9F9" }
        ),
        note("The close is deliberately outside the video. There is no room for it inside 1:58, and it lands better said to their faces over a still frame than talked over a moving screen."),

        // ------------------------------------------------------------ 5
        h("Thapelo"),
        screenBar("Slide 5  ·  Under the Hood", "4:13 to 4:55"),
        beat(
          [{ label: "ON SCREEN", text: "AI organises the signal, on the left. People control the decision, on the right. Then the red line at the bottom." },
           { label: "YOU", text: "Work left to right across the slide with your hand. The shape of the slide IS the argument." }],
          [say("One rule underneath all of this. The model has one narrow job: read what people said and turn it into claims with evidence attached. It does not decide anything."),
           act("move your hand to the right half"),
           say("Everything that matters is code and database. Every claim has to tie a practice scenario, a floor observation and a written hotel standard together. If that evidence does not hold, it stops and says so rather than guessing."),
           say("No recommendation reaches a staff member without a named manager approving it. And who can see what is enforced inside the database, not in our interface."),
           act("down to the bottom line, slow right down"),
           say("And three things we deliberately do not do. No live guest monitoring. No emotion recognition. No automatic employment decisions.", true),
           act("to the room, not the screen"),
           say("Under the EU AI Act those are the lines you do not cross in a workplace. We designed to them from the first week, not after a lawyer asked.")]
        ),
        beat(
          [{ label: "HANDOVER", text: "to Eugenia." }],
          [say("That is what makes it something a hotel can actually deploy. Eugenia will tell you where.", true)],
          { shade: "F7F9F9" }
        ),

        // ------------------------------------------------------------ 6
        h("Eugenia"),
        screenBar("Slide 6  ·  Scale", "4:55 to 5:33"),
        beat(
          [{ label: "ON SCREEN", text: "828 Irish hotels. 416 four and five star. 14,800 EU hotels with 100+ rooms. 1 flagship, 2 proof, 3 group." },
           { label: "YOU", text: "Trace the one, two, three with your finger as you say them. It is a path, so draw it." }],
          [say("We are starting deliberately narrow. Four hundred and sixteen four and five star hotels in Ireland: the segment where the training spend is real and the standards are already written down."),
           act("trace 1, 2, 3"),
           say("One flagship property. Prove it there. Then expand across the group, because hotels do not buy one at a time. They buy by group."),
           act("down to the bar"),
           say("We are talking to three groups, forty one properties between them, three of them active follow ups."),
           act("open hand to the 14,800"),
           say("And nothing about this is Irish. Fourteen thousand eight hundred European hotels over a hundred rooms have the same problem, the same standards and the same regulation.")]
        ),

        // ------------------------------------------------------------ 7
        screenBar("Slide 7  ·  Commercial Path", "5:33 to 6:20"),
        beat(
          [{ label: "ON SCREEN", text: "Four week pilot. Prove outcomes. Group licence. 12 euro per active user per month, about 9,792 per property per year." },
           { label: "YOU", text: "The last line is the one that wins trust. Say it looking straight at them, and do not soften it." }],
          [say("The route is simple, and it has evidence gates in it."),
           say("A four week paid pilot at one property, one operating team. What we are proving is not whether people like it. It is whether behaviour changed: did managers use it, did the actions get completed, did the next scenario match the gap."),
           say("If that holds, it becomes an annual group licence priced per active employee. Twelve euro a month, about nine thousand eight hundred a year for a typical property."),
           act("straight, unhurried, no apology in your voice"),
           say("And to be straight with you: we have three warm follow ups and no signed pilot yet. That is exactly what we are here to change.", true)]
        ),
        beat(
          [{ label: "HANDOVER", text: "to Mary-Susan." }],
          [say("Mary-Susan will close.", true)],
          { shade: "F7F9F9" }
        ),

        // ------------------------------------------------------------ 8
        h("Mary-Susan"),
        screenBar("Slide 8  ·  The Ask", "6:20 to 6:57"),
        beat(
          [{ label: "ON SCREEN", text: "Back us to turn a live system into a measured hotel pilot. Completion is not behaviour. We measure what happens next." },
           { label: "YOU", text: "Hands still. The last line is eight words. Do not add a ninth." }],
          [say("Our ask is one thing. Back us to turn a live system into a measured pilot inside a real hotel."),
           say("What you watched is built and running today. What we need next is one property, four weeks, and the introductions to get there faster than we would on our own."),
           act("beat, then slower, to the room"),
           say("Completion is not behaviour. We measure what happens next.", true),
           act("stop, three seconds, then"),
           say("Thank you.")]
        ),

        // ------------------------------------------------------------ back
        new Paragraph({ children: [], pageBreakBefore: true }),
        h("The shape of it", { before: 0 }),
        new Table({
          columnWidths: [6200, CONTENT - 6200],
          width: { size: CONTENT, type: WidthType.DXA },
          borders: {
            top: NONE, left: NONE, right: NONE, bottom: NONE,
            insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: RULE },
            insideVertical: NONE,
          },
          rows: [
            ["Slide 1, title  ·  Mary-Susan", "0:25"],
            ["Slide 2, the problem  ·  Mary-Susan", "0:50"],
            ["Slide 3, the solution  ·  Nathan", "0:50"],
            ["Slide 4, THE DEMO  ·  Nathan", "1:58"],
            ["The close, to the room  ·  Nathan", "0:10"],
            ["Slide 5, under the hood  ·  Thapelo", "0:42"],
            ["Slide 6, scale  ·  Eugenia", "0:40"],
            ["Slide 7, commercial path  ·  Eugenia", "0:47"],
            ["Slide 8, the ask  ·  Mary-Susan", "0:37"],
            ["Total", "6:57"],
          ].map(([a, b], i) => new TableRow({
            children: [a, b].map((t, j) => new TableCell({
              width: { size: j === 0 ? 6200 : CONTENT - 6200, type: WidthType.DXA },
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: [new Paragraph({
                alignment: j === 1 ? AlignmentType.RIGHT : AlignmentType.LEFT,
                children: [new TextRun({ text: t, size: 20, color: INK, font: "Calibri", bold: i === 9 })],
              })],
            })),
          })),
        }),
        new Paragraph({
          spacing: { before: 240, after: 240 },
          children: [new TextRun({
            text: "About 730 words of slides plus a 1:58 video and a ten second close: six fifty seven inside a seven minute cap. That is three seconds of slack, so the cut list below is not optional if anyone runs over. Time it out loud twice, as a group, standing up: reading it silently will tell you it fits when it does not.",
            size: 20, color: INK, italics: true, font: "Calibri" })],
        }),

        h("If you are running long"),
        body("Cut in this order. Every cut is a whole paragraph so you lose time without losing a thread.", { after: 160 }),
        bullet("Slide 6, the 14,800 EU line. The Irish numbers carry the argument on their own."),
        bullet("Slide 2, the eight who named unprepared managers. It is a good fact and it is not the point of the slide."),
        bullet("Slide 5, the sentence about a bug in our code not leaking a record. Keep the three things you do not do."),
        body("Never cut the demo's last three lines, the no-signed-pilot admission on slide 7, or the last line of slide 8.", { after: 240 }),

        h("Two things to get right before you walk in"),
        body("The slide 5 provider labels and what Thapelo says are not quite the same thing. The slide credits OpenAI with the practice guest persona; in the running system that call goes to Groq, and OpenAI does the scoring and the coaching text. Nobody will notice from the floor, but if a judge asks who serves which model, answer from the system rather than the slide, and say plainly that the slide simplifies it. Do not let two of you give different answers.", { after: 160 }),
        body("Decide now who takes which question. Technical and anything about the demo goes to Nathan. Architecture, safety and the EU AI Act goes to Thapelo. Market, pricing and pilot goes to Eugenia. Anything about the problem, the interviews or the ask goes to Mary-Susan. One person answers, and the others do not add to it unless asked. A team that answers as a queue looks rehearsed; a team that all answers at once looks unled.", { after: 160 }),

        h("While you are not speaking"),
        bullet("Look at whoever is speaking. An audience looks where the panel looks."),
        bullet("Hands still or loosely clasped. No phones, no notes shuffling, no checking the laptop."),
        bullet("Do not nod along at your own team. It reads as nervous."),
        bullet("If a slide misfires, the speaker keeps talking and the driver fixes it silently. Never narrate the technology failing."),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = process.argv[2] || "Pitch-Run-Sheet.docx";
  fs.writeFileSync(out, buf);
  console.log("written:", out, buf.length, "bytes");
});
`;

fs.writeFileSync("build_pitchsheet.js", helpers + extra + body, "utf8");
console.log("generated build_pitchsheet.js");
