import { T, pickLang, readSavedLang, saveLang, t, applyLang } from '../src/i18n.js'

test('both languages have identical keys', () => {
  expect(Object.keys(T.zh).sort()).toEqual(Object.keys(T.en).sort())
})

test('pickLang', () => {
  expect(pickLang('zh', 'en-US')).toBe('zh')
  expect(pickLang(null, 'zh-TW')).toBe('zh')
  expect(pickLang(null, 'en-CA')).toBe('en')
  expect(pickLang(null, undefined)).toBe('en')
  expect(pickLang('fr', 'zh-CN')).toBe('zh') // invalid saved value ignored
})

test('storage that throws is tolerated', () => {
  const bad = { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') } }
  expect(readSavedLang(bad)).toBeNull()
  expect(() => saveLang('zh', bad)).not.toThrow()
})

test('saved language round-trips through storage', () => {
  const m = new Map()
  const s = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }
  saveLang('zh', s)
  expect(readSavedLang(s)).toBe('zh')
})

test('t interpolates', () => {
  expect(t('zh', 'toastEmail', { email: 'a@b.c' })).toBe('我的邮箱：a@b.c')
  expect(t('en', 'ariaDot', { n: '2' })).toBe('Photo 2')
})

test('applyLang updates document', () => {
  document.documentElement.innerHTML = `<head><title></title><meta name="description" content=""></head>
    <body><span data-i="status"></span><p data-h="tagline"></p><button data-aria="ariaCart"></button>
    <img data-alt="alt" alt="">
    <div class="lang"><button data-l="en"></button><button data-l="zh"></button></div></body>`
  applyLang(document, 'zh')
  expect(document.documentElement.lang).toBe('zh-CN')
  expect(document.title).toBe('朱勉')
  expect(document.querySelector('[data-i=status]').textContent).toBe('精品好男人 · 名草无主')
  expect(document.querySelector('[data-h=tagline] em').textContent).toBe('热爱生活。')
  expect(document.querySelector('meta[name=description]').content).toBe('情绪稳定，热爱生活。')
  expect(document.querySelector('[data-aria]').getAttribute('aria-label')).toBe('购物车')
  expect(document.querySelector('img').alt).toBe('朱勉的照片')
  expect(document.querySelector('[data-l=zh]').getAttribute('aria-pressed')).toBe('true')
  expect(document.querySelector('[data-l=en]').classList.contains('on')).toBe(false)
  applyLang(document, 'en')
  expect(document.documentElement.lang).toBe('en')
  expect(document.title).toBe('Mian')
})

test('no emoji in any string', () => {
  const all = [...Object.values(T.en), ...Object.values(T.zh)].join('')
  expect(/\p{Extended_Pictographic}/u.test(all)).toBe(false)
})

test('copy stays warm but not cheesy (no hugs, no "photos of us")', () => {
  const all = [...Object.values(T.en), ...Object.values(T.zh)].join('\n')
  for (const phrase of ['抱抱', '疼人', '我们的照片', '包你开心', 'hug', 'photo of us', 'Smiles included']) {
    expect(all).not.toContain(phrase)
  }
})

test('specs say the real birth year, not a confusing "2026 model"', () => {
  expect(T.zh.specSub).toContain('1995')
  expect(T.en.specSub).toContain('1995')
  expect(T.zh.s10v).toBe('1995 年 · 射手座')
  expect(T.en.s10v).toBe('1995 · Sagittarius')
})

test('smoking note is the clearer "smoke-free edition"', () => {
  expect(T.zh.s5n).toBe('无烟版，零排放；一杯就脸红。')
  expect(T.en.s5n).toBe('Smoke-free edition. One drink and my face turns red.')
})

test('weekend copy reads like Mian talking, not ad copy', () => {
  expect(T.zh.h2s).toBe('有时候就是想出去兜兜风，开到哪算哪。')
  expect(T.zh.h4s).toBe('一年也就去一两次，主要是去看星星、拍银河。')
  const all = Object.values(T.zh).join('\n')
  for (const p of ['零食和歌单', '主要是为了看星星']) expect(all).not.toContain(p)
})

test('no leftover cart-email copy', () => {
  expect(T.en).not.toHaveProperty('mailBodyCart')
})

test('about headline: serious relationship in both languages', () => {
  expect(T.en.aboutTitle).toBe('Looking for something <em>serious.</em>')
  expect(T.zh.aboutTitle).toBe('认真谈恋爱，<em>奔着结果去。</em>')
})

test('orientation reads naturally in Chinese', () => {
  expect(T.zh.s14).toBe('取向')
  expect(T.zh.s14v).toBe('异性恋')
  expect(T.zh.s14n).toBe('找的是女朋友。')
})

test("core items use Mian's own wording", () => {
  expect(T.zh.c1s).toBe('不开心就找我，想聊就聊，想出去吃就出去吃。')
  expect(T.zh.c2s).toBe('饿了跟我说，想吃啥我给你做。')
  expect(T.zh.c3s).toBe('你想干啥我都支持，大事小事都站你这边。')
  expect(T.zh.c4s).toBe('想吐槽就吐槽，想碎碎念就碎碎念，我都听着。')
})

test('status is the playful "premium good guy, single" line', () => {
  expect(T.zh.status).toBe('精品好男人 · 名草无主')
  expect(T.en.status).toBe('Premium good guy · Not taken yet')
  expect(T.zh.shareTitle).toBe('朱勉 · 精品好男人，名草无主')
})

test('referral bonus wording', () => {
  expect(T.zh.referral).toBe('推荐有礼：介绍成功的，婚礼红包免了，还给你留主桌。')
  expect(T.en.referral).toBe('Referral bonus: set us up and skip the wedding gift. Head-table seat included.')
})

test('merged spec rows read naturally', () => {
  expect(T.zh.s1).toBe('身高体重')
  expect(T.zh.s5).toBe('烟酒')
  expect(T.zh.s5v).toBe('不抽烟 · 一年喝两三次')
  expect(T.en.s5v).toBe("Don't smoke · Drink 2–3 times a year")
  expect(T.en).not.toHaveProperty('s2')
  expect(T.en).not.toHaveProperty('s6')
})

test('known issues: four items, each with a workaround', () => {
  for (const l of ['en', 'zh']) {
    for (const k of ['issuesTitle', 'workaround', 'issuesNote', 'i1', 'i1w', 'i2', 'i2w', 'i3', 'i3w', 'i4', 'i4w']) expect(T[l][k], l + k).toBeTruthy()
  }
  expect(T.zh.issuesNote).toBe('以上问题均不影响正常使用。')
  expect(T.zh.workaround).toBe('临时解决方法：')
})

test("known issues are funny bug reports of Mian's real habits", () => {
  expect(T.zh.i1).toBe('买瓶洗发水，也要先做个横向对比。')
  expect(T.zh.i1w).toBe('好处是，家里的东西都很值。')
  expect(T.zh.i2).toBe('一个决定能想三天，最后选的还是第一天想好的那个。')
  expect(T.zh.i2w).toBe('直接问我第一反应，能省三天。')
  expect(T.zh.i3).toBe('连下一周雨，会自动进入「开车出去转转」模式。')
  expect(T.zh.i3w).toBe('无法关闭，但可以带上你。')
  expect(T.zh.i4).toBe('看到好光线会突然停下，原地拍十分钟。')
  expect(T.zh.i4w).toBe('这十分钟里，你会收获很多好看的照片。')
})
