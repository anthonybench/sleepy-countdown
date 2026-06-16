import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SleepyCountdown } from '../src';

const future = () => new Date(Date.now() + 2 * 86400_000 + 3 * 3600_000);

describe('SleepyCountdown', () => {
  it('renders title and description', () => {
    render(<SleepyCountdown target={future()} title="Launch" description="soon" />);
    expect(screen.getByText('Launch')).toBeTruthy();
    expect(screen.getByText('soon')).toBeTruthy();
  });

  it('shows only days at resolution="day"', () => {
    render(<SleepyCountdown target={future()} resolution="day" />);
    expect(screen.getByText('Days')).toBeTruthy();
    expect(screen.queryByText('Hours')).toBeNull();
    expect(screen.queryByText('Seconds')).toBeNull();
  });

  it('shows all four units at resolution="second"', () => {
    render(<SleepyCountdown target={future()} resolution="second" />);
    for (const label of ['Days', 'Hours', 'Minutes', 'Seconds']) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  it('shows the default end message once the target has passed', () => {
    render(<SleepyCountdown target={new Date(Date.now() - 1000)} />);
    expect(screen.getByText('Countdown has ended.')).toBeTruthy();
    expect(screen.queryByText('Days')).toBeNull();
  });

  it('shows a custom end message', () => {
    render(
      <SleepyCountdown target={new Date(Date.now() - 1000)} end_message="Done!" />,
    );
    expect(screen.getByText('Done!')).toBeTruthy();
  });
});
