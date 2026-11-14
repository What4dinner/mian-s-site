import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { imagetools } from 'vite-imagetools'
import { requireEnv } from './build/require-env.js'
import { faInline } from './build/fa-inline.js'
import { cjkFonts } from './build/cjk-fonts.js'
import { wechatQr } from './build/wechat-qr.js'
import { autoOrient } from './build/auto-orient.js'
import { T } from './src/i18n.js'

const root = fileURLToPath(new URL('.', import.meta.url))
const envDir = fileURLToPath(new URL('..', import.meta.url))

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, envDir)
  if (command === 'build') requireEnv(env, ['VITE_EMAIL'])
  return {
    root,
    envDir,
    publicDir: 'public',
    build: { outDir: '../dist-dating', emptyOutDir: true },
    plugins: [
      cjkFonts({
        root,
        outFile: path.join(root, 'src/styles/cjk.generated.css'),
        getStrings: () => [...Object.values(T.en), ...Object.values(T.zh)],
      }),
      wechatQr({
        outFile: path.join(root, 'src/generated/wechat-qr.png'),
        getText: () => env.VITE_WECHAT_QR,
        siteUrl: 'https://dating.zhumian.ca/',
        siteOutFile: path.join(root, 'src/generated/site-qr.png'),
      }),
      // Case-insensitive: iPhone exports are often IMG_0012.JPG, which the default filter skips.
      // Also rotate camera photos upright (EXIF orientation) before resizing; see build/auto-orient.js.
      imagetools({ include: /^[^?]+\.(jpe?g|png|webp)\?.*\bas=picture\b.*$/i, extendTransforms: (builtins) => [autoOrient, ...builtins],
        // The cache key ignores our transform code: bump the version when auto-orient changes.
        cache: { dir: './node_modules/.cache/imagetools-dating-v2' } }),
      faInline(),
    ],
    test: { environment: 'jsdom', include: ['tests/**/*.test.js'], globals: true },
  }
})
