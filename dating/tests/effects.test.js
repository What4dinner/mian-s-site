import { showToast, burst } from '../src/effects.js'

afterEach(() => vi.useRealTimers())

test('toast timer resets on repeated calls', () => {
  vi.useFakeTimers()
  document.body.innerHTML = '<div id="toast"><span></span></div>'
  showToast('a'); vi.advanceTimersByTime(2000)
  showToast('b'); vi.advanceTimersByTime(2000)
  const el = document.getElementById('toast')
  expect(el.classList.contains('show')).toBe(true)
  expect(el.textContent).toContain('b')
  vi.advanceTimersByTime(500)
  expect(el.classList.contains('show')).toBe(false)
})

test('toast honours a custom duration', () => {
  vi.useFakeTimers()
  document.body.innerHTML = '<div id="toast"><span></span></div>'
  showToast('x', 6000); vi.advanceTimersByTime(5000)
  expect(document.getElementById('toast').classList.contains('show')).toBe(true)
})

test('burst adds six icons then cleans up', () => {
  vi.useFakeTimers()
  document.body.innerHTML = '<div id="h"></div>'
  const host = document.getElementById('h')
  burst(10, 10, host, false)
  expect(host.querySelectorAll('.heart')).toHaveLength(6)
  vi.advanceTimersByTime(1700)
  expect(host.querySelectorAll('.heart')).toHaveLength(0)
})

test('burst does nothing under reduced motion', () => {
  document.body.innerHTML = '<div id="h"></div>'
  const host = document.getElementById('h')
  burst(10, 10, host, true)
  expect(host.children).toHaveLength(0)
})

test('selectable toast lets the visitor copy the text, normal toast does not', () => {
  vi.useFakeTimers()
  document.body.innerHTML = '<div id="toast"><span></span></div>'
  const el = document.getElementById('toast')
  showToast('My email: a@b.c', 10000, { selectable: true })
  expect(el.classList.contains('selectable')).toBe(true)
  showToast('Opening an email to Mian')
  expect(el.classList.contains('selectable')).toBe(false)
})
