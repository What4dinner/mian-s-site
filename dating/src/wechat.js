import { t } from './i18n.js'

/**
 * Fills the WeChat card: the build-generated QR (src/generated/wechat-qr.png) and the WeChat ID.
 * Leaves the card hidden when there is neither.
 */
export function initWechat(card, { qrUrl, wechatId } = {}, { alt }) {
  if (!qrUrl && !wechatId) return false
  const qr = card.querySelector('.qr')
  if (qrUrl) {
    qr.innerHTML = `<img src="${qrUrl}" alt="" data-alt="wechatAlt" width="680" height="680" loading="lazy" decoding="async">`
    qr.querySelector('img').setAttribute('alt', alt)
  } else {
    qr.hidden = true
  }
  const row = card.querySelector('.wechat-id-row')
  if (wechatId) card.querySelector('.wechat-id').textContent = wechatId
  else row.hidden = true
  card.hidden = false
  return true
}

/**
 * "Copy WeChat ID": copy to clipboard and confirm; on a phone browser (not inside WeChat) also try
 * to open the WeChat app so the visitor can paste it into search. If the clipboard is blocked,
 * show the ID as selectable text instead.
 */
export async function copyWechatId(id, lang, { clipboard, isMobile, inWeChat, open, toast, wait = (fn) => setTimeout(fn, 900) }) {
  try {
    await clipboard.writeText(id)
  } catch {
    toast(t(lang, 'toastIdPlain', { id }), { ms: 10000, selectable: true })
    return
  }
  if (isMobile && !inWeChat) {
    toast(t(lang, 'toastIdOpen'), { ms: 2400 })
    wait(() => open('weixin://'))
  } else {
    toast(t(lang, 'toastIdCopied', { id }), { ms: 3000 })
  }
}

/** Where Add to Cart / Contact me land: the WeChat card if shown, otherwise the contact cards. */
export function contactTarget(doc) {
  const wechat = doc.getElementById('wechat')
  return wechat && !wechat.hidden ? wechat : doc.getElementById('contact')
}
