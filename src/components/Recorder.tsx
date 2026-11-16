import { useEffect, useRef, useState } from 'react'
import { useT } from '../lib/i18n'
import { cx } from '../lib/cx'
import { recordSupported } from '../lib/desktop'
import { Icon } from './Icon'

/** Record yourself, then listen back and compare with the model voice (no cloud service needed). */
export function Recorder({ disabled = false, maxSeconds = 20 }: { disabled?: boolean; maxSeconds?: number }) {
  const { t } = useT()
  const [state, setState] = useState<'idle' | 'rec' | 'done' | 'denied'>('idle')
  const [url, setUrl] = useState<string>()
  const mr = useRef<MediaRecorder | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); window.clearTimeout(timer.current); mr.current?.stream.getTracks().forEach((x) => x.stop()) }, [url])
  if (!recordSupported()) return null
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const chunks: Blob[] = []
      const r = new MediaRecorder(stream)
      r.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data) }
      r.onstop = () => {
        stream.getTracks().forEach((x) => x.stop())
        if (url) URL.revokeObjectURL(url)
        setUrl(URL.createObjectURL(new Blob(chunks, { type: r.mimeType })))
        setState('done')
      }
      mr.current = r
      r.start()
      setState('rec')
      timer.current = window.setTimeout(() => r.state === 'recording' && r.stop(), maxSeconds * 1000)
    } catch {
      setState('denied')
    }
  }
  const stop = () => { window.clearTimeout(timer.current); if (mr.current?.state === 'recording') mr.current.stop() }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={disabled} onClick={state === 'rec' ? stop : start}
        className={cx('flex items-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold transition disabled:opacity-50', state === 'rec' ? 'animate-pulse bg-terra text-paper' : 'bg-ink text-paper hover:bg-ink-2')}>
        <Icon name="mic" size={20} /> {state === 'rec' ? t('أوقف التسجيل', 'Stop recording') : state === 'done' ? t('سجّل مرة أخرى', 'Record again') : t('سجّل صوتك', 'Record yourself')}
      </button>
      {url && state === 'done' && <audio controls src={url} className="h-10" />}
      {state === 'denied' && <span className="text-sm text-terra">{t('لم يُسمح بالميكروفون. فعّله من إعدادات النظام ← الخصوصية والأمان ← الميكروفون.', 'Microphone not allowed. Enable it in System Settings → Privacy & Security → Microphone.')}</span>}
    </div>
  )
}
