import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import jsQR from 'jsqr'
import { renderQrPng, writeWechatQr } from '../build/wechat-qr.js'

async function decode(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data
}

test('generated QR (with WeChat logo) scans back to the same link', async () => {
  const url = 'https://u.wechat.com/EXAMPLE_example-1234567890ab'
  const png = await renderQrPng(url)
  const meta = await sharp(png).metadata()
  expect(meta.format).toBe('png')
  expect(meta.width).toBe(meta.height)
  expect(meta.width).toBeGreaterThanOrEqual(600)
  expect(await decode(png)).toBe(url)
})

test('still scans when shown small (phone screenshot size)', async () => {
  const url = 'https://u.wechat.com/EXAMPLE_example-1234567890ab'
  const small = await sharp(await renderQrPng(url)).resize(220).png().toBuffer()
  expect(await decode(small)).toBe(url)
})

test('writeWechatQr removes a stale file when the env var is missing', async () => {
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'qr-')), 'wechat-qr.png')
  fs.writeFileSync(out, 'old')
  await writeWechatQr(undefined, out)
  expect(fs.existsSync(out)).toBe(false)
  await writeWechatQr('https://u.wechat.com/x', out)
  expect(fs.existsSync(out)).toBe(true)
})

test('site QR (no logo) scans back to the page URL', async () => {
  const url = 'https://dating.zhumian.ca/'
  const png = await renderQrPng(url, { logo: false })
  expect(await decode(await sharp(png).resize(200).png().toBuffer())).toBe(url)
})
