# dating.zhumian.ca Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build dating.zhumian.ca, a bilingual one-page "Mian as an Apple product" site. It is a separate static Vite app in `dating/`, deployed as a second Firebase Hosting site.

**Architecture:** `dating/index.html` holds the static markup, taken from the approved mockup. Font Awesome icons are inlined into the HTML at build time. A handful of small plain-JS modules (i18n, photos, mail, deck, slideshow, effects, analytics) are wired by `main.js`. Photos are discovered with `import.meta.glob` and resized and stripped of metadata by vite-imagetools. Fonts and icons are all self-hosted from the build output. Nothing in the existing resume app (`src/`, root `index.html`, root `vite.config.js`) changes.

**Tech Stack:**
- Vite 6.3 (already installed) with plain JS, no React
- vite-imagetools 7.1 (sharp)
- vitest 3.2 + jsdom
- `@fortawesome/free-solid-svg-icons` and `@fortawesome/free-regular-svg-icons` 6.7, used as path data only (no svg-core)
- Fonts: `@fontsource-variable/fraunces`, `@fontsource-variable/geist`, `@fontsource/noto-sans-sc`, `@chinese-fonts/lxgwwenkai@3.0.0`
- `@microsoft/clarity` (already installed)
- Firebase Hosting multi-site

**Spec:** [docs/superpowers/specs/2026-11-12-dating-site-design.md](../specs/2026-11-12-dating-site-design.md). The visual source of truth is [docs/superpowers/specs/assets/2026-11-12-dating-site-mockup.html](../specs/assets/2026-11-12-dating-site-mockup.html). Read both before starting any task. Where the spec and the mockup disagree, the spec wins.

## Global Constraints

**Fonts and icons**
- No runtime requests to Google Fonts, jsdelivr, cdnjs, unpkg or any other CDN. Every font and icon ships in `dist-dating/`. Clarity is the only external script.
- No emoji anywhere, including in source strings, toasts, mail subjects and alt text.
- Use Font Awesome **6** Free only: pin `^6.7.2`, not 7.
- LXGW WenKai Medium is weight 400 only. Never set `font-weight` above 400 on any element that uses it, and add `font-synthesis: none` to it.

**Copy and design**
- Copy comes verbatim from spec §7 (and from the mockup's `T` object, which matches it). Do not reword it. Any new string written in this plan is marked **NEW** and listed in Task 9 for Mian to review.
- Use the colors and tokens exactly as in spec §3. No purple. No dark mode.
- The breakpoint is `834px` (`min-width: 834px` = desktop). The container is max 1120px with 20/40px padding. There must be no horizontal scroll at 320px.
- Easing values: spring `cubic-bezier(.34,1.56,.64,1)`, ease-out `cubic-bezier(.22,.8,.2,1)`.

**Language, contact and photos**
- `localStorage` key `lang`. `<html lang>` is `en` or `zh-CN`. Wrap every storage access in try/catch.
- The email comes from `VITE_EMAIL` in the repo-root `.env`. The build fails if it is missing.
- The Clarity ID comes from `VITE_DATING_CLARITY_ID`. When it is missing, Clarity is skipped silently.
- Mail subjects: cart is `I'd like to add you to my cart` / `我想把你加入购物车`; contact is `Hi Mian` / `你好，朱勉`.
- Photo folders: `dating/photos/{hero,photography,drives,hiking,camping}/`. Hero images are 1600px on the long edge; slideshow images are 1200px. Output is AVIF + WebP with no EXIF or GPS data.

**Budgets and isolation**
- Total JS under 30 KB gzipped.
- The resume site must be unaffected: root `npm run build` still outputs `dist/` exactly as before.

**Commits**
- Work on branch `dating-site`. Never stage `src/App.jsx`, `src/App.css` or `.firebase/`. Those are Mian's unrelated uncommitted edits.

## Review Focus

1. **Photo file names and types Mian will actually drop in.** iPhone exports come as `IMG_0012.JPG` (uppercase), `.jpeg`, or HEIC, and numbering like `2.jpg` vs `10.jpg` must sort naturally. Uppercase extensions should be picked up, HEIC should fail with a clear message instead of a silent blank, and the order should be natural. Tests are in Task 4 (natural sort, uppercase extensions) and Task 8 (`check-dist` reports unsupported files in the photo folders).
2. **The mail button in WeChat, or on a desktop with no mail app.** `mailto:` often does nothing there. The visitor must still be able to reach Mian. In WeChat (`MicroMessenger` user agent), the toast shows the email address for 6s instead of trying `mailto:`. Tests are in Task 5.
3. **JavaScript fails or is slow (old WebView, blocked script).** The buttons must still be working `mailto:` links, and all text must be readable. The static HTML ships with English text and real `href`s in place; JS only enhances. Tests are in Task 3 (the raw HTML contains English copy and `mailto:` hrefs).
4. **Storage blocked (Safari private mode, some WeChat builds).** Detection still works, and switching still works for the session. Tests are in Task 2.
5. **Rapid repeated taps on the deck, cart or slideshow arrows.** The deck must not desync or show two cards on top, toasts must not stack, and the slideshow must not overshoot past the ends. Tests are in Task 5 (deck lock while animating, toast timer reset) and Task 6 (clamp).

---

## File structure

```
dating/
  index.html                 static markup (mockup body), meta, OG, fallback hrefs
  vite.config.js             root=dating, envDir=.., outDir=../dist-dating, plugins
  build/fa-inline.js         Vite plugin: <i data-fa="solid:camera"> → inline <svg>
  build/require-env.js       throws if VITE_EMAIL missing
  public/robots.txt
  public/og.png              1200×630 link preview (generated in Task 7)
  og/og.html                 source page for og.png (not deployed)
  photos/{hero,photography,drives,hiking,camping}/.gitkeep
  src/main.js                wiring only
  src/i18n.js                T dictionary + language logic
  src/icons.js               Font Awesome path data → svg strings
  src/photos.js              list sorting + slide/card markup (pure)
  src/photo-sets.js          import.meta.glob calls (Vite-only)
  src/mail.js                mailto building + WeChat detection
  src/deck.js                hero photo deck
  src/slideshow.js           hobby slideshows
  src/effects.js             burst (hearts), toast, jelly, reveal
  src/analytics.js           Clarity loader + track()
  src/styles/fonts.css       self-hosted font imports + family stacks
  src/styles/base.css        tokens, layout, sections (from mockup <style>)
  src/styles/motion.css      keyframes, reveal, reduced-motion
  tests/*.test.js
  scripts/check-dist.mjs     post-build budget/privacy/CDN checks
  README.md                  photos, env, deploy, DNS steps for Mian
```

---

### Task 1: Scaffold the dating app and test runner

**Files:**
- Create: `dating/vite.config.js`, `dating/build/require-env.js`, `dating/index.html` (minimal placeholder), `dating/src/main.js` (empty), `dating/photos/*/.gitkeep`, `dating/tests/require-env.test.js`
- Modify: `package.json` (scripts and devDeps), `.gitignore` (add `dist-dating`), `eslint.config.js` (ignore `dist-dating`)

**Interfaces:**
- Produces: `requireEnv(env: Record<string,string|undefined>, names: string[]): void`, which throws `Error("Missing env: VITE_EMAIL")` listing every missing name. Also produces the npm scripts `dev:dating`, `build:dating`, `test:dating`, `check:dating` and `preview:dating`.

- [ ] **Step 1: Install the dev dependencies.**
  Run `npm i -D vitest@^3.2 jsdom vite-imagetools@^7.1 @fortawesome/free-solid-svg-icons@^6.7.2 @fortawesome/free-regular-svg-icons@^6.7.2 @fontsource-variable/fraunces @fontsource-variable/geist @fontsource/noto-sans-sc @chinese-fonts/lxgwwenkai@3.0.0`.
  Expected: it installs without peer warnings about vite.
- [ ] **Step 2: Write the failing test** in `dating/tests/require-env.test.js`.

```js
import { requireEnv } from '../build/require-env.js'
test('throws naming each missing var', () => {
  expect(() => requireEnv({}, ['VITE_EMAIL'])).toThrow('Missing env: VITE_EMAIL')
  expect(() => requireEnv({ VITE_EMAIL: ' ' }, ['VITE_EMAIL'])).toThrow('VITE_EMAIL')
})
test('passes when present', () => {
  expect(() => requireEnv({ VITE_EMAIL: 'a@b.c' }, ['VITE_EMAIL'])).not.toThrow()
})
```

- [ ] **Step 3: Add the scripts to `package.json`.**
  - `"dev:dating": "vite --config dating/vite.config.js"`
  - `"build:dating": "vite build --config dating/vite.config.js && node dating/scripts/check-dist.mjs"`. Until Task 8, leave out `&& node …`.
  - `"preview:dating": "vite preview --config dating/vite.config.js"`
  - `"test:dating": "vitest run --config dating/vite.config.js"`

  Then run `npm run test:dating`.
  Expected: FAIL, module not found.
- [ ] **Step 4: Implement `requireEnv`.** Treat blank strings as missing.
- [ ] **Step 5: Write `dating/vite.config.js`.**
  - Use `defineConfig(({ mode }) => …)`.
  - Settings: `root: __dirname` (via `fileURLToPath(new URL('.', import.meta.url))`), `envDir: '..'`, `publicDir: 'public'`, `build.outDir: '../dist-dating'`, `build.emptyOutDir: true`.
  - Plugins: `imagetools()`.
  - In `build` mode only, call `requireEnv(loadEnv(mode, '..'), ['VITE_EMAIL'])`.
  - `test: { environment: 'jsdom', include: ['tests/**/*.test.js'], globals: true }`.
- [ ] **Step 6: Run the tests.**
  Run `npm run test:dating`.
  Expected: PASS (2).
- [ ] **Step 7: Verify the resume site is untouched.**
  Run `npm run build && npm run build:dating`.
  Expected: both succeed. `dist/index.html` still contains the resume app, and `dist-dating/index.html` exists. Run `git status` and confirm that `dist-dating` is ignored.
- [ ] **Step 8: Commit.**
  Run `git add package.json package-lock.json .gitignore eslint.config.js dating && git commit -m "feat(dating): scaffold separate Vite app and test runner"`.

---

### Task 2: Translation module

**Files:**
- Create: `dating/src/i18n.js`, `dating/tests/i18n.test.js`

**Interfaces:**
- Produces:
  - `T: { en: Record<string,string>, zh: Record<string,string> }`
  - `pickLang(saved: string|null, navLang?: string): 'en'|'zh'`
  - `readSavedLang(storage?: Storage): string|null`
  - `saveLang(lang, storage?): void`
  - `t(lang, key, vars?: Record<string,string>): string`, which replaces `{name}` placeholders
  - `applyLang(doc: Document, lang): void`
- The markup contract that `applyLang` fills in:
  - `[data-i]` → `textContent`
  - `[data-h]` → `innerHTML`
  - `[data-aria]` → `aria-label`
  - `[data-alt]` → `alt`, which lets photo alt text switch language
  - `.lang [data-l]` → class `on` plus `aria-pressed`
  - `<html lang>`: `en` or `zh-CN`
  - `document.title` = `T[lang].name`
  - `meta[name=description]` content = `T[lang].metaDesc`

- [ ] **Step 1: Write the failing tests.**

```js
import { T, pickLang, readSavedLang, saveLang, t, applyLang } from '../src/i18n.js'
test('both languages have identical keys', () => {
  expect(Object.keys(T.zh).sort()).toEqual(Object.keys(T.en).sort())
})
test('pickLang', () => {
  expect(pickLang('zh', 'en-US')).toBe('zh')
  expect(pickLang(null, 'zh-TW')).toBe('zh')
  expect(pickLang(null, 'en-CA')).toBe('en')
  expect(pickLang(null, undefined)).toBe('en')
  expect(pickLang('fr', 'zh-CN')).toBe('zh') // invalid saved value ignored
})
test('storage that throws is tolerated', () => {
  const bad = { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') } }
  expect(readSavedLang(bad)).toBeNull()
  expect(() => saveLang('zh', bad)).not.toThrow()
})
test('t interpolates', () => {
  expect(t('zh', 'toastEmail', { email: 'a@b.c' })).toBe('我的邮箱：a@b.c')
})
test('applyLang updates document', () => {
  document.documentElement.innerHTML = `<head><title></title><meta name="description" content=""></head>
    <body><span data-i="status"></span><p data-h="tagline"></p><button data-aria="ariaCart"></button>
    <div class="lang"><button data-l="en"></button><button data-l="zh"></button></div></body>`
  applyLang(document, 'zh')
  expect(document.documentElement.lang).toBe('zh-CN')
  expect(document.title).toBe('朱勉')
  expect(document.querySelector('[data-i=status]').textContent).toBe('现货 · 目前单身')
  expect(document.querySelector('[data-h=tagline] em').textContent).toBe('也很会疼人。')
  expect(document.querySelector('meta[name=description]').content).toBe('会逗你开心，也很会疼人。')
  expect(document.querySelector('[data-l=zh]').getAttribute('aria-pressed')).toBe('true')
})
test('no emoji in any string', () => {
  const all = [...Object.values(T.en), ...Object.values(T.zh)].join('')
  expect(/\p{Extended_Pictographic}/u.test(all)).toBe(false)
})
```

- [ ] **Step 2: Run the tests.**
  Run `npm run test:dating -- i18n`.
  Expected: FAIL.
- [ ] **Step 3: Implement `i18n.js`.**

  Copy both `T` objects verbatim from the mockup's `<script>`. The tagline mark stays `<span class='mark'><em>…</em></span>`.

  Add these keys:
  - `metaDesc` = the tagline text without markup.
  - `alt`: "Photo of Mian" / "朱勉的照片".
  - `ariaCart`: "Cart" / "购物车".
  - `ariaPrev` / `ariaNext`: "Previous photo" / "上一张", "Next photo" / "下一张".
  - `ariaDot`: "Photo {n}" / "第 {n} 张".
  - `ariaDeck`: "Next photo" / "换一张".
  - **NEW** `mailBodyCart`: "Hi Mian,\n\nI saw your page and I'd like to add you to my cart." / "朱勉你好，\n\n看了你的主页，想把你加入购物车。"
  - **NEW** `mailBodyMail`: "Hi Mian,\n\n" / "朱勉你好，\n\n"
  - **NEW** `toastEmail`: "My email: {email}" / "我的邮箱：{email}"

  Pass `storage` defaulting to `globalThis.localStorage`. Accessing that getter can itself throw, so wrap the access as well.
- [ ] **Step 4: Run the tests.**
  Run `npm run test:dating -- i18n`.
  Expected: PASS (6).
- [ ] **Step 5: Commit.**
  Commit message: `feat(dating): translation module`.

---

### Task 3: Build-time icons and the static page (markup, fonts, CSS)

**Files:**
- Create: `dating/src/icons.js`, `dating/build/fa-inline.js`, `dating/src/styles/{fonts,base,motion}.css`, `dating/tests/icons.test.js`, `dating/tests/markup.test.js`
- Modify: `dating/index.html`, `dating/vite.config.js` (add `faInline()`), `dating/src/main.js` (import CSS, call `applyLang`)

**Interfaces:**
- Consumes: `T` and `applyLang` from Task 2.
- Produces:
  - `faSvg(name: string, cls?: string): string`. `name` is `'solid:camera'` or `'regular:envelope'`. It returns `<svg class="fa {cls}" viewBox="0 0 W H" aria-hidden="true" focusable="false"><path fill="currentColor" d="…"/></svg>` and throws `Unknown icon: x` for anything outside the map.
  - `ICON_NAMES: string[]`.
  - `faInline(): Plugin`. Its `transformIndexHtml` replaces every `<i data-fa="set:name" …attrs></i>` with `faSvg` output and keeps the `class` and `style` attrs.
- The icon map, which is exactly spec §3:
  - solid: bag-shopping, chevron-right, chevron-left, camera, car-side, person-hiking, campground, ruler-vertical, weight-scale, location-dot, earth-asia, language, ban-smoking, wine-glass, battery-full, shield-heart, heart, star
  - regular: hand-pointer, envelope

- [ ] **Step 1: Write the failing tests.**

```js
// icons.test.js
import { faSvg, ICON_NAMES } from '../src/icons.js'
import { faInline } from '../build/fa-inline.js'
test('renders an svg', () => {
  const s = faSvg('solid:camera', 'x')
  expect(s).toMatch(/^<svg class="fa x" viewBox="0 0 \d+ \d+"/)
  expect(s).toContain('aria-hidden="true"')
})
test('unknown icon throws', () => { expect(() => faSvg('solid:rocket')).toThrow('Unknown icon: solid:rocket') })
test('plugin inlines and leaves no <i data-fa>', () => {
  const out = faInline().transformIndexHtml('<p><i data-fa="solid:heart" class="h"></i></p>')
  expect(out).toContain('<svg class="fa h"'); expect(out).not.toContain('data-fa')
})
test('every spec icon is mapped', () => { expect(ICON_NAMES).toHaveLength(20) })
```

```js
// markup.test.js — reads dating/index.html as raw text and as DOM
import fs from 'node:fs'; import { T } from '../src/i18n.js'
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const doc = new DOMParser().parseFromString(html, 'text/html')
test('every data-i/data-h/data-aria key exists in T', () => {
  const keys = [...doc.querySelectorAll('[data-i],[data-h],[data-aria]')]
    .map(e => e.dataset.i ?? e.dataset.h ?? e.dataset.aria)
  for (const k of keys) expect(T.en, k).toHaveProperty(k)
})
test('no-JS fallback: English text and mailto hrefs are in the raw HTML', () => {
  expect(doc.querySelector('[data-i=status]').textContent).toBe('In stock · Currently single')
  const acts = [...doc.querySelectorAll('a[data-act]')]
  expect(acts).toHaveLength(4) // hero + CTA, cart + mail each
  for (const a of acts) expect(a.getAttribute('href')).toMatch(/^mailto:%VITE_EMAIL%\?subject=/)
})
test('no external font/icon/CDN URLs in source', () => {
  expect(html).not.toMatch(/googleapis|gstatic|jsdelivr|cdnjs|unpkg|font-awesome/)
})
test('anchors exist', () => { for (const id of ['box','features','specs']) expect(doc.getElementById(id)).not.toBeNull() })
```

- [ ] **Step 2: Run the tests.**
  Run `npm run test:dating -- icons markup`.
  Expected: FAIL.
- [ ] **Step 3: Implement `icons.js`.**
  Import the 20 definitions (`faCamera`, etc.) from `@fortawesome/free-solid-svg-icons` and `/free-regular-svg-icons`. Use `def.icon = [w, h, , , path]`. Only these imports are bundled, which keeps it tree-shaken.
- [ ] **Step 4: Implement `fa-inline.js`.**
  Use a regex replace on `<i\b([^>]*)\bdata-fa="([^"]+)"([^>]*)><\/i>` and keep the `class` and `style` from the attrs.
- [ ] **Step 5: Build `dating/index.html` from the mockup.**
  - Copy the `<body>` markup, then make these changes:
    - Replace every `<i class="fa-… fa-x">` with `<i data-fa="solid:x">`.
    - Fill every `data-i` element with its English text, and every `data-h` element with its English HTML. This is the no-JS fallback.
    - Turn the four `data-act` buttons into `<a class="btn …" data-act="cart|mail" href="mailto:%VITE_EMAIL%?subject=…">`. Use the encoded English subjects.
    - Give the cart button `data-aria="ariaCart"`.
    - Make the deck `role="button" tabindex="0" data-aria="ariaDeck"`.
    - Add `<div id="toast" role="status" aria-live="polite">`. Copy it from the mockup.
    - Leave the deck and `.show` containers empty. Task 4 fills them.
  - Copy the bonus app-icon SVGs and the two landmark SVGs byte-for-byte. Copy them from the spec's mockup asset, which is the final version.
  - Leave out the mockup's `<link>` tags.
  - `<head>`: charset, viewport, `<title>Mian</title>`, `<meta name="description" content="Makes you laugh. Gives great hugs.">`, and `<script type="module" src="/src/main.js">`. Task 7 adds OG and canonical.
- [ ] **Step 6: Move the CSS over.**
  - **`base.css`:** the mockup's `<style>` (tokens, layout, sections, including the "v8 override" font block, merged in rather than appended).
  - **`motion.css`:** the keyframes, the `.reveal`/`.in` rules, the jelly, ping, heart float and toast rules, plus a `@media (prefers-reduced-motion: reduce)` block. In that block, `*{animation:none!important;transition:none!important}` and `.reveal{opacity:1;transform:none}`.
  - Change `.fa-…` selectors to `.fa` / `svg.fa{width:1em;height:1em;vertical-align:-.125em}`.
  - **`fonts.css`:**
    - Import `@fontsource-variable/fraunces/full.css` and `full-italic.css` (the opsz axis), `@fontsource-variable/geist`, `@fontsource/noto-sans-sc/400.css` and `500.css`, and `@chinese-fonts/lxgwwenkai/dist/LXGWWenKai-Medium/result.css`.
    - Add `font-display: swap` overrides if a package lacks it.
    - Define the family vars `--f-display-en: "Fraunces Variable", Georgia, serif`, `--f-display-zh: "LXGW WenKai Medium", "Kaiti SC", STKaiti, serif`, `--f-ui: "Geist Variable", -apple-system, system-ui, sans-serif` and `--f-ui-zh: "PingFang SC", "Noto Sans SC", sans-serif`.
    - Map the mockup's family names onto these vars.
  - **Name layout shift:** set `.name{line-height:1;min-height:1em;white-space:nowrap}` so the font swap can't move content vertically.
- [ ] **Step 7: Write `main.js`.**
  Import the three CSS files. Call `applyLang(document, pickLang(readSavedLang(), navigator.language))`. Bind the `.lang [data-l]` click handlers to save the choice and re-apply.
- [ ] **Step 8: Run the tests.**
  Run `npm run test:dating`.
  Expected: all pass.
- [ ] **Step 9: Visual check against the mockup.**
  Run `npm run build:dating && npm run preview:dating -- --port 4174` in the background. Then take headless Edge screenshots of `http://localhost:4174/` at `--window-size=500,3200` and `1280,3400`. Take each one twice: once with `--lang=en-US` and once with `--lang=zh-CN`. The flag sets `navigator.language`, and a fresh `--user-data-dir` keeps any saved `lang` from interfering.

  Compare them side by side with screenshots of the mockup asset at the same sizes. Expected:
  - Identical section order, spacing, fonts and icons.
  - No horizontal overflow: a `--dump-dom` probe gives `scrollWidth === clientWidth`.
  - Chinese headlines use 霞鹜文楷, and no `em` breaks.

  Photo areas are empty at this stage, which is fine.
- [ ] **Step 10: Commit.**
  Commit message: `feat(dating): static page with self-hosted fonts and inline icons`.

---

### Task 4: Photo discovery and placeholders

**Files:**
- Create: `dating/src/photos.js`, `dating/src/photo-sets.js`, `dating/tests/photos.test.js`

**Interfaces:**
- Consumes: `faSvg` (Task 3).
- Produces:
  - `toPhotoList(glob: Record<string, Picture>): Picture[]`, sorted by basename with `localeCompare(b, undefined, {numeric:true, sensitivity:'base'})`. Here `Picture = { sources: Record<'avif'|'webp', string>, img: { src, w, h } }`, which is imagetools' `as=picture`.
  - `photoMarkup(p: Picture|null, opts: { index: number, total: number, alt: string, phLabel: string, eager: boolean }): string`. With a `Picture`, it returns `<picture>` with avif and webp `<source>` plus an `<img>` that has `alt`, `data-alt="alt"`, `width`, `height`, `loading="eager"|"lazy"` and `decoding="async"`. With `null`, it returns the placeholder `<div class="ph">{camera svg}<span class="pl" data-i="ph">{phLabel}</span><span>{index+1} / {total}</span></div>`.
  - `slotsFor(list: Picture[], placeholderCount: number): (Picture|null)[]` returns the list if it is non-empty, otherwise an array of `null`s.
  - `PHOTO_SETS: { hero, photography, drives, hiking, camping }`, each a `Picture[]`, in `photo-sets.js`.
  - `PLACEHOLDER_COUNTS = { hero: 4, photography: 4, drives: 3, hiking: 3, camping: 3 }`.
  - The `.show` elements get `data-set="photography|drives|hiking|camping"` in index.html.

- [ ] **Step 1: Write the failing tests.**

```js
import { toPhotoList, photoMarkup, slotsFor } from '../src/photos.js'
const pic = s => ({ sources: { avif: s+'.avif 1200w', webp: s+'.webp 1200w' }, img: { src: s+'.webp', w: 1200, h: 900 } })
test('natural, case-insensitive filename order', () => {
  const list = toPhotoList({ '/photos/hero/10.jpg': pic('c'), '/photos/hero/2.JPG': pic('b'), '/photos/hero/1.jpeg': pic('a') })
  expect(list.map(p => p.img.src)).toEqual(['a.webp', 'b.webp', 'c.webp'])
})
test('empty folder yields placeholders', () => { expect(slotsFor([], 3)).toEqual([null, null, null]) })
test('placeholder markup', () => {
  const h = photoMarkup(null, { index: 1, total: 3, alt: '', phLabel: '照片', eager: false })
  expect(h).toContain('照片'); expect(h).toContain('2 / 3'); expect(h).toContain('<svg')
})
test('picture markup is lazy with alt and dimensions', () => {
  const h = photoMarkup(pic('x'), { index: 0, total: 1, alt: '朱勉的照片', phLabel: '', eager: false })
  expect(h).toContain('type="image/avif"'); expect(h).toContain('alt="朱勉的照片"')
  expect(h).toContain('loading="lazy"'); expect(h).toContain('width="1200"')
})
```

- [ ] **Step 2: Run the tests.**
  Expected: FAIL.
- [ ] **Step 3: Implement `photos.js`.** Escape the `alt` attribute.
- [ ] **Step 4: Implement `photo-sets.js`.**
  - Hero uses `import.meta.glob('../photos/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, import: 'default', query: { w: '1600', format: 'avif;webp', as: 'picture' } })`.
  - The other four sets use the same call with `w: '1200'`.
  - Run each through `toPhotoList`.
  - Glob patterns must be literal strings (a Vite rule), so write five calls rather than a loop.
- [ ] **Step 5: Verify the metadata stripping.**
  Drop one phone JPG that has GPS EXIF into `dating/photos/hero/` (use any test photo with GPS; do not commit it). Run `npm run build:dating`. Then run `grep -c Exif dist-dating/assets/*.webp dist-dating/assets/*.avif`.
  Expected: `0` everywhere. Remove the test photo afterwards.
- [ ] **Step 6: Run the tests.**
  Expected: PASS.
- [ ] **Step 7: Commit.**
  Commit message: `feat(dating): photo discovery with placeholders`.

---

### Task 5: Hero deck, buttons, mail and effects

**Files:**
- Create: `dating/src/mail.js`, `dating/src/deck.js`, `dating/src/effects.js`, `dating/tests/mail.test.js`, `dating/tests/deck.test.js`, `dating/tests/effects.test.js`
- Modify: `dating/src/main.js`

**Interfaces:**
- Consumes: `t` and `T` (Task 2); `faSvg` (Task 3); `PHOTO_SETS`, `slotsFor`, `photoMarkup` and `PLACEHOLDER_COUNTS` (Task 4).
- Produces:
  - **`mail.js`:**
    - `mailtoHref(email: string, kind: 'cart'|'mail', lang): string`. It builds `mailto:${email}?subject=${enc(subject)}&body=${enc(t(lang, 'mailBody'+Cap(kind)))}`, where `enc = encodeURIComponent`.
    - `isWeChat(ua: string): boolean`, which tests `/MicroMessenger/i`.
  - **`deck.js`:**
    - `rotate(order: number[]): number[]` moves the first element to the end.
    - `DECK_POSE = { rot: [-3,4,-7,6], x: [0,10,-12,14] }`, with y = p×6 and scale = 1−p×.035. Cards at index > 2 get opacity 0.
    - `initDeck(el: HTMLElement, slots: (Picture|null)[], opts: { lang: () => string, reducedMotion: boolean, onNext: () => void }): { next(): void }`.
    - Card markup comes from `photoMarkup`. The first card is `eager: true`.
    - `next()` ignores calls while an animation is in flight (a 700ms lock, 0 under reduced motion).
    - Activated by click, Enter or Space.
  - **`effects.js`:**
    - `burst(x: number, y: number, host: HTMLElement): void` adds six `faSvg` heart/star nodes, using the spec colors `#1F6FEB #FFC93C #1F6FEB #E8735A #1D1D1F #FFC93C`, and removes them after 1600ms. It does nothing under reduced motion.
    - `showToast(text: string, ms = 2400): void` uses a single `#toast`, and each call resets the hide timer.
    - `jelly(el)` restarts the CSS class `bump`.
    - `initReveal(root, reducedMotion)` uses an IntersectionObserver with threshold .12 and rootMargin `0px 0px -40px 0px`, a 70ms stagger inside `.tiles`, `.core-list` and `.feat-grid`, and adds `.in` to everything immediately under reduced motion.
- `main.js` behavior for a `[data-act]` click:
  1. `preventDefault`.
  2. If cart: add `.has` to `#cart` and `jelly(#cart)`.
  3. If `isWeChat(navigator.userAgent)`: `showToast(t(lang,'toastEmail',{email}), 6000)` and stop.
  4. Otherwise `showToast(t(lang, kind==='cart'?'toastCart':'toastMail'))`, then after 900ms (cart) or 600ms (mail) set `location.href = mailtoHref(...)`.
  5. Track the event (Task 7 wires `track`; leave a `track` import stub that is a no-op until then).

  On every language switch, also refresh each `a[data-act]` `href` to the current language's `mailtoHref`.

- [ ] **Step 1: Write the failing tests.**

```js
// mail.test.js
import { mailtoHref, isWeChat } from '../src/mail.js'
test('cart subject zh is percent-encoded', () => {
  const h = mailtoHref('a@b.c', 'cart', 'zh')
  expect(h.startsWith('mailto:a@b.c?subject=')).toBe(true)
  expect(decodeURIComponent(h.split('subject=')[1].split('&')[0])).toBe('我想把你加入购物车')
})
test('contact subject en', () => {
  expect(decodeURIComponent(mailtoHref('a@b.c', 'mail', 'en').split('subject=')[1].split('&')[0])).toBe('Hi Mian')
})
test('wechat detection', () => {
  expect(isWeChat('Mozilla/5.0 (iPhone) MicroMessenger/8.0.50')).toBe(true)
  expect(isWeChat('Mozilla/5.0 (iPhone) Safari/604.1')).toBe(false)
})
```

```js
// deck.test.js
import { rotate, initDeck } from '../src/deck.js'
test('rotate', () => { expect(rotate([0,1,2,3])).toEqual([1,2,3,0]) })
test('rapid next() calls are ignored while animating', () => {
  vi.useFakeTimers(); document.body.innerHTML = '<div id="d"></div>'
  let n = 0; const d = initDeck(document.getElementById('d'), [null,null,null,null], { lang: () => 'en', reducedMotion: false, onNext: () => n++ })
  d.next(); d.next(); d.next(); expect(n).toBe(1)
  vi.advanceTimersByTime(800); d.next(); expect(n).toBe(2)
})
test('keyboard Enter advances', () => {
  document.body.innerHTML = '<div id="d" tabindex="0"></div>'; let n = 0
  initDeck(document.getElementById('d'), [null,null], { lang: () => 'en', reducedMotion: true, onNext: () => n++ })
  document.getElementById('d').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); expect(n).toBe(1)
})
```

```js
// effects.test.js
import { showToast } from '../src/effects.js'
test('toast timer resets on repeated calls', () => {
  vi.useFakeTimers(); document.body.innerHTML = '<div id="toast"><span></span></div>'
  showToast('a'); vi.advanceTimersByTime(2000); showToast('b'); vi.advanceTimersByTime(2000)
  const el = document.getElementById('toast')
  expect(el.classList.contains('show')).toBe(true); expect(el.textContent).toContain('b')
  vi.advanceTimersByTime(500); expect(el.classList.contains('show')).toBe(false)
})
```

- [ ] **Step 2: Run the tests.**
  Expected: FAIL.
- [ ] **Step 3: Implement `mail.js`, `effects.js` and `deck.js`.**
  - Base deck flight and layout on the mockup's `layoutDeck` and the click handler: translate(−120%,−6%) rotate(−24°), then reorder after 260ms.
  - The toast icon is `faSvg('regular:envelope')`.
  - Re-render the placeholder `.pl` labels on language change. Expose `initDeck(...).relabel()` if needed; an `applyLang` pass over `.pl` also works if you give them `data-i="ph"`, which is preferred.
- [ ] **Step 4: Wire everything in `main.js`.**
  - `const rm = matchMedia('(prefers-reduced-motion: reduce)').matches`.
  - Clicking deck cards calls `burst` at the tap point.
  - `email = import.meta.env.VITE_EMAIL`.
- [ ] **Step 5: Run the tests.**
  Run `npm run test:dating`.
  Expected: all pass.
- [ ] **Step 6: Manual check.**
  Use `npm run dev:dating` and the Edge DevTools device toolbar. Check that:
  - The deck flips with a spring.
  - The hearts float.
  - The cart badge springs in and the cart jellies.
  - The toast appears, and then the mail app opens with the correct subject in both languages.
  - With the user agent overridden to WeChat, the toast shows the address for 6s.
  - With reduced motion emulated, nothing animates and the deck simply swaps.
- [ ] **Step 7: Commit.**
  Commit message: `feat(dating): hero deck, cart/contact mail flow, effects`.

---

### Task 6: Hobby slideshows

**Files:**
- Create: `dating/src/slideshow.js`, `dating/tests/slideshow.test.js`
- Modify: `dating/src/main.js`

**Interfaces:**
- Consumes: `photoMarkup`, `slotsFor`, `PHOTO_SETS` and `PLACEHOLDER_COUNTS` (Task 4); `burst` (Task 5); `faSvg` (Task 3).
- Produces:
  - `clampIndex(i: number, n: number): number`.
  - `indexFromScroll(scrollLeft: number, width: number): number`, which is `Math.round` with a width-0 guard that returns 0.
  - `initSlideshow(el: HTMLElement, slots, opts: { alt: string, phLabel: string }): void`.
  - The markup follows the mockup: `.track > .slide*`, `button.arrow.prev/.next` with `data-aria="ariaPrev/ariaNext"`, and `.dots > button*` labelled with `t(lang,'ariaDot',{n})`.
  - All slides use `eager: false`. The active dot gets `.on` and `aria-current="true"`.
  - The arrows are disabled at the ends.

- [ ] **Step 1: Write the failing tests.**

```js
import { clampIndex, indexFromScroll, initSlideshow } from '../src/slideshow.js'
test('clamp', () => { expect(clampIndex(-1, 3)).toBe(0); expect(clampIndex(5, 3)).toBe(2) })
test('indexFromScroll guards zero width', () => { expect(indexFromScroll(300, 0)).toBe(0); expect(indexFromScroll(610, 300)).toBe(2) })
test('renders n slides and n dots, prev disabled at start', () => {
  document.body.innerHTML = '<div class="show" id="s"></div>'
  initSlideshow(document.getElementById('s'), [null, null, null], { alt: '', phLabel: 'Photo' })
  expect(document.querySelectorAll('.slide')).toHaveLength(3)
  expect(document.querySelectorAll('.dots button')).toHaveLength(3)
  expect(document.querySelector('.arrow.prev').disabled).toBe(true)
})
```

- [ ] **Step 2: Run the tests.**
  Expected: FAIL.
- [ ] **Step 3: Implement `slideshow.js`.**
  - Use the mockup's slideshow block as the base, with scroll-snap from `base.css`.
  - Use `scrollTo({behavior: rm ? 'auto' : 'smooth'})`.
  - Throttle scroll updates with `requestAnimationFrame`.
- [ ] **Step 4: Wire it in `main.js`.**
  For each `.show[data-set]`, call `initSlideshow(el, slotsFor(PHOTO_SETS[set], PLACEHOLDER_COUNTS[set]), …)`. Clicking a slide calls `burst`.
- [ ] **Step 5: Run the tests, then check by hand.**
  Run `npm run test:dating`; expected PASS. Then check in DevTools at phone size, swiping by touch emulation, and at desktop size with hover arrows.
- [ ] **Step 6: Commit.**
  Commit message: `feat(dating): hobby slideshows`.

---

### Task 7: Analytics, SEO and link preview

**Files:**
- Create: `dating/src/analytics.js`, `dating/tests/analytics.test.js`, `dating/public/robots.txt`, `dating/og/og.html`, `dating/public/og.png`
- Modify: `dating/index.html` (head), `dating/src/main.js`

**Interfaces:**
- Produces:
  - `loadAnalytics(id: string|undefined, loader = () => import('@microsoft/clarity')): Promise<void>`. It does nothing when `id` is falsy. Otherwise it waits for `load` plus `requestIdleCallback` (falling back to `setTimeout` 2000), then calls `Clarity.init(id)`. Any rejection is swallowed.
  - `track(name: 'add_to_cart'|'contact_me'|'lang_switch'|'deck_next', tags?: Record<string,string>): void`. Before load it queues events, capped at 20; after load it flushes them. For each tag it calls `Clarity.setTag(k, v)` before `Clarity.event(name)`.
  - `lang_switch` is sent with `{ lang }`.

- [ ] **Step 1: Write the failing tests.**

```js
import { loadAnalytics, track, _resetForTest } from '../src/analytics.js'
test('no id: loader never called', async () => {
  const loader = vi.fn(); await loadAnalytics(undefined, loader); expect(loader).not.toHaveBeenCalled()
})
test('queued events flush after load with tags', async () => {
  _resetForTest()
  const C = { init: vi.fn(), event: vi.fn(), setTag: vi.fn() }
  track('lang_switch', { lang: 'zh' })
  await loadAnalytics('abc', async () => ({ default: C }), { immediate: true })
  expect(C.init).toHaveBeenCalledWith('abc')
  expect(C.setTag).toHaveBeenCalledWith('lang', 'zh'); expect(C.event).toHaveBeenCalledWith('lang_switch')
})
test('loader failure is swallowed (Clarity blocked in China)', async () => {
  _resetForTest()
  await expect(loadAnalytics('abc', async () => { throw new Error('blocked') }, { immediate: true })).resolves.toBeUndefined()
  expect(() => track('deck_next')).not.toThrow()
})
```

  `opts.immediate` (a third parameter) skips the load/idle wait, for tests only.
- [ ] **Step 2: Run the tests.**
  Expected: FAIL.
- [ ] **Step 3: Implement `analytics.js` and wire it into `main.js`.**
  Call `loadAnalytics(import.meta.env.VITE_DATING_CLARITY_ID)` and replace the Task 5 `track` stub.
- [ ] **Step 4: Fill in the `<head>`.**
  - `<link rel="canonical" href="https://dating.zhumian.ca/">`
  - `og:type=website`, `og:url`, `og:title="Mian · In stock"`, `og:description="Makes you laugh. Gives great hugs."`, `og:image=https://dating.zhumian.ca/og.png` (1200×630)
  - `twitter:card=summary_large_image`
  - `<meta name="theme-color" content="#FFFFFF">`
  - A favicon: an inline SVG data-URI of a blue `#1F6FEB` rounded square with a white "M" in Georgia.
  - `robots.txt` contains `User-agent: *\nAllow: /\n`.
- [ ] **Step 5: Make `og.png`.**
  - Build `og/og.html` at 1200×630:
    - Background: the hero wash `#EEF4FC → #FFF`.
    - "New" with a sun dot.
    - "Mian" in Fraunces 600 at 200px, −0.045em.
    - The tagline in Fraunces italic with the yellow mark.
    - A green pulse dot with "In stock · Currently single" in Geist.
  - Reference the fonts from `node_modules` via relative paths.
  - Render it with `msedge --headless=new --screenshot=dating/public/og.png --window-size=1200,630 --hide-scrollbars file:///…/dating/og/og.html`.
  - Expected: a 1200×630 PNG that matches the page style. Show it to Mian before committing.
- [ ] **Step 6: Run the tests.**
  Expected: PASS.
- [ ] **Step 7: Commit.**
  Commit message: `feat(dating): Clarity analytics, SEO meta, OG image`.

---

### Task 8: Post-build checks

**Files:**
- Create: `dating/scripts/check-dist.mjs`, `dating/tests/check-dist.test.js`
- Modify: `package.json` (append `&& node dating/scripts/check-dist.mjs` to `build:dating`)

**Interfaces:**
- Produces: `checkDist(distDir: string, photosDir: string): string[]`, which returns a list of problems (an empty list means the build is OK). The CLI prints the problems and exits with code 1 if there are any. It checks:
  1. The total gzipped size of `assets/*.js` is under 30720 bytes.
  2. No file in dist contains `fonts.googleapis`, `fonts.gstatic`, `jsdelivr`, `cdnjs` or `unpkg`.
  3. No `.webp`, `.avif`, `.jpg` or `.png` in dist contains the ASCII `Exif` marker. `og.png` and favicons are included. Don't match `GPS`: three random bytes appear by chance in compressed data.
  4. `index.html` contains no `%VITE_EMAIL%` and does contain `mailto:`.
  5. `robots.txt` and `og.png` exist.
  6. Every file in the `photos/*/` folders other than `.gitkeep` has one of the extensions jpg, jpeg, png or webp (case-insensitive). Otherwise it reports `Unsupported photo (convert to JPG): photos/hero/IMG_1.HEIC`.

- [ ] **Step 1: Write the failing tests.**
  Build temporary fixture directories in `os.tmpdir()`.

```js
import { checkDist } from '../scripts/check-dist.mjs'
// helper mk(files: Record<string,string|Buffer>) writes a temp dir and returns its path
test('clean dist passes', () => { expect(checkDist(mk(cleanDist), mk({ 'hero/.gitkeep': '' }))).toEqual([]) })
test('flags CDN url', () => { expect(checkDist(mk({ ...cleanDist, 'assets/a.css': '@import url(https://fonts.googleapis.com/x)' }), emptyPhotos).join()).toMatch(/googleapis/) })
test('flags EXIF', () => { expect(checkDist(mk({ ...cleanDist, 'assets/p.webp': Buffer.from('RIFF....WEBPEXIFExif\0\0') }), emptyPhotos).join()).toMatch(/Exif/) })
test('flags unreplaced email', () => { expect(checkDist(mk({ ...cleanDist, 'index.html': '<a href="mailto:%VITE_EMAIL%">' }), emptyPhotos).join()).toMatch(/VITE_EMAIL/) })
test('flags HEIC in photos', () => { expect(checkDist(mk(cleanDist), mk({ 'hero/IMG_1.HEIC': 'x' })).join()).toMatch(/Unsupported photo/) })
test('flags JS over budget', () => { expect(checkDist(mk({ ...cleanDist, 'assets/a.js': randomBytes(40000) }), emptyPhotos).join()).toMatch(/30 KB/) })
```

- [ ] **Step 2: Run the tests.**
  Expected: FAIL.
- [ ] **Step 3: Implement `check-dist.mjs`.**
  Use `node:zlib` `gzipSync` and a recursive `readdirSync`. Run the CLI only when `import.meta.url === pathToFileURL(process.argv[1]).href`.
- [ ] **Step 4: Run the tests, then the real build.**
  Run `npm run test:dating && npm run build:dating`.
  Expected: tests PASS, and the build prints no problems and exits with code 0. Also run `npm run build` (the resume site) and confirm it still succeeds.
- [ ] **Step 5: Commit.**
  Commit message: `feat(dating): post-build budget, privacy and CDN checks`.

---

### Task 9: Firebase multi-site, docs and final verification

**Files:**
- Modify: `firebase.json`, `.firebaserc`
- Create: `dating/README.md`

**Interfaces:**
- `firebase.json`: `hosting` becomes an array.
  - `[{ target: "main", public: "dist", ignore: […same…], rewrites: [same] }, { target: "dating", public: "dist-dating", ignore: […same…], cleanUrls: true }]`.
  - The dating site has no SPA rewrite, so unknown paths return 404.
  - Its headers: `Cache-Control: public,max-age=31536000,immutable` on `/assets/**`, and `no-cache` on `/index.html`.

- [ ] **Step 1: Find the site IDs (read-only).**
  Run `npx firebase hosting:sites:list --project mian-site`.
  Expected: it lists the existing site ID (probably `mian-site`). **Stop and ask Mian** before running `firebase hosting:sites:create <id>`. Creating a site is outward-facing. Suggest the ID `zhumian-dating`.
- [ ] **Step 2: Wire the targets.**
  After Mian approves the site creation, run `npx firebase target:apply hosting main <main-site-id>` and `npx firebase target:apply hosting dating zhumian-dating`. These write the `targets` block into `.firebaserc`. Then edit `firebase.json` as described above.
- [ ] **Step 3: Verify both sites locally.**
  Run `npm run build && npm run build:dating && npx firebase emulators:start --only hosting`.
  Expected: both sites serve. The resume site behaves exactly as before.
- [ ] **Step 4: Write `dating/README.md` for Mian.** It covers:
  - Adding photos: which folder feeds which section, JPG/PNG only, how to convert HEIC on iPhone (Settings → Camera → Formats → Most Compatible, or export as JPG), and the fact that files sort by name.
  - Env: `VITE_EMAIL` (already in `.env`) and `VITE_DATING_CLARITY_ID` (create a new Clarity project at clarity.microsoft.com and paste its ID).
  - Commands: dev, test, build, and `npx firebase deploy --only hosting:dating`.
  - Custom domain steps: Firebase console → Hosting → zhumian-dating → Add custom domain → `dating.zhumian.ca`. Then add the TXT record and the A records (or CNAME) that Firebase shows, at the registrar for zhumian.ca. Then wait for SSL provisioning (up to 24h).
  - **NEW** strings awaiting Mian's review: `mailBodyCart`, `mailBodyMail`, `toastEmail` (Task 2).
- [ ] **Step 5: Final visual pass.**
  - Take headless Edge screenshots of the production build at 500×3200 and 1280×3400, in EN and ZH.
  - Compare them against the mockup.
  - Run a `--dump-dom` probe for no horizontal overflow.
  - Run a Lighthouse mobile run: `npx lighthouse http://localhost:4174 --preset=perf --form-factor=mobile --only-categories=performance,accessibility,seo --chrome-flags="--headless=new"`, with Edge set as `CHROME_PATH`. Expected: FCP under 1.5s, accessibility at least 95, SEO at least 95, and CLS under 0.05.
- [ ] **Step 6: Commit and hand off to Mian.**
  Commit message: `feat(dating): Firebase multi-site config and README`.

  Do **not** deploy or touch DNS. Ask Mian to:
  - review the screenshots, `og.png` and the NEW strings;
  - create the Clarity project;
  - say when he wants it deployed.
