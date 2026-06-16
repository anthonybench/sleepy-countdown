import type { VariantProps } from '../types';
import '../styles/modern.css';

/** Sleek, rounded cards with an accent value and small caption. */
export function ModernCountdown({ units }: VariantProps) {
  return (
    <>
      {units.map((unit) => (
        <div key={unit.key} className="sleepy-modern__unit">
          <div className="sleepy-modern__value">{unit.value}</div>
          <div className="sleepy-modern__label">{unit.label}</div>
        </div>
      ))}
    </>
  );
}
