import { initCardSheet } from '../src/card-sheet.js'

const SHEET = `<div class="sheet" id="card-sheet" hidden>
  <div class="sheet-panel"><button class="sheet-close"></button>
  <div class="card-preview"><img alt=""><span class="card-loading"></span></div>
  <a class="card-save" download="zhumian-card.png"></a><button class="card-link"></button></div></div>`

async function setup(over = {}) {
  document.body.innerHTML = SHEET
  const deps = { render: vi.fn().mockResolvedValue('blob:card'), lang: () => 'zh', inWeChat: false, toast: vi.fn(), shareLink: vi.fn(), ...over }
  const sheet = initCardSheet(document.getElementById('card-sheet'), deps)
  return { sheet, deps, el: document.getElementById('card-sheet') }
}

test('open renders the card and wires the save link', async () => {
  const { sheet, deps, el } = await setup()
  await sheet.open()
  expect(el.hidden).toBe(false)
  expect(deps.render).toHaveBeenCalledWith('zh')
  expect(el.querySelector('img').getAttribute('src')).toBe('blob:card')
  expect(el.querySelector('.card-save').getAttribute('href')).toBe('blob:card')
  expect(el.classList.contains('ready')).toBe(true)
})

test('close button and Escape hide the sheet', async () => {
  const { sheet, el } = await setup()
  await sheet.open()
  el.querySelector('.sheet-close').click()
  expect(el.hidden).toBe(true)
  await sheet.open()
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  expect(el.hidden).toBe(true)
})

test('in WeChat, Save explains long-press instead (downloads are blocked there)', async () => {
  const { sheet, deps, el } = await setup({ inWeChat: true })
  await sheet.open()
  const ev = new MouseEvent('click', { cancelable: true })
  el.querySelector('.card-save').dispatchEvent(ev)
  expect(ev.defaultPrevented).toBe(true)
  expect(deps.toast).toHaveBeenCalledWith('长按上面的图片保存')
})

test('Share link falls through to the link-sharing flow', async () => {
  const { sheet, deps, el } = await setup()
  await sheet.open()
  el.querySelector('.card-link').click()
  expect(deps.shareLink).toHaveBeenCalled()
})

test('a render failure still offers the link', async () => {
  const { sheet, el } = await setup({ render: vi.fn().mockRejectedValue(new Error('canvas')) })
  await sheet.open()
  expect(el.classList.contains('failed')).toBe(true)
  expect(el.hidden).toBe(false)
})
