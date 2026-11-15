# dating.zhumian.ca

The bilingual "Mian as an Apple product" page. It is a separate static Vite app that lives next to the resume site. Nothing in `src/` (the resume site) is shared.

Design: [../docs/superpowers/specs/2026-11-12-dating-site-design.md](../docs/superpowers/specs/2026-11-12-dating-site-design.md)

## Adding photos

Drop the photos into these folders. No code changes are needed.

| Folder | Where it shows |
|---|---|
| `photos/hero/` | The tilted photo deck at the top (4–6 photos looks best) |
| `photos/photography/` | Photography slideshow |
| `photos/drives/` | Scenic drives slideshow |
| `photos/hiking/` | Hiking slideshow |
| `photos/camping/` | Camping slideshow |

- **Formats:** use JPG, PNG or WebP. Uppercase `.JPG` is fine.
  - **HEIC (the iPhone default) won't work.** The build stops and names the file.
  - To get JPGs from an iPhone, either set *Settings → Camera → Formats → Most Compatible*, or AirDrop to a Mac, which converts automatically.
- **Order:** photos sort by file name, with numbers in natural order (`2.jpg` comes before `10.jpg`). Name them `01.jpg`, `02.jpg`… to control the order.
- **Empty folders:** a folder with no photos shows the gray placeholder.
- **Processing:** the build resizes photos (1600px for the hero, 1200px for slideshows), converts them to AVIF and WebP, and **removes location (GPS) and other metadata**. Your originals in these folders are not changed.
- **Privacy:** the photos are **not committed to git** (`.gitignore`). The GitHub repo is public, and phone originals contain GPS location. Builds and deploys run from your own machine, so this is all that's needed. Back the originals up somewhere else.

## Settings (`.env` at the repo root)

| Variable | What it is |
|---|---|
| `VITE_EMAIL` | The address the Add to Cart and Contact me buttons email. It is already set (shared with the resume site). The build fails if it is missing. |
| `VITE_WECHAT_QR` | The link inside your WeChat QR code (decoded from your original code). The build turns it into a crisp QR image with the WeChat logo. Leave it out to hide the QR. |
| `VITE_WECHAT_ID` | Your WeChat ID, shown with a Copy button. On a phone browser, copying also opens WeChat. |
| `VITE_DATING_CLARITY_ID` | Microsoft Clarity project ID for this site (a separate project from the resume site). Leave it out to turn analytics off. Events: visit (tagged lang, in_wechat), add_to_cart, contact_me, copy_wechat_id, write_email, share_open, save_card, share_link, deck_next, lang_switch. |


## Commands (run from the repo root)

```bash
npm run dev:dating       # local dev server
npm run test:dating      # unit tests
npm run build:dating     # build to dist-dating/ and run the checks below
npm run preview:dating   # serve the built site
```

`build:dating` fails if:
- the JS is over 30 KB gzipped;
- any file points at Google Fonts or a CDN (these are blocked in mainland China / WeChat);
- any image still has EXIF data;
- the email wasn't filled in;
- `robots.txt` or `og.png` is missing;
- a photo folder has an unsupported file.

## First deploy (one-time setup)

`firebase.json` now has two hosting targets: `main` (the resume site, `dist/`) and `dating` (`dist-dating/`). These steps make changes in Firebase and DNS, so only Mian runs them.

1. **Log in again.** The CLI credentials have expired. Run `firebase login --reauth`.
2. **Create the second site:** `firebase hosting:sites:create zhumian-dating --project mian-site`.
   - If that ID is taken, pick another one and change it in `.firebaserc` under `targets → hosting → dating`.
   - Also check that `main` in `.firebaserc` matches your existing site ID. Get the list with `firebase hosting:sites:list`. It is assumed to be `mian-site`.
3. **Deploy:** run `npm run build:dating`, then `firebase deploy --only hosting:dating`.
   - From now on, deploy the resume site with `npm run build`, then `firebase deploy --only hosting:main`.
   - A plain `firebase deploy` deploys both sites.
4. **Custom domain:**
   1. In Firebase console, go to Hosting → `zhumian-dating` → **Add custom domain** and enter `dating.zhumian.ca`.
   2. Firebase shows the DNS records to add (usually a TXT record to verify ownership, then A records or a CNAME). Add them at the registrar where `zhumian.ca` is managed. They go on the `dating` host only, so the main domain stays untouched.
   3. Wait for verification and the free SSL certificate. This takes minutes to a few hours, and up to 24 hours.

## Wording to review

These strings are new, written for this build. They live in `src/i18n.js`.

| Key | English | 中文 |
|---|---|---|
| `mailBodyCart` | Hi Mian, / I saw your page and I'd like to add you to my cart. | 朱勉你好， / 看了你的主页，想把你加入购物车。 |
| `mailBodyMail` | Hi Mian, | 朱勉你好， |
| `toastEmail` (WeChat only, where email links don't open) | My email: {email} | 我的邮箱：{email} |

## Files

```
index.html             page markup, the source of truth (English text built in, so it reads fine without JS;
                       a test checks it matches src/i18n.js)
src/i18n.js            all copy, EN + 中文
src/main.js            wiring
src/{deck,slideshow,effects,mail,analytics,photos,photo-sets,icons}.js
src/styles/            fonts (self-hosted), base, motion
build/                 Vite plugins: inline icons, Chinese font trimming, env check
scripts/check-dist.mjs post-build checks
og/og.html             source of public/og.png (the link preview image)
```
