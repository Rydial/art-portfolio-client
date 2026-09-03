import {useCallback, useEffect, useRef, useState} from "react";

interface UseSlideshowOptions {
  length: number;
  intervalMs?: number;
}

export function useSlideshow({length, intervalMs = 6000}: UseSlideshowOptions) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- Callbacks ------------------------------------------------------------
  const next = useCallback(() => {
    setIndex((i) => (i + 1) % length);
  }, [length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + length) % length);
  }, [length]);

  const pause = useCallback(() => setPaused(true), []);

  const resume = useCallback(() => setPaused(false), []);

  // ---- Effects --------------------------------------------------------------

  // Slide timeout logic
  useEffect(() => {
    if (paused || length <= 1) return;

    timerRef.current = setInterval(next, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, length, intervalMs, next]);

  // ---------------------------------------------------------------------------

  return {index, next, prev, pause, resume};
}
