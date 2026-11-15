import './styles/fonts.css'
import './styles/base.css'
import './styles/motion.css'
// Chinese font declarations: loaded off the critical path (see styles/fonts.css).
import('./styles/cjk.generated.css')
import { applyLang, pickLang, readSavedLang, saveLang, t } from './i18n.js'
import { PHOTO_SETS } from './photo-sets.js'
import { slotsFor, PLACEHOLDER_COUNTS } from './photos.js'
import { initDeck } from './deck.js'
import { initSlideshow } from './slideshow.js'
import { initWechat, copyWechatId, contactTarget } from './wechat.js'
import { burstAt, showToast, jelly, initReveal } from './effects.js'
import { mailtoHref, isWeChat, scheduleMail, watchMailFallback } from './mail.js'
import { sharePage } from './share.js'
import { renderCardUrl } from './card.js'
import { initCardSheet } from './card-sheet.js'
import { track, loadAnalytics } from './analytics.js'

// Tells the <head> failsafe the app started; otherwise it un-hides the scroll-reveal content after 2.5s.
window.__datingReady = true

const email = import.meta.env.VITE_EMAIL
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const inWeChat = isWeChat(navigator.userAgent)
let lang = pickLang(readSavedLang(), navigator.language)

const mailLink = document.querySelector('.email-card a[data-mail]')

function setLang(next) {
  lang = next
  applyLang(document, lang)
  mailLink.href = mailtoHref(email, lang)
}

// Hero deck
const deckEl = document.getElementById('deck')
initDeck(deckEl, slotsFor(PHOTO_SETS.hero, PLACEHOLDER_COUNTS.hero), {
  lang: () => lang,
  reducedMotion,
  onNext: () => track('deck_next'),
})
deckEl.addEventListener('click', (e) => burstAt(e, deckEl, reducedMotion))

// Hobby slideshows
document.querySelectorAll('.show[data-set]').forEach((el) => {
  const set = el.dataset.set
  initSlideshow(el, slotsFor(PHOTO_SETS[set], PLACEHOLDER_COUNTS[set]), {
    alt: t(lang, 'alt'),
    phLabel: t(lang, 'ph'),
    reducedMotion,
  })
  el.querySelectorAll('.slide').forEach((s) => s.addEventListener('click', (e) => burstAt(e, s, reducedMotion)))
})

// WeChat card: QR generated at build time from VITE_WECHAT_QR (build/wechat-qr.js), plus the WeChat ID.
const wechatCard = document.getElementById('wechat')
const qrUrl = Object.values(import.meta.glob('./generated/wechat-qr.png', { eager: true, import: 'default', query: '?url' }))[0]
const wechatId = import.meta.env.VITE_WECHAT_ID
const hasWechat = initWechat(wechatCard, { qrUrl, wechatId }, { alt: t(lang, 'wechatAlt') })
if (!hasWechat) document.querySelector('.contact').classList.add('solo')
wechatCard.querySelector('.copy-id').addEventListener('click', () => {
  track('copy_wechat_id')
  copyWechatId(wechatId, lang, {
    clipboard: navigator.clipboard,
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    inWeChat,
    open: (href) => { location.href = href },
    toast: (text, { ms, selectable }) => showToast(text, ms, { selectable }),
  })
})

// Language switch
document.querySelectorAll('.lang [data-l]').forEach((b) => {
  b.addEventListener('click', () => {
    if (b.dataset.l === lang) return
    saveLang(b.dataset.l)
    setLang(b.dataset.l)
    track('lang_switch', { lang })
  })
})

// Add to Cart / Contact me / the cart icon: go to the contact cards, landing on WeChat.
const cart = document.getElementById('cart')
function goToContact() {
  const target = contactTarget(document)
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' })
  setTimeout(() => jelly(target), reducedMotion ? 0 : 450)
}
document.querySelectorAll('a[data-act]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault()
    track(a.dataset.act === 'cart' ? 'add_to_cart' : 'contact_me')
    if (a.dataset.act === 'cart') {
      cart.classList.add('has')
      jelly(cart)
      showToast(t(lang, inWeChat && hasWechat ? 'toastWechat' : 'toastCart'), 3000)
    } else if (inWeChat && hasWechat) {
      showToast(t(lang, 'toastWechat'), 3000)
    }
    goToContact()
  })
})
cart.addEventListener('click', () => {
  track('contact_me')
  jelly(cart)
  goToContact()
})

// "Write an email" on the email card
mailLink.addEventListener('click', (e) => {
  e.preventDefault()
  track('write_email')
  const showEmail =() => showToast(t(lang, 'toastEmail', { email }), 10000, { selectable: true })
  if (inWeChat) return showEmail() // WeChat ignores mailto:
  showToast(t(lang, 'toastMail'))
  scheduleMail(mailtoHref(email, lang), 600, (href) => {
    location.href = href
    watchMailFallback(window, document, showEmail)
  })
})

// Share with a single friend: a saveable card image, plus the link
const siteQr = Object.values(import.meta.glob('./generated/site-qr.png', { eager: true, import: 'default', query: '?url' }))[0]
const shareLink = () =>
  sharePage({
    lang,
    url: location.origin + '/',
    inWeChat,
    nav: navigator,
    clipboard: navigator.clipboard,
    toast: (text, { ms, selectable }) => showToast(text, ms, { selectable }),
  })
const cardSheet = initCardSheet(document.getElementById('card-sheet'), {
  render: (l) => renderCardUrl(l, { photoSrc: PHOTO_SETS.hero[0]?.img.src, qrSrc: siteQr }),
  lang: () => lang,
  inWeChat,
  toast: (text) => showToast(text, 3000),
  shareLink: () => {
    track('share_link')
    return shareLink()
  },
})
document.querySelector('.share-btn').addEventListener('click', () => {
  track('share_open')
  cardSheet.open()
})
document.querySelector('#card-sheet .card-save').addEventListener('click', () => track('save_card'))

setLang(lang)
initReveal(document, reducedMotion)

// Microsoft Clarity (separate project from the resume site). Loads after the page is idle;
// skipped when VITE_DATING_CLARITY_ID is unset, and harmless if blocked (e.g. in mainland China).
track('visit', { lang, in_wechat: inWeChat ? 'yes' : 'no' })
loadAnalytics(import.meta.env.VITE_DATING_CLARITY_ID)
