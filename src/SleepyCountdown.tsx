import { CountdownFrame } from './CountdownFrame';
import { useCountdown } from './useCountdown';
import { ModernCountdown } from './variants/ModernCountdown';
import { ClassicCountdown } from './variants/ClassicCountdown';
import { MinimalCountdown } from './variants/MinimalCountdown';
import type {
  CountdownType,
  DisplayUnit,
  Resolution,
  SleepyCountdownProps,
  VariantProps,
} from './types';
import type { TimeParts } from './useCountdown';
import type { ComponentType } from 'react';

const VARIANTS: Record<CountdownType, ComponentType<VariantProps>> = {
  modern: ModernCountdown,
  classic: ClassicCountdown,
  minimal: MinimalCountdown,
};

// Units ordered coarse → fine. `resolution` decides how many we keep.
const UNIT_ORDER: { key: DisplayUnit['key']; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

const RESOLUTION_DEPTH: Record<Resolution, number> = {
  day: 1,
  hour: 2,
  minute: 3,
  second: 4,
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function buildUnits(parts: TimeParts, resolution: Resolution): DisplayUnit[] {
  return UNIT_ORDER.slice(0, RESOLUTION_DEPTH[resolution]).map(({ key, label }) => ({
    key,
    label,
    value: pad(parts[key]),
  }));
}

/**
 * A countdown timer to `target`, rendered in one of three pre-designed styles.
 * Once the target passes, the timer is replaced by `end_message` (the frame
 * keeps its size, so the layout doesn't jump).
 */
export function SleepyCountdown({
  target,
  resolution = 'day',
  end_message = 'Countdown has ended.',
  title,
  description,
  type = 'modern',
  className,
  style,
}: SleepyCountdownProps) {
  const parts = useCountdown(target);
  const isComplete = parts.total <= 0;
  const Variant = VARIANTS[type] ?? VARIANTS.modern;

  return (
    <CountdownFrame
      title={title}
      description={description}
      type={type}
      className={className}
      style={style}
    >
      {isComplete ? (
        <div className="sleepy-countdown__end">{end_message}</div>
      ) : (
        <Variant units={buildUnits(parts, resolution)} />
      )}
    </CountdownFrame>
  );
}
