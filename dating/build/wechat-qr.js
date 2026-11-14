// Build-time WeChat QR: renders VITE_WECHAT_QR (the link inside Mian's WeChat code) as a crisp PNG
// with the WeChat mark in the middle. PNG rather than SVG because WeChat's "long-press to recognise"
// only works on images. The link lives in .env, so it never lands in the public repo.
import fs from 'node:fs'
import path from 'node:path'
import QRCode from 'qrcode'
import sharp from 'sharp'
import { faWeixin } from '@fortawesome/free-brands-svg-icons'

const INK = '#1D1D1F'
const WECHAT_GREEN = '#07C160'
const SCALE = 20 // px per module: integer scaling keeps edges perfectly sharp

/** PNG buffer of `text` as a QR code (error correction H, so the centre logo is safe). */
export async function renderQrPng(text, { logo: withLogo = true } = {}) {
  const qr = await QRCode.toBuffer(text, {
    errorCorrectionLevel: 'H',
    margin: 2,
    scale: SCALE,
    color: { dark: INK + 'FF', light: '#FFFFFFFF' },
  })
  if (!withLogo) return sharp(qr).png({ compressionLevel: 9, palette: true }).toBuffer()
  const { width } = await sharp(qr).metadata()
  const logo = Math.round(width * 0.2)
  const pad = Math.round(logo * 0.14)
  const [w, h, , , d] = faWeixin.icon
  const glyph = Math.round(logo * 0.62)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${logo + pad * 2}" height="${logo + pad * 2}">
    <rect width="100%" height="100%" rx="${Math.round((logo + pad * 2) * 0.24)}" fill="#fff"/>
    <rect x="${pad}" y="${pad}" width="${logo}" height="${logo}" rx="${Math.round(logo * 0.22)}" fill="${WECHAT_GREEN}"/>
    <svg x="${pad + (logo - glyph) / 2}" y="${pad + (logo - glyph) / 2}" width="${glyph}" height="${glyph}" viewBox="0 0 ${w} ${h}"><path fill="#fff" d="${d}"/></svg>
  </svg>`
  return sharp(qr).composite([{ input: Buffer.from(svg), gravity: 'center' }]).png({ compressionLevel: 9, palette: true }).toBuffer()
}

/** Writes the QR PNG to `outFile`, or removes a stale one when `text` is empty. */
export async function writeWechatQr(text, outFile) {
  if (!text) {
    fs.rmSync(outFile, { force: true })
    return false
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, await renderQrPng(text))
  return true
}

/** Vite plugin: regenerate the WeChat QR and the page-link QR (for the share card) before each build / dev start. */
export function wechatQr({ outFile, getText, siteUrl, siteOutFile }) {
  return {
    name: 'wechat-qr',
    async buildStart() {
      await writeWechatQr(getText(), outFile)
      fs.mkdirSync(path.dirname(siteOutFile), { recursive: true })
      fs.writeFileSync(siteOutFile, await renderQrPng(siteUrl, { logo: false }))
    },
  }
}
