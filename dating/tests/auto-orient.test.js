import sharp from 'sharp'
import { applyTransforms, generateTransforms, builtins } from 'imagetools-core'
import { autoOrient } from '../build/auto-orient.js'

// A camera "portrait" shot: pixels stored landscape (600x400) + EXIF orientation 6 (rotate 90° to view).
async function portraitFromCamera() {
  const buf = await sharp({ create: { width: 600, height: 400, channels: 3, background: '#888' } })
    .jpeg().withMetadata({ orientation: 6 }).toBuffer()
  return sharp(buf)
}

for (const format of ['webp', 'avif']) {
  test(`${format}: camera-rotated photo comes out upright after EXIF is stripped`, async () => {
    const { transforms } = generateTransforms({ w: '300', format }, [autoOrient, ...builtins])
    const { image } = await applyTransforms(transforms, await portraitFromCamera(), true)
    const meta = await sharp(await image.toBuffer()).metadata()
    expect([meta.width, meta.height]).toEqual([300, 450])
    expect(meta.orientation).toBeUndefined()
  })
}
