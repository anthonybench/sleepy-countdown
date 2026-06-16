import type { CSSProperties, ReactNode } from 'react';
import type { CountdownType } from './types';
import './styles/frame.css';

interface CountdownFrameProps {
  title?: ReactNode;
  description?: ReactNode;
  type: CountdownType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Shared layout mandated by the spec: title at the top, muted description below
 * it, and a fixed-size timer area underneath. Every variant — and the end
 * message — render inside this same frame, so the timer area keeps a constant
 * size regardless of resolution, type, or whether the countdown has ended.
 */
export function CountdownFrame({
  title,
  description,
  type,
  className,
  style,
  children,
}: CountdownFrameProps) {
  const classes = ['sleepy-countdown', `sleepy-countdown--${type}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {title != null && <div className="sleepy-countdown__title">{title}</div>}
      {description != null && (
        <div className="sleepy-countdown__description">{description}</div>
      )}
      <div className="sleepy-countdown__timer">{children}</div>
    </div>
  );
}
