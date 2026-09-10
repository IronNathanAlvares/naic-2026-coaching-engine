import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Record a shift debrief and hand back the audio.
 *
 * This is deliberately not the browser's SpeechRecognition API, which
 * use-voice-input.ts uses to help someone type. Two different jobs:
 *
 *  - Dictating into a text box wants live interim results, and losing a word
 *    costs nothing because the person is watching the box.
 *  - A debrief is the record. It has to work on the phone the staff member
 *    actually owns, and SpeechRecognition is Chrome-and-Safari-flavoured,
 *    silently absent on Firefox, and on Chrome it ships the audio to Google
 *    rather than to us. MediaRecorder is everywhere, and the audio goes to our
 *    own Whisper endpoint, which is also the only version of this we can make
 *    a promise about: transcribed, then deleted.
 */

export type RecorderState = "idle" | "recording" | "denied" | "unsupported";

/** Whisper takes both; which one we get depends on the browser. */
function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const type of ["audio/webm", "audio/mp4"]) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return undefined;
}

export function extensionFor(mimeType: string): string {
  return mimeType.includes("mp4") ? "m4a" : "webm";
}

export function useRecorder({
  maxSeconds = 120,
  onComplete,
}: {
  maxSeconds?: number;
  onComplete: (blob: Blob, filename: string) => void;
}) {
  const [state, setState] = useState<RecorderState>("idle");
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Read inside the stop handler, which was created before the latest render.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanup = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    recorderRef.current = null;
  }, []);

  // Releasing the microphone on unmount is not tidiness. A page that navigates
  // away while still holding it leaves the browser's recording indicator lit,
  // which is exactly the kind of thing that makes people stop trusting an app
  // that asks them to talk about their shift.
  useEffect(() => cleanup, [cleanup]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    const mimeType = pickMimeType();
    if (!mimeType || !navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState("denied");
      return;
    }

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      cleanup();
      setState("idle");
      setSeconds(0);
      if (blob.size > 0) {
        onCompleteRef.current(blob, `debrief.${extensionFor(mimeType)}`);
      }
    };

    recorder.start();
    setState("recording");
    setSeconds(0);
    tickRef.current = setInterval(() => {
      setSeconds((s) => {
        // A hard ceiling, because a phone left in a pocket will happily record
        // the rest of the shift and then fail the upload limit.
        if (s + 1 >= maxSeconds) stop();
        return s + 1;
      });
    }, 1000);
  }, [cleanup, maxSeconds, stop]);

  return { state, seconds, start, stop, maxSeconds };
}
