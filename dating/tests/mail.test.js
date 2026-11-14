import { mailtoHref, isWeChat } from '../src/mail.js'

const subject = (h) => decodeURIComponent(h.split('subject=')[1].split('&')[0])
const body = (h) => decodeURIComponent(h.split('body=')[1])

test('subject and body are percent-encoded', () => {
  const zh = mailtoHref('a@b.c', 'zh')
  expect(zh.startsWith('mailto:a@b.c?subject=')).toBe(true)
  expect(subject(zh)).toBe('你好，朱勉')
  expect(body(zh)).toBe('朱勉你好，\n\n')
  expect(subject(mailtoHref('a@b.c', 'en'))).toBe('Hi Mian')
})

test('wechat detection', () => {
  expect(isWeChat('Mozilla/5.0 (iPhone) MicroMessenger/8.0.50')).toBe(true)
  expect(isWeChat('Mozilla/5.0 (iPhone) Safari/604.1')).toBe(false)
  expect(isWeChat(undefined)).toBe(false)
})

import { scheduleMail, watchMailFallback } from '../src/mail.js'

describe('mail launching', () => {
  afterEach(() => vi.useRealTimers())

  test('rapid taps open the mail app only once', () => {
    vi.useFakeTimers()
    const go = vi.fn()
    scheduleMail('mailto:a', 900, go)
    vi.advanceTimersByTime(300)
    scheduleMail('mailto:a', 900, go)
    scheduleMail('mailto:a', 900, go)
    vi.advanceTimersByTime(1000)
    expect(go).toHaveBeenCalledTimes(1)
    expect(go).toHaveBeenCalledWith('mailto:a')
  })

  test('fallback fires when the page keeps focus (no mail app)', () => {
    vi.useFakeTimers()
    const onFail = vi.fn()
    watchMailFallback(window, document, onFail, 1500)
    vi.advanceTimersByTime(1600)
    expect(onFail).toHaveBeenCalledTimes(1)
  })

  test('no fallback when the mail app takes focus', () => {
    vi.useFakeTimers()
    const onFail = vi.fn()
    watchMailFallback(window, document, onFail, 1500)
    window.dispatchEvent(new Event('blur'))
    vi.advanceTimersByTime(1600)
    expect(onFail).not.toHaveBeenCalled()
  })
})
