import { SleepyCountdown } from '../src';
import type { CountdownType, Resolution } from '../src';

// A target a few days out so every unit has something to show.
const soon = new Date(Date.now() + 3 * 86400_000 + 4 * 3600_000 + 30 * 60_000 + 15_000);
// A target in the past, to show the end-message state.
const past = new Date(Date.now() - 1000);

const types: CountdownType[] = ['modern', 'classic', 'minimal'];
const resolutions: Resolution[] = ['day', 'hour', 'minute', 'second'];

const section: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 32,
  alignItems: 'flex-start',
  padding: '12px 0 32px',
  borderBottom: '1px solid #313244',
};

export function App() {
  return (
    <main
      style={{
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
        // Catppuccin Mocha Mantle, so the dark default cards sit on a cohesive backdrop.
        background: '#181825',
        color: '#cdd6f4',
        padding: 24,
      }}
    >
      <h1>sleepy-countdown</h1>

      <h2>Every style (resolution: second)</h2>
      <div style={section}>
        {types.map((type) => (
          <SleepyCountdown
            key={type}
            target={soon}
            type={type}
            resolution="second"
            title={type[0].toUpperCase() + type.slice(1)}
            description={`type="${type}"`}
          />
        ))}
      </div>

      <h2>Every resolution (type: modern)</h2>
      <div style={section}>
        {resolutions.map((resolution) => (
          <SleepyCountdown
            key={resolution}
            target={soon}
            type="modern"
            resolution={resolution}
            title={resolution[0].toUpperCase() + resolution.slice(1)}
            description={`resolution="${resolution}"`}
          />
        ))}
      </div>

      <h2>Ended state</h2>
      <div style={section}>
        <SleepyCountdown
          target={past}
          type="modern"
          resolution="second"
          title="All done"
          description="target is in the past"
        />
        <SleepyCountdown
          target={past}
          type="classic"
          resolution="second"
          title="Custom message"
          end_message="🎉 Happy New Year!"
        />
      </div>

      <h2>Themed via CSS variables (Catppuccin Latte)</h2>
      <div style={section}>
        <SleepyCountdown
          target={soon}
          type="modern"
          resolution="minute"
          title="Latte override"
          description="light flavor via the style prop"
          style={
            {
              '--sleepy-countdown-surface': '#eff1f5', // Base
              '--sleepy-countdown-border': '1px solid #ccd0da', // Surface0
              '--sleepy-countdown-card-bg': '#ccd0da', // Surface0
              '--sleepy-countdown-accent': '#8839ef', // Mauve
              '--sleepy-countdown-fg': '#4c4f69', // Text
              '--sleepy-countdown-muted': '#6c6f85', // Subtext0
            } as React.CSSProperties
          }
        />
      </div>
    </main>
  );
}
