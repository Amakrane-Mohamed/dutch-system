import { useMemo, useState } from 'react'
import { EXAMS, PRACTICE, REDEMITTEL, SKILLS, type Practice } from '../content/data'
import { daysBetween, todayISO } from '../lib/dates'
import { useT, fmtDate } from '../lib/i18n'
import { practiceItems } from '../lib/path'
import { setState, uid, useStore } from '../state/store'
import { logMinutes, pushTest } from '../state/progress'
import { ExerciseRunner } from '../components/ExerciseRunner'
import { VideoCard } from '../components/VideoCard'
import { Button, Card, PageHead, Pill, Tabs, Title, TxT } from '../components/ui'
import { Icon } from '../components/Icon'
import { useAuth } from '../state/auth'
import { AdminResourceLink } from '../components/AdminResourceLink'

export default function Exams() {
  const { t, tx, lang } = useT()
  const { isAdmin } = useAuth()
  const today = todayISO()
  const examDate = useStore((s) => s.settings.examDate)
  const mocks = useStore((s) => s.mocks)
  const [id, setId] = useState('goethe-b1')
  const [run, setRun] = useState<Practice | null>(null)
  const e = EXAMS.find((x) => x.id === id)!
  const items = useMemo(() => (run ? practiceItems(run) : []), [run])
  const [form, setForm] = useState({ type: 'Goethe B1 Modellsatz', skill: 'lesen', score: '', max: '100' })
  if (run) return (
    <ExerciseRunner exercises={items} level={run.level} title={tx(run.title)} passMark={0.6} bonusXp={30}
      onFinish={(r) => { if (r.completed) { pushTest({ kind: 'practice', ref: run.id, title: tx(run.title), score: r.score, total: r.total, level: run.level }); logMinutes(20, run.id, 'exam') } }}
      onExit={() => setRun(null)} />
  )
  return (
    <div>
      <PageHead kicker={t('Goethe و telc · B1 و B2', 'Goethe & telc · B1 & B2')} title={t('الامتحانات', 'Exams')} de="Prüfungstraining"
        sub={isAdmin ? t('صيغة كل امتحان، استراتيجيات بالعربية، تدريب داخل التطبيق، والنماذج الرسمية المجانية.', 'Exam formats, strategies in Arabic, in-app practice, and official model tests.') : t('صيغة كل امتحان، استراتيجيات بالدارجة، وتدريب تفاعلي داخل التطبيق.', 'Exam formats, Darija strategies, and interactive practice in the app.')}
        right={<div className="card flex items-center gap-3 px-5 py-3"><Icon name="exam" size={26} className="text-terra" /><div><div className="text-xs text-mute">{t('امتحان Goethe B1', 'Goethe B1 exam')} · {fmtDate(examDate, lang, true)}</div><div className="text-2xl font-bold tabular-nums">{Math.max(0, daysBetween(today, examDate))} {t('يومًا', 'days')}</div></div></div>} />
      <Tabs className="mb-6" value={id} onChange={setId} items={EXAMS.map((x) => ({ key: x.id, label: x.name.replace(' (Zertifikat Deutsch)', '') }))} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <Title kicker={e.level} right={isAdmin ? <AdminResourceLink id={e.res} isAdmin={isAdmin}>{t('النموذج الرسمي', 'Official model test')}</AdminResourceLink> : undefined}>{e.name}</Title>
            <p className="mb-4 rounded-xl bg-saffron-soft/60 px-4 py-3 text-sm"><TxT x={e.pass} /></p>
            <div className="grid gap-4 md:grid-cols-2">
              {e.parts.map((p) => (
                <div key={p.name} className="rounded-2xl bg-paper p-4 ring-1 ring-sand">
                  <div className="mb-2 flex items-center justify-between gap-2"><span className="flex items-center gap-2 font-bold" style={{ color: SKILLS[p.skill].color }}><Icon name={SKILLS[p.skill].icon} size={17} /><span className="de">{p.name}</span></span><Pill color={SKILLS[p.skill].color}>{p.minutes} {t('د', 'min')}</Pill></div>
                  <p className="text-sm"><TxT x={p.detail} /></p>
                  <p className="mt-2 text-sm text-ink/80"><b className="text-zellige">{t('الاستراتيجية', 'Strategy')}:</b> <TxT x={p.strategy} /></p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Title kicker={t('داخل التطبيق', 'In the app')}>{t('تدريب بصيغة الامتحان', 'Exam-format practice')}</Title>
            <div className="grid gap-3 md:grid-cols-2">
              {PRACTICE.filter((p) => p.level === e.level.toLowerCase()).map((p) => (
                <button key={p.id} onClick={() => setRun(p)} className="flex items-center gap-3 rounded-2xl bg-paper p-4 text-start ring-1 ring-sand transition hover:-translate-y-0.5 hover:ring-ink/30">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-paper" style={{ background: SKILLS[p.skill].color }}><Icon name={SKILLS[p.skill].icon} size={20} /></span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold">{tx(p.title)}</span><span className="block truncate text-xs text-mute">{tx(p.instr)}</span></span>
                  <Icon name="play" size={18} className="text-saffron-deep" />
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <Title kicker="Redemittel">{t('عبارات جاهزة للامتحان', 'Ready-made exam phrases')}</Title>
            <div className="grid gap-4 md:grid-cols-3">
              {REDEMITTEL[e.level.toLowerCase() as 'b1' | 'b2'].map(([g, items]) => (
                <div key={g}><div className="de mb-2 font-bold">{g}</div><ul className="space-y-1.5">{items.map((x) => <li key={x} className="de rounded-lg bg-paper px-3 py-2 text-sm ring-1 ring-sand">{x}</li>)}</ul></div>
              ))}
            </div>
          </Card>
          <Card>
            <Title kicker={t('سجّل نتائجك', 'Log your results')}>{t('الامتحانات التجريبية', 'Mock exams')}</Title>
            <form className="mb-4 flex flex-wrap items-end gap-2" onSubmit={(ev) => {
              ev.preventDefault(); const score = Number(form.score), max = Number(form.max) || 100
              if (!form.score) return
              setState((s) => ({ ...s, mocks: [...s.mocks, { id: uid(), date: today, type: form.type, skill: form.skill, score, max, passed: score / max >= 0.6 }] }))
              setForm({ ...form, score: '' })
            }}>
              <select value={form.type} onChange={(x) => setForm({ ...form, type: x.target.value })} className="rounded-xl bg-paper px-3 py-2 text-sm ring-1 ring-sand-2">{['Goethe A1 Modellsatz', 'Goethe A2 Modellsatz', 'Goethe B1 Modellsatz', 'telc B1 Übungstest', 'Goethe B2 Modellsatz', 'telc B2 Übungstest', 'Goethe-Zertifikat B1', 'Goethe-Zertifikat B2'].map((x) => <option key={x}>{x}</option>)}</select>
              <select value={form.skill} onChange={(x) => setForm({ ...form, skill: x.target.value })} className="rounded-xl bg-paper px-3 py-2 text-sm ring-1 ring-sand-2">{Object.entries(SKILLS).map(([k, v]) => <option key={k} value={k}>{v.de}</option>)}</select>
              <input type="number" min="0" placeholder={t('النقاط', 'Score')} value={form.score} onChange={(x) => setForm({ ...form, score: x.target.value })} className="w-24 rounded-xl bg-paper px-3 py-2 text-sm ring-1 ring-sand-2" />
              <span className="text-mute">/</span>
              <input type="number" min="1" value={form.max} onChange={(x) => setForm({ ...form, max: x.target.value })} className="w-20 rounded-xl bg-paper px-3 py-2 text-sm ring-1 ring-sand-2" />
              <Button type="submit">{t('حفظ', 'Save')}</Button>
            </form>
            {mocks.length === 0 ? <p className="text-sm text-mute">{t('لا توجد نتائج بعد.', 'No results yet.')}</p> : (
              <ul className="divide-y divide-sand text-sm">{[...mocks].reverse().map((m) => <li key={m.id} className="flex items-center gap-3 py-2"><Pill color={m.passed ? '#12756B' : '#C8553D'}>{m.score}/{m.max}</Pill><span className="de flex-1">{m.type} · {SKILLS[m.skill as 'lesen']?.de ?? m.skill}</span><span className="text-xs text-mute">{fmtDate(m.date, lang)}</span></li>)}</ul>
            )}
          </Card>
        </div>
        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="text-xs font-semibold uppercase tracking-[.14em] text-saffron-deep">{t('شرح بالعربية', 'Explained in Arabic')}</div>
          {e.videos.map((v, i) => <VideoCard key={v} id={v} featured={i === 0} />)}
          <Card>
            <p className="text-sm text-mute">{t('سجّل فقط في متجر Goethe الرسمي، وادفع فقط بعد إيميل من ‎@goethe.de. لا وسطاء.', 'Register only in the official Goethe webshop and pay only after an e-mail from @goethe.de. No agents.')}</p>
            {isAdmin && <div className="mt-2"><AdminResourceLink id="goethe-ma" isAdmin={isAdmin}>Goethe-Institut Marokko</AdminResourceLink></div>}
          </Card>
        </aside>
      </div>
    </div>
  )
}
