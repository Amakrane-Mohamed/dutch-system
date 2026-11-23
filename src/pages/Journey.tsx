import { useState } from 'react'
import { LEVEL_COLOR, PHASES, SKILLS, SKILL_KEYS, WEEKS, lessonById, weekByN, type PhaseKey } from '../content/data'
import { todayISO } from '../lib/dates'
import { useT } from '../lib/i18n'
import { cx } from '../lib/cx'
import { nodesForWeek, nodeHref, weekFor, weekProgress } from '../lib/path'
import { toggleTask, useStore } from '../state/store'
import { VideoCard } from '../components/VideoCard'
import { Bar, Card, Check, De, LinkButton, PageHead, Pill, Tabs, Title, TxT } from '../components/ui'
import { Icon } from '../components/Icon'
import { taskKind } from './Dashboard'
import { useAuth } from '../state/auth'

export default function Journey({ route }: { route: string }) {
  const { isAdmin } = useAuth()
  const n = Number(route.split('/')[2])
  return n ? <WeekView n={n} isAdmin={isAdmin} /> : <WeekList isAdmin={isAdmin} />
}

function WeekList({ isAdmin }: { isAdmin: boolean }) {
  const { t, tx } = useT()
  const today = todayISO()
  const s = useStore((x) => x)
  const cur = weekFor(today)
  const [phase, setPhase] = useState<PhaseKey | 'all'>('all')
  const list = WEEKS.filter((w) => phase === 'all' || w.phase === phase)
  return (
    <div>
      <PageHead kicker={t('11 نوفمبر 2026 ← 29 أغسطس 2027', '11 Nov 2026 → 29 Aug 2027')} title={t('الرحلة أسبوعًا بأسبوع', 'The journey, week by week')} de="42 Wochen bis zur Ausbildung"
        sub={isAdmin ? t('لكل أسبوع: أهداف المهارات الأربع، القواعد والمفردات، فصول Nicos Weg ودروس الكتاب، فيديوهات بالعربية، روتين يومي واختبار في نهاية الأسبوع.', 'Every week: goals for the four skills, grammar and vocab, Nicos Weg chapters and book units, Arabic videos, a daily routine and a weekly test.') : t('لكل أسبوع: أهداف المهارات الأربع، القواعد والمفردات، فيديوهات بالعربية، روتين يومي واختبار في نهاية الأسبوع.', 'Every week: skill goals, grammar and vocabulary, Arabic videos, a daily routine and a weekly test.')}
        right={<LinkButton href={`#/journey/${cur.n}`} variant="gold"><Icon name="calendar" size={18} />{t('هذا الأسبوع', 'This week')} · {cur.n}</LinkButton>} />
      <Tabs className="mb-6" value={phase} onChange={setPhase} items={[{ key: 'all', label: t('الكل', 'All') }, ...PHASES.map((p) => ({ key: p.key, label: p.label }))]} />
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((w) => {
          const p = weekProgress(s, w)
          return (
            <a key={w.n} href={`#/journey/${w.n}`} className={cx('card group block p-5 transition hover:-translate-y-0.5', w.n === cur.n && 'ring-2 ring-terra')}>
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-paper" style={{ background: LEVEL_COLOR[w.phase] }}>
                  <div className="text-center leading-none"><div className="text-[10px] opacity-75">{t('أسبوع', 'Wk')}</div><div className="text-xl font-bold">{w.n}</div></div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-mute">{tx(w.dates)} {w.n === cur.n && <Pill color="#C8553D" className="ms-1">{t('الآن', 'now')}</Pill>}</div>
                  <div className="mt-0.5 font-bold leading-snug">{w.emoji} {tx(w.title)}</div>
                  <div className="de truncate text-sm italic text-ink-3">{w.titleDe}</div>
                </div>
              </div>
              {isAdmin && <div className="mt-3 line-clamp-1 text-xs text-mute"><span className="de">{w.nicos}</span></div>}
              <div className="mt-3 flex items-center gap-3"><Bar value={p.done / p.total} color={LEVEL_COLOR[w.phase]} h={6} /><span className="text-xs tabular-nums text-mute">{p.done}/{p.total}</span></div>
              {w.extra && <div className="mt-3 rounded-lg bg-saffron-soft px-3 py-1.5 text-xs"><TxT x={w.extra} /></div>}
            </a>
          )
        })}
      </div>
    </div>
  )
}

function WeekView({ n, isAdmin }: { n: number; isAdmin: boolean }) {
  const { t, tx } = useT()
  const today = todayISO()
  const s = useStore((x) => x)
  const w = weekByN(n)
  if (!w) return <p>—</p>
  const p = weekProgress(s, w)
  const color = LEVEL_COLOR[w.phase]
  const nodes = nodesForWeek(w)
  const test = nodes[nodes.length - 1]
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <a href="#/journey" className="inline-flex items-center gap-1 text-sm font-semibold text-mute hover:text-ink"><Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" />{t('كل الأسابيع', 'All weeks')}</a>
        <div className="flex gap-2">
          {n > 1 && <a href={`#/journey/${n - 1}`} className="rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ring-sand-2 hover:bg-sand/50">{t('السابق', 'Previous')}</a>}
          {n < 42 && <a href={`#/journey/${n + 1}`} className="rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ring-sand-2 hover:bg-sand/50">{t('التالي', 'Next')}</a>}
        </div>
      </div>
      <header className="zellige-bg mb-6 overflow-hidden rounded-3xl p-7 text-paper">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm"><span className="rounded-md px-2 py-0.5 text-xs font-bold" style={{ background: color }}>{w.phase.toUpperCase()}</span><span className="text-paper/70">{t('الأسبوع', 'Week')} {w.n} / 42 · {tx(w.dates)}</span></div>
            <h1 className="mt-2 text-3xl font-bold">{w.emoji} {tx(w.title)}</h1>
            <div className="de display mt-1 text-lg italic text-saffron">{w.titleDe}</div>
          </div>
          <div className="min-w-60">
            <div className="mb-1 flex justify-between text-sm text-paper/70"><span>{t('إنجاز الأسبوع', 'Week done')}</span><span className="tabular-nums">{p.done}/{p.total}</span></div>
            <Bar value={p.done / p.total} color="#E3A72F" track="rgba(255,255,255,.12)" h={10} />
          </div>
        </div>
        {w.extra && <div className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-sm"><TxT x={w.extra} /></div>}
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            {SKILL_KEYS.map((k) => {
              const sk = w.skills[k], meta = SKILLS[k]
              return (
                <Card key={k} className="!p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3" style={{ background: meta.color + '14' }}>
                    <div className="flex items-center gap-2 font-bold" style={{ color: meta.color }}><Icon name={meta.icon} size={19} />{tx(meta.title)} <span className="de text-xs font-medium opacity-70">{meta.de}</span></div>
                    <span className="text-xs font-semibold text-mute">{sk.minutes} {t('د/يوم', 'min/day')}</span>
                  </div>
                  <div className="space-y-3 p-5 text-sm">
                    <div><div className="mb-1 text-xs font-semibold text-mute">{t('هدف الأسبوع', 'Goal')}</div><TxT x={sk.goal} /></div>
                    <div>
                      <div className="mb-1 text-xs font-semibold text-mute">{t('الروتين اليومي', 'Daily routine')}</div>
                      <ol className="space-y-1.5">{sk.daily.map((d, i) => <li key={i} className="flex gap-2"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-paper" style={{ background: meta.color }}>{i + 1}</span><TxT x={d} /></li>)}</ol>
                    </div>
                    {k === 'sprechen' && <div className="rounded-xl bg-paper p-3 ring-1 ring-sand"><div className="mb-1 text-xs font-semibold text-mute">{t('أزواج النطق هذا الأسبوع', 'This week\'s sound pairs')}</div>{w.drills.map((d) => <div key={d.a} className="flex items-center gap-2"><De className="font-semibold">{d.a}</De><span className="text-mute">/</span><De className="font-semibold">{d.b}</De><span className="text-xs text-mute">{d.ar}</span></div>)}</div>}
                  </div>
                </Card>
              )
            })}
          </section>

          <Card>
            <Title kicker={t('المحتوى', 'Content')}>{isAdmin ? t('القواعد والمفردات والمصادر', 'Grammar, vocabulary and sources') : t('القواعد والمفردات', 'Grammar and vocabulary')}</Title>
            <div className="grid gap-4 md:grid-cols-2">
              <div><div className="mb-2 text-sm font-bold">{t('القواعد', 'Grammar')}</div><ul className="space-y-1.5 text-sm">{w.grammar.map((g, i) => <li key={i} className="flex gap-2"><span style={{ color }}>◆</span><TxT x={g} /></li>)}</ul></div>
              <div><div className="mb-2 text-sm font-bold">{t('المفردات', 'Vocabulary')}</div><ul className="space-y-1.5 text-sm">{w.vocab.map((g, i) => <li key={i} className="flex gap-2"><span style={{ color }}>◆</span><TxT x={g} /></li>)}</ul></div>
            </div>
            {isAdmin && <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-paper p-4 ring-1 ring-sand text-sm"><div className="mb-1 flex items-center gap-2 font-semibold"><Icon name="play" size={16} className="text-zellige" />Nicos Weg</div><span className="de">{w.nicos}</span></div>
              <div className="rounded-xl bg-paper p-4 ring-1 ring-sand text-sm"><div className="mb-1 flex items-center gap-2 font-semibold"><Icon name="library" size={16} className="text-saffron-deep" />{t('الكتاب', 'Book')}</div><span className="de">{w.book}</span></div>
            </div>}
          </Card>

          <Card>
            <Title kicker={t('قائمة الأسبوع', 'Week checklist')} right={<span className="text-sm tabular-nums text-mute">{p.done}/{p.total}</span>}>{t('ما يجب إنجازه', 'What to get done')}</Title>
            <div className="grid gap-x-6 md:grid-cols-2">
              {w.tasks.map((task) => {
                const auto = task.kind === 'lesson' ? !!s.nodes[`L:${task.ref}`] : task.kind === 'test' ? !!s.nodes[`T:${w.n}`] : false
                const id = `w${w.n}:${task.id}`
                const label = task.kind === 'lesson' ? tx(lessonById(task.ref!)!.title) : tx(task.label!)
                return <Check key={task.id} checked={auto || !!s.tasks[id]} onChange={() => !auto && toggleTask(id, today)}><span className="block text-[11px] font-semibold text-saffron-deep no-underline">{taskKind(task.kind, t)}</span><TxT x={label} /></Check>
              })}
            </div>
          </Card>

          <Card className="!bg-ink text-paper !ring-ink">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-saffron text-ink"><Icon name="ticket" size={28} /></div>
                <div><div className="text-xs font-semibold uppercase tracking-[.16em] text-saffron">{t('اختبار الأسبوع', 'Weekly test')}</div><div className="mt-1 max-w-xl text-paper/90"><TxT x={w.test} /></div></div>
              </div>
              <a href={`#${nodeHref(test)}`} className="rounded-xl bg-saffron px-5 py-3 text-sm font-bold text-ink">{s.nodes[test.id] ? t('أعد الاختبار', 'Retake test') : t('ابدأ الاختبار', 'Start test')}</a>
            </div>
          </Card>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <Title kicker={t('التوقفات', 'Stops')}>{t('في خط الرحلة', 'On the route')}</Title>
            <ul className="space-y-2">{nodes.map((x) => <li key={x.id}><a href={`#${nodeHref(x)}`} className="flex items-center gap-3 rounded-xl p-2 text-sm hover:bg-sand/40"><span className={cx('grid h-7 w-7 place-items-center rounded-full', s.nodes[x.id] ? 'text-paper' : 'bg-sand/70')} style={s.nodes[x.id] ? { background: color } : undefined}><Icon name={s.nodes[x.id] ? 'check' : x.kind === 'test' ? 'ticket' : x.kind === 'study' ? 'map' : 'book'} size={14} /></span><span className="flex-1">{tx(x.title)}</span><Icon name="chevron" size={16} className="flip-rtl text-mute" /></a></li>)}</ul>
          </Card>
          <div className="text-xs font-semibold uppercase tracking-[.14em] text-saffron-deep">{t('فيديوهات الأسبوع (مُتحقَّق منها)', 'Week videos (verified)')}</div>
          {w.videos.map((v, i) => <VideoCard key={v} id={v} featured={i === 0} />)}
        </aside>
      </div>
    </div>
  )
}
