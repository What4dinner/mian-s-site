import { rotate, initDeck } from '../src/deck.js'

afterEach(() => vi.useRealTimers())

test('rotate', () => {
  expect(rotate([0, 1, 2, 3])).toEqual([1, 2, 3, 0])
})

test('renders one card per slot', () => {
  document.body.innerHTML = '<div id="d"></div>'
  initDeck(document.getElementById('d'), [null, null, null, null], { lang: () => 'en', reducedMotion: true, onNext() {} })
  expect(document.querySelectorAll('.dcard')).toHaveLength(4)
  expect(document.querySelector('.dcard').textContent).toContain('1 / 4')
})

test('rapid next() calls are ignored while animating', () => {
  vi.useFakeTimers()
  document.body.innerHTML = '<div id="d"></div>'
  let n = 0
  const d = initDeck(document.getElementById('d'), [null, null, null, null], { lang: () => 'en', reducedMotion: false, onNext: () => n++ })
  d.next(); d.next(); d.next()
  expect(n).toBe(1)
  vi.advanceTimersByTime(800)
  d.next()
  expect(n).toBe(2)
})

test('top card moves to the back after next()', () => {
  vi.useFakeTimers()
  document.body.innerHTML = '<div id="d"></div>'
  const el = document.getElementById('d')
  const d = initDeck(el, [null, null, null], { lang: () => 'en', reducedMotion: false, onNext() {} })
  const first = el.children[0]
  expect(first.style.zIndex).toBe('10')
  d.next()
  vi.advanceTimersByTime(800)
  expect(first.style.zIndex).toBe('8')
})

test('keyboard Enter and Space advance', () => {
  document.body.innerHTML = '<div id="d" tabindex="0"></div>'
  let n = 0
  const el = document.getElementById('d')
  initDeck(el, [null, null], { lang: () => 'en', reducedMotion: true, onNext: () => n++ })
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
  el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
  expect(n).toBe(2)
})
