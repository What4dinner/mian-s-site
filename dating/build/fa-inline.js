import { faSvg } from '../src/icons.js'

const TAG = /<i\b([^>]*?)\sdata-fa="([^"]+)"([^>]*)><\/i>/g
const attr = (s, name) => (s.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1]

/** Vite plugin: replaces <i data-fa="solid:camera" class=".." style=".."></i> with inline SVG at build time. */
export function faInline() {
  return {
    name: 'fa-inline',
    transformIndexHtml(html) {
      return html.replace(TAG, (_, before, name, after) => {
        const rest = before + ' ' + after
        const cls = attr(rest, 'class') || ''
        const style = attr(rest, 'style')
        const svg = faSvg(name, cls)
        return style ? svg.replace(' viewBox=', ` style="${style}" viewBox=`) : svg
      })
    },
  }
}
