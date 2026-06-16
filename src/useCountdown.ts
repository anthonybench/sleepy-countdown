import { useEffect, useState } from 'react';

export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Milliseconds remaining; `0` once the target has passed. */
  total: number;
}

function compute(targetMs: number): TimeParts {
  const total = Math.max(0, targetMs - Date.now());
  const totalSeconds = Math.floor(total / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    total,
  };
}

/**
 * Computes the time remaining until `target` and re-renders once per second.
 * Owns all the timer logic so the visual variants stay purely presentational.
 */
export function useCountdown(target: Date | string | number): TimeParts {
  const targetMs = new Date(target).getTime();
  const [parts, setParts] = useState<TimeParts>(() => compute(targetMs));

  useEffect(() => {
    // Re-sync immediately in case `target` changed, then tick every second.
    setParts(compute(targetMs));
    const id = setInterval(() => setParts(compute(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return parts;
}
