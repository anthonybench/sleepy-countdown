import type { CSSProperties, ReactNode } from 'react';

/** The finest time unit the timer will display. Finer units are hidden. */
export type Resolution = 'day' | 'hour' | 'minute' | 'second';

/** One of the pre-designed visual styles. */
export type CountdownType = 'modern' | 'classic' | 'minimal';

export interface SleepyCountdownProps {
  /** When the countdown ends. Accepts a Date, an ISO string, or an epoch-ms number. */
  target: Date | string | number;
  /** Finest unit to show (default `'day'`). */
  resolution?: Resolution;
  /** Text shown in place of the timer once it ends (default `'Countdown has ended.'`). */
  end_message?: ReactNode;
  /** Heading shown above the timer. */
  title?: ReactNode;
  /** Muted text shown below the title. */
  description?: ReactNode;
  /** Pre-designed style (default `'modern'`). */
  type?: CountdownType;
  /** Extra class on the root element, for consumer styling. */
  className?: string;
  /** Inline styles / CSS-variable overrides on the root element. */
  style?: CSSProperties;
}

/** A single time unit ready to render: a 2-digit value plus its label. */
export interface DisplayUnit {
  key: 'days' | 'hours' | 'minutes' | 'seconds';
  label: string;
  value: string;
}

/** Props every variant component receives. */
export interface VariantProps {
  units: DisplayUnit[];
}
