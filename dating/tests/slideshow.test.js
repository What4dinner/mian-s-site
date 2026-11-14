import { clampIndex, indexFromScroll, initSlideshow } from '../src/slideshow.js'

test('clamp', () => {
  expect(clampIndex(-1, 3)).toBe(0)
  expect(clampIndex(5, 3)).toBe(2)
  expect(clampIndex(1, 3)).toBe(1)
})

test('indexFromScroll guards zero width', () => {
  expect(indexFromScroll(300, 0)).toBe(0)
  expect(indexFromScroll(610, 300)).toBe(2)
})

function make(n) {
  document.body.innerHTML = '<div class="show" id="s"></div>'
  const el = document.getElementById('s')
  initSlideshow(el, Array.from({ length: n }, () => null), { alt: '', phLabel: 'Photo', reducedMotion: true })
  return el
}

test('renders n slides and n labelled dots, prev disabled at start', () => {
  const el = make(3)
  expect(el.querySelectorAll('.slide')).toHaveLength(3)
  const dots = el.querySelectorAll('.dots button')
  expect(dots).toHaveLength(3)
  expect(dots[1].dataset.aria).toBe('ariaDot')
  expect(dots[1].dataset.n).toBe('2')
  expect(dots[0].classList.contains('on')).toBe(true)
  expect(dots[0].getAttribute('aria-current')).toBe('true')
  expect(el.querySelector('.arrow.prev').disabled).toBe(true)
  expect(el.querySelector('.arrow.next').disabled).toBe(false)
})

test('next arrow scrolls by one slide width', () => {
  const el = make(3)
  const track = el.querySelector('.track')
  Object.defineProperty(track, 'clientWidth', { value: 300 })
  const calls = []
  track.scrollTo = (o) => calls.push(o)
  el.querySelector('.arrow.next').click()
  expect(calls[0]).toEqual({ left: 300, behavior: 'auto' })
})

test('single photo: both arrows disabled', () => {
  const el = make(1)
  expect(el.querySelector('.arrow.next').disabled).toBe(true)
})
