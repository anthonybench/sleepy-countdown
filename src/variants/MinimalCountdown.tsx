import { Fragment } from 'react';
import type { VariantProps } from '../types';
import '../styles/minimal.css';

/** Minimalist: plain numbers with tiny labels, colon-separated. */
export function MinimalCountdown({ units }: VariantProps) {
  return (
    <>
      {units.map((unit, index) => (
        <Fragment key={unit.key}>
          {index > 0 && (
            // Mirror the unit's column (value + label) so the separator is the
            // same height and centers identically — keeping the colon level with
            // the digits. The empty label is just a height spacer.
            <div className="sleepy-minimal__sep" aria-hidden="true">
              <span className="sleepy-minimal__value">:</span>
              <span className="sleepy-minimal__label">&nbsp;</span>
            </div>
          )}
          <div className="sleepy-minimal__unit">
            <span className="sleepy-minimal__value">{unit.value}</span>
            <span className="sleepy-minimal__label">{unit.label}</span>
          </div>
        </Fragment>
      ))}
    </>
  );
}
