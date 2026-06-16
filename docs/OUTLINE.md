# OUTLINE

A guide to the file structure of the `sleepy-countdown` npm package, written for a
first-time package author. The first half explains how npm packages work in
general; the second half maps those ideas onto the concrete files we'll create.

---

## Part 1 — How npm packages work in general

### What an npm package actually is

An npm package is just a folder with a `package.json` file at its root. That's the
only hard requirement. `package.json` is the manifest — it tells npm the package's
name, version, what files to ship, what code runs when someone `import`s it, and
what other packages it depends on.

When you run `npm publish`, npm zips up your folder (minus ignored files) and uploads
it to the registry. When someone runs `npm install sleepy-countdown`, they get that
zip unpacked into their `node_modules/`. So the mental model is simple: **you are
shipping a folder, and `package.json` is the label on the box.**

### The source vs. published distinction

This is the single most important concept and the one that trips up beginners.

- **Source code** is what *you* write: modern JSX/TSX, TypeScript, multiple files,
  comments. It is convenient for humans but not directly runnable by every consumer.
- **Published code** (often called the "build" or "dist") is what *consumers* run:
  plain JavaScript that has been compiled, bundled, and stripped of TypeScript types.

You do not ship your source directly. You run a **build step** that transforms
`src/` into `dist/`, and you publish `dist/`. The consumer never sees your JSX —
they see compiled JS plus a `.d.ts` type-definitions file so their editor still gets
autocomplete.

```
  src/ (you write)  --[build tool]-->  dist/ (consumers install)
```

### Module formats: ESM vs CJS

JavaScript has two competing ways to share code between files:

- **ESM** (ES Modules): `import x from 'y'` / `export ...`. The modern standard.
- **CJS** (CommonJS): `const x = require('y')` / `module.exports = ...`. The older
  Node.js style, still widely used.

A good library ships **both**, so it works no matter how the consumer's project is
set up. You don't write both by hand — the build tool emits both from one source.
`package.json` then points each format at the right file via the `exports` field.

### Dependencies, devDependencies, and peerDependencies

`package.json` lists three kinds of dependencies, and the difference matters a lot
for a React component library:

- **`dependencies`** — packages your code needs *at runtime* and that should be
  installed automatically alongside yours. Keep this list small.
- **`devDependencies`** — tools you need only to *build and test* the package
  (the bundler, TypeScript, the test runner). These are **not** installed for
  consumers. They're for you, the author.
- **`peerDependencies`** — packages you expect the *consumer's app* to already
  provide. For a React component, **React itself is a peer dependency**. You must
  not bundle your own copy of React, because if the consumer's app and your library
  each loaded a separate React, hooks would break. You say "I need React 18+, but
  *you* bring it."

### Versioning (semver)

Versions look like `MAJOR.MINOR.PATCH`, e.g. `1.4.2`:

- **PATCH** (`1.4.2` → `1.4.3`): bug fixes, no API change.
- **MINOR** (`1.4.2` → `1.5.0`): new features, backwards-compatible.
- **MAJOR** (`1.4.2` → `2.0.0`): breaking changes.

Start at `0.1.0` while the API is still settling — the leading `0` signals
"anything may change." Bump with `npm version patch|minor|major`, which also creates
a git tag.

### The typical authoring lifecycle

```
  write src/  →  npm run build  →  test it  →  npm version  →  npm publish
```

You'll iterate the first three many times before the first publish. A useful trick
for testing your package inside a real app before publishing is `npm link` (or
`npm pack`, which produces the exact tarball that would be published so you can
install it locally).

---

## Part 2 — The file structure for `sleepy-countdown`

Here is the layout we'll build. Files marked *(generated)* are produced by the build
step and should **not** be edited by hand or committed to git.

```
sleepy-countdown/
├── package.json            # the manifest — the heart of the package
├── tsconfig.json           # TypeScript compiler settings
├── tsup.config.ts          # build-tool config (bundles src/ → dist/)
├── README.md               # what users see on the npm page
├── LICENSE                 # open-source license text
├── .gitignore              # keep node_modules/ and dist/ out of git
├── .npmignore              # (optional) extra files to exclude from publish
│
├── src/                    # ← all source code you write lives here
│   ├── index.ts            # public entry point — re-exports the public API
│   ├── SleepyCountdown.tsx # the main React component (orchestrator)
│   ├── CountdownFrame.tsx  # shared layout: title → description → slot for timer
│   ├── types.ts            # shared TypeScript types (props, enums)
│   ├── useCountdown.ts     # a custom hook holding the timer logic
│   ├── styles/             # styling for each visual variant + shared frame
│   │   ├── frame.css       # shared layout + the --sleepy-countdown-* theming variables
│   │   ├── modern.css
│   │   ├── classic.css
│   │   └── minimal.css
│   └── variants/           # one component per `type` prop value
│       ├── ModernCountdown.tsx
│       ├── ClassicCountdown.tsx
│       └── MinimalCountdown.tsx
│
├── dist/                   # (generated) the published, compiled output
│   ├── index.js            #   ESM build
│   ├── index.cjs           #   CommonJS build
│   └── index.d.ts          #   TypeScript type definitions
│
├── examples/               # a tiny demo app to develop against (not published)
│   └── App.tsx
│
└── tests/                  # automated tests (not published)
    └── SleepyCountdown.test.tsx
```

### What each top-level file does

**`package.json`** — the manifest. Key fields for *this* package:

```jsonc
{
  "name": "sleepy-countdown",
  "version": "0.1.0",
  "type": "module",                 // treat .js as ESM by default
  "main": "./dist/index.cjs",       // entry for CommonJS consumers
  "module": "./dist/index.js",      // entry for ESM consumers
  "types": "./dist/index.d.ts",     // entry for TypeScript types
  "exports": {                      // modern, precise entry map
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],                // ONLY ship dist/ — not src/, tests/, etc.
  "sideEffects": ["**/*.css"],      // CSS imports DO have side effects (style injection);
                                    // marking them keeps bundlers from tree-shaking styles away
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",          // rebuild the library on change
    "demo": "vite",                 // run the live demo app in examples/
    "test": "vitest"
  },
  "peerDependencies": {             // consumer's app must provide React
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {              // your build/test tooling only
    "tsup": "...",
    "typescript": "...",
    "vitest": "...",
    "react": "...",                 // for local dev & tests
    "react-dom": "..."
  }
}
```

Note React appears in **both** `peerDependencies` (what consumers must supply) and
`devDependencies` (so *you* can run the demo and tests). It is deliberately **not**
in `dependencies` — that's the rule for component libraries.

**`tsconfig.json`** — tells TypeScript how to type-check (and, with our setup, how to
emit `.d.ts` files). Important flags: `"jsx": "react-jsx"`, `"declaration": true`,
`"strict": true`.

**`tsup.config.ts`** — config for [tsup](https://tsup.egoist.dev/), a zero-config
bundler built on esbuild. It's the recommended easy choice for a first library: point
it at `src/index.ts` and tell it to emit ESM + CJS + `.d.ts`. (Alternatives you may
see elsewhere: Rollup, Vite library mode, or microbundle — tsup is the simplest.)

**`README.md`** — rendered on the package's npmjs.com page. Should show install
command, a minimal usage example, and the full prop table (`target`, `resolution`,
`type`).

**`LICENSE`** — pick one (MIT is the common default for small open-source libraries).

**`.gitignore`** — must include `node_modules/` and `dist/` (dist is regenerated by
the build, so it doesn't belong in source control).

### What each `src/` file does

- **`index.ts`** — the *public API surface*. It does nothing but re-export what
  consumers are allowed to use:
  ```ts
  export { SleepyCountdown } from './SleepyCountdown';
  export type { SleepyCountdownProps, Resolution, CountdownType } from './types';
  ```
  Anything you *don't* export here is effectively private. This file is what
  `package.json`'s `exports` field ultimately points at (through the build).

- **`types.ts`** — the prop contract from `SPEC.md`, expressed as TypeScript:
  ```ts
  export type Resolution = 'day' | 'hour' | 'minute' | 'second';
  export type CountdownType = 'modern' | 'classic' | 'minimal';
  export interface SleepyCountdownProps {
    target: Date;
    resolution?: Resolution;       // default 'day'
    end_message?: string;          // default 'Countdown has ended.'; replaces the timer
    title?: string;                // shown at the top
    description?: string;          // muted text below the title
    type?: CountdownType;          // default 'modern'
  }
  ```

- **`useCountdown.ts`** — a custom hook that owns the *logic*: it computes the time
  remaining until `target` and ticks on an interval, returning the days/hours/
  minutes/seconds. Keeping logic in a hook separates "how the countdown works" from
  "how it looks," so all three visual variants can share it.

- **`SleepyCountdown.tsx`** — the main component / orchestrator. It calls
  `useCountdown`, decides what to show, and wires the pieces together: it renders
  the shared `CountdownFrame` (title + description) and, inside it, either the
  matching variant timer (filtered by `resolution`) or — once the countdown reaches
  zero — the `end_message` in the timer's place.

- **`CountdownFrame.tsx`** — the shared layout wrapper mandated by the spec's visual
  requirements: `title` at the top, `description` (muted) under it, and a slot below
  for whatever the timer area should show. All three variants live inside this same
  frame, so the title/description layout is written once instead of three times.

- **`variants/*.tsx`** — one presentational component per design (`modern`,
  `classic`, `minimal`). They receive already-computed numbers and render *only the
  timer* (the frame handles title/description). This matches the three `type`
  options in the spec.

- **`styles/*.css`** — plain CSS files with `sleepy-`-prefixed class names (e.g.
  `.sleepy-countdown`, `.sleepy-modern__value`). `frame.css` holds the
  title/description/timer layout plus the `--sleepy-countdown-*` theming variables; one file
  per variant holds that design's look. Two visual rules from the spec live here:
  **(1)** the timer area must keep the same size when the countdown ends and
  `end_message` replaces it — so the end state is styled to occupy the same box
  rather than collapsing the layout; and **(2)** the timer must always render at the
  same size regardless of `resolution` or `type` — so the frame fixes the timer's
  dimensions, and neither dropping finer units nor switching design styles is allowed
  to reflow it.

  **Why plain prefixed CSS, not CSS Modules?** Our theming contract (see
  [style_inheritence.md](./style_inheritence.md)) lets consumers override colors via
  `.sleepy-countdown { --sleepy-countdown-accent: ... }`. That depends on *stable, predictable*
  class names — but CSS Modules deliberately hash class names to scope them locally,
  which would hide them from consumers and break those overrides. A `sleepy-` prefix
  gives us the clash-avoidance benefit without losing the stable names. Each component
  `import`s its CSS, and the build (`tsup` with `injectStyle`) bundles the styles into
  the JS, so **consumers get styling automatically with no separate CSS import**.

### Folders that exist for *you*, not consumers

- **`examples/`** — a small demo app you render during development so you can see the
  component live (`npm run demo`, served by Vite). Excluded from the published
  package via the `files` field.
- **`tests/`** — automated tests (e.g. with Vitest + Testing Library). Also excluded
  from publish.

Because `package.json` has `"files": ["dist"]`, only `dist/` ships — `src/`,
`examples/`, and `tests/` stay in your repo but never reach consumers. This keeps
the installed package small.

---

## Summary of the workflow we'll follow

1. Scaffold the files above and fill in `package.json`.
2. Write the source in `src/`.
3. `npm run build` → produces `dist/`.
4. Develop visually against `examples/` and verify with `tests/`.
5. When happy: `npm version 0.1.0` → `npm publish`.

The guiding principle throughout: **write convenient source in `src/`, ship compiled
output from `dist/`, and let `package.json` wire the two together for consumers.**
