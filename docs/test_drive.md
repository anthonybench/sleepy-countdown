# Test Drive — seeing the component

Three ways to look at `sleepy-countdown`, from quickest to most thorough. Run every
command from the project root.

## 0. One-time setup

Install the dependencies (you only need to do this once, or after `package.json`
changes):

```bash
npm install
```

This installs everything from `devDependencies` — React, the bundler (tsup), the demo
server (Vite), and the test runner (Vitest). Consumers of the published package never
install these; they're only for developing the package.

## 1. The live demo (the visual one) ⭐

This is what you want to *see what it looks like*. It starts a dev server rendering
`examples/App.tsx`, which shows every `type`, every `resolution`, the ended state, and
a themed example — all ticking live.

```bash
npm run demo
```

Then open the URL it prints (default <http://localhost:5173>). The page hot-reloads:
edit anything under `src/` or `examples/` and the browser updates instantly. The demo
imports the component straight from `src/`, so **no build step is needed** to see your
changes. Press `Ctrl+C` to stop the server.

What you'll see on the page:

- **Every style** — `modern`, `classic`, and `minimal` side by side at second
  resolution. (Watch the `classic` cards do a brief flip animation each second.)
- **Every resolution** — `day` → `second`, showing how finer units appear/disappear
  while the timer keeps a constant size.
- **Ended state** — a timer whose target is in the past, showing the default end
  message, plus one with a custom `end_message`.
- **Themed** — the same component recolored purely through CSS variables passed via the
  `style` prop (see [`style_inheritence.md`](./style_inheritence.md)).

To try your own values, edit `examples/App.tsx` — e.g. change a `target`, `type`, or
`resolution` — and watch it update.

## 2. Automated tests (the fast, headless check)

These render the component in a simulated DOM and assert behavior (correct units per
resolution, the end message appears, etc.). No browser, finishes in ~1 second.

```bash
npm test          # run once
npm run test:watch  # re-run on file changes
```

Use this to confirm logic still works after a change, without eyeballing the demo.

## 3. The production build (what consumers actually get)

This compiles `src/` into the publishable `dist/` folder (ESM + CommonJS + TypeScript
types, with CSS bundled in). You don't need it just to view the component, but it's how
you verify the package is shippable.

```bash
npm run build
```

Inspect the output in `dist/`. To test the *real* installed experience before
publishing, pack it into the exact tarball npm would upload:

```bash
npm pack          # produces sleepy-countdown-0.1.0.tgz
```

…then in a separate test app, `npm install /path/to/sleepy-countdown-0.1.0.tgz` and
import it as a real dependency. (`npm link` is an alternative, but installing the
tarball most closely matches what published consumers receive.)

## Quick reference

| Command              | What it does                                  | When to use                  |
| -------------------- | --------------------------------------------- | ---------------------------- |
| `npm install`        | Install dev dependencies                      | Once, after cloning          |
| `npm run demo`       | Live, hot-reloading demo in the browser       | **To see what it looks like** |
| `npm test`           | Run the headless test suite once              | Verify behavior after edits  |
| `npm run test:watch` | Re-run tests on every change                  | While actively coding        |
| `npm run build`      | Compile `src/` → `dist/` for publishing       | Before publishing            |
| `npm pack`           | Build the exact tarball npm would publish     | Final pre-publish smoke test |
