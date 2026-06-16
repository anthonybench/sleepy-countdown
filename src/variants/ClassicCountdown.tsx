import type { VariantProps } from '../types';
import '../styles/classic.css';

/**
 * Old-fashioned flip-clock look: a dark card split across the middle. The value
 * span is keyed on its own text, so each change remounts it and replays the
 * flip-in animation — giving the card-flipping feel.
 */
export function ClassicCountdown({ units }: VariantProps) {
  return (
    <>
      {units.map((unit) => (
        <div key={unit.key} className="sleepy-classic__unit">
          <div className="sleepy-classic__card">
            <span key={unit.value} className="sleepy-classic__value">
              {unit.value}
            </span>
          </div>
          <div className="sleepy-classic__label">{unit.label}</div>
        </div>
      ))}
    </>
  );
}
