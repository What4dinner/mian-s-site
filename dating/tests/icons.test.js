import { faSvg, ICON_NAMES } from '../src/icons.js'
import { faInline } from '../build/fa-inline.js'

test('renders an svg', () => {
  const s = faSvg('solid:camera', 'x')
  expect(s).toMatch(/^<svg class="fa x" viewBox="0 0 \d+ \d+"/)
  expect(s).toContain('aria-hidden="true"')
  expect(s).toContain('fill="currentColor"')
})

test('unknown icon throws', () => {
  expect(() => faSvg('solid:rocket')).toThrow('Unknown icon: solid:rocket')
})

test('plugin inlines, keeps class and style, leaves no <i data-fa>', () => {
  const out = faInline().transformIndexHtml('<p><i data-fa="solid:heart" class="h" style="font-size:11px"></i></p>')
  expect(out).toContain('<svg class="fa h"')
  expect(out).toContain('style="font-size:11px"')
  expect(out).not.toContain('data-fa')
})

test('every spec icon is mapped', () => {
  expect(ICON_NAMES).toHaveLength(30)
})

test('brand icon for WeChat', () => {
  expect(faSvg('brands:weixin')).toMatch(/^<svg class="fa"/)
})
