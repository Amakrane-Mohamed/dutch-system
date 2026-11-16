// Run with Electron: renders build/icon.svg to PNGs (used by make-icons.mjs).
const { app, BrowserWindow } = require('electron')
const fs = require('node:fs'), path = require('node:path')
const out = process.argv[process.argv.length - 1]
app.disableHardwareAcceleration()
app.whenReady().then(async () => {
  const svg = fs.readFileSync(path.join(__dirname, '..', 'build', 'icon.svg'), 'utf8')
  const win = new BrowserWindow({ width: 1024, height: 1024, show: false, transparent: true, frame: false, webPreferences: { offscreen: true } })
  win.webContents.setZoomFactor(1)
  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', '<svg width="1024" height="1024" ')}</body></html>`))
  await new Promise((r) => setTimeout(r, 400))
  const img = await win.webContents.capturePage({ x: 0, y: 0, width: 1024, height: 1024 })
  fs.writeFileSync(out, img.resize({ width: 1024, height: 1024, quality: 'best' }).toPNG())
  app.quit()
})
