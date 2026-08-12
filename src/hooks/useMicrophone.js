import { useCallback, useEffect, useRef, useState } from "react";
import { MicrophoneCapture } from "../audio.js";

export function useMicrophone() {
  const captureRef = useRef(null);
  const requestRef = useRef(null);
  const [state, setState] = useState({ mode: null, status: "idle", sample: null, startedAt: 0, error: null });

  const stop = useCallback(() => {
    if (requestRef.current) requestRef.current.cancelled = true;
    requestRef.current = null;
    captureRef.current?.stop();
    captureRef.current = null;
    setState((current) => ({ ...current, mode: null, status: "stopped", sample: null }));
  }, []);

  const playAlert = useCallback(() => captureRef.current?.playAlert(), []);

  const start = useCallback(async (mode) => {
    if (captureRef.current) return;
    const request = { cancelled: false };
    requestRef.current = request;
    const startedAt = performance.now();
    setState({ mode, status: "requesting", sample: null, startedAt, error: null });
    const capture = new MicrophoneCapture(
      (sample) => setState((current) => ({ ...current, sample: { ...sample, at: performance.now() }, status: "active" })),
      () => {},
      () => {
        stop();
        setState((current) => ({ ...current, status: "error", error: new DOMException("Microphone ended", "NotReadableError") }));
      },
    );
    captureRef.current = capture;
    try {
      const started = await capture.start(() => requestRef.current === request && !request.cancelled);
      if (!started || request.cancelled || requestRef.current !== request) return;
      requestRef.current = null;
      setState((current) => ({ ...current, status: "active" }));
    } catch (error) {
      const cancelled = request.cancelled;
      stop();
      if (!cancelled) setState({ mode, status: "error", sample: null, startedAt, error });
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return { ...state, start, stop, playAlert, active: Boolean(captureRef.current) && state.status !== "error" };
}
