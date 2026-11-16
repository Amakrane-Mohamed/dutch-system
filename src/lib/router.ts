import { useSyncExternalStore } from 'react'
const sub = (cb: () => void) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb) }
const get = () => window.location.hash.replace(/^#/, '') || '/'
export const useRoute = () => useSyncExternalStore(sub, get, () => '/')
export const go = (path: string) => { window.location.hash = path; window.scrollTo(0, 0) }
