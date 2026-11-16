import { useState } from 'react'
import { ACTIVITIES, SKILLS, type Activity } from '../content/data'
import { todayISO } from '../lib/dates'
import { useT, fmtDate } from '../lib/i18n'
import { setState, uid, useStore } from '../state/store'
import { Button, Card, PageHead, Pill, Title } from '../components/ui'
import { Icon } from '../components/Icon'

export default function Log() {
  const { t, tx, lang } = useT()
  const log = useStore((s) => s.log)
  const [f, setF] = useState<{ date: string; activity: Activity; minutes: string; note: string }>({ date: todayISO(), activity: 'book', minutes: '30', note: '' })
  const add = () => {
    const m = Number(f.minutes)
    if (!m) return
    setState((s) => ({ ...s, log: [...s.log, { id: uid(), date: f.date, activity: f.activity, minutes: m, note: f.note }] }))
    setF({ ...f, note: '' })
  }
  const color = (a: string) => { const k = ACTIVITIES.find((x) => x.key === a)?.skill; return k ? SKILLS[k].color : '#33437A' }
  return (
    <div>
      <PageHead kicker={t('سجل الدراسة', 'Study log')} title={t('سجّل وقتك', 'Log your time')} de="Lerntagebuch" sub={t('سجّل ما تدرسه خارج التطبيق (Nicos Weg، الكتاب، البودكاست، المعلم…) ليظهر في الخريطة الحرارية والمهارات.', 'Log what you study outside the app (Nicos Weg, book, podcasts, tutor…) so it shows in the heatmap and skills.')} />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <Title>{t('إضافة جلسة', 'Add a session')}</Title>
          <div className="space-y-3">
            <label className="block text-sm"><span className="mb-1 block text-mute">{t('التاريخ', 'Date')}</span><input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="w-full rounded-xl bg-paper px-3 py-2 ring-1 ring-sand-2" /></label>
            <div className="text-sm"><span className="mb-1 block text-mute">{t('النشاط', 'Activity')}</span>
              <div className="grid grid-cols-3 gap-2">{ACTIVITIES.map((a) => <button key={a.key} onClick={() => setF({ ...f, activity: a.key })} className={`rounded-xl px-2 py-2 text-xs font-semibold ring-1 ${f.activity === a.key ? 'bg-ink text-paper ring-ink' : 'bg-paper ring-sand-2'}`}>{tx(a.label)}</button>)}</div>
            </div>
            <label className="block text-sm"><span className="mb-1 block text-mute">{t('الدقائق', 'Minutes')}</span>
              <div className="flex gap-2"><input type="number" min="1" value={f.minutes} onChange={(e) => setF({ ...f, minutes: e.target.value })} className="w-24 rounded-xl bg-paper px-3 py-2 ring-1 ring-sand-2" />{[15, 30, 45, 60, 90].map((m) => <button key={m} onClick={() => setF({ ...f, minutes: String(m) })} className="rounded-lg bg-sand/60 px-2.5 text-xs font-semibold">{m}</button>)}</div>
            </label>
            <label className="block text-sm"><span className="mb-1 block text-mute">{t('ملاحظة', 'Note')}</span><input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Nicos Weg A1 Kapitel 3…" className="w-full rounded-xl bg-paper px-3 py-2 ring-1 ring-sand-2" /></label>
            <Button className="w-full" onClick={add}><Icon name="plus" size={16} />{t('حفظ', 'Save')}</Button>
          </div>
        </Card>
        <Card>
          <Title kicker={`${log.length} ${t('جلسة', 'sessions')}`}>{t('الجلسات الأخيرة', 'Recent sessions')}</Title>
          {log.length === 0 ? <p className="text-sm text-mute">{t('لا توجد جلسات بعد.', 'No sessions yet.')}</p> : (
            <ul className="divide-y divide-sand">
              {[...log].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 60).map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
                  <Pill color={color(e.activity)}>{tx(ACTIVITIES.find((a) => a.key === e.activity)?.label ?? e.activity)}</Pill>
                  <span className="de min-w-0 flex-1 truncate text-mute">{e.note}</span>
                  <span className="font-semibold tabular-nums">{e.minutes} {t('د', 'min')}</span>
                  <span className="w-20 text-end text-xs text-mute">{fmtDate(e.date, lang)}</span>
                  <button onClick={() => setState((s) => ({ ...s, log: s.log.filter((x) => x.id !== e.id) }))} className="rounded p-1 text-mute hover:text-terra" aria-label={t('حذف', 'Delete')}><Icon name="x" size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
