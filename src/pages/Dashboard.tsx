import { useState } from 'react'
import { AUSBILDUNG_START, DAILY, LEVEL_COLOR, MILESTONES, PHASES, SKILLS, SKILL_KEYS, lessonById } from '../content/data'
import { addDays, daysBetween, todayISO } from '../lib/dates'
import { useT, fmtDate } from '../lib/i18n'
import { currentNode, levelProgress, nodeHref, phaseFor, weekFor, weekProgress } from '../lib/path'
import { playerLevel } from '../lib/game'
import { setState, streak, toggleTask, totalXp, useStore, longestStreak } from '../state/store'
import { JourneyMap } from '../components/JourneyMap'
import { Heatmap } from '../components/Heatmap'
import { Bar, Card, Check, Pill, Ring, Title, TxT } from '../components/ui'
import { Icon } from '../components/Icon'
import { skillShare } from './Progress'

export default function Dashboard() {
  const { t, tx, lang } = useT()
  const today = todayISO()
  const s = useStore((x) => x)
  const wk = weekFor(today)
  const ph = phaseFor(today)
  const node = currentNode(s, today)
  const st = streak(s, today, addDays)
  const best = longestStreak(s, addDays)
  const xp = totalXp(s)
  const lvl = playerLevel(xp)
  const wp = weekProgress(s, wk)
  const examDate = s.settings.examDate
  const next = MILESTONES.find((m) => m.date >= today) ?? MILESTONES[MILESTONES.length - 1]
  const doneToday = s.daily[today] ?? []
  const toggleBlock = (id: string) => setState((x) => {
    const cur = x.daily[today] ?? []
    return { ...x, daily: { ...x.daily, [today]: cur.includes(id) ? cur.filter((b) => b !== id) : [...cur, id] } }
  })
  const [hour] = useState(() => new Date().getHours())
  const greet = hour < 12 ? t('صباح الخير يا محمد', 'Good morning, Mohamed') : hour < 18 ? t('مساء الخير يا محمد', 'Good afternoon, Mohamed') : t('مساء النور يا محمد', 'Good evening, Mohamed')
  const greetDe = hour < 12 ? 'Guten Morgen!' : hour < 18 ? 'Guten Tag!' : 'Guten Abend!'
  const nodeLesson = node?.kind === 'lesson' ? lessonById(node.ref) : undefined
  const shares = skillShare(s)

  return (
    <div className="space-y-6">
      {/* Greeting + continue */}
      <section className="flex flex-wrap items-end justify-between gap-4 animate-rise">
        <div>
          <div className="de display text-lg italic text-saffron-deep">{greetDe}</div>
          <h1 className="text-3xl font-bold">{greet}</h1>
          <p className="mt-1 text-mute">
            {t('الأسبوع', 'Week')} <b className="text-ink">{wk.n}</b> {t('من 42', 'of 42')} · {t('المستوى', 'Level')} <b style={{ color: LEVEL_COLOR[ph.key] }}>{ph.label}</b> · {tx(wk.dates)}
          </p>
        </div>
        {node && (
          <a href={`#${nodeHref(node)}`} className="group flex items-center gap-4 rounded-2xl bg-ink p-2 pe-6 text-paper shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-saffron text-ink"><Icon name="play" size={24} /></span>
            <span>
              <span className="block text-xs text-paper/60">{t('تابع من حيث توقفت', 'Continue where you left off')}</span>
              <span className="block text-base font-bold">{tx(node.title)}</span>
              {node.de && <span className="de block text-xs italic text-saffron">{node.de}{nodeLesson ? ` · ${nodeLesson.minutes} min` : ''}</span>}
            </span>
          </a>
        )}
      </section>

      <JourneyMap today={today} />

      {/* Countdowns */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Countdown icon="exam" color="#C8553D" label={t('امتحان Goethe B1', 'Goethe B1 exam')} days={daysBetween(today, examDate)} date={fmtDate(examDate, lang, true)} />
        <Countdown icon="train" color="#12756B" label={t('بداية Ausbildung', 'Ausbildung starts')} days={daysBetween(today, AUSBILDUNG_START)} date={fmtDate(AUSBILDUNG_START, lang, true)} />
        <Countdown icon="khatam" color="#2F4BCE" label={`${t('المحطة القادمة', 'Next station')}: ${tx(next.title)}`} days={daysBetween(today, next.date)} date={fmtDate(next.date, lang, true)} />
        <div className="card flex items-center gap-4 p-4">
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-terra-soft text-terra"><Icon name="flame" size={30} className={st ? 'animate-flicker' : ''} /></div>
          <div>
            <div className="text-xs text-mute">{t('سلسلة الأيام', 'Streak')}</div>
            <div className="text-2xl font-bold tabular-nums">{st} <span className="text-sm font-medium text-mute">{t('يوم', 'days')}</span></div>
            <div className="text-xs text-mute">{t('الأطول', 'Longest')}: {best} · {t('الرتبة', 'Rank')} {lvl.level}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* This week */}
        <Card>
          <Title kicker={`${t('الأسبوع', 'Week')} ${wk.n} · ${tx(wk.dates)}`} right={<a href={`#/journey/${wk.n}`} className="text-sm font-semibold text-majorelle hover:underline">{t('تفاصيل الأسبوع', 'Week details')} ←</a>}>
            <span className="me-2">{wk.emoji}</span>{tx(wk.title)} <span className="de display ms-2 text-base font-medium italic text-ink-3">{wk.titleDe}</span>
          </Title>
          <div className="mb-4 flex items-center gap-3">
            <Bar value={wp.done / wp.total} color={LEVEL_COLOR[wk.phase]} h={10} />
            <span className="shrink-0 text-sm tabular-nums text-mute">{wp.done}/{wp.total}</span>
          </div>
          {wk.extra && <div className="mb-4 rounded-xl bg-saffron-soft px-4 py-3 text-sm"><TxT x={wk.extra} /></div>}
          <div className="grid gap-x-6 md:grid-cols-2">
            {wk.tasks.map((task) => {
              const auto = task.kind === 'lesson' ? !!s.nodes[`L:${task.ref}`] : task.kind === 'test' ? !!s.nodes[`T:${wk.n}`] : false
              const id = `w${wk.n}:${task.id}`
              const label = task.kind === 'lesson' ? tx(lessonById(task.ref!)!.title) : tx(task.label!)
              return <Check key={task.id} checked={auto || !!s.tasks[id]} onChange={() => !auto && toggleTask(id, today)}>
                <span className="block text-[11px] font-semibold text-saffron-deep no-underline">{taskKind(task.kind, t)}</span><TxT x={label} />
              </Check>
            })}
          </div>
          <div className="mt-5 grid gap-3 border-t border-sand pt-5 sm:grid-cols-2 xl:grid-cols-4">
            {SKILL_KEYS.map((k) => (
              <div key={k} className="rounded-xl p-3" style={{ background: SKILLS[k].color + '10' }}>
                <div className="mb-1 flex items-center gap-1.5 text-sm font-bold" style={{ color: SKILLS[k].color }}><Icon name={SKILLS[k].icon} size={16} />{tx(SKILLS[k].title)}</div>
                <div className="line-clamp-3 text-xs text-ink/80"><TxT x={wk.skills[k].goal} /></div>
                <div className="mt-1 text-[11px] text-mute">{wk.skills[k].minutes} {t('د/يوم', 'min/day')}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today */}
        <Card>
          <Title kicker={t('برنامج اليوم', 'Today\'s plan')} right={<Pill color="#12756B">{doneToday.length}/{DAILY.length}</Pill>}>{t('ساعتان من التركيز', 'Two focused hours')}</Title>
          <ol className="space-y-2">
            {DAILY.map((b) => {
              const done = doneToday.includes(b.id)
              return (
                <li key={b.id}>
                  <button onClick={() => toggleBlock(b.id)} className={`flex w-full items-start gap-3 rounded-xl p-3 text-start ring-1 transition ${done ? 'bg-zellige-soft/60 ring-zellige/30' : 'bg-paper ring-sand hover:ring-sand-2'}`}>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold tabular-nums ${done ? 'bg-zellige text-paper' : 'bg-sand/70 text-ink'}`}>{done ? <Icon name="check" size={16} strokeWidth={2.5} /> : b.time}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-sm font-semibold"><span>{tx(b.title)}</span><span className="shrink-0 text-xs font-medium text-mute">{b.minutes} {t('د', 'min')}</span></span>
                      <span className="mt-0.5 block text-xs text-mute"><TxT x={b.by[wk.phase]} /></span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <Title kicker={t('سنة الدراسة', 'Your study year')} right={<a href="#/progress" className="text-sm font-semibold text-majorelle hover:underline">{t('لوحة التتبع', 'Tracking')} ←</a>}>{t('خريطة النشاط', 'Activity heatmap')}</Title>
          <Heatmap today={today} compact />
        </Card>
        <Card>
          <Title kicker={t('التقدّم', 'Progress')}>{t('المستويات والمهارات', 'Levels and skills')}</Title>
          <div className="space-y-3">
            {PHASES.map((p) => {
              const v = levelProgress(s, p.key)
              return (
                <div key={p.key} className="flex items-center gap-3">
                  <span className="w-9 shrink-0 rounded-md py-0.5 text-center text-xs font-bold text-paper" style={{ background: LEVEL_COLOR[p.key] }}>{p.label}</span>
                  <Bar value={v} color={LEVEL_COLOR[p.key]} />
                  <span className="w-10 shrink-0 text-end text-xs tabular-nums text-mute">{Math.round(v * 100)}%</span>
                </div>
              )
            })}
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2 border-t border-sand pt-5 text-center">
            {SKILL_KEYS.map((k) => (
              <div key={k} className="flex flex-col items-center gap-1">
                <Ring value={shares[k].score} size={60} stroke={6} color={SKILLS[k].color}><Icon name={SKILLS[k].icon} size={18} style={{ color: SKILLS[k].color }} /></Ring>
                <div className="text-xs font-semibold">{tx(SKILLS[k].title)}</div>
                <div className="text-[11px] tabular-nums text-mute">{Math.round(shares[k].score * 100)}%</div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

export const taskKind = (k: string, t: (a: string, e: string) => string) =>
  ({ lesson: t('درس', 'Lesson'), nicos: 'Nicos Weg', book: t('الكتاب', 'Book'), speak: t('محادثة', 'Speak'), write: t('كتابة', 'Write'), listen: t('استماع', 'Listen'), read: t('قراءة', 'Read'), test: t('اختبار', 'Test') } as Record<string, string>)[k] ?? k

function Countdown({ icon, color, label, days, date }: { icon: string; color: string; label: string; days: number; date: string }) {
  const { t } = useT()
  return (
    <div className="card flex items-center gap-4 p-4">
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: color + '18', color }}><Icon name={icon} size={28} /></div>
      <div className="min-w-0">
        <div className="truncate text-xs text-mute">{label}</div>
        <div className="text-2xl font-bold tabular-nums">{Math.max(0, days)} <span className="text-sm font-medium text-mute">{t('يومًا', 'days')}</span></div>
        <div className="text-xs text-mute">{date}</div>
      </div>
    </div>
  )
}
