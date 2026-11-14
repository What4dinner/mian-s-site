import { t } from './i18n.js'

/**
 * The "share card" sheet: shows the generated card image with Save image / Share link.
 * deps: render(lang) → image URL, lang() → current language, inWeChat, toast(text), shareLink().
 */
export function initCardSheet(el, { render, lang, inWeChat, toast, shareLink }) {
  const img = el.querySelector('.card-preview img')
  const save = el.querySelector('.card-save')
  let lastFocus = null
  let cache = {}

  function close() {
    el.hidden = true
    document.documentElement.classList.remove('sheet-open')
    if (lastFocus && lastFocus.focus) lastFocus.focus()
  }

  async function open() {
    lastFocus = document.activeElement
    el.hidden = false
    el.classList.remove('ready', 'failed')
    document.documentElement.classList.add('sheet-open')
    el.querySelector('.sheet-close').focus?.()
    const l = lang()
    try {
      const url = cache[l] || (cache[l] = await render(l))
      img.setAttribute('src', url)
      save.setAttribute('href', url)
      el.classList.add('ready')
    } catch {
      el.classList.add('failed')
    }
  }

  el.querySelector('.sheet-close').addEventListener('click', close)
  el.addEventListener('click', (e) => { if (e.target === el) close() }) // backdrop
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.hidden) close() })
  save.addEventListener('click', (e) => {
    if (inWeChat) {
      // WeChat blocks downloads; long-press on the image is how people save it there.
      e.preventDefault()
      toast(t(lang(), 'toastLongPress'))
    }
  })
  el.querySelector('.card-link').addEventListener('click', () => shareLink())

  return { open, close, resetCache: () => { cache = {} } }
}
