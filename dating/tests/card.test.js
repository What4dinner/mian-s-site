import { splitMarked, cardData } from '../src/card.js'

test('splitMarked separates the highlighted half of the tagline', () => {
  expect(splitMarked("情绪稳定，<span class='mark'><em>热爱生活。</em></span>")).toEqual({ plain: '情绪稳定，', marked: '热爱生活。' })
  expect(splitMarked('No mark here')).toEqual({ plain: 'No mark here', marked: '' })
})

test('Chinese card content', () => {
  const d = cardData('zh')
  expect(d.newLabel).toBe('新品')
  expect(d.name).toBe('朱勉')
  expect(d.tagline).toEqual({ plain: '情绪稳定，', marked: '热爱生活。' })
  expect(d.status).toBe('精品好男人 · 名草无主')
  expect(d.referral).toBe('推荐有礼：请喝咖啡；介绍成功，婚礼免红包')
  expect(d.chips).toEqual(['1995 年 · 射手座', '178 cm', '现居维多利亚', 'IT @ 维多利亚大学'])
  expect(d.scan).toBe('扫码看完整介绍')
  expect(d.url).toBe('dating.zhumian.ca')
})

test('English card content', () => {
  const d = cardData('en')
  expect(d.name).toBe('Mian')
  expect(d.chips).toEqual(['1995 · Sagittarius', '178 cm', 'Victoria, BC', 'IT @ University of Victoria'])
  expect(d.scan).toBe('Scan for the full page')
})
