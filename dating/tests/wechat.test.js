import { initWechat, copyWechatId } from '../src/wechat.js'

const CARD = `<div id="wechat" hidden><div class="qr"></div>
  <div class="wechat-id-row"><span class="wechat-id"></span><button type="button" class="copy-id"></button></div></div>`

test('stays hidden with neither a QR nor an ID', () => {
  document.body.innerHTML = CARD
  const card = document.getElementById('wechat')
  expect(initWechat(card, {}, { alt: 'WeChat QR code' })).toBe(false)
  expect(card.hidden).toBe(true)
})

test('shows the generated QR image and the WeChat ID', () => {
  document.body.innerHTML = CARD
  const card = document.getElementById('wechat')
  expect(initWechat(card, { qrUrl: '/assets/qr.png', wechatId: 'someone' }, { alt: '微信二维码' })).toBe(true)
  expect(card.hidden).toBe(false)
  const img = card.querySelector('.qr img')
  expect(img.getAttribute('src')).toBe('/assets/qr.png')
  expect(img.getAttribute('alt')).toBe('微信二维码')
  expect(img.dataset.alt).toBe('wechatAlt')
  expect(card.querySelector('.wechat-id').textContent).toBe('someone')
})

test('ID row hides when there is no ID', () => {
  document.body.innerHTML = CARD
  const card = document.getElementById('wechat')
  initWechat(card, { qrUrl: '/q.png' }, { alt: '' })
  expect(card.querySelector('.wechat-id-row').hidden).toBe(true)
})

describe('copyWechatId', () => {
  const deps = (over = {}) => ({ clipboard: { writeText: vi.fn().mockResolvedValue() }, isMobile: false, inWeChat: false, open: vi.fn(), toast: vi.fn(), wait: (fn) => fn(), ...over })

  test('copies, confirms, and opens WeChat on a phone browser', async () => {
    const d = deps({ isMobile: true })
    await copyWechatId('someone', 'zh', d)
    expect(d.clipboard.writeText).toHaveBeenCalledWith('someone')
    expect(d.toast).toHaveBeenCalledWith('微信号已复制，正在打开微信…', expect.anything())
    expect(d.open).toHaveBeenCalledWith('weixin://')
  })

  test('does not try to open WeChat on desktop or inside WeChat', async () => {
    for (const d of [deps(), deps({ isMobile: true, inWeChat: true })]) {
      await copyWechatId('someone', 'en', d)
      expect(d.open).not.toHaveBeenCalled()
      expect(d.toast).toHaveBeenCalledWith('WeChat ID copied: someone', expect.anything())
    }
  })

  test('clipboard blocked: shows the ID as selectable text instead', async () => {
    const d = deps({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, isMobile: true })
    await copyWechatId('someone', 'zh', d)
    expect(d.toast).toHaveBeenCalledWith('微信号：someone', { ms: 10000, selectable: true })
    expect(d.open).not.toHaveBeenCalled()
  })
})

import { contactTarget } from '../src/wechat.js'

test('Add to Cart / Contact me scroll to the WeChat card, or the contact cards if WeChat is hidden', () => {
  document.body.innerHTML = '<div class="contact" id="contact"><div class="contact-card email-card"></div><div class="contact-card wechat" id="wechat"></div></div>'
  expect(contactTarget(document).id).toBe('wechat')
  document.getElementById('wechat').hidden = true
  expect(contactTarget(document).id).toBe('contact')
})
