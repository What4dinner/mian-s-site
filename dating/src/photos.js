import { faSvg } from './icons.js'

/** How many placeholders to show while a photo folder is empty (matches the mockup). */
export const PLACEHOLDER_COUNTS = { hero: 4, photography: 4, drives: 3, hiking: 3, camping: 3 }

const basename = (p) => p.split('/').pop()

/** import.meta.glob result → pictures sorted by file name, naturally (2 before 10), case-insensitive. */
export function toPhotoList(glob) {
  return Object.keys(glob)
    .sort((a, b) => basename(a).localeCompare(basename(b), undefined, { numeric: true, sensitivity: 'base' }))
    .map((k) => glob[k])
}

/** The photos if there are any, otherwise `placeholderCount` nulls. */
export function slotsFor(list, placeholderCount) {
  return list.length ? list : Array.from({ length: placeholderCount }, () => null)
}

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A <picture> for a photo, or the styled placeholder when `p` is null. */
export function photoMarkup(p, { index, total, alt, phLabel, eager }) {
  if (!p) {
    return `<div class="ph">${faSvg('solid:camera')}<span class="pl" data-i="ph">${escAttr(phLabel)}</span><span>${index + 1} / ${total}</span></div>`
  }
  const sources = Object.entries(p.sources)
    .map(([fmt, srcset]) => `<source type="image/${fmt}" srcset="${escAttr(srcset)}">`)
    .join('')
  // Portrait shots get cropped into landscape frames; their subject (a tent, a person) is usually low.
  const focus = p.img.h > p.img.w ? ' style="object-position:50% 80%"' : ''
  return (
    `<picture>${sources}<img src="${escAttr(p.img.src)}" alt="${escAttr(alt)}" data-alt="alt"${focus} ` +
    `width="${p.img.w}" height="${p.img.h}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" draggable="false"></picture>`
  )
}
