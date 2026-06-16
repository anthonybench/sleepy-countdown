# Style Inheritance — letting consumers control colors & fonts

How a consumer (anyone who `npm install`s `sleepy-countdown`) can adjust the look of
the component, and how much the component author needs to plan for it.

## The short answer

You don't anticipate specific colors or fonts — you can't, and you shouldn't. Your job
is to ship sensible defaults and design clear **override seams** where consumers can
restyle. Decide *how much* control to expose, once, deliberately.

## Fonts often take care of themselves (CSS inheritance)

`font-family`, `font-size`, and `color` are **inherited** in CSS: an element uses its
parent's value unless told otherwise. So if you *don't* set `font-family` at all, the
component automatically picks up the consumer's app font and blends in.

For `sleepy-countdown`, `title` and `description` text should inherit the host font —
usually exactly what the consumer wants. Only override a font intentionally, e.g. a
monospace font on the digits so they don't jitter as numbers change.

**Takeaway for fonts: setting nothing is often the correct, lowest-effort choice.**

Colors are different — a countdown has its own background/accent colors that don't come
free from inheritance, so those need a deliberate choice.

## Mechanisms consumers can use (least → most flexible)

### 1. CSS Custom Properties (CSS variables) — recommended sweet spot

Define styles in terms of variables with fallback defaults:

```css
.sleepy-countdown {
  background: var(--sleepy-countdown-surface, #1e1e2e);
  color:      var(--sleepy-countdown-fg, #cdd6f4);
  border-radius: var(--sleepy-countdown-surface-radius, 18px);
}
```

The consumer overrides from their own CSS, no JS involved:

```css
.my-page .sleepy-countdown {
  --sleepy-countdown-surface: papayawhip;
  --sleepy-countdown-fg: #333;
}
```

You publish a documented list of variables (your "theming API") and consumers restyle
without you exposing a prop per color. Variables inherit, so they cascade naturally.
This is exactly how `sleepy-countdown` works today — every `--sleepy-countdown-*`
variable is namespaced with the full package name (not just `--sleepy-`) so it won't
collide with variables from the consumer's app or other libraries. The full list lives
in the [README](../README.md#theming) and in `src/styles/frame.css`.

### 2. `className` / `style` passthrough

Accept a `className` (and/or `style`) prop and apply it to the root element:

```tsx
<div className={`sleepy-countdown ${props.className ?? ''}`} style={props.style}>
```

Consumers then target it with their own CSS or inline overrides. Cheap to offer, very
common — worth including regardless of what else you do.

### 3. Explicit theme props

Expose specific props like `accentColor="..."` or `theme={{ bg, fg }}`. Gives a typed,
autocomplete-friendly API and lets *you* control exactly what's adjustable. Cost: every
prop is a maintenance commitment and the list sprawls easily. Reserve for a *small* set
of high-value knobs.

### 4. "Headless" / unstyled — overkill here

Ship behavior with almost no styling and let the consumer supply everything. Powerful,
but it defeats the purpose of `sleepy-countdown`, whose value is the three ready-made
designs. Not the right model for this package.

## How this maps to the three design `type`s

- **`type`** (`modern`/`classic`/`minimal`) = *structural* design choices you own and
  ship complete. Consumers pick one; they don't redesign it.
- **Colors/fonts** = *cosmetic* tweaks layered on top so a chosen design fits the
  consumer's brand.

So: ship the three opinionated looks, and expose a handful of CSS variables (+
`className` passthrough) so a consumer can recolor, say, `modern` to match their site
without you anticipating their palette.

## Recommendation for this package

Use **CSS variables + `className` passthrough** as the styling contract, and lean on
**inheritance for fonts** (set as little as possible). This is why the package uses
**plain, `--sleepy-countdown-`-prefixed CSS rather than CSS Modules**: the theming
contract depends on *stable, predictable* variable and class names that consumers can
target, and CSS Modules would hash those names away. See the styling rationale in
[OUTLINE.md](./OUTLINE.md).
