// Share card: a 1080×1620 image drawn on a canvas in the page's own style and fonts,
// so people can save it or send it to a friend. Strings come from i18n.js.
import { t } from './i18n.js'

/** "情绪稳定，<span class='mark'><em>热爱生活。</em></span>" → { plain: '情绪稳定，', marked: '热爱生活。' } */
export function splitMarked(html) {
  const m = html.match(/^([\s\S]*?)<span class='mark'><em>([\s\S]*?)<\/em><\/span>/)
  if (!m) return { plain: html.replace(/<[^>]+>/g, ''), marked: '' }
  return { plain: m[1], marked: m[2] }
}

/** Everything the card says, in one language. */
export function cardData(lang) {
  return {
    newLabel: t(lang, 'new'),
    name: t(lang, 'name'),
    tagline: splitMarked(t(lang, 'tagline')),
    status: t(lang, 'status'),
    chips: [t(lang, 's10v'), '178 cm', t(lang, 'cardCity'), t(lang, 's11v')],
    scan: t(lang, 'cardScan'),
    url: 'dating.zhumian.ca',
    referral: t(lang, 'cardReferral'),
  }
}

const W = 1080
const H = 1760
const PAD = 96
const INK = '#1D1D1F'
const INK2 = '#6E6E73'
const UI = '"Geist Variable", "PingFang SC", "Noto Sans SC", -apple-system, sans-serif'
const fontsFor = (lang) =>
  lang === 'zh'
    ? { name: `400 188px "LXGW WenKai Medium", "PingFang SC", serif`, tagline: `400 58px "LXGW WenKai Medium", "PingFang SC", serif` }
    : { name: `600 188px "Fraunces Variable", Georgia, serif`, tagline: `italic 400 60px "Fraunces Variable", Georgia, serif` }

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Wait (briefly) for the web fonts the card uses, so the canvas doesn't fall back to system fonts. */
async function ensureFonts(lang, data) {
  if (!document.fonts) return
  const f = fontsFor(lang)
  const sample = [data.name, data.tagline.plain, data.tagline.marked, data.status, ...data.chips, data.scan, data.newLabel].join('')
  const loads = [f.name, f.tagline, `600 34px ${UI}`, `500 30px ${UI}`].map((font) => document.fonts.load(font, sample).catch(() => {}))
  await Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 3000))])
}

/** Draws the card for `lang`. `photoSrc` (hero photo) and `qrSrc` (page-link QR) are optional. */
export async function drawCard(canvas, lang, { photoSrc, qrSrc } = {}) {
  const data = cardData(lang)
  await ensureFonts(lang, data)
  const [photo, qr] = await Promise.all([photoSrc && loadImage(photoSrc).catch(() => null), qrSrc && loadImage(qrSrc).catch(() => null)])
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const f = fontsFor(lang)

  // Background: the hero's sky wash.
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#EEF4FC')
  bg.addColorStop(0.55, '#FFFFFF')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // "New" with the sun dot.
  ctx.fillStyle = 'rgba(255,201,60,.28)'
  ctx.beginPath(); ctx.arc(PAD + 9, 128, 15, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#FFC93C'
  ctx.beginPath(); ctx.arc(PAD + 9, 128, 9, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = INK
  ctx.font = `600 34px ${UI}`
  ctx.textBaseline = 'middle'
  ctx.fillText(data.newLabel, PAD + 34, 129)

  // Name.
  ctx.textBaseline = 'alphabetic'
  ctx.font = f.name
  if ('letterSpacing' in ctx) ctx.letterSpacing = lang === 'zh' ? '4px' : '-8px'
  ctx.fillText(data.name, PAD - (lang === 'zh' ? 0 : 6), 335)
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px'

  // Tagline with the yellow highlighter under its second half.
  ctx.font = f.tagline
  const ty = 435
  const plainW = ctx.measureText(data.tagline.plain).width
  const markW = ctx.measureText(data.tagline.marked).width
  const size = lang === 'zh' ? 58 : 60
  ctx.fillStyle = 'rgba(255,201,60,.55)'
  ctx.fillRect(PAD + plainW - 4, ty - size * 0.3, markW + 8, size * 0.34)
  ctx.fillStyle = INK
  ctx.fillText(data.tagline.plain, PAD, ty)
  ctx.fillText(data.tagline.marked, PAD + plainW, ty)

  // Status: green dot + text.
  ctx.fillStyle = 'rgba(38,179,95,.2)'
  ctx.beginPath(); ctx.arc(PAD + 9, 503, 16, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#26B35F'
  ctx.beginPath(); ctx.arc(PAD + 9, 503, 9, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#1E8E4E'
  ctx.font = `500 32px ${UI}`
  ctx.textBaseline = 'middle'
  ctx.fillText(data.status, PAD + 36, 504)

  // Photo: a slightly tilted card with a white border and soft shadow, like the hero deck.
  const pw = 860
  const ph = 573
  const px = (W - pw) / 2
  const py = 580
  ctx.save()
  ctx.translate(W / 2, py + ph / 2)
  ctx.rotate((-2 * Math.PI) / 180)
  ctx.translate(-W / 2, -(py + ph / 2))
  ctx.shadowColor = 'rgba(29,29,31,.22)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 26
  ctx.fillStyle = '#FFFFFF'
  roundRect(ctx, px - 14, py - 14, pw + 28, ph + 28, 44)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  roundRect(ctx, px, py, pw, ph, 32)
  ctx.clip()
  if (photo) {
    const s = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight)
    const dw = photo.naturalWidth * s
    const dh = photo.naturalHeight * s
    ctx.drawImage(photo, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh)
  } else {
    ctx.fillStyle = '#E8E8ED'
    ctx.fillRect(px, py, pw, ph)
  }
  ctx.restore()

  // Spec chips, wrapping onto a second row if needed.
  ctx.font = `500 30px ${UI}`
  ctx.textBaseline = 'middle'
  let cx = PAD
  let cy = 1240
  for (const chip of data.chips) {
    const w = ctx.measureText(chip).width + 52
    if (cx + w > W - PAD) { cx = PAD; cy += 78 }
    ctx.fillStyle = '#FFFFFF'
    roundRect(ctx, cx, cy - 31, w, 62, 31)
    ctx.fill()
    ctx.strokeStyle = '#E3E3E8'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = INK
    ctx.fillText(chip, cx + 26, cy + 1)
    cx += w + 14
  }

  // Footer: hairline, scan prompt + URL, page QR.
  const fy = 1418
  ctx.fillStyle = '#E3E3E8'
  ctx.fillRect(PAD, fy, W - PAD * 2, 2)
  const qs = 150
  if (qr) {
    ctx.fillStyle = '#FFFFFF'
    roundRect(ctx, W - PAD - qs - 12, fy + 30, qs + 24, qs + 24, 20)
    ctx.fill()
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(qr, W - PAD - qs, fy + 42, qs, qs)
    ctx.imageSmoothingEnabled = true
  }
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = INK
  ctx.font = `600 36px ${UI}`
  ctx.fillText(data.scan, PAD, fy + 105)
  ctx.fillStyle = INK2
  ctx.font = `400 30px ${UI}`
  ctx.fillText(data.url, PAD, fy + 152)

  // Referral bonus: a soft yellow pill across the bottom.
  ctx.font = `500 30px ${UI}`
  ctx.textBaseline = 'middle'
  const ry = fy + 246
  ctx.fillStyle = 'rgba(255,201,60,.2)'
  roundRect(ctx, PAD, ry - 34, W - PAD * 2, 68, 22)
  ctx.fill()
  ctx.fillStyle = '#D9A21B'
  ctx.beginPath(); ctx.arc(PAD + 34, ry, 8, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = INK
  ctx.fillText(data.referral, PAD + 58, ry + 1)
  return canvas
}

/** Renders the card and returns an object URL for a PNG. */
export async function renderCardUrl(lang, assets) {
  const canvas = await drawCard(document.createElement('canvas'), lang, assets)
  const blob = await new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'))
  return URL.createObjectURL(blob)
}
