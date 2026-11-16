// Exposes a tiny, read-only flag so the web code can adapt (no service worker, mic recorder instead of cloud speech recognition).
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('rihlaDesktop', { isDesktop: true, platform: process.platform, versions: { electron: process.versions.electron, chrome: process.versions.chrome } })
