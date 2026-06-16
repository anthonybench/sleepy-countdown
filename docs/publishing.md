# Publishing — sharing the package with the world

The word you're looking for is **publish**: you *publish* a package to the **npm
registry** (the public database at <https://www.npmjs.com>), and from then on anyone
can `npm install sleepy-countdown`. (You "push" code to GitHub; you "publish" packages
to npm — two different services, see the FAQ at the bottom.)

This guide assumes you've already got the package building (`npm run build`) and tests
passing (`npm test`) — which they do.

---

## 1. Do you need an npm account? Yes.

Publishing requires a free account on the npm registry.

1. Go to <https://www.npmjs.com/signup> and create an account (username, email,
   password). The username becomes part of your public identity on the registry.
2. **Verify your email.** npm will not let you publish until the email on the account
   is verified — check your inbox and click the link.
3. **Turn on two-factor authentication (2FA).** Account Settings → enable 2FA with an
   authenticator app. npm increasingly requires this for publishing, and it protects
   your package from being hijacked. You'll enter a 6-digit code when you publish.

That's the only account you need. It's free, and public packages are free to publish
forever.

## 2. Log in from your terminal

Your computer needs to prove it's you before it can publish. Run:

```bash
npm login
```

It opens a browser to authenticate (or prompts for username/password/2FA in older
npm versions). Confirm it worked with:

```bash
npm whoami        # should print your npm username
```

You only have to do this once per machine (the credentials are saved in `~/.npmrc`).

## 3. Claim the name (check it's available)

Package names on npm are **globally unique and first-come-first-served**. Before you
get attached to `sleepy-countdown`, check whether it's taken:

```bash
npm view sleepy-countdown
```

- **"404 / not found"** → the name is free, you can have it. 🎉
- **It prints package info** → someone already owns that name. You'll need to either
  pick a different name (edit `name` in `package.json`) or publish under a **scope**
  tied to your username, e.g. `@yourusername/sleepy-countdown`. Scoped names are
  always available to you because they live under your namespace.

> If you go scoped, your install command becomes `npm install @yourusername/sleepy-countdown`,
> and you must publish with `--access public` (see step 6) because scoped packages are
> private by default.

## 4. A pre-flight checklist

A few things that are easy to get wrong the first time:

- **`version`** — npm refuses to publish a version that already exists. Your first
  publish uses `0.1.0` (what's in `package.json` now). Every later publish needs a
  *new, higher* version (see step 7).
- **`files`** — `package.json` lists `"files": ["dist"]`, so only the built output
  ships. Good: consumers don't download your `src/`, `tests/`, or `examples/`.
- **Build freshness** — the package ships `dist/`, which is git-ignored and built on
  demand. You've wired a `prepublishOnly` script (`npm test && npm run build`) that npm
  runs **automatically** right before publishing, so you can never accidentally publish
  stale or untested code.
- **`README.md`** — this becomes the package's front page on npmjs.com. Yours is ready.
- **`LICENSE`** — present (MIT), so people know they're allowed to use it.

## 5. Preview exactly what will ship (no account needed)

Before the real thing, do a dry run. This builds the tarball npm *would* upload and
lists its contents, without publishing anything:

```bash
npm publish --dry-run
```

Read the file list it prints. You should see `dist/…`, `package.json`, `README.md`, and
`LICENSE` — and **not** see `src/`, `node_modules/`, `tests/`, or `examples/`. If
something's wrong, fix `files` in `package.json` and dry-run again.

(`npm pack` does the same but leaves a real `.tgz` on disk you can inspect or
`npm install ./that-file.tgz` into a test app — the closest thing to being a real
consumer before going live.)

## 6. Publish 🚀

When the dry run looks right:

```bash
npm publish
```

…and for a **scoped** name (`@you/sleepy-countdown`), the registry needs to be told
it's a public package, or it'll try to publish it privately (which needs a paid plan):

```bash
npm publish --access public
```

npm will run your `prepublishOnly` (test + build), ask for your 2FA code, upload the
tarball, and within a minute the package is live at
`https://www.npmjs.com/package/sleepy-countdown`. Anyone can now:

```bash
npm install sleepy-countdown
```

## 7. Publishing updates (versioning)

You can't overwrite a published version — you publish a **new** one. Use `npm version`,
which bumps `package.json`, commits, and creates a git tag in one step. Pick the bump
per [semver](https://semver.org):

```bash
npm version patch   # 0.1.0 → 0.1.1   bug fixes
npm version minor   # 0.1.0 → 0.2.0   new features, backwards-compatible
npm version major   # 0.1.0 → 1.0.0   breaking changes
npm publish
```

Typical update loop: make changes → `npm version patch` → `npm publish`. While the API
is still young, staying on `0.x` signals "things may still change."

## 8. Made a mistake? (unpublish — carefully)

npm strongly discourages removing published versions because other people's projects
may already depend on them. Within **72 hours** of publishing you *can* remove a
version:

```bash
npm unpublish sleepy-countdown@0.1.0
```

After 72 hours it's effectively permanent. The better fix for a bad release is almost
always to **publish a corrected higher version** rather than unpublish. If a version is
broken but you don't want to remove it, you can `npm deprecate` it with a message
pointing users to the fixed version.

---

## FAQ

**Is "publishing to npm" the same as "pushing to GitHub"?**
No. GitHub stores your *source code and history* (you `git push` to it). npm stores the
*built, installable package* (you `npm publish` to it). Many libraries do both — source
on GitHub, releases on npm — but they're independent. You can publish to npm without
GitHub, and vice versa. Linking them is optional but nice: set a `"repository"` field in
`package.json` so npmjs.com shows a link back to your GitHub repo.

**Does it cost anything?** No. Public packages are free to publish and free to install.
(npm only charges for *private* packages.)

**Can I try it privately first?** Yes — `npm publish --dry-run` and `npm pack` (step 5)
let you rehearse the whole thing and inspect the output without anything going public.

**What if I want automated publishing later?** You can publish from CI (e.g. a GitHub
Action on every git tag) using an npm **automation token** instead of interactive login,
and add **provenance** (`npm publish --provenance`) so consumers can verify the package
was built from your public source. That's an optional upgrade once manual publishing
feels comfortable.

## TL;DR

```bash
npm login                 # once per machine (needs a verified npm account + 2FA)
npm view sleepy-countdown # check the name is free
npm publish --dry-run     # preview what ships
npm publish               # go live  (add --access public if the name is @scoped)
# later, for updates:
npm version patch && npm publish
```
