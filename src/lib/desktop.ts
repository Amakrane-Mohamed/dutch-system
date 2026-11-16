// Detects the Electron desktop shell (electron/preload.cjs exposes window.rihlaDesktop).
interface DesktopInfo { isDesktop: true; platform: string; versions: { electron: string; chrome: string } }
export const desktop = (): DesktopInfo | undefined =>
  typeof window === 'undefined' ? undefined : (window as unknown as { rihlaDesktop?: DesktopInfo }).rihlaDesktop
export const isDesktop = () => !!desktop()
export const isMacDesktop = () => desktop()?.platform === 'darwin'

/** Microphone recording (MediaRecorder) — works in the desktop app and modern browsers. */
export const recordSupported = () =>
  typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined'
