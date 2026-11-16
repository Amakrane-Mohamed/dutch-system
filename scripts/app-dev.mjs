// Dev mode for the desktop app: Vite dev server (hot reload) inside the Electron window.
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { createServer } from 'vite'
const require = createRequire(import.meta.url)
const server = await createServer({ server: { port: 5173, strictPort: false } })
await server.listen()
const url = server.resolvedUrls.local[0]
console.log('Vite dev server', url)
const args = ['.']
if (process.platform === 'linux') args.unshift('--no-sandbox')
const child = spawn(require('electron'), args, { stdio: 'inherit', env: { ...process.env, RIHLA_DEV_URL: url } })
child.on('exit', async (code) => { await server.close(); process.exit(code ?? 0) })
