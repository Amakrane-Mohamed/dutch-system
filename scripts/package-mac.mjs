// Packages Rihla.app for macOS Apple Silicon (unsigned / ad-hoc), then zips it with symlinks preserved.
//   npm run package:mac            → release/Rihla-darwin-arm64/Rihla.app + release/Rihla-mac-arm64.zip
//   RIHLA_ZIP=/path/out.zip npm run package:mac
import { packager } from '@electron/packager'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const electronVersion = require('electron/package.json').version
if (!fs.existsSync(path.join(root, 'dist', 'index.html'))) throw new Error('Run `npm run build` first (dist/ missing).')
if (!fs.existsSync(path.join(root, 'build', 'icon.icns'))) execFileSync('node', [path.join(root, 'scripts', 'make-icons.mjs')], { stdio: 'inherit' })

const keep = /^\/(dist|electron|package\.json)(\/|$)/
const [appPath] = await packager({
  dir: root,
  out: path.join(root, 'release'),
  overwrite: true,
  name: 'Rihla',
  executableName: 'Rihla',
  platform: 'darwin',
  arch: 'arm64',
  electronVersion,
  appVersion: pkg.version,
  buildVersion: pkg.version,
  appBundleId: 'app.rihla.deutsch',
  appCategoryType: 'public.app-category.education',
  appCopyright: '© 2026 Mohamed',
  icon: path.join(root, 'build', 'icon.icns'),
  asar: true,
  prune: true,
  ignore: (p) => p !== '' && !keep.test(p),
  extendInfo: {
    CFBundleDisplayName: 'Rihla',
    CFBundleDevelopmentRegion: 'ar',
    CFBundleLocalizations: ['ar', 'en', 'de'],
    LSMinimumSystemVersion: '12.0',
    NSMicrophoneUsageDescription: 'رحلة تستعمل الميكروفون لتسجيل صوتك في تمارين النطق. Rihla uses the microphone to record your voice in speaking practice.',
    NSHighResolutionCapable: true,
  },
})
const app = path.join(appPath, 'Rihla.app')
console.log('packaged', app)

// Ad-hoc signature (Apple Silicon refuses to run code with a broken signature after Info.plist edits).
const rcodesign = process.env.RCODESIGN || 'rcodesign'
if (process.platform === 'darwin') {
  spawnSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' })
} else if (spawnSync(rcodesign, ['--version']).status === 0) {
  const r = spawnSync(rcodesign, ['sign', app], { stdio: 'inherit' })
  if (r.status !== 0) console.warn('rcodesign failed; sign on the Mac with: codesign --force --deep --sign - Rihla.app')
} else console.warn('No codesign/rcodesign: on the Mac run `codesign --force --deep --sign - Rihla.app`')

// Zip with symlinks preserved (Electron Framework.framework relies on them).
const zipOut = process.env.RIHLA_ZIP || path.join(root, 'release', 'Rihla-mac-arm64.zip')
if (process.platform === 'darwin') execFileSync('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', app, zipOut], { stdio: 'inherit' })
else execFileSync('python3', [path.join(root, 'scripts', 'zip-keep-symlinks.py'), app, zipOut], { stdio: 'inherit' })
console.log('zip', zipOut, (fs.statSync(zipOut).size / 1048576).toFixed(1) + ' MB')
