// Microsoft Clarity — a separate project from the resume site (VITE_DATING_CLARITY_ID).
// Loaded after the page is idle so it never counts against the performance budget.
// If it is missing (local dev) or blocked (mainland China), everything still works.

const MAX_QUEUE = 20
let clarity = null
let queue = []

function send(name, tags) {
  try {
    for (const [k, v] of Object.entries(tags || {})) clarity.setTag(k, v)
    clarity.event(name)
  } catch {
    /* analytics must never break the page */
  }
}

/** Custom events: add_to_cart, contact_me, lang_switch ({ lang }), deck_next. */
export function track(name, tags) {
  if (clarity) send(name, tags)
  else if (queue.length < MAX_QUEUE) queue.push([name, tags])
}

function whenIdle() {
  return new Promise((resolve) => {
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(() => resolve(), { timeout: 4000 }) : setTimeout(resolve, 2000))
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
  })
}

export async function loadAnalytics(id, loader = () => import('@microsoft/clarity'), opts = {}) {
  if (!id) return
  try {
    if (!opts.immediate) await whenIdle()
    const mod = await loader()
    const c = mod.default || mod
    c.init(id)
    clarity = c
    const pending = queue
    queue = []
    pending.forEach(([name, tags]) => send(name, tags))
  } catch {
    /* blocked or failed: stay silent */
  }
}

/** Test helper. */
export function _resetForTest() {
  clarity = null
  queue = []
}
