// Rihla · رحلة — Electron shell for macOS (same React/Vite source as the web app).
// The built `dist/` is served from a privileged custom protocol (app://rihla/) so the
// origin is stable: localStorage / IndexedDB persist between launches, and hash routing works.
const { app, BrowserWindow, protocol, net, shell, session, systemPreferences, Menu } = require('electron')
const path = require('node:path')
const { pathToFileURL } = require('node:url')

const SCHEME = 'app'
const HOST = 'rihla'
const ORIGIN = `${SCHEME}://${HOST}`
const DIST = path.join(__dirname, '..', 'dist')
const isMac = process.platform === 'darwin'

app.setName('Rihla')
// A plain Chrome user agent (no "Electron/x" token) so YouTube serves the normal player.
app.userAgentFallback = app.userAgentFallback.replace(/\s?Electron\/\S+/, '').replace(/\s?(rihla-deutsch|Rihla)\/\S+/i, '')

protocol.registerSchemesAsPrivileged([
  { scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true, codeCache: true } },
])

function serveDist() {
  protocol.handle(SCHEME, (req) => {
    const url = new URL(req.url)
    if (url.host !== HOST) return new Response('Not found', { status: 404 })
    let rel = decodeURIComponent(url.pathname)
    if (rel === '/' || rel === '') rel = '/index.html'
    const file = path.normalize(path.join(DIST, rel))
    if (!file.startsWith(DIST + path.sep)) return new Response('Forbidden', { status: 403 })
    return net.fetch(pathToFileURL(file).toString())
  })
}

const DEV_URL = process.env.RIHLA_DEV_URL
const isInternal = (u) => u.startsWith(ORIGIN + '/') || u === ORIGIN || (!!DEV_URL && u.startsWith(DEV_URL))

function setupSession() {
  const ses = session.defaultSession
  // YouTube's embedded player needs an http(s) Referer; a custom-scheme referrer gets "Error 153".
  ses.webRequest.onBeforeSendHeaders(
    { urls: ['https://www.youtube-nocookie.com/*', 'https://www.youtube.com/*', 'https://*.googlevideo.com/*', 'https://i.ytimg.com/*'] },
    (details, cb) => {
      const h = details.requestHeaders
      if (!h.Referer || h.Referer.startsWith(ORIGIN)) h.Referer = 'https://rihla.app/'
      cb({ requestHeaders: h })
    },
  )
  // Microphone for speaking practice (recording); everything else denied.
  ses.setPermissionCheckHandler((_wc, permission) => ['media', 'clipboard-sanitized-write', 'fullscreen', 'speaker-selection'].includes(permission))
  ses.setPermissionRequestHandler(async (_wc, permission, cb, details) => {
    if (permission === 'media') {
      const wantsVideo = (details.mediaTypes || []).includes('video')
      if (wantsVideo) return cb(false)
      if (isMac) {
        try { return cb(await systemPreferences.askForMediaAccess('microphone')) } catch { return cb(false) }
      }
      return cb(true)
    }
    cb(['clipboard-sanitized-write', 'fullscreen', 'speaker-selection'].includes(permission))
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    title: 'Rihla · رحلة',
    backgroundColor: '#F6F0E4',
    show: false,
    ...(isMac ? { titleBarStyle: 'hiddenInset', trafficLightPosition: { x: 18, y: 22 } } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  })
  win.once('ready-to-show', () => win.show())
  win.on('page-title-updated', (e) => { e.preventDefault(); win.setTitle('Rihla · رحلة') })

  // External links (YouTube pages, resources, LanguageTool …) open in the default browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:|^mailto:/.test(url)) shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (e, url) => {
    if (!isInternal(url)) { e.preventDefault(); if (/^https?:|^mailto:/.test(url)) shell.openExternal(url) }
  })

  const dev = process.env.RIHLA_DEV_URL
  win.loadURL(dev || `${ORIGIN}/index.html`)
  return win
}

function buildMenu() {
  const template = [
    ...(isMac ? [{ role: 'appMenu', label: 'Rihla' }] : []),
    { role: 'editMenu' },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }] },
    { role: 'windowMenu' },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

const single = app.requestSingleInstanceLock()
if (!single) app.quit()
else {
  app.on('second-instance', () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus() } })
  app.whenReady().then(() => {
    serveDist()
    setupSession()
    buildMenu()
    createWindow()
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
  })
  app.on('window-all-closed', () => { if (!isMac) app.quit() })
}
