import { useMemo, useState } from 'react'
import { LEVEL_COLOR, PHASES, lessonById, phaseByKey, resourceById, weekByN, weeksOf, type Block, type Lesson, type PhaseKey } from '../content/data'
import { WORDS, ARTICLE_COLOR, pluralOf } from '../content/vocab'
import { todayISO } from '../lib/dates'
import { useT } from '../lib/i18n'
import { cx } from '../lib/cx'
import { go } from '../lib/router'
import { XP } from '../lib/game'
import { lessonSession } from '../lib/lessons'
import { buildDrill, DRILLS } from '../lib/drills'
import { PASS, levelExam, levelProgress, nodeHref, nodeStates, nodesForWeek, weekFor, weekTest, type NodeState, type PathNode } from '../lib/path'
import { addXp, useStore } from '../state/store'
import { completeNode, logMinutes, pushTest } from '../state/progress'
import { ExerciseRunner } from '../components/ExerciseRunner'
import { VideoCard } from '../components/VideoCard'
import { Bar, Button, Card, De, Ext, Md, PageHead, Pill, Ring, Speak, Title, TxT } from '../components/ui'
import { Icon } from '../components/Icon'

export default function Learn({ route }: { route: string }) {
  const parts = route.split('/').filter(Boolean) // learn, kind, ref, run?
  const [, kind, ref, sub] = parts
  if (kind === 'lesson' && ref) return sub === 'run' ? <LessonRun id={ref} /> : <LessonView id={ref} />
  if (kind === 'study' && ref) return <StudyView n={Number(ref)} />
  if (kind === 'test' && ref) return <TestRun n={Number(ref)} />
  if (kind === 'exam' && ref) return <ExamRun level={ref as PhaseKey} />
  if (kind === 'drill' && ref) return <DrillRun id={ref} />
  return <RouteMap />
}

// ---------------------------------------------------------------- route map
function RouteMap() {
  const { t, tx, lang } = useT()
  const today = todayISO()
  const s = useStore((x) => x)
  const cur = weekFor(today).phase
  const [level, setLevel] = useState<PhaseKey>(cur)
  const ph = phaseByKey(level)
  const states = nodeStates(s, level, today)
  const color = LEVEL_COLOR[level]
  const weeks = weeksOf(level)
  const exam: PathNode = { id: `E:${level}`, kind: 'exam', level, ref: level, title: { ar: `امتحان المستوى ${ph.label}`, en: `${ph.label} level exam` } }
  return (
    <div>
      <PageHead kicker={t('خط الرحلة', 'The route')} title={t('من محطة إلى محطة', 'From station to station')} de="Deine Strecke"
        sub={t('كل أسبوع محطة، وكل درس توقف. أنهِ التوقفات بالترتيب، ثم اختبار الأسبوع، لتصل إلى المحطة التالية.', 'Every week is a station and every lesson a stop. Finish the stops in order, then the weekly test, to reach the next station.')} />
      {/* line selector */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PHASES.map((p) => {
          const v = levelProgress(s, p.key)
          return (
            <button key={p.key} onClick={() => setLevel(p.key)} className={cx('card flex items-center gap-4 p-4 text-start transition', level === p.key ? 'ring-2' : 'opacity-80 hover:opacity-100')} style={level === p.key ? { boxShadow: `inset 0 0 0 2px ${LEVEL_COLOR[p.key]}` } : undefined}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold text-paper" style={{ background: LEVEL_COLOR[p.key] }}>{p.label}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{t('الخط', 'Line')} {p.label} {p.key === cur && <Pill color={LEVEL_COLOR[p.key]} className="ms-1">{t('الآن', 'now')}</Pill>}</span>
                <span className="block truncate text-xs text-mute">{tx(p.dates)}</span>
                <Bar value={v} color={LEVEL_COLOR[p.key]} h={5} className="mt-2" />
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <ol className="relative">
          {/* the rail */}
          <div className="absolute bottom-6 top-6 start-[27px] w-[6px] rounded-full" style={{ background: `repeating-linear-gradient(to bottom, ${color} 0 18px, ${color}CC 18px 22px)` }} />
          {weeks.map((w) => {
            const nodes = nodesForWeek(w)
            const doneN = nodes.filter((n) => states[n.id] === 'done').length
            const isNow = w.n === weekFor(today).n
            const allDone = doneN === nodes.length
            return (
              <li key={w.n} className="relative mb-6 ps-20">
                <div className={cx('absolute start-0 top-0 grid h-[60px] w-[60px] place-items-center rounded-full border-[5px] text-lg font-bold', allDone ? 'text-paper' : 'bg-paper-2')} style={{ borderColor: color, background: allDone ? color : undefined, color: allDone ? undefined : color }}>
                  {allDone ? <Icon name="check" size={26} strokeWidth={3} /> : w.n}
                  {isNow && <span className="absolute -inset-2 animate-ping rounded-full border-2 opacity-30" style={{ borderColor: color }} />}
                </div>
                <div className="card overflow-hidden p-0">
                  <a href={`#/journey/${w.n}`} className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-5 py-4 hover:bg-sand/30">
                    <div>
                      <div className="text-xs text-mute">{t('المحطة', 'Station')} {w.n} · {tx(w.dates)} {isNow && <Pill color="#C8553D" className="ms-1">{t('هذا الأسبوع', 'this week')}</Pill>}</div>
                      <div className="mt-0.5 text-lg font-bold">{w.emoji} {tx(w.title)}</div>
                      <div className="de display text-sm italic text-ink-3">{w.titleDe}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mute"><span className="tabular-nums">{doneN}/{nodes.length}</span><Icon name="chevron" size={18} className="flip-rtl" /></div>
                  </a>
                  <div className="flex flex-wrap gap-2 p-4">
                    {nodes.map((n) => <Stop key={n.id} n={n} state={states[n.id]} color={color} />)}
                  </div>
                </div>
              </li>
            )
          })}
          <li className="relative ps-20">
            <div className="absolute start-0 top-0 grid h-[60px] w-[60px] place-items-center rounded-2xl text-paper shadow-lg" style={{ background: color }}><Icon name="exam" size={28} /></div>
            <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="text-xs text-mute">{t('المحطة النهائية', 'Terminal')}</div>
                <div className="text-lg font-bold">{tx(exam.title)}</div>
                <div className="text-sm text-mute"><TxT x={ph.test} /></div>
              </div>
              <Stop n={exam} state={states[exam.id]} color={color} big />
            </div>
          </li>
        </ol>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <div className="flex items-center gap-4">
              <Ring value={levelProgress(s, level)} size={84} stroke={8} color={color}><span className="text-xl font-bold">{ph.label}</span></Ring>
              <div>
                <div className="text-sm text-mute">{t('تقدّم الخط', 'Line progress')}</div>
                <div className="text-3xl font-bold tabular-nums">{Math.round(levelProgress(s, level) * 100)}%</div>
                <div className="text-xs text-mute">~{ph.hours} {t('ساعة', 'hours')} · {ph.book}</div>
              </div>
            </div>
          </Card>
          <Card>
            <Title kicker="Can-do">{t('في نهاية هذا الخط أستطيع…', 'At the end of this line I can…')}</Title>
            <ul className="space-y-2 text-sm">{ph.can.map((c, i) => <li key={i} className="flex gap-2"><Icon name="check" size={16} className="mt-0.5 shrink-0" style={{ color }} /><TxT x={c} /></li>)}</ul>
          </Card>
          <Card>
            <Title kicker={t('مفتاح الخريطة', 'Map key')}>{t('أنواع التوقفات', 'Kinds of stops')}</Title>
            <ul className="space-y-2 text-sm text-mute">
              <li className="flex items-center gap-2"><Icon name="book" size={16} className="text-ink" />{t('درس مكتوب بالعربية مع تمارين وفيديو', 'Written lesson in Arabic with exercises and video')}</li>
              <li className="flex items-center gap-2"><Icon name="map" size={16} className="text-ink" />{t('محطة دراسة: Nicos Weg + الكتاب + فيديوهات', 'Study stop: Nicos Weg + book + videos')}</li>
              <li className="flex items-center gap-2"><Icon name="ticket" size={16} className="text-ink" />{t('اختبار الأسبوع (≥ 70٪)', 'Weekly test (≥ 70%)')}</li>
            </ul>
            <p className="mt-3 text-xs text-mute">{lang === 'ar' ? 'تفتح الخطوط تلقائيًا في تاريخها، أو عند نجاحك في امتحان الخط السابق.' : 'Lines open on their start date, or when you pass the previous line\'s exam.'}</p>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function Stop({ n, state, color, big = false }: { n: PathNode; state: NodeState; color: string; big?: boolean }) {
  const { tx, t } = useT()
  const icon = n.kind === 'lesson' ? 'book' : n.kind === 'study' ? 'map' : n.kind === 'test' ? 'ticket' : 'exam'
  const locked = state === 'locked'
  const body = (
    <span className={cx('inline-flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition',
      state === 'done' && 'bg-paper ring-sand text-ink', state === 'current' && 'text-paper shadow-md', (state === 'open') && 'bg-paper-2 ring-sand-2 hover:ring-ink/40', locked && 'bg-sand/30 text-mute ring-sand', big && 'px-5 py-3')}
      style={state === 'current' ? { background: color, boxShadow: `0 8px 20px -10px ${color}` } : undefined}>
      <span className={cx('grid h-7 w-7 place-items-center rounded-full', state === 'done' ? 'text-paper' : state === 'current' ? 'bg-paper/20' : 'bg-sand/70')} style={state === 'done' ? { background: color } : undefined}>
        <Icon name={state === 'done' ? 'check' : locked ? 'lock' : icon} size={14} strokeWidth={state === 'done' ? 3 : 2} />
      </span>
      <span>{tx(n.title)}{n.de && n.kind === 'lesson' && <span className={cx('de ms-1.5 text-xs font-normal italic', state === 'current' ? 'text-paper/80' : 'text-mute')}>{n.de}</span>}</span>
      {state === 'current' && <span className="ms-1 rounded-md bg-paper px-2 py-0.5 text-xs font-bold" style={{ color }}>{t('انطلق', 'Go')}</span>}
    </span>
  )
  return locked ? <span title={t('مغلق: أكمل التوقف السابق', 'Locked: finish the previous stop')}>{body}</span> : <a href={`#${nodeHref(n)}`}>{body}</a>
}

// ---------------------------------------------------------------- lesson
function BlockView({ b }: { b: Block }) {
  const { tx, t } = useT()
  const darija = useStore((s) => s.settings.showDarija)
  switch (b.type) {
    case 'text': return <p className="naskh text-[17px] text-ink/90"><Md text={tx(b.md)} /></p>
    case 'tip': return <div className="flex gap-3 rounded-2xl bg-saffron-soft/70 p-4 text-[15px] ring-1 ring-saffron/30"><Icon name="sparkle" size={20} className="mt-1 shrink-0 text-saffron-deep" /><div className="naskh"><Md text={tx(b.md)} /></div></div>
    case 'examples': return (
      <div className="overflow-hidden rounded-2xl ring-1 ring-sand">
        {b.items.map((e, i) => (
          <div key={i} className={cx('flex items-center gap-4 px-4 py-3', i % 2 ? 'bg-paper' : 'bg-paper-2')}>
            <Speak text={e.de} />
            <div className="min-w-0 flex-1">
              <De className="text-lg font-semibold">{e.de}</De>
              <div className="text-sm text-mute">{tx({ ar: e.ar, en: e.en })}{darija && e.dar && <span className="ms-2 text-xs text-terra">· {t('بالدارجة', 'Darija')}: {e.dar}</span>}</div>
            </div>
          </div>
        ))}
      </div>
    )
    case 'sounds': return (
      <div>
        <div className="mb-2 font-bold">{tx(b.title)}</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {b.items.map((x, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-paper-2 p-3 ring-1 ring-sand">
              <Speak text={x.de} />
              <div><De className="text-lg font-bold">{x.de}</De> <span className="text-sm text-mute">{x.ar}</span><div className="mt-0.5 text-sm text-ink/80"><Md text={tx(x.tip)} /></div></div>
            </div>
          ))}
        </div>
      </div>
    )
    case 'table': return (
      <div className="overflow-x-auto rounded-2xl ring-1 ring-sand scroll-thin">
        <table className="w-full text-sm">
          <thead className="bg-ink text-paper"><tr>{b.columns.map((c, i) => <th key={i} className="px-4 py-2.5 text-start font-semibold">{tx(c)}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, i) => <tr key={i} className={i % 2 ? 'bg-paper' : 'bg-paper-2'}>{r.map((c, j) => {
            const v = tx(c), de = typeof c === 'string' && !/[\u0600-\u06FF]/.test(c)
            return <td key={j} className="px-4 py-2.5 align-top">{de ? <span className="de font-semibold">{v}</span> : <Md text={v} />}</td>
          })}</tr>)}</tbody>
        </table>
      </div>
    )
  }
}

function LessonView({ id }: { id: string }) {
  const { t, tx } = useT()
  const l = lessonById(id)
  const done = useStore((s) => s.nodes[`L:${id}`])
  if (!l) return <p>{t('الدرس غير موجود', 'Lesson not found')}</p>
  const week = weekByN(weekOfLesson(l))
  const words = l.vocab.map((v) => WORDS.find((w) => w.id === v)).filter((w): w is NonNullable<typeof w> => !!w)
  return (
    <div>
      <a href="#/learn" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-mute hover:text-ink"><Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" />{t('خط الرحلة', 'Route')}</a>
      <PageHead kicker={`${l.level} · ${t('الدرس', 'Lesson')} ${l.order}${week ? ` · ${t('الأسبوع', 'Week')} ${week.n}` : ''} · ${l.minutes} ${t('دقيقة', 'min')}`} title={tx(l.title)} de={l.titleDe} sub={<TxT x={l.summary} />}
        right={<Button variant="gold" className="px-6 py-3 text-base" onClick={() => go(`/learn/lesson/${id}/run`)}><Icon name="play" size={18} />{done ? t('أعد التمارين', 'Practise again') : t('ابدأ التمارين', 'Start exercises')}</Button>} />
      <div className="grid gap-8 xl:grid-cols-[1fr_400px]">
        <article className="card space-y-6 p-7">{l.blocks.map((b, i) => <BlockView key={i} b={b} />)}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink p-5 text-paper">
            <div><div className="font-bold">{t('جاهز؟', 'Ready?')} <span className="de italic text-saffron">Los geht’s!</span></div><div className="text-sm text-paper/60">{l.exercises.length} {t('تمارين + استماع ونطق وترجمة', 'exercises + listening, speaking and translation')}</div></div>
            <Button variant="gold" onClick={() => go(`/learn/lesson/${id}/run`)}>{t('ابدأ التمارين', 'Start exercises')}</Button>
          </div>
        </article>
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          {l.videos[0] && <VideoCard id={l.videos[0]} featured />}
          {l.videos.length > 1 && (
            <Card>
              <Title kicker={t('فيديوهات إضافية', 'More videos')}>{t('للتعمّق', 'Go deeper')}</Title>
              <div className="grid grid-cols-2 gap-3">{l.videos.slice(1).map((v) => <VideoCard key={v} id={v} />)}</div>
            </Card>
          )}
          {words.length > 0 && (
            <Card>
              <Title kicker={`${words.length} ${t('كلمة', 'words')}`}>{t('مفردات الدرس', 'Lesson vocabulary')}</Title>
              <ul className="divide-y divide-sand">
                {words.map((w) => (
                  <li key={w.id} className="flex items-center gap-3 py-2">
                    <Speak text={w.de} size={15} />
                    <div className="min-w-0 flex-1">
                      <div className={cx('de font-semibold', ARTICLE_COLOR[w.article])}>{w.de}</div>
                      {pluralOf(w) && <div className="de text-xs text-mute">{pluralOf(w)}</div>}
                    </div>
                    <div className="text-sm font-semibold">{w.ar}</div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {l.resources.length > 0 && (
            <Card>
              <Title kicker={t('موارد', 'Resources')}>{t('ادرس أيضًا', 'Also study')}</Title>
              <ul className="space-y-2 text-sm">{l.resources.map((r) => { const x = resourceById(r); return x ? <li key={r}><Ext href={x.urls[0]}>{x.name}</Ext></li> : null })}</ul>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}
const weekOfLesson = (l: Lesson) => weeksOfAll().find((w) => w.lessons.includes(l.id))?.n ?? 0
const weeksOfAll = () => PHASES.flatMap((p) => weeksOf(p.key))

function LessonRun({ id }: { id: string }) {
  const { tx } = useT()
  const l = lessonById(id)
  const items = useMemo(() => (l ? lessonSession(l) : []), [l])
  if (!l) return null
  return (
    <ExerciseRunner exercises={items} level={l.level.toLowerCase()} title={tx(l.title)} passMark={PASS.lesson}
      onFinish={(r) => {
        if (!r.completed) return
        pushTest({ kind: 'lesson', ref: id, title: tx(l.title), score: r.score, total: r.total, level: l.level.toLowerCase() })
        if (r.score / r.total >= PASS.lesson) { completeNode(`L:${id}`, r.score / r.total); logMinutes(l.minutes, `Lesson: ${l.titleDe}`) }
      }}
      onExit={() => go('/learn')} />
  )
}

// ---------------------------------------------------------------- study stop
function StudyView({ n }: { n: number }) {
  const { t, tx } = useT()
  const w = weekByN(n)
  const done = useStore((s) => !!s.nodes[`S:${n}`])
  if (!w) return null
  return (
    <div>
      <a href="#/learn" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-mute hover:text-ink"><Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" />{t('خط الرحلة', 'Route')}</a>
      <PageHead kicker={`${t('محطة دراسة', 'Study stop')} · ${t('الأسبوع', 'Week')} ${w.n} · ${tx(w.dates)}`} title={tx(w.title)} de={w.titleDe}
        right={<Button variant={done ? 'ghost' : 'gold'} onClick={() => { if (!done) { completeNode(`S:${n}`, 1); addXp(XP.study, todayISO()) } go('/learn') }}><Icon name="check" size={18} />{done ? t('تمّت', 'Done') : t('درست هذه المحطة (+30 XP)', 'I studied this stop (+30 XP)')}</Button>} />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <Card>
            <Title kicker={t('المنهج', 'Syllabus')}>{t('ماذا تدرس في هذه المحطة', 'What to study at this stop')}</Title>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-paper p-4 ring-1 ring-sand"><div className="mb-2 flex items-center gap-2 font-bold"><Icon name="book" size={18} className="text-majorelle" />{t('القواعد', 'Grammar')}</div><ul className="space-y-1.5 text-sm">{w.grammar.map((g, i) => <li key={i}>• <TxT x={g} /></li>)}</ul></div>
              <div className="rounded-2xl bg-paper p-4 ring-1 ring-sand"><div className="mb-2 flex items-center gap-2 font-bold"><Icon name="cards" size={18} className="text-terra" />{t('المفردات', 'Vocabulary')}</div><ul className="space-y-1.5 text-sm">{w.vocab.map((g, i) => <li key={i}>• <TxT x={g} /></li>)}</ul></div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2"><Icon name="play" size={16} className="mt-0.5 shrink-0 text-zellige" /><span><b>Nicos Weg:</b> <span className="de">{w.nicos}</span> · <Ext href="https://learngerman.dw.com/ar/nicos-weg/c-47993645">DW</Ext></span></div>
              <div className="flex gap-2"><Icon name="library" size={16} className="mt-0.5 shrink-0 text-saffron-deep" /><span><b>{t('الكتاب', 'Book')}:</b> <span className="de">{w.book}</span></span></div>
            </div>
          </Card>
          <Card>
            <Title kicker={t('تدرّب الآن', 'Practise now')}>{t('قل واكتب', 'Say and write')}</Title>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 rounded-xl bg-terra-soft/50 p-3"><Icon name="mic" size={18} className="mt-0.5 text-terra" /><div><div className="font-semibold">{t('سؤال المحادثة', 'Speaking prompt')}</div><De>{w.speak}</De></div></div>
              <div className="flex items-start gap-3 rounded-xl bg-saffron-soft/60 p-3"><Icon name="pen" size={18} className="mt-0.5 text-saffron-deep" /><div><div className="font-semibold">{t('مهمة الكتابة', 'Writing task')}</div><span className="de">{w.write}</span></div></div>
            </div>
          </Card>
        </div>
        <aside className="space-y-4">{w.videos.map((v, i) => <VideoCard key={v} id={v} featured={i === 0} />)}</aside>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- tests
function TestRun({ n }: { n: number }) {
  const { t, tx } = useT()
  const w = weekByN(n)
  const items = useMemo(() => (w ? weekTest(w) : []), [w])
  if (!w) return null
  return (
    <ExerciseRunner exercises={items} level={w.phase} title={`${t('اختبار الأسبوع', 'Week test')} ${w.n} · ${tx(w.title)}`} passMark={PASS.test} bonusXp={XP.testBonus}
      onFinish={(r) => {
        if (!r.completed) return
        pushTest({ kind: 'unit', ref: String(n), title: `${t('اختبار الأسبوع', 'Week test')} ${n}`, score: r.score, total: r.total, level: w.phase })
        if (r.score / r.total >= PASS.test) { completeNode(`T:${n}`, r.score / r.total); logMinutes(20, `Week ${n} test`, 'exam') }
      }}
      onExit={() => go('/learn')} />
  )
}

function ExamRun({ level }: { level: PhaseKey }) {
  const { t } = useT()
  const items = useMemo(() => levelExam(level), [level])
  return (
    <ExerciseRunner exercises={items} level={level} title={`${t('امتحان المستوى', 'Level exam')} ${level.toUpperCase()}`} passMark={PASS.exam} bonusXp={XP.examBonus}
      onFinish={(r) => {
        if (!r.completed) return
        pushTest({ kind: 'level', ref: level, title: `${level.toUpperCase()} ${t('امتحان', 'exam')}`, score: r.score, total: r.total, level })
        if (r.score / r.total >= PASS.exam) { completeNode(`E:${level}`, r.score / r.total); logMinutes(45, `${level} exam`, 'exam') }
      }}
      onExit={() => go('/learn')} />
  )
}

function DrillRun({ id }: { id: string }) {
  const { tx } = useT()
  const d = DRILLS.find((x) => x.id === id)
  const items = useMemo(() => buildDrill(id), [id])
  return (
    <ExerciseRunner exercises={items} title={d ? tx(d.title) : ''} bonusXp={10}
      onFinish={(r) => { if (r.completed) { pushTest({ kind: 'drill', ref: id, title: d ? tx(d.title) : id, score: r.score, total: r.total, level: 'all' }); logMinutes(10, `Drill ${id}`, 'anki') } }}
      onExit={() => go('/words')} />
  )
}
