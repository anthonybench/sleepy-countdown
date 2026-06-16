# sleepy-countdown

A configurable React countdown timer component, with three pre-designed styles:
`modern`, `classic`, and `minimal`.

## Install

```bash
npm install sleepy-countdown
```

`react` and `react-dom` (v18+) are peer dependencies — your app provides them.

## Usage

```tsx
import { SleepyCountdown } from 'sleepy-countdown';

export function Example() {
  return (
    <SleepyCountdown
      target={new Date('2026-12-31T23:59:59')}
      type="modern"
      resolution="second"
      title="New Year"
      description="Counting down to 2027"
    />
  );
}
```

Styles are bundled into the component — no separate CSS import is required.

## Props

| Prop          | Type                                      | Default                  | Description                                                 |
| ------------- | ----------------------------------------- | ------------------------ | ----------------------------------------------------------- |
| `target`      | `Date \| string \| number`                | _(required)_             | When the countdown ends (Date, ISO string, or epoch-ms).    |
| `resolution`  | `'day' \| 'hour' \| 'minute' \| 'second'` | `'day'`                  | Finest unit shown; finer units are hidden.                  |
| `end_message` | `ReactNode`                               | `'Countdown has ended.'` | Replaces the timer once `target` passes.                    |
| `title`       | `ReactNode`                               | —                        | Heading shown above the timer.                              |
| `description` | `ReactNode`                               | —                        | Muted text shown below the title.                           |
| `type`        | `'modern' \| 'classic' \| 'minimal'`      | `'modern'`               | Pre-designed visual style.                                  |
| `className`   | `string`                                  | —                        | Extra class on the root element.                            |
| `style`       | `CSSProperties`                           | —                        | Inline styles / CSS-variable overrides on the root element. |

## Theming

Colors and radii are CSS custom properties you can override from your own CSS or
the `style` prop. Fonts are inherited from your app (the component sets none on
its text). See [`docs/style_inheritence.md`](./docs/style_inheritence.md).

The component renders as a card with its own surface, border, and rounded corners.
The default palette is **Catppuccin Mocha**; override any variable to switch flavors
(or to your own brand). Common variables:

| Variable                            | Default (Catppuccin Mocha) | Controls                              |
| ----------------------------------- | -------------------------- | ------------------------------------- |
| `--sleepy-countdown-surface`        | `#1e1e2e`                  | The card's background                 |
| `--sleepy-countdown-border`         | `1px solid #313244`        | The card's border (full shorthand)    |
| `--sleepy-countdown-surface-radius` | `18px`                     | The card's corner rounding            |
| `--sleepy-countdown-shadow`         | soft dark drop shadow      | The card's shadow                     |
| `--sleepy-countdown-accent`         | `#cba6f7` (Mauve)          | Accent color (modern digits)          |
| `--sleepy-countdown-card-bg`        | `#313244` (Surface0)       | The individual time-unit cards        |
| `--sleepy-countdown-card-fg`        | `#cdd6f4` (Text)           | Text on the time-unit cards (classic) |
| `--sleepy-countdown-fg`             | `#cdd6f4` (Text)           | Primary text color                    |
| `--sleepy-countdown-muted`          | `#a6adc8` (Subtext0)       | Muted text (description, labels)      |

```css
/* Example: override to Catppuccin Latte (the light flavor). */
.my-page .sleepy-countdown {
  --sleepy-countdown-surface: #eff1f5;
  --sleepy-countdown-border: 1px solid #ccd0da;
  --sleepy-countdown-card-bg: #ccd0da;
  --sleepy-countdown-accent: #8839ef;
  --sleepy-countdown-fg: #4c4f69;
  --sleepy-countdown-muted: #6c6f85;
}
```

## Development

See [`docs/test_drive.md`](./docs/test_drive.md) for running the live demo and tests.

## License

MIT
