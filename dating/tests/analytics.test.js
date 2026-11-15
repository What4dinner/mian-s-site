import { loadAnalytics, track, _resetForTest } from '../src/analytics.js'

beforeEach(() => _resetForTest())

test('no id: loader never called', async () => {
  const loader = vi.fn()
  await loadAnalytics(undefined, loader)
  await loadAnalytics('', loader)
  expect(loader).not.toHaveBeenCalled()
})

test('queued events flush after load with tags', async () => {
  const C = { init: vi.fn(), event: vi.fn(), setTag: vi.fn() }
  track('lang_switch', { lang: 'zh' })
  await loadAnalytics('abc', async () => ({ default: C }), { immediate: true })
  expect(C.init).toHaveBeenCalledWith('abc')
  expect(C.setTag).toHaveBeenCalledWith('lang', 'zh')
  expect(C.event).toHaveBeenCalledWith('lang_switch')
})

test('events after load go straight through', async () => {
  const C = { init: vi.fn(), event: vi.fn(), setTag: vi.fn() }
  await loadAnalytics('abc', async () => ({ default: C }), { immediate: true })
  track('add_to_cart')
  expect(C.event).toHaveBeenCalledWith('add_to_cart')
})

test('queue is capped at 20 before load', async () => {
  const C = { init: vi.fn(), event: vi.fn(), setTag: vi.fn() }
  for (let i = 0; i < 30; i++) track('deck_next')
  await loadAnalytics('abc', async () => ({ default: C }), { immediate: true })
  expect(C.event).toHaveBeenCalledTimes(20)
})

test('loader failure is swallowed (Clarity blocked in China)', async () => {
  await expect(loadAnalytics('abc', async () => { throw new Error('blocked') }, { immediate: true })).resolves.toBeUndefined()
  expect(() => track('deck_next')).not.toThrow()
})

test('a throwing Clarity call never breaks the page', async () => {
  const C = { init: vi.fn(), event: () => { throw new Error('clarity not ready') }, setTag: vi.fn() }
  await loadAnalytics('abc', async () => ({ default: C }), { immediate: true })
  expect(() => track('contact_me')).not.toThrow()
})
