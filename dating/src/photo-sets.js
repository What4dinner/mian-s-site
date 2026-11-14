// Photo discovery. Drop JPG/PNG/WebP files into dating/photos/<set>/ — no code changes needed.
// Vite requires literal glob strings, hence five separate calls.
// imagetools resizes, converts to AVIF + WebP, and strips EXIF/GPS (sharp drops metadata by default).
import { toPhotoList } from './photos.js'

const hero = import.meta.glob('../photos/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true, import: 'default', query: { w: '1600', format: 'avif;webp', as: 'picture' },
})
const photography = import.meta.glob('../photos/photography/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true, import: 'default', query: { w: '1200', format: 'avif;webp', as: 'picture' },
})
const drives = import.meta.glob('../photos/drives/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true, import: 'default', query: { w: '1200', format: 'avif;webp', as: 'picture' },
})
const hiking = import.meta.glob('../photos/hiking/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true, import: 'default', query: { w: '1200', format: 'avif;webp', as: 'picture' },
})
const camping = import.meta.glob('../photos/camping/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true, import: 'default', query: { w: '1200', format: 'avif;webp', as: 'picture' },
})

export const PHOTO_SETS = {
  hero: toPhotoList(hero),
  photography: toPhotoList(photography),
  drives: toPhotoList(drives),
  hiking: toPhotoList(hiking),
  camping: toPhotoList(camping),
}

