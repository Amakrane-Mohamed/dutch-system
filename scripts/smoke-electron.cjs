// Smoke test for the desktop shell (run: electron scripts/smoke-electron.cjs [phase]).
// phase "write": sets a marker in localStorage; phase "read": checks it survived a restart, then tests a YouTube embed.
const { app, BrowserWindow } = require('electron')
const fs = require('node:fs')
const phase = process.argv[process.argv.length - 1]
const electron = require('electron')
const opened = []
electron.shell.openExternal = async (u) => { opened.push(u) }
require('../electron/main.cjs')
const log = (...a) => console.log('[smoke]', ...a)
app.on('browser-window-created', (_e, win) => {
  win.webContents.once('did-finish-load', async () => {
    const js = (s) => win.webContents.executeJavaScript(s).catch((e) => 'ERR ' + e.message)
    log('url', win.webContents.getURL())
    log('desktop flag', await js('JSON.stringify(window.rihlaDesktop)'), 'html class', await js('document.documentElement.className'), 'dir', await js('document.documentElement.dir'))
    log('sw registered', await js("navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(r=>r.length).catch(e=>'rejected: '+e.message) : 'n/a'"))
    log('title', win.getTitle(), 'size', win.getSize())
    log('ua', await js('navigator.userAgent'))
    log('fonts', await js("document.fonts.ready.then(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).join(','))"))
    if (phase === 'write') {
      await js("localStorage.setItem('rihla:smoke', 'persisted-' + Date.now()); 'ok'")
      log('wrote marker')
      setTimeout(() => app.quit(), 1500)
      return
    }
    log('marker after restart', await js("localStorage.getItem('rihla:smoke')"))
    await js("location.hash = '#/learn/lesson/greetings'")
    await new Promise((r) => setTimeout(r, 1500))
    await js("document.querySelector('figure button')?.click(); 'clicked'")
    await new Promise((r) => setTimeout(r, 12000))
    const frames = win.webContents.mainFrame.framesInSubtree.filter((f) => /youtube/.test(f.url))
    log('yt frames', frames.map((f) => f.url.slice(0, 90)))
    for (const f of frames.slice(0, 1)) {
      try {
        log('yt text', JSON.stringify((await f.executeJavaScript('document.body.innerText')).slice(0, 300)))
        log('yt video', await f.executeJavaScript("(()=>{const v=document.querySelector('video');return v?JSON.stringify({src:!!v.src,paused:v.paused,t:v.currentTime,rs:v.readyState}):'no video'})()"))
      } catch (e) { log('frame err', e.message) }
    }
    const img = await win.webContents.capturePage()
    fs.writeFileSync('/tmp/electron-smoke.png', img.toPNG())
    log('voices', await js("new Promise(r=>{const v=speechSynthesis.getVoices(); if(v.length) r(v.length); else {speechSynthesis.onvoiceschanged=()=>r(speechSynthesis.getVoices().length); setTimeout(()=>r(0),2000)}})"))
    log('sr supported in app', await js("!!(window.webkitSpeechRecognition)"), 'recorder', await js("!!navigator.mediaDevices && typeof MediaRecorder"))
    await js("document.querySelector('figcaption a[target=_blank]')?.click(); 'ok'")
    await new Promise((r) => setTimeout(r, 800))
    log('external links opened in browser', opened, 'windows', BrowserWindow.getAllWindows().length, 'url still', win.webContents.getURL())
    setTimeout(() => app.quit(), 500)
  })
})
