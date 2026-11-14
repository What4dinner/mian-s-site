import { photoMarkup } from './photos.js'
import { t } from './i18n.js'

/** Fan pose per stack position (0 = top). */
export const DECK_POSE = { rot: [-3, 4, -7, 6], x: [0, 10, -12, 14] }
const ANIM_MS = 700
const FLY_MS = 260

export function rotate(order) {
  return [...order.slice(1), order[0]]
}

/**
 * Hero photo deck. Tap/click/Enter/Space: the top card flies off left and rejoins at the back.
 * Ignores input while a flight is in progress, so rapid taps can't desync the stack.
 */
export function initDeck(el, slots, { lang, reducedMotion, onNext }) {
  const total = slots.length
  el.innerHTML = slots
    .map((p, i) => `<div class="dcard">${photoMarkup(p, { index: i, total, alt: t(lang(), 'alt'), phLabel: t(lang(), 'ph'), eager: i === 0 })}</div>`)
    .join('')
  const cards = [...el.children]
  let order = cards.map((_, i) => i)
  let busy = false

  function layout() {
    order.forEach((k, p) => {
      const q = Math.min(p, DECK_POSE.rot.length - 1)
      Object.assign(cards[k].style, {
        zIndex: String(10 - p),
        opacity: p > 2 ? '0' : '1',
        transform: `translate(${DECK_POSE.x[q]}px,${p * 6}px) rotate(${DECK_POSE.rot[q]}deg) scale(${1 - p * 0.035})`,
      })
    })
  }

  function next() {
    if (busy || total < 2) return
    onNext()
    if (reducedMotion) {
      order = rotate(order)
      layout()
      return
    }
    busy = true
    cards[order[0]].style.transform = 'translate(-120%,-6%) rotate(-24deg)'
    setTimeout(() => {
      order = rotate(order)
      layout()
    }, FLY_MS)
    setTimeout(() => { busy = false }, ANIM_MS)
  }

  el.addEventListener('click', next)
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      next()
    }
  })
  layout()
  return { next }
}
