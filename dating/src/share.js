import { t } from './i18n.js'

/**
 * "Share with a single friend":
 * - inside WeChat, web pages can't open the share sheet, so point to WeChat's own ··· menu;
 * - otherwise use the system share sheet (phones) and stay quiet if the visitor cancels;
 * - with no share sheet (most desktops), copy the link, or show it if the clipboard is blocked.
 */
export async function sharePage({ lang, url, inWeChat, nav, clipboard, toast }) {
  if (inWeChat) {
    toast(t(lang, 'toastShareWechat'), { ms: 5000 })
    return
  }
  if (nav.share) {
    try {
      await nav.share({ title: t(lang, 'shareTitle'), text: t(lang, 'shareText'), url })
      return
    } catch (e) {
      if (e && e.name === 'AbortError') return
    }
  }
  try {
    await clipboard.writeText(url)
    toast(t(lang, 'toastLinkCopied'), { ms: 3000 })
  } catch {
    toast(url, { ms: 10000, selectable: true })
  }
}
