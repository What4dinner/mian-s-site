// Post-build checks for dist-dating: JS budget, no CDN URLs, no photo metadata,
// email substituted, SEO files present, and only supported photo types in dating/photos.
// Usage: node dating/scripts/check-dist.mjs   (exits 1 and lists problems if any)
import fs from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { pathToFileURL, fileURLToPath } from 'node:url'

const JS_BUDGET = 30 * 1024
const CSS_BUDGET = 12 * 1024
const BLOCKED_HOSTS = ['fonts.googleapis', 'fonts.gstatic', 'jsdelivr', 'cdnjs', 'unpkg']
const TEXT_EXT = /\.(html|css|js|txt|json|svg|xml)$/i
const IMAGE_EXT = /\.(webp|avif|jpe?g|png)$/i
const PHOTO_EXT = /\.(jpe?g|png|webp)$/i

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

/** Returns a list of problems; empty means the build is OK. */
export function checkDist(distDir, photosDir) {
  const problems = []
  const files = walk(distDir)
  const rel = (p) => path.relative(distDir, p).split(path.sep).join('/')

  const jsGz = files.filter((f) => /[\\/]assets[\\/][^\\/]+\.js$/.test(f)).reduce((n, f) => n + gzipSync(fs.readFileSync(f)).length, 0)
  if (jsGz > JS_BUDGET) problems.push(`JS is ${(jsGz / 1024).toFixed(1)} KB gzipped, over the 30 KB budget`)

  for (const f of files.filter((x) => TEXT_EXT.test(x))) {
    const text = fs.readFileSync(f, 'utf8')
    for (const host of BLOCKED_HOSTS) if (text.includes(host)) problems.push(`${rel(f)} references ${host} (blocked in mainland China)`)
  }

  for (const f of files.filter((x) => IMAGE_EXT.test(x))) {
    if (fs.readFileSync(f).includes('Exif')) problems.push(`${rel(f)} still contains Exif metadata`)
  }

  const indexPath = path.join(distDir, 'index.html')
  const html = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : ''
  if (html.includes('%VITE_EMAIL%')) problems.push('index.html still contains %VITE_EMAIL% (env not substituted)')
  if (!html.includes('mailto:')) problems.push('index.html has no mailto: link')

  // Stylesheets linked from index.html block first paint; keep them small (spec §8: hero text < 1.5s on 4G).
  const blockingCss = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="\/?([^"]+)"/g)].map((m) => m[1])
  const cssGz = blockingCss.reduce((n, href) => {
    const f = path.join(distDir, href)
    return n + (fs.existsSync(f) ? gzipSync(fs.readFileSync(f)).length : 0)
  }, 0)
  if (cssGz > CSS_BUDGET) problems.push(`render-blocking CSS is ${(cssGz / 1024).toFixed(1)} KB gzipped, over the 12 KB budget`)

  for (const name of ['robots.txt', 'og.png']) {
    if (!fs.existsSync(path.join(distDir, name))) problems.push(`${name} is missing`)
  }

  for (const f of walk(photosDir)) {
    const name = path.basename(f)
    if (name === '.gitkeep' || PHOTO_EXT.test(name)) continue
    const r = path.relative(photosDir, f).split(path.sep).join('/')
    problems.push(`Unsupported photo (convert to JPG): photos/${r}`)
  }
  return problems
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const problems = checkDist(path.resolve(here, '../../dist-dating'), path.resolve(here, '../photos'))
  if (problems.length) {
    console.error('check-dist found problems:\n' + problems.map((p) => '  - ' + p).join('\n'))
    process.exit(1)
  }
  console.log('check-dist: OK')
}
