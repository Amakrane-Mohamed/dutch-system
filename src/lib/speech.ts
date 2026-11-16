import { isDesktop } from './desktop'
// Text-to-speech with a German voice when the device has one (de-DE preferred, then de-AT / de-CH).
let cached: SpeechSynthesisVoice[] = []
export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function germanVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return []
  const all = window.speechSynthesis.getVoices()
  if (all.length) cached = all
  return cached.filter((v) => v.lang.toLowerCase().startsWith('de')).sort((a, b) => score(b) - score(a))
}
const score = (v: SpeechSynthesisVoice) => (v.lang === 'de-DE' ? 2 : v.lang.startsWith('de') ? 1 : 0) + (v.localService ? 0.5 : 0)

export function onVoicesChanged(cb: () => void) {
  if (!ttsSupported()) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', cb)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', cb)
}

export function speak(text: string, opts: { voiceURI?: string; rate?: number } = {}) {
  if (!ttsSupported()) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text.replace(/\s*\/\s*/g, ', '))
  const voices = germanVoices()
  const v = voices.find((x) => x.voiceURI === opts.voiceURI) ?? voices[0]
  if (v) u.voice = v
  u.lang = v?.lang ?? 'de-DE'
  u.rate = opts.rate ?? 0.9
  synth.speak(u)
  return true
}

// ---- Speech recognition (Chrome/Edge/Safari expose webkitSpeechRecognition) ----
type SR = { lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean; start(): void; stop(): void; abort(): void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null }
const SRClass = (): (new () => SR) | undefined =>
  typeof window === 'undefined' ? undefined : ((window as unknown as { SpeechRecognition?: new () => SR }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition)
// Electron has the API but no Google speech service behind it (always fails with "network"), so the desktop app uses the recorder instead.
export const srSupported = () => !!SRClass() && !isDesktop()

export function listenOnce(onText: (alternatives: string[]) => void, onError: (msg: string) => void, onEnd: () => void): () => void {
  const C = SRClass()
  if (!C) { onError('Speech recognition is not supported in this browser.'); onEnd(); return () => {} }
  const r = new C()
  r.lang = 'de-DE'; r.interimResults = false; r.maxAlternatives = 3; r.continuous = false
  r.onresult = (e) => { const res = e.results[0]; onText(Array.from({ length: res.length }, (_, i) => res[i].transcript)) }
  r.onerror = (e) => onError(e.error === 'not-allowed' ? 'الميكروفون غير مسموح به · Microphone permission denied.' : e.error === 'no-speech' ? 'لم أسمع شيئًا، حاول مرة أخرى · No speech heard.' : e.error === 'network' ? 'خدمة التعرف على الصوت غير متاحة الآن · Recognition service unavailable.' : `Recognition error: ${e.error}`)
  r.onend = onEnd
  r.start()
  return () => r.abort()
}

/** Share of target words that were said (order-insensitive), 0..1. */
export function speechScore(target: string, said: string): number {
  const words = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean)
  const t = words(target), s = words(said)
  if (!t.length) return 0
  const bag = new Map<string, number>()
  s.forEach((w) => bag.set(w, (bag.get(w) ?? 0) + 1))
  let hit = 0
  t.forEach((w) => { const n = bag.get(w) ?? 0; if (n > 0) { hit++; bag.set(w, n - 1) } })
  return hit / t.length
}
