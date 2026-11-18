// Font Awesome 6 Free path data, rendered as plain inline SVG (no svg-core runtime).
import {
  faBagShopping, faChevronRight, faChevronLeft, faCamera, faCarSide, faPersonHiking,
  faCampground, faRulerVertical, faWeightScale, faLocationDot, faEarthAsia, faLanguage,
  faBanSmoking, faWineGlass, faBatteryFull, faShieldHeart, faHeart, faStar,
  faCakeCandles, faBriefcase, faHouse, faPaw, faCheck, faArrowUpFromBracket, faXmark, faDownload, faGift,
} from '@fortawesome/free-solid-svg-icons'
import { faHandPointer, faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faWeixin } from '@fortawesome/free-brands-svg-icons'

const MAP = {
  'solid:bag-shopping': faBagShopping,
  'solid:chevron-right': faChevronRight,
  'solid:chevron-left': faChevronLeft,
  'solid:camera': faCamera,
  'solid:car-side': faCarSide,
  'solid:person-hiking': faPersonHiking,
  'solid:campground': faCampground,
  'solid:ruler-vertical': faRulerVertical,
  'solid:weight-scale': faWeightScale,
  'solid:location-dot': faLocationDot,
  'solid:earth-asia': faEarthAsia,
  'solid:language': faLanguage,
  'solid:ban-smoking': faBanSmoking,
  'solid:wine-glass': faWineGlass,
  'solid:battery-full': faBatteryFull,
  'solid:shield-heart': faShieldHeart,
  'solid:heart': faHeart,
  'solid:star': faStar,
  'solid:cake-candles': faCakeCandles,
  'solid:briefcase': faBriefcase,
  'solid:house': faHouse,
  'solid:paw': faPaw,
  'solid:check': faCheck,
  'solid:arrow-up-from-bracket': faArrowUpFromBracket,
  'solid:xmark': faXmark,
  'solid:download': faDownload,
  'solid:gift': faGift,
  'brands:weixin': faWeixin,
  'regular:hand-pointer': faHandPointer,
  'regular:envelope': faEnvelope,
}

export const ICON_NAMES = Object.keys(MAP)

/** Returns an inline <svg> string for a Font Awesome icon, e.g. faSvg('solid:camera'). */
export function faSvg(name, cls = '') {
  const def = MAP[name]
  if (!def) throw new Error(`Unknown icon: ${name}`)
  const [w, h, , , path] = def.icon
  const d = Array.isArray(path) ? path.join(' ') : path
  return `<svg class="fa${cls ? ' ' + cls : ''}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/></svg>`
}
