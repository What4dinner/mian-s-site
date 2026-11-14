import { parseUnicodeRange, filterFontFaces, pageChars } from '../build/cjk-fonts.js'

test('parses single, range and wildcard entries', () => {
  expect(parseUnicodeRange('U+20, U+4E00-4E3F, U+4??')).toEqual([[0x20, 0x20], [0x4e00, 0x4e3f], [0x400, 0x4ff]])
})

const css = `@font-face{font-family:"X";src:url(./a.woff2);unicode-range:U+6731}
@font-face{font-family:"X";src:url(./b.woff2);unicode-range:U+9000-9FFF}
@font-face{font-family:"X";src:url(./c.woff2)}`

test('keeps only faces covering a used char (and faces with no range)', () => {
  const out = filterFontFaces(css, new Set(['朱'.codePointAt(0)]))
  expect(out).toContain('a.woff2')
  expect(out).not.toContain('b.woff2')
  expect(out).toContain('c.woff2')
})

test('rewrites relative urls against a base', () => {
  const out = filterFontFaces(css, new Set([0x6731]), (u) => 'BASE/' + u.replace('./', ''))
  expect(out).toContain('url("BASE/a.woff2")')
})

test('pageChars includes every character of the copy', () => {
  const s = pageChars(['朱勉', 'Hi'])
  for (const ch of '朱勉Hi') expect(s.has(ch.codePointAt(0))).toBe(true)
})
