# dating.zhumian.ca — Design

**Date:** 2026-11-12
**Visual reference:** [assets/2026-11-12-dating-site-mockup.html](assets/2026-11-12-dating-site-mockup.html). This is the approved mockup. Open it in a browser and use it as the source of truth for layout, spacing, motion, icons and copy. Where this doc and the mockup disagree, this doc wins.

## 1. Intent

zhumian.ca is Mian's resume. dating.zhumian.ca shows the other side of him: a personal page he can send to matches.

**The one feeling:** within five seconds, before reading closely, a visitor should sense *a funny, caring, loving guy*.

**The concept:** Mian presented like an Apple product launch. It has a "New" badge, the name set like a product name, "What's in the box", a bonus perks section, "Features" (hobbies), a "Tech specs" sheet, an "Add to Cart" button, and "In stock · Currently single". The humor comes from the product framing and the copy. The sincerity comes from what's actually "in the box".

**Success:** more matches reach out. Every design choice should make a visitor more likely to tap **Add to Cart** or **Contact me**.

## 2. Goals, non-goals, anti-goals

**Goals**
- Phone-first, and equally polished on desktop. Most visitors arrive from a dating app or a chat link on a phone.
- Fully bilingual (English / Simplified Chinese), showing one language at a time.
- Playful motion (bouncy springs and hidden tap surprises) on a calm, premium layout.
- Mian can add many photos later without touching layout code.

**Non-goals**
- No backend, forms, accounts or database. Contact happens by email (`mailto:`). Analytics is the only third-party script (§8).
- No CMS. Copy lives in one translation file in the repo.
- No dark mode. The light, sky-morning look is deliberate. *(Builder's call; revisit only if asked.)*
- No changes to the existing resume site at zhumian.ca.

**Anti-goals.** These make it a failure even if it works:
- **Looks AI-generated.** Avoid rainbow pastel cards, a different color per card, colored icon squares, gradients everywhere, colored glow shadows, emoji, and generic fonts. Mian explicitly rejected all of these.
- **Chinese that reads like a translation.** Chinese copy is written Chinese-first (§7). Don't "improve" it by translating from English.
- **Cheesy or gimmicky.** Surprises are few and quick, and polish keeps the playfulness in check.
- **Slow or broken on a phone, or inside WeChat.** Chinese matches may open the link in WeChat's in-app browser in mainland China, where Google Fonts and some CDNs are blocked.

## 3. Visual system

### Colors

| Token | Value | Use |
|---|---|---|
| `--paper` | `#FFFFFF` | Page background |
| `--mist` | `#F5F5F7` | Alternate section background (Bonus, Tech specs) |
| `--ink` | `#1D1D1F` | Text, dark feature tile, icon line art |
| `--ink-2` | `#6E6E73` | Secondary text and the gray half of two-tone headlines |
| `--line` | `#E3E3E8` | Hairline dividers (`#D2D2D7` on mist sections) |
| `--blue` / `--blue-ink` | `#1F6FEB` / `#0B4FC4` | The only accent: primary button, eyebrows, links (hover) |
| `--sun` | `#FFC93C` | Tiny highlights only: "New" dot, tagline highlighter stroke, cart badge |
| `--go` | `#1E8E4E` (dot `#26B35F`) | "In stock" status text and pulsing dot |
| Hero wash | `#EEF4FC → #FFFFFF` | Very subtle vertical gradient behind the hero only |
| Icon accents | dome green `#7FA899`, seal red `#C8302A`, lights `#F2B630`, statue gold `#D9A21B` | Only inside the two landmark icons |

There is no purple anywhere (Mian's request). Photo placeholders use near-neutral grays (`#E8E8ED`, `#E3E8EF`, `#ECE8E1`, `#E4EAE5`, `#EDEDF0`, `#E6E9EE`).

### Typography

| Role | English | Chinese |
|---|---|---|
| Display (name, tagline, section headlines, CTA headline, core numbers, photographer quote) | **Fraunces**, optical size 144 | **LXGW WenKai Medium (霞鹜文楷)**, weight 400 only. It ships a single weight, so never apply bold or faux-bold. |
| Chinese reading text (core item titles and descriptions, hobby titles and descriptions, Bonus lede, photographer title) | n/a | LXGW WenKai Medium |
| UI and body (nav, buttons, eyebrows, tiles, spec sheet, status, footer, English body) | **Geist** 400–600 | **PingFang SC** first (Apple devices), then **Noto Sans SC** |

- **Name:** Fraunces 600, letter-spacing −0.045em. 76px on phone, 132px on desktop. Chinese: +0.02em.
- **Tagline:** Fraunces italic 400. 24px phone, 34px desktop. Chinese is upright.
- **Section `h2`:** Fraunces 500, −0.03em. 40px phone, 64px desktop. CTA `h2` is 52px phone, 96px desktop. Chinese: +0.01em, line-height 1.2.
- **Core numbers 01–04:** Fraunces italic 300, 34px, `--ink-2`.
- **Two-tone headlines:** the second half of each headline is `--ink-2` (the `<em>` in the copy table). Emphasis is a color change only, never a font switch.
- **Line breaks:** use `text-wrap: balance` on headlines. In Chinese, the emphasized phrase must never break (`white-space: nowrap` on the `<em>`), so no line ends with one stranded character.
- **Chinese body:** line-height 1.7, with core and hobby descriptions at 16.5px.
- **Chinese ellipsis:** don't use "…" in Chinese headlines. The Latin font draws it on the baseline, which is wrong for Chinese.
- **Font hosting:** self-host every font from the build output. Use no Google Fonts or CDN at runtime (see the WeChat anti-goal). For Chinese, load only the glyphs the page uses: either subset the fonts at build time, or use the pre-sliced `@chinese-fonts/lxgwwenkai` package (CSS `LXGWWenKai-Medium/result.css`, family `"LXGW WenKai Medium"`) bundled locally.

### Layout

- **Breakpoint:** 834px. Below it is the phone layout; at or above it is desktop.
- **Container:** max-width 1120px, with 20px side padding on phone and 40px on desktop. No horizontal scroll at any width down to 320px.
- **Section padding:** 88px on phone, 128px on desktop (hero: 56/88 phone, 96/128 desktop).

### Icons

- **No emoji anywhere**, including toasts, floating hearts and email subjects. All UI icons are **Font Awesome 6 Free** (solid and regular), self-hosted or tree-shaken SVG.
- **Icons used:**
  - `bag-shopping`: cart and Add to Cart
  - `chevron-right`: Contact me
  - `hand-pointer` (regular): tap hint
  - `camera`, `car-side`, `person-hiking`, `campground`: hobbies
  - `ruler-vertical`, `weight-scale`, `location-dot`, `earth-asia`, `language`, `ban-smoking`, `wine-glass`, `battery-full`, `shield-heart`: specs
  - `envelope` (regular): toast
  - `heart` and `star`: tap surprise
- **Bonus app icons:** hand-drawn SVGs in the mockup, styled after iCloud, YouTube and Costco, plus a headset and a camera. Copy them from the mockup as-is.
- **Landmark icons:** two original hand-drawn SVGs in the mockup. Copy them as-is.
  - *Anhui:* two overlapping Huizhou houses with 马头墙, a pond, and a red "皖" seal.
  - *Victoria:* the BC Parliament Buildings with a green central dome, gold statue, twin turrets, paired pavilion domes, roofline lights, harbour lines, and a red "Vic" seal.

## 4. Page structure

Section order (anchors in parentheses):

1. **Nav (sticky).** Frosted white bar, 52px tall.
   - Left: the name ("Mian" / "朱勉").
   - Center, desktop only: links to *What's in the box* (#box), *Features* (#features), and *Tech specs* (#specs).
   - Right: an **EN / 中文** segmented switch (active segment filled `--ink`) and a cart icon button with a yellow count badge.
2. **Hero.**
   - Phone: centered and stacked.
   - Desktop: two columns, with copy on the left (1.1fr) and the photo deck on the right (0.9fr).
   - Contents, in order: "New" with a yellow dot, the name, the tagline (with a yellow highlighter stroke under its second half), the status (pulsing green dot + text), then the buttons.
   - Buttons: **Add to Cart** (primary blue pill with a bag icon) and **Contact me** (a blue text link with a chevron).
   - **Photo deck:** a tilted stack of 4:5 photo cards with white 6px borders and soft shadows. Tap or click it and the top card flies off to the left, then rejoins at the back. A "Tap for the next one" hint sits below.
3. **What's in the box (#box).** Eyebrow and two-tone headline, then four items.
   - Each item has a large italic number (01–04), a title, and a description, separated by hairlines.
   - Phone: one column. Desktop: 2×2.
   - Items have no icons and no colored backgrounds.
4. **Bonus.** Mist background. Eyebrow, two-tone headline, and a lede.
   - Four white tiles (2 columns on phone, 4 on desktop), each with an app icon, title and line.
   - Below them, a full-width **dark feature tile** (`--ink`) for "Your Personal Photographer": icon, title and line on the left, and a large display-font quote on the right (stacked on phone).
5. **Features (#features).** Eyebrow and two-tone headline.
   - Four hobby cards: one column on phone, 2×2 on desktop.
   - Each card has a **swipeable 4:3 slideshow**, then an icon and title, then a description.
6. **Tech specs (#specs).** Mist background.
   - Desktop: two columns (1fr : 2fr), with the eyebrow, name and lede on the left and the spec rows on the right. Phone: stacked.
   - Each row has a label (with an icon) and a value with an optional gray sub-line.
   - The **Based in** row shows the Victoria icon (84×61) before its value, and the **Origin** row shows the Anhui icon. Each icon tilts slightly on row hover.
7. **CTA.** Centered: a huge two-tone headline, the status ("Stock: 1"), the same two buttons, and the shipping line.
8. **Footer.** Hairline above.
   - Left: Anhui icon (small, 46×34), the footer line, then the Victoria icon.
   - Right: `dating.zhumian.ca`.

## 5. Motion and interaction

- **Easing:**
  - Spring: `cubic-bezier(.34,1.56,.64,1)`
  - Ease-out: `cubic-bezier(.22,.8,.2,1)`
- **Scroll reveal:** blocks fade up 28px and scale from 0.98 when they enter the viewport. Items within a grid are staggered by 70ms.
- **Buttons:** a "jelly" squish on press (scale 1.12/0.88 → settle, about 0.5s).
- **Photo deck:** cards fan with small rotations (−3°, 4°, −7°, 6°) and offsets.
  - On tap, the top card flies out (translate −120%, rotate −24°).
  - The order then rotates, and cards spring into their new positions (0.7s).
- **Tap surprise:**
  - Tapping a deck card or a slideshow photo releases six Font Awesome hearts and stars from the tap point.
  - They float up about 150px with random sideways drift and fade over 1.3s.
  - Colors: blue, sun, coral `#E8735A`, and ink.
- **Slideshows:**
  - Native horizontal scroll-snap with swipe on touch.
  - Dot indicators: the active dot stretches to a 20px pill in `--ink`, with a spring transition.
  - On hover-capable devices, round prev/next arrow buttons fade in while hovering.
- **Tiles:**
  - Hover: lift 4px.
  - App icon: rotates −6° and scales to 1.06.
  - Press: scale to 0.97.
- **Status dot:** a continuous soft "ping" ring.
- **Cart:**
  - The badge scales in with a spring the first time Add to Cart is pressed.
  - The cart icon jellies on every press.
- **Toast:** a dark pill at the bottom center that springs up, shows an envelope icon and message, and auto-hides after about 2.4s.
- **Language switch:** swaps all text in place with no reload and no layout jump.
- **`prefers-reduced-motion`:** turn off all animations, reveals, deck flight and floating hearts. Content shows immediately, and tapping the deck simply changes the photo.

## 6. Behavior

### Language

- **Initial language:**
  - Use a saved choice (`localStorage`, key `lang`) if one exists.
  - Otherwise, use Chinese if `navigator.language` starts with `zh`; else English.
- **Switching:** the switch saves the choice. Wrap every storage access in try/catch, and fall back to detection if storage is unavailable.
- **When the language changes, update:**
  - `<html lang>`: `en` or `zh-CN`. This matters for correct CJK font selection.
  - `document.title`: "Mian" or "朱勉".
  - The meta description, so link previews match the language.
- **Text source:** all user-facing strings come from one translation module (§7), with strings stored as keys.
- **Inline markup:** strings that contain inline markup (`<em>` for the gray half, and `<span class="mark">` for the highlighter) are the only ones rendered as HTML. They come only from the translation file.

### Add to Cart and Contact me

- **Add to Cart:**
  1. Show the badge and bump the cart.
  2. Show a toast ("Added to cart. Opening an email to Mian" / "已加入购物车，马上给朱勉发邮件").
  3. After about 900ms, open `mailto:` with the subject **"I'd like to add you to my cart"** / **"我想把你加入购物车"** and a one-line body greeting.
- **Contact me:** show a toast ("Opening an email to Mian" / "打开邮件，给朱勉写点什么吧"), then open `mailto:` with the subject **"Hi Mian"** / **"你好，朱勉"**.
- **The email address** is **the same one the resume site uses**: read `VITE_EMAIL` from the existing `.env` *(Mian's decision)*. Any address used in a `mailto:` is visible in the built page. That can't be avoided without a backend, and Mian accepted it.
- **Plain-link fallback:** both buttons must still work as plain `mailto:` links if JavaScript fails.

### Photos

- Mian will add several sets of photos later. Adding photos should mean dropping files into folders, with no code edits:
  - `photos/hero/` feeds the hero deck (4–6 recommended).
  - `photos/photography/`, `photos/drives/`, `photos/hiking/` and `photos/camping/` feed the hobby slideshows.
- Discover files at build time (e.g. `import.meta.glob`) and sort them by filename.
- **Empty folders:** if a folder is empty, show the styled placeholder (camera icon, "Photo / 照片", "n / N"). That keeps the page presentable before photos exist.
- **Image delivery:**
  - Generate web-sized versions at build time: WebP/AVIF, about 1600px on the long edge for the hero and about 1200px for slideshows. Keep the originals.
  - Lazy-load every image below the hero.
  - Use `object-fit: cover` within the fixed aspect ratios.
  - Give each image a localized alt text ("Photo of Mian" / "朱勉的照片").
- **Privacy:** strip EXIF/GPS metadata from the output images. These are personal photos, and many phones embed location.

## 7. Copy (final)

Strings marked `<em>…</em>` are the gray half of a two-tone headline. `<mark>` is the yellow highlighter.

| Key | English | 中文 |
|---|---|---|
| brand / name | Mian | 朱勉 |
| nav | What's in the box · Features · Tech specs | 标配 · 兴趣爱好 · 技术规格 |
| new | New | 新品 |
| tagline | Even-tempered. <mark><em>Loves life.</em></mark> | 情绪稳定，<mark><em>热爱生活。</em></mark> |
| status | Premium good guy · Not taken yet | 精品好男人 · 名草无主 |
| cart button / contact | Add to Cart / Contact me | 加入购物车 / 跟我聊聊 |
| deck hint | Tap for the next one | 点一下换一张 |
| core eyebrow | What's in the box | 标配 |
| core headline | Date me, and <em>this comes standard.</em> | 跟我在一起，<em>这些都是标配。</em> |
| 01 | **Shows up when you're down.** Bad day? Text me. We'll talk it out, or go grab something good to eat. | **心情不好，随叫随到。** 不开心就找我，想聊就聊，想出去吃就出去吃。 |
| 02 | **Cooks when you're hungry.** Tell me what you're craving. The kitchen's mine. | **饿了，有人给你做饭。** 饿了跟我说，想吃啥我给你做。 |
| 03 | **In your corner.** Big plans or small ones, I'm on your side. | **你想做的事，我都支持。** 你想干啥我都支持，大事小事都站你这边。 |
| 04 | **Actually listens.** Vent, ramble, think out loud. I'm listening. | **你说，我在听。** 想吐槽就吐槽，想碎碎念就碎碎念，我都听着。 |
| bonus eyebrow / headline / lede | Bonus / And a few <em>extras.</em> / No extra charge. Never expires. | 附赠 / 还有点<em>小福利。</em> / 不额外收费，长期有效。 |
| iCloud | iCloud 2TB Family Plan · Room for all your photos. No more deleting. | iCloud 2TB 家庭共享 · 照片随便存，不用再删。 |
| YouTube | YouTube Premium · Never sit through an ad again. | YouTube Premium · 看视频不用再等广告。 |
| Costco | Costco Membership · $1.50 hot dogs, as many as you want. | Costco 会员 · 1.5 刀热狗管够。 |
| Tech support | 24/7 Tech Support · Wi-Fi, printers, your parents' phones. I fix them all. | 24/7 技术支持 · WiFi、打印机、爸妈的手机，都归我修。 |
| Photographer | Your Personal Photographer · Retakes until you like it. · “Don't move. This one's the one.” | 专属摄影师 · 拍到你满意为止。 · 「别动，这张绝对好看。」 |
| features eyebrow / headline | Features / How I spend <em>my weekends.</em> | 兴趣爱好 / 周末<em>一般这么过。</em> |
| photography | **Photography.** My camera's always with me. Portraits are my specialty. | **摄影。** 走到哪拍到哪，帮你拍照也很拿手。 |
| drives | **Scenic drives.** Sometimes I just want to get out and drive, wherever the road goes. | **开车闲逛。** 有时候就是想出去兜兜风，开到哪算哪。 |
| hiking | **Hiking, sometimes.** When the weekend weather's nice, I head for the trails. | **偶尔徒步。** 天气好的周末，会去山里走走。 |
| camping | **Camping.** Only once or twice a year, mostly to see the stars and shoot the Milky Way. | **露营。** 一年也就去一两次，主要是去看星星、拍银河。 |
| specs eyebrow / lede | Tech specs / Model year 2026. Runs smoothly. No bad habits. | 技术规格 / 2026 款，性能稳定，无不良嗜好。 |
| height / weight | Height 178 cm · Weight 70 kg | 身高 178 cm · 体重 70 kg |
| based in | Victoria, BC, Canada · *Ocean views included.* | 现居：加拿大 BC 省维多利亚 · *附带海景。* |
| origin | Anhui, China · *Imported. Fully localized.* | 产地：中国安徽 · *原装进口，已完成本地化。* |
| languages | English · 中文 | English · 中文 |
| smoking | None · *Smoke-free edition. Zero emissions.* | 不抽烟 · *无烟版，零排放。* |
| alcohol | 2–3 times a year · *One drink and my face turns red.* | 一年两三次 · *一杯就脸红。* |
| battery | Lasts through late-night calls | 续航：聊到半夜也不掉电 |
| warranty | Lifetime. No returns. | 售后：终身保修，不退不换 |
| CTA headline | Only one <em>available.</em> | 仅此一位，<em>先到先得。</em> |
| CTA status / shipping | Stock: 1 · Free shipping. No hidden fees. | 库存：1 · 包邮，无隐藏费用。 |
| footer | Designed in Anhui. Assembled in Victoria. | 安徽原产 · 维多利亚组装 |
| toasts | Added to cart. Opening an email to Mian / Opening an email to Mian | 已加入购物车，马上给朱勉发邮件 / 打开邮件，给朱勉写点什么吧 |

### Additions (2026-11-14, from Mian)

- **Tech specs** gain: Made in 1995 · Sagittarius / 出厂 1995 年 · 射手座; Occupation IT with a link to the résumé at zhumian.ca; Settling down: West Coast (depends on work, open to discussing) / 长期定居：西海岸; Kids & pets: open to both / 孩子和宠物：都可以. The specs lede becomes "Made in 1995. Still getting updates. No bad habits." / "1995 年出厂，持续更新中，无不良嗜好。"
- **New section "The serious part / 说点正经的"** (#about), between Tech specs and the CTA. Headline "Looking for something <em>serious.</em>" / "认真谈恋爱，<em>奔着结果去。</em>". A short first-person note (moved to Victoria at 15, high school through university there; lately learning and getting certified; made this page to find someone and start the next chapter). Beside it, "Hoping you're / 希望你是": even-tempered 情绪稳定, kind 性格好, active 爱运动, no bad habits 无不良嗜好.
- **Add to Cart, Contact me and the nav cart icon** no longer open email: they scroll to the contact cards and land on the WeChat card (Add to Cart still shows the cart badge). Email stays available via the email card's "Write an email" link.
- **Orientation** spec row (after Made in): Straight · Looking for a girlfriend. / 取向：异性恋 · 找的是女朋友。
- **Share with a single friend** under the contact cards: hint "Know a single woman who might be a good match? Send this her way." / "认识合适的单身女生？转给她看看。" The button opens the system share sheet on phones, copies the link on desktop, and inside WeChat points to the ··· menu (web pages there can't open the share sheet).
- **Share card:** "Share with a single friend" opens a sheet with a 1080×1620 card image drawn on a canvas in the page style (New, name, tagline with highlight, status, first hero photo as a tilted card, chips: birth year · sign, 178 cm, city, occupation; footer: "Scan for the full page", URL and a QR to https://dating.zhumian.ca/). Buttons: Save image (download; in WeChat, a long-press hint) and Share link (previous behaviour). Preview in dev at /card-preview.html.
- **Referral bonus** line under the share button (gift icon, soft yellow): "Referral bonus: set us up and skip the wedding gift. Head-table seat included." / "推荐有礼：介绍成功的，婚礼红包免了，还给你留主桌。" A short version sits at the bottom of the share card.
- **Known issues** (release-notes style, written as funny bug reports of real habits) under the spec rows, bug icon, each with a workaround: compares everything before buying shampoo (upside: everything is a great deal); thinks three days, picks the day-one choice (ask for my gut answer); a week of rain switches on go-for-a-drive mode (cannot be turned off, but you can come along); stops for good light and shoots for ten minutes (you get great photos). Note: None of these affect normal use.
- **Spec rows trimmed** to 12: Height & weight (178 cm · 70 kg) and Smoking & drinking are single rows.
- **Digits** in Chinese display text use Geist (a digits-only @font-face before LXGW).
- **OG title** is "Mian · Premium good guy".
- **Nav bar** gets a blue "Contact me / 跟我聊聊" pill at the far right (after the cart), always visible on phone and desktop; it goes to the WeChat card like the other buttons.
- **Contact cards** under the CTA buttons, side by side: Email (address shown, selectable, plus a Write-an-email link) and WeChat. The WeChat QR is generated at build time from `VITE_WECHAT_QR` (crisp PNG, WeChat logo in the centre, error correction H), with the WeChat ID from `VITE_WECHAT_ID` and a Copy button (on phone browsers it also opens WeChat). Inside WeChat, Add to Cart / Contact me scroll to the QR instead of emailing.
- Smoking note changed to "Smoke-free edition. Zero emissions." / "无烟版，零排放。"

**Copy rules:**
- Don't rewrite this copy without Mian. If new strings are needed, write the Chinese natively in a casual, spoken register.
- Avoid ad-speak such as 「全天候，只为你」, and avoid cold-joke framing. Mian doesn't tell cold jokes.
- Keep it warm but not cheesy (不要太肉麻): no hugs, no "us" before the visitor has even said hi. Revised 2026-11-14 at Mian's request.

## 8. Build and hosting

- **Repo layout:** build the dating site as a **separate app in this repo** (e.g. `dating/` with its own Vite config and output folder). It shares nothing at runtime with the resume site, and the resume site's build and deploy must keep working unchanged.
- **Framework:** **plain HTML/CSS/JS built with Vite** *(builder's call)*. The page is static with light interactivity, so React isn't needed, and this keeps the phone payload small. The existing repo already has Vite.
- **Hosting:** a second site in the existing Firebase project, using Firebase Hosting multi-site.
  - Convert `firebase.json` to a `hosting` array with deploy targets for `main` (current `dist`) and `dating` (the new output).
  - Map `dating.zhumian.ca` as a custom domain. That needs DNS records that Mian adds at his registrar; document the exact steps.
- **Performance budget (phone, 4G):**
  - First paint of the hero text under 1.5s.
  - Total JS under 30 KB gzipped, excluding images.
  - Fonts load with `font-display: swap`.
  - The hero name must not shift layout when the fonts arrive (match fallback metrics or reserve size).
- **Must work in:** iOS Safari, Android Chrome, desktop Chrome/Safari/Edge, and the **WeChat in-app browser**. No runtime requests may go to Google or blocked CDNs.
- **Link preview (Open Graph / Twitter card):** this link gets pasted into dating apps and chats, so the preview must look intentional. Use a static 1200×630 image designed in the page style: white/sky wash, "Mian" in Fraunces, the tagline, and the green "In stock · Currently single" status. Use no photo, so it works before photos exist. The title is "Mian · In stock" and the description is the English tagline. *(Claude's call.)*
- **Search engines: the site is public and indexable** *(Mian's decision)*.
  - Include a real `<title>` and meta description in the HTML itself (English by default), `<link rel="canonical" href="https://dating.zhumian.ca/">`, and a `robots.txt` that allows crawling.
  - Don't add `noindex`.
- **Analytics: none.** Clarity was planned, then dropped by Mian on 2026-11-14. No third-party scripts at all.
- **Accessibility:**
  - Real `<button>`/`<a>` elements.
  - Visible focus rings.
  - Labels on icon-only buttons (cart, arrows, dots).
  - Deck operable by keyboard.
  - Color contrast ≥ 4.5:1 for body text.

## 9. Left to the builder

- Exact component and file structure, the image pipeline tool, and the font subsetting approach, provided the §3 and §8 constraints hold.
- Mail body wording beyond the subject lines in §6.
- Fine-tuning motion timings within the feel of the mockup.

## 10. Decisions Claude made (for Mian to check)

- Phone-first layout, plus an EN/中文 manual switch on top of browser auto-detection.
- Section order, the "Tech specs" section idea, the dark photographer feature tile, and the footer line.
- Self-hosting all fonts and icons so the site works inside WeChat in mainland China.
- Plain Vite with no React; Firebase multi-site hosting in the same project.
- Photo folders with auto-discovery, EXIF stripping, and placeholders when a folder is empty.
- No dark mode.
- A static, photo-free link preview image (§8).
