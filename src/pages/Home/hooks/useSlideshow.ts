import {useCallback, useEffect, useRef, useState} from "react";

interface UseSlideshowOptions {
  length: number;
  intervalMs?: number;
}

export function useSlideshow({length, intervalMs = 6000}: UseSlideshowOptions) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);
  const remainingRef = useRef<number>(intervalMs);
  const pausedRef = useRef(false);

  // ---- Callbacks ------------------------------------------------------------
  const next = useCallback(() => {
    remainingRef.current = intervalMs;
    setIndex((i) => (i + 1) % length);
  }, [length, intervalMs]);

  const prev = useCallback(() => {
    remainingRef.current = intervalMs;
    setIndex((i) => (i - 1 + length) % length);
  }, [length, intervalMs]);

  const pause = useCallback(() => {
    if (pausedRef.current) return;

    const elapsed = Date.now() - startedAtRef.current;
    remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
    pausedRef.current = true;
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
    setPaused(false);
  }, []);

  // ---- Effects --------------------------------------------------------------

  // Slide timeout logic
  useEffect(() => {
    if (paused || length <= 1) return;

    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(next, remainingRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, length, next, index]);

  // ---------------------------------------------------------------------------

  return {index, next, prev, pause, resume};
}
