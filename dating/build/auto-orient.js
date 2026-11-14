// imagetools transform: rotate camera photos upright using their EXIF orientation *before* resizing.
// Without it, portrait shots stored as "landscape + rotate 90°" come out sideways once EXIF is
// stripped (seen with WebP output from a Sony JPG). imagetools sizes the output from the width/height
// it read up front, so those are swapped too for 90°/270° orientations (EXIF values 5–8).
import { getMetadata, setMetadata } from 'imagetools-core'

export function autoOrient() {
  return function autoOrientTransform(image) {
    const orientation = getMetadata(image, 'orientation')
    if (orientation >= 5) {
      const w = getMetadata(image, 'width')
      setMetadata(image, 'width', getMetadata(image, 'height'))
      setMetadata(image, 'height', w)
    }
    setMetadata(image, 'orientation', undefined)
    return image.rotate() // no angle = auto-orient from EXIF
  }
}
