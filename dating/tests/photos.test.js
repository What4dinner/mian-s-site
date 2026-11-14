import { toPhotoList, photoMarkup, slotsFor, PLACEHOLDER_COUNTS } from '../src/photos.js'

const pic = (s) => ({ sources: { avif: s + '.avif 1200w', webp: s + '.webp 1200w' }, img: { src: s + '.webp', w: 1200, h: 900 } })

test('natural, case-insensitive filename order', () => {
  const list = toPhotoList({ '/photos/hero/10.jpg': pic('c'), '/photos/hero/2.JPG': pic('b'), '/photos/hero/1.jpeg': pic('a') })
  expect(list.map((p) => p.img.src)).toEqual(['a.webp', 'b.webp', 'c.webp'])
})

test('empty folder yields placeholders; non-empty yields the list', () => {
  expect(slotsFor([], 3)).toEqual([null, null, null])
  expect(slotsFor([pic('a')], 3)).toHaveLength(1)
})

test('placeholder counts match the mockup', () => {
  expect(PLACEHOLDER_COUNTS).toEqual({ hero: 4, photography: 4, drives: 3, hiking: 3, camping: 3 })
})

test('placeholder markup', () => {
  const h = photoMarkup(null, { index: 1, total: 3, alt: '', phLabel: '照片', eager: false })
  expect(h).toContain('照片')
  expect(h).toContain('2 / 3')
  expect(h).toContain('<svg')
  expect(h).toContain('data-i="ph"')
})

test('picture markup is lazy with alt and dimensions', () => {
  const h = photoMarkup(pic('x'), { index: 0, total: 1, alt: '朱勉的照片', phLabel: '', eager: false })
  expect(h).toContain('type="image/avif"')
  expect(h).toContain('type="image/webp"')
  expect(h).toContain('alt="朱勉的照片"')
  expect(h).toContain('data-alt="alt"')
  expect(h).toContain('loading="lazy"')
  expect(h).toContain('width="1200"')
})

test('eager picture and escaped alt', () => {
  const h = photoMarkup(pic('x'), { index: 0, total: 1, alt: 'a"<b', phLabel: '', eager: true })
  expect(h).toContain('loading="eager"')
  expect(h).toContain('alt="a&quot;&lt;b"')
})

test('portrait photos in landscape frames are framed toward the bottom (where the subject usually is)', () => {
  const portrait = { sources: { webp: 'p.webp 1200w' }, img: { src: 'p.webp', w: 1200, h: 1800 } }
  expect(photoMarkup(portrait, { index: 0, total: 1, alt: '', phLabel: '', eager: false })).toContain('style="object-position:50% 80%"')
  expect(photoMarkup(pic('x'), { index: 0, total: 1, alt: '', phLabel: '', eager: false })).not.toContain('object-position')
})
