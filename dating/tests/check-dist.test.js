import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { checkDist } from '../scripts/check-dist.mjs'

function mk(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dating-check-'))
  for (const [rel, content] of Object.entries(files)) {
    const p = path.join(dir, rel)
    fs.mkdirSync(path.dirname(p), { recursive: true })
    fs.writeFileSync(p, content)
  }
  return dir
}

const cleanDist = {
  'index.html': '<a href="mailto:me@example.com?subject=Hi">x</a>',
  'assets/a.js': 'console.log(1)',
  'assets/a.css': 'body{}',
  'robots.txt': 'User-agent: *\nAllow: /\n',
  'og.png': Buffer.from('PNGDATA'),
}
const emptyPhotos = mk({ 'hero/.gitkeep': '' })

test('clean dist passes', () => {
  expect(checkDist(mk(cleanDist), emptyPhotos)).toEqual([])
})

test('flags CDN url', () => {
  const r = checkDist(mk({ ...cleanDist, 'assets/a.css': '@import url(https://fonts.googleapis.com/x)' }), emptyPhotos)
  expect(r.join()).toMatch(/googleapis/)
})

test('flags EXIF', () => {
  const r = checkDist(mk({ ...cleanDist, 'assets/p.webp': Buffer.from('RIFF....WEBPEXIFExif\0\0') }), emptyPhotos)
  expect(r.join()).toMatch(/Exif/)
})

test('flags unreplaced email and missing mailto', () => {
  const r = checkDist(mk({ ...cleanDist, 'index.html': '<a href="%VITE_EMAIL%">' }), emptyPhotos)
  expect(r.join()).toMatch(/VITE_EMAIL/)
  expect(r.join()).toMatch(/mailto/)
})

test('flags missing robots.txt and og.png', () => {
  const { 'robots.txt': _r, 'og.png': _o, ...rest } = cleanDist
  const r = checkDist(mk(rest), emptyPhotos)
  expect(r.join()).toMatch(/robots\.txt/)
  expect(r.join()).toMatch(/og\.png/)
})

test('flags HEIC in photos', () => {
  const r = checkDist(mk(cleanDist), mk({ 'hero/IMG_1.HEIC': 'x', 'hero/ok.JPG': 'x' }))
  expect(r).toEqual(['Unsupported photo (convert to JPG): photos/hero/IMG_1.HEIC'])
})

test('flags JS over budget', () => {
  const r = checkDist(mk({ ...cleanDist, 'assets/a.js': randomBytes(40000) }), emptyPhotos)
  expect(r.join()).toMatch(/30 KB/)
})

test('flags render-blocking CSS over 12 KB gzipped', () => {
  const big = randomBytes(20000).toString('hex')
  const r = checkDist(mk({ ...cleanDist, 'index.html': cleanDist['index.html'] + '<link rel="stylesheet" href="/assets/a.css">', 'assets/a.css': big }), emptyPhotos)
  expect(r.join()).toMatch(/render-blocking CSS/)
})

test('CSS not linked from index.html does not count as render-blocking', () => {
  const big = randomBytes(20000).toString('hex')
  expect(checkDist(mk({ ...cleanDist, 'assets/late.css': big }), emptyPhotos)).toEqual([])
})
