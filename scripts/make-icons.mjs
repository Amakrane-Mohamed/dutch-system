// Builds build/icon.icns (macOS) and build/icon.png from build/icon.svg using Electron's renderer.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const png1024 = path.join(root, 'build', 'icon.png')
const electron = require('electron')
const args = [path.join(root, 'scripts', 'render-icon.cjs'), png1024]
if (process.platform === 'linux') args.unshift('--no-sandbox')
execFileSync(electron, args, { stdio: 'inherit' })

// Resize with Electron's nativeImage in a second tiny pass, then pack an .icns (PNG-based entries).
const sizes = { ic07: 128, ic08: 256, ic09: 512, ic10: 1024, ic11: 32, ic12: 64, ic13: 256, ic14: 512 }
const tmp = fs.mkdtempSync(path.join(root, 'build', '.icns-'))
const resizer = path.join(tmp, 'resize.cjs')
fs.writeFileSync(resizer, `const {app,nativeImage}=require('electron');const fs=require('fs');app.whenReady().then(()=>{const src=nativeImage.createFromPath(${JSON.stringify(png1024)});for(const [k,s] of Object.entries(${JSON.stringify(sizes)})){fs.writeFileSync(${JSON.stringify(tmp)}+'/'+k+'.png',src.resize({width:s,height:s,quality:'best'}).toPNG())}app.quit()})`)
execFileSync(electron, process.platform === 'linux' ? ['--no-sandbox', resizer] : [resizer], { stdio: 'inherit' })
const chunks = Object.keys(sizes).map((k) => {
  const data = fs.readFileSync(path.join(tmp, k + '.png'))
  const head = Buffer.alloc(8); head.write(k, 0, 'ascii'); head.writeUInt32BE(data.length + 8, 4)
  return Buffer.concat([head, data])
})
const body = Buffer.concat(chunks)
const head = Buffer.alloc(8); head.write('icns', 0, 'ascii'); head.writeUInt32BE(body.length + 8, 4)
fs.writeFileSync(path.join(root, 'build', 'icon.icns'), Buffer.concat([head, body]))
fs.rmSync(tmp, { recursive: true, force: true })
console.log('build/icon.icns written')
