import fs from 'node:fs'
import path from 'node:path'
import { T } from '../src/i18n.js'

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8')
const doc = new DOMParser().parseFromString(html, 'text/html')

test('every data-i/data-h/data-aria key exists in T', () => {
  const els = [...doc.querySelectorAll('[data-i],[data-h],[data-aria]')]
  expect(els.length).toBeGreaterThan(50)
  for (const e of els) {
    const k = e.dataset.i ?? e.dataset.h ?? e.dataset.aria
    expect(T.en, k).toHaveProperty(k)
  }
})

test('no-JS fallback: English text and mailto hrefs are in the raw HTML', () => {
  expect(doc.querySelector('[data-i=status]').textContent).toBe('Premium good guy · Not taken yet')
  expect(doc.querySelector('[data-h=tagline] em').textContent).toBe('Loves life.')
  // Add to Cart / Contact me (hero + CTA) jump to the contact cards; without JS the anchor still works.
  const acts = [...doc.querySelectorAll('a[data-act]')]
  expect(acts.map((a) => a.dataset.act).sort()).toEqual(['cart', 'cart', 'chat', 'chat', 'chat'])
  for (const a of acts) expect(a.getAttribute('href')).toBe('#contact')
  expect(doc.getElementById('contact').classList.contains('contact')).toBe(true)
  expect(doc.querySelector('.email-card a[data-mail]').getAttribute('href')).toMatch(/^mailto:%VITE_EMAIL%\?subject=/)
})

test('no external font/icon/CDN URLs in source', () => {
  expect(html).not.toMatch(/googleapis|gstatic|jsdelivr|cdnjs|unpkg|font-awesome/)
})

test('icons use data-fa, not Font Awesome classes', () => {
  expect(html).not.toMatch(/class="fa-(solid|regular)/)
})

test('anchors exist', () => {
  for (const id of ['box', 'features', 'specs']) expect(doc.getElementById(id)).not.toBeNull()
})

test('SEO and link-preview tags', () => {
  const meta = (sel) => doc.querySelector(sel)?.getAttribute('content')
  expect(doc.querySelector('link[rel=canonical]').getAttribute('href')).toBe('https://dating.zhumian.ca/')
  expect(meta('meta[property="og:title"]')).toBe('Mian · Premium good guy')
  expect(meta('meta[property="og:description"]')).toBe('Even-tempered. Loves life.')
  expect(meta('meta[property="og:image"]')).toBe('https://dating.zhumian.ca/og.png')
  expect(meta('meta[property="og:image:width"]')).toBe('1200')
  expect(meta('meta[property="og:image:height"]')).toBe('630')
  expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image')
  expect(doc.querySelector('meta[name=robots]')).toBeNull()
})

test('robots.txt allows crawling', () => {
  const robots = fs.readFileSync(path.resolve(__dirname, '../public/robots.txt'), 'utf8')
  expect(robots).toMatch(/User-agent: \*\s+Allow: \//)
})

describe('JS failsafe in <head>', () => {
  const inline = [...doc.querySelectorAll('head script:not([src])')].map((s) => s.textContent).join('\n')
  afterEach(() => { vi.useRealTimers(); delete window.__datingReady; document.documentElement.className = '' })

  test('content un-hides if the app bundle never starts', () => {
    vi.useFakeTimers()
    new Function(inline)()
    expect(document.documentElement.classList.contains('js')).toBe(true)
    vi.advanceTimersByTime(2600)
    expect(document.documentElement.classList.contains('js')).toBe(false)
  })

  test('stays hidden-for-reveal when the app has started', () => {
    vi.useFakeTimers()
    new Function(inline)()
    window.__datingReady = true
    vi.advanceTimersByTime(2600)
    expect(document.documentElement.classList.contains('js')).toBe(true)
  })
})

test('"the serious part" section with what Mian is looking for', () => {
  const about = doc.getElementById('about')
  expect(about).not.toBeNull()
  expect(about.querySelectorAll('.traits li')).toHaveLength(4)
  expect(about.querySelector('[data-h=aboutTitle]')).not.toBeNull()
  expect(about.querySelector('[data-i=aboutNote]').textContent).toContain('Victoria')
})

test('new spec rows: year, occupation with résumé link, settling down, kids & pets', () => {
  for (const k of ['s10', 's11', 's12', 's13']) expect(doc.querySelector(`[data-i=${k}]`), k).not.toBeNull()
  const resume = doc.querySelector('a.resume')
  expect(resume.getAttribute('href')).toBe('https://zhumian.ca/')
  expect(resume.getAttribute('target')).toBe('_blank')
  expect(resume.getAttribute('rel')).toContain('noopener')
})

test('WeChat card is hidden until a QR image exists', () => {
  const card = doc.getElementById('wechat')
  expect(card).not.toBeNull()
  expect(card.hasAttribute('hidden')).toBe(true)
})

test('no-JS fallback text matches the English copy for every data-i / data-h', () => {
  for (const el of doc.querySelectorAll('[data-i]')) {
    if (el.dataset.i === 'ph') continue
    expect(el.textContent, el.dataset.i).toBe(T.en[el.dataset.i])
  }
  for (const el of doc.querySelectorAll('[data-h]')) {
    const ref = new DOMParser().parseFromString(`<div>${T.en[el.dataset.h]}</div>`, 'text/html').body.firstChild
    expect(el.innerHTML, el.dataset.h).toBe(ref.innerHTML)
  }
})

test('contact options sit side by side: email card next to the WeChat card', () => {
  const contact = doc.querySelector('.cta .contact')
  expect(contact).not.toBeNull()
  const cards = contact.querySelectorAll(':scope > .contact-card')
  expect(cards).toHaveLength(2)
  expect(cards[0].classList.contains('email-card')).toBe(true)
  expect(cards[1].id).toBe('wechat')
  expect(cards[0].querySelector('.email-addr').textContent).toBe('%VITE_EMAIL%')
  expect(cards[0].querySelector('a[data-mail]')).not.toBeNull()
})

test('nav bar has a Contact me button that goes to the contact cards', () => {
  const btn = doc.querySelector('header.nav a.nav-cta[data-act=chat]')
  expect(btn).not.toBeNull()
  expect(btn.getAttribute('href')).toBe('#contact')
  expect(btn.querySelector('[data-i=contact]').textContent).toBe('Contact me')
})

test('share block under the contact cards', () => {
  const share = doc.querySelector('.cta .share')
  expect(share).not.toBeNull()
  expect(share.querySelector('button.share-btn [data-i=shareBtn]').textContent).toBe('Share with a single friend')
  expect(share.querySelector('[data-i=shareHint]').textContent).toBe('Know a single woman who might be a good match? Send this her way.')
})

test('spec row for orientation', () => {
  expect(doc.querySelector('[data-i=s14]').textContent).toBe('Orientation')
  expect(doc.querySelector('[data-i=s14v]').textContent).toBe('Straight')
})

test('card sheet markup exists and starts hidden', () => {
  const s = doc.getElementById('card-sheet')
  expect(s.hasAttribute('hidden')).toBe(true)
  expect(s.getAttribute('role')).toBe('dialog')
  expect(s.querySelector('a.card-save').getAttribute('download')).toBe('zhumian-card.png')
})

test('referral bonus line sits with the share button', () => {
  expect(doc.querySelector('.share .referral [data-i=referral]')).not.toBeNull()
})

test('specs are trimmed: height & weight and smoking & drinking are single rows', () => {
  expect(doc.querySelectorAll('.spec')).toHaveLength(12)
  expect(doc.querySelector('[data-i=s2]')).toBeNull()
  expect(doc.querySelector('[data-i=s6]')).toBeNull()
  expect(doc.querySelector('[data-i=s1]').closest('.spec').querySelector('dd').textContent).toBe('178 cm · 70 kg')
})

test('known issues block follows the spec rows', () => {
  const issues = doc.querySelector('.specs .issues')
  expect(issues).not.toBeNull()
  expect(issues.querySelectorAll('.issue-list li')).toHaveLength(4)
  expect(issues.querySelector('[data-i=issuesNote]')).not.toBeNull()
})

test('Chinese display text uses Geist for digits (not the handwritten LXGW numerals)', () => {
  const fonts = fs.readFileSync(path.resolve(__dirname, '../src/styles/fonts.css'), 'utf8')
  expect(fonts).toMatch(/font-family:\s*"Digits"[\s\S]*unicode-range:\s*U\+0030-0039/)
  const base = fs.readFileSync(path.resolve(__dirname, '../src/styles/base.css'), 'utf8')
  expect(base).toMatch(/html:lang\(zh\) \.note,html:lang\(zh\) \.traits li\{font-family:"Digits","LXGW WenKai Medium"/)
  expect(base).toMatch(/font-family:"Digits","LXGW WenKai Medium","Noto Sans SC",serif;font-style:normal;font-weight:400;font-synthesis:none\}/)
})
