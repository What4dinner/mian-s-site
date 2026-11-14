import { sharePage } from '../src/share.js'

const base = (over = {}) => ({
  lang: 'zh',
  url: 'https://dating.zhumian.ca/',
  inWeChat: false,
  nav: {},
  clipboard: { writeText: vi.fn().mockResolvedValue() },
  toast: vi.fn(),
  ...over,
})

test('uses the system share sheet when available', async () => {
  const share = vi.fn().mockResolvedValue()
  const d = base({ nav: { share } })
  await sharePage(d)
  expect(share).toHaveBeenCalledWith({ title: '朱勉 · 精品好男人，名草无主', text: '朱勉：情绪稳定，热爱生活，认真谈恋爱。', url: 'https://dating.zhumian.ca/' })
  expect(d.toast).not.toHaveBeenCalled()
})

test('cancelling the share sheet is silent', async () => {
  const err = Object.assign(new Error('cancel'), { name: 'AbortError' })
  const d = base({ nav: { share: vi.fn().mockRejectedValue(err) } })
  await sharePage(d)
  expect(d.toast).not.toHaveBeenCalled()
  expect(d.clipboard.writeText).not.toHaveBeenCalled()
})

test('no share sheet (desktop): copies the link', async () => {
  const d = base({ lang: 'en' })
  await sharePage(d)
  expect(d.clipboard.writeText).toHaveBeenCalledWith('https://dating.zhumian.ca/')
  expect(d.toast).toHaveBeenCalledWith('Link copied. Send it her way.', expect.anything())
})

test('inside WeChat: points to the ··· menu instead', async () => {
  const share = vi.fn()
  const d = base({ inWeChat: true, nav: { share } })
  await sharePage(d)
  expect(share).not.toHaveBeenCalled()
  expect(d.toast).toHaveBeenCalledWith('点右上角 ··· ，发送给朋友', expect.anything())
})

test('clipboard blocked: shows the link as selectable text', async () => {
  const d = base({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error('no')) } })
  await sharePage(d)
  expect(d.toast).toHaveBeenCalledWith('https://dating.zhumian.ca/', { ms: 10000, selectable: true })
})
