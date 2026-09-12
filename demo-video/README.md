# Backup demo video

`coaching-engine-demo.mp4`, 1280x800, H.264, about 74 seconds.

**This is insurance, not the demo.** If the venue wifi holds, drive the live
site. Play this only if it does not.

## It has no sound, on purpose

Narrate it live from `../DEMO-SCRIPT.md`. The words should be yours, said in
the room, at the pace the room is going. A recorded voiceover is harder to talk
over and sounds like an advert.

Because you are narrating, you can pause it. If a judge interrupts, stop the
video, answer, and resume. That is easier than it would be with a voiced one.

## What is in it, in order

| Roughly | What is on screen |
|---|---|
| 0:00 | the staff app, Diego |
| 0:10 | the Spanish debrief being typed, at human speed |
| 0:20 | translation, regional words, read as Colombia |
| 0:30 | the hotel's own escalation clause |
| 0:38 | the manager console |
| 0:48 | the drafted observation, evidence underlined |
| 1:00 | logged, the agent runs |
| 1:08 | the transfer gap. Practice 4.8, floor about 1.4, BLOCKED |

## It is real

Recorded against the deployed site, the Cloud Run API and the live database.
Nothing is mocked, nothing is sped up, the typing is genuinely typed. The
observation it logs is a real one, and the recording script deletes it
afterwards so the numbers the pitch quotes do not drift.

## To record it again

```bash
python scripts/record_demo.py
```

Takes about 80 seconds. Do it again if the site changes, and keep a copy on the
laptop you will actually present from. A backup that lives only in the cloud is
not a backup for a wifi failure.
