import { faSvg } from './icons.js'

const BURST_COLORS = ['#1F6FEB', '#FFC93C', '#1F6FEB', '#E8735A', '#1D1D1F', '#FFC93C']

/** Six hearts/stars float up from (x, y), relative to `host`'s top-left. */
export function burst(x, y, host, reducedMotion) {
  if (reducedMotion) return
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span')
    h.className = 'heart'
    h.innerHTML = faSvg(i % 3 === 2 ? 'solid:star' : 'solid:heart')
    h.style.color = BURST_COLORS[i]
    h.style.left = `${x - 10 + (Math.random() * 40 - 20)}px`
    h.style.top = `${y - 10}px`
    h.style.setProperty('--dx', `${Math.random() * 90 - 45}px`)
    h.style.animationDelay = `${i * 55}ms`
    host.appendChild(h)
    setTimeout(() => h.remove(), 1600)
  }
}

/** Burst at a pointer event's position inside `host`. */
export function burstAt(event, host, reducedMotion) {
  const r = host.getBoundingClientRect()
  burst(event.clientX - r.left, event.clientY - r.top, host, reducedMotion)
}

let toastTimer
/** Single dark toast at the bottom; each call replaces the text and restarts the hide timer. */
export function showToast(text, ms = 2400, { selectable = false } = {}) {
  const el = document.getElementById('toast')
  if (!el) return
  el.querySelector('span').textContent = text
  el.classList.toggle('selectable', selectable)
  el.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('show'), ms)
}

/** Restart the "jelly" squish on an element. */
export function jelly(el) {
  el.classList.remove('bump')
  void el.offsetWidth
  el.classList.add('bump')
}

/** Fade blocks up as they enter the viewport; grid children stagger by 70ms. */
export function initReveal(root, reducedMotion) {
  const els = [...root.querySelectorAll('.reveal')]
  if (reducedMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'))
    return
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in')
        io.unobserve(en.target)
      }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  els.forEach((el) => {
    const p = el.parentElement
    if (p && /\b(tiles|core-list|feat-grid)\b/.test(p.className)) {
      el.style.transitionDelay = `${[...p.children].indexOf(el) * 70}ms`
    }
    io.observe(el)
  })
}
