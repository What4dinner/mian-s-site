import { photoMarkup } from './photos.js'
import { faSvg } from './icons.js'

export function clampIndex(i, n) {
  return Math.max(0, Math.min(n - 1, i))
}

export function indexFromScroll(scrollLeft, width) {
  return width > 0 ? Math.round(scrollLeft / width) : 0
}

/**
 * Swipeable 4:3 slideshow: native scroll-snap track, dots, and prev/next arrows
 * (arrows are shown on hover-capable devices by CSS, disabled at the ends).
 */
export function initSlideshow(el, slots, { alt, phLabel, reducedMotion }) {
  const n = slots.length
  el.innerHTML =
    '<div class="track">' +
    slots.map((p, i) => `<div class="slide">${photoMarkup(p, { index: i, total: n, alt, phLabel, eager: false })}</div>`).join('') +
    '</div>' +
    `<button type="button" class="arrow prev" data-aria="ariaPrev" aria-label="Previous photo">${faSvg('solid:chevron-left')}</button>` +
    `<button type="button" class="arrow next" data-aria="ariaNext" aria-label="Next photo">${faSvg('solid:chevron-right')}</button>` +
    '<div class="dots">' +
    slots.map((_, i) => `<button type="button" data-aria="ariaDot" data-n="${i + 1}" aria-label="Photo ${i + 1}"></button>`).join('') +
    '</div>'

  const track = el.querySelector('.track')
  const prev = el.querySelector('.prev')
  const next = el.querySelector('.next')
  const dots = [...el.querySelectorAll('.dots button')]
  let current = -1

  function show(i) {
    if (i === current) return
    current = i
    dots.forEach((d, j) => {
      d.classList.toggle('on', j === i)
      if (j === i) d.setAttribute('aria-current', 'true')
      else d.removeAttribute('aria-current')
    })
    prev.disabled = i <= 0
    next.disabled = i >= n - 1
  }

  const go = (i) => track.scrollTo({ left: clampIndex(i, n) * track.clientWidth, behavior: reducedMotion ? 'auto' : 'smooth' })

  let raf = 0
  track.addEventListener('scroll', () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      show(clampIndex(indexFromScroll(track.scrollLeft, track.clientWidth), n))
    })
  })
  dots.forEach((d, j) => d.addEventListener('click', () => go(j)))
  prev.addEventListener('click', () => go(current - 1))
  next.addEventListener('click', () => go(current + 1))
  show(0)
}
