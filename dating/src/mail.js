import { t } from './i18n.js'

const SUBJECT = { en: 'Hi Mian', zh: '你好，朱勉' }

/** mailto: link for the "Write an email" button on the email card. */
export function mailtoHref(email, lang) {
  return `mailto:${email}?subject=${encodeURIComponent(SUBJECT[lang])}&body=${encodeURIComponent(t(lang, 'mailBodyMail'))}`
}

let pending = 0
/** Open the mail app after `delay`; taps while one is pending are ignored (no duplicate drafts). */
export function scheduleMail(href, delay, go = (h) => { location.href = h }) {
  if (pending) return
  pending = setTimeout(() => {
    pending = 0
    go(href)
  }, delay)
}

/**
 * After handing off to mailto:, call onFail if the page never loses focus/visibility within `ms`
 * (no mail app configured, e.g. desktop Chrome on Windows).
 */
export function watchMailFallback(win, doc, onFail, ms = 1500) {
  let left = false
  const mark = () => { left = true }
  const onVis = () => { if (doc.visibilityState === 'hidden') left = true }
  win.addEventListener('blur', mark, { once: true })
  doc.addEventListener('visibilitychange', onVis)
  setTimeout(() => {
    win.removeEventListener('blur', mark)
    doc.removeEventListener('visibilitychange', onVis)
    if (!left) onFail()
  }, ms)
}

/** WeChat's in-app browser usually ignores mailto: links. */
export function isWeChat(ua) {
  return /MicroMessenger/i.test(ua || '')
}
