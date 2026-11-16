import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { isDesktop, isMacDesktop } from './lib/desktop'

if (isDesktop()) document.documentElement.classList.add('desktop')
if (isMacDesktop()) document.documentElement.classList.add('mac-desktop')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// The desktop app serves files locally, so it needs no offline service worker.
if (import.meta.env.PROD && !isDesktop() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}) })
}
