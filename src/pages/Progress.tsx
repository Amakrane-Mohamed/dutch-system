import { ACTIVITIES, LEVEL_COLOR, MILESTONES, PHASES, SKILLS, SKILL_KEYS, WEEKS, type PhaseKey, type SkillKey } from '../content/data'
import { WORDS } from '../content/vocab'
import { addDays, daysBetween, mondayOf, todayISO } from '../lib/dates'
import { useT, fmtDate, monthName } from '../lib/i18n'
import { achievements, leagueFor, LEAGUES, playerLevel } from '../lib/game'
import { levelProgress, nodesFor, phaseFor, weekFor, weekProgress } from '../lib/path'
import { longestStreak, streak, totalMinutes, totalXp, useStore, type AppState } from '../state/store'
import { Heatmap } from '../components/Heatmap'
import { Legend, Spark, StackedBars } from '../components/Charts'
import { Bar, Card, PageHead, Pill, Ring, Stat, Title } from '../components/ui'
import { Icon } from '../components/Icon'
import { cx } from '../lib/cx'

const SKILL_TARGET_MIN = 120 * 60 // ~120 h per skill across the whole A1 → B2 journey
const actSkill = (a: string) => ACTIVITIES.find((x) => x.key === a)?.skill ?? null

export function skillMinutes(s: AppState, level?: PhaseKey): Record<SkillKey, number> {
  const out = { sprechen: 0, schreiben: 0, hoeren: 0, lesen: 0 } as Record<SkillKey, number>
  for (const e of s.log) {
    const k = actSkill(e.activity)
    if (k && (!level || phaseFor(e.date).key === level)) out[k] += e.minutes
  }
  return out
}
/** Skill score 0..1: 60% practice time (vs. target), 40% correct exercise items (vs. 300). */
export function skillShare(s: AppState): Record<SkillKey, { score: number; minutes: number; acc: number; correct: number }> {
  const m = skillMinutes(s)
  return Object.fromEntries(SKILL_KEYS.map((k) => {
    const r = s.skills[`all:${k}`] ?? { c: 0, t: 0 }
    const score = 0.6 * Math.min(1, m[k] / SKILL_TARGET_MIN) + 0.4 * Math.min(1, r.c / 300)
    return [k, { score, minutes: m[k], acc: r.t ? r.c / r.t : 0, correct: r.c }]
  })) as Record<SkillKey, { score: number; minutes: number; acc: number; correct: number }>
}

export default function ProgressPage() {
  const { t, tx, lang } = useT()
  const today = todayISO()
  const s = useStore((x) => x)
  const xp = totalXp(s), lvl = playerLevel(xp)
  const st = streak(s, today, addDays), best = longestStreak(s, addDays)
  const hrs = totalMinutes(s) / 60
  const learned = WORDS.filter((w) => (s.srs[w.id]?.reps ?? 0) >= 1).length
  const passed = s.tests.filter((x) => x.score / x.total >= 0.7).length
  const shares = skillShare(s)
  const wk = weekFor(today)

  // weekly stacked (last 12 weeks, minutes by skill + other)
  const mon = mondayOf(today)
  const weekly = Array.from({ length: 12 }, (_, i) => {
    const a = addDays(mon, -7 * (11 - i)), b = addDays(a, 6)
    const v: Record<string, number> = { sprechen: 0, schreiben: 0, hoeren: 0, lesen: 0, other: 0 }
    s.log.filter((e) => e.date >= a && e.date <= b).forEach((e) => { v[actSkill(e.activity) ?? 'other'] += e.minutes })
    return { label: fmtDate(a, lang), values: v }
  })
  const colors = { ...Object.fromEntries(SKILL_KEYS.map((k) => [k, SKILLS[k].color])), other: '#33437A' }
  // monthly: Nov 2026 → Aug 2027
  const months = Array.from({ length: 10 }, (_, i) => { const m = (10 + i) % 12, y = i < 2 ? 2026 : 2027; return { m, y, key: `${y}-${String(m + 1).padStart(2, '0')}` } })
  const monthly = months.map(({ m, key }) => {
    const mins = s.log.filter((e) => e.date.startsWith(key)).reduce((a, e) => a + e.minutes, 0)
    const x = Object.entries(s.xp).filter(([d]) => d.startsWith(key)).reduce((a, [, v]) => a + v, 0)
    return { label: monthName(m, lang), values: { min: mins, xp: x } }
  })
  const weekXp = Array.from({ length: 7 }, (_, i) => s.xp[addDays(mon, i)] ?? 0).reduce((a, b) => a + b, 0)
  const league = leagueFor(weekXp)
  const nextLeague = LEAGUES.find((l) => l.min > weekXp)
  const last30 = Array.from({ length: 30 }, (_, i) => s.xp[addDays(today, i - 29)] ?? 0)
  const ach = achievements(s, today)

  return (
    <div className="space-y-6">
      <PageHead kicker={t('لوحة التتبع', 'Tracking')} title={t('تقدّمك في الرحلة', 'Your progress on the journey')} de="Fortschritt"
        sub={t('كل دقيقة تسجّلها وكل تمرين تحلّه يظهر هنا: الأيام، المستويات، المهارات الأربع والأسابيع.', 'Every logged minute and every exercise shows up here: days, levels, the four skills and the weeks.')}
        right={<a href="#/log" className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper"><Icon name="plus" size={16} />{t('سجّل وقت دراسة', 'Log study time')}</a>} />

      <section className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <Stat icon="clock" color="#12756B" label={t('ساعات الدراسة', 'Study hours')} value={hrs.toFixed(1)} sub={t('الهدف ~660 ساعة', 'target ~660 h')} />
        <Stat icon="bolt" color="#B57F12" label="XP" value={xp.toLocaleString('en')} sub={`${t('الرتبة', 'Rank')} ${lvl.level}`} />
        <Stat icon="flame" color="#C8553D" label={t('السلسلة', 'Streak')} value={st} sub={`${t('الأطول', 'Longest')} ${best}`} />
        <Stat icon="cards" color="#2F4BCE" label={t('كلمات متعلّمة', 'Words learned')} value={learned} sub={`/ ${WORDS.length}`} />
        <Stat icon="medal" color="#12756B" label={t('اختبارات ناجحة', 'Tests passed')} value={passed} sub={`/ ${s.tests.length}`} />
        <Stat icon="calendar" color="#33437A" label={t('الأسبوع', 'Week')} value={`${wk.n}/42`} sub={tx(wk.title)} />
      </section>

      <Card>
        <Title kicker={t('نوفمبر 2026 ← نوفمبر 2027', 'Nov 2026 → Nov 2027')} right={<div className="flex items-center gap-2 text-sm"><Icon name="flame" size={18} className="text-terra" /><b>{st}</b> {t('يوم الآن', 'days now')} · <b>{best}</b> {t('الأطول', 'longest')}</div>}>
          {t('سنة الدراسة يومًا بيوم', 'Your study year, day by day')}
        </Title>
        <Heatmap today={today} />
      </Card>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <Title kicker={t('آخر 12 أسبوعًا', 'Last 12 weeks')} right={<Legend items={[...SKILL_KEYS.map((k) => ({ color: SKILLS[k].color, label: tx(SKILLS[k].title) })), { color: '#33437A', label: t('أخرى', 'Other') }]} />}>{t('الدقائق أسبوعيًا حسب المهارة', 'Minutes per week by skill')}</Title>
          <StackedBars data={weekly} keys={[...SKILL_KEYS, 'other']} colors={colors} format={(v) => `${v} ${t('د', 'min')}`} labelEvery={2} />
        </Card>
        <Card>
          <Title kicker={t('نوفمبر ← أغسطس', 'Nov → Aug')} right={<Legend items={[{ color: '#E3A72F', label: t('الدقائق', 'Minutes') }]} />}>{t('الدقائق شهريًا', 'Minutes per month')}</Title>
          <StackedBars data={monthly.map((m) => ({ label: m.label, values: { min: m.values.min } }))} keys={['min']} colors={{ min: '#E3A72F' }} format={(v) => `${v} ${t('د', 'min')}`} />
          <div className="mt-4 border-t border-sand pt-3">
            <div className="mb-1 flex items-center justify-between text-xs text-mute"><span>{t('XP آخر 30 يومًا', 'XP, last 30 days')}</span><span className="tabular-nums">{last30.reduce((a, b) => a + b, 0)} XP</span></div>
            <Spark values={last30} color="#C8553D" />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <Title kicker={t('A1 ← B2', 'A1 → B2')}>{t('التقدّم في كل مستوى', 'Progress per level')}</Title>
          <div className="space-y-5">
            {PHASES.map((p) => {
              const nodes = nodesFor(p.key), done = nodes.filter((n) => s.nodes[n.id]).length
              const timeFrac = Math.max(0, Math.min(1, (daysBetween(p.start, today) + 1) / (daysBetween(p.start, p.end) + 1)))
              return (
                <div key={p.key}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2"><span className="rounded-md px-2 py-0.5 text-xs font-bold text-paper" style={{ background: LEVEL_COLOR[p.key] }}>{p.label}</span><span className="text-mute">{tx(p.dates)}</span></span>
                    <span className="tabular-nums text-mute">{done}/{nodes.length} {t('محطة', 'stops')}</span>
                  </div>
                  <Bar value={levelProgress(s, p.key)} color={LEVEL_COLOR[p.key]} h={12} />
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-mute"><span className="h-1 w-6 rounded bg-ink/30" /><span>{t('الوقت المنقضي من المرحلة', 'Time elapsed in phase')}: {Math.round(timeFrac * 100)}%</span></div>
                </div>
              )
            })}
          </div>
        </Card>
        <Card>
          <Title kicker="Sprechen · Schreiben · Hören · Lesen">{t('المهارات الأربع', 'The four skills')}</Title>
          <div className="space-y-5">
            {SKILL_KEYS.map((k) => {
              const sh = shares[k]
              return (
                <div key={k}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 font-semibold" style={{ color: SKILLS[k].color }}><Icon name={SKILLS[k].icon} size={17} />{tx(SKILLS[k].title)} <span className="de text-xs font-normal text-mute">{SKILLS[k].de}</span></span>
                    <span className="text-xs tabular-nums text-mute">{Math.round(sh.minutes / 60 * 10) / 10} {t('س', 'h')} · {sh.correct} {t('صحيح', 'correct')} · {Math.round(sh.acc * 100)}%</span>
                  </div>
                  <Bar value={sh.score} color={SKILLS[k].color} h={12} />
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {PHASES.map((p) => {
                      const r = s.skills[`${p.key}:${k}`] ?? { c: 0, t: 0 }
                      const m = skillMinutes(s, p.key)[k]
                      return <div key={p.key} className="text-[11px] text-mute"><div className="mb-0.5 flex justify-between"><span>{p.label}</span><span className="tabular-nums">{m}{t('د', 'm')}</span></div><Bar value={Math.min(1, m / (SKILL_TARGET_MIN / 4)) * 0.6 + Math.min(1, r.c / 75) * 0.4} color={SKILLS[k].color} h={4} /></div>
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      <Card>
        <Title kicker={t('42 أسبوعًا', '42 weeks')} right={<span className="text-sm text-mute">{t('اضغط على أسبوع لفتحه', 'Click a week to open it')}</span>}>{t('التقدّم أسبوعًا بأسبوع', 'Week-by-week progress')}</Title>
        <div className="flex items-end gap-1.5 overflow-x-auto pb-2 scroll-thin">
          {WEEKS.map((w) => {
            const p = weekProgress(s, w), v = p.done / p.total
            return (
              <a key={w.n} href={`#/journey/${w.n}`} title={`${t('الأسبوع', 'Week')} ${w.n}: ${tx(w.title)} (${p.done}/${p.total})`} className="group flex min-w-6 flex-1 flex-col items-center gap-1">
                <div className={cx('relative h-24 w-full overflow-hidden rounded-md bg-sand/50 ring-1', w.n === wk.n ? 'ring-2 ring-ink' : 'ring-transparent')}>
                  <div className="absolute inset-x-0 bottom-0 rounded-md transition-all group-hover:opacity-80" style={{ height: `${v * 100}%`, background: LEVEL_COLOR[w.phase] }} />
                </div>
                <span className={cx('text-[10px] tabular-nums', w.n === wk.n ? 'font-bold text-ink' : 'text-mute')}>{w.n}</span>
              </a>
            )
          })}
        </div>
        <div className="mt-2"><Legend items={PHASES.map((p) => ({ color: LEVEL_COLOR[p.key], label: p.label }))} /></div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="zellige-bg !bg-ink text-paper !ring-ink">
          <div className="text-xs font-semibold uppercase tracking-[.16em] text-saffron">{t('درجة هذا الأسبوع', 'This week\'s class')}</div>
          <div className="mt-4 flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-2xl animate-float" style={{ background: league.color }}><Icon name="ticket" size={40} className="text-paper" /></div>
            <div>
              <div className="text-2xl font-bold">{tx(league.title)}</div>
              <div className="de text-sm italic text-saffron">{league.de}</div>
              <div className="mt-1 text-sm text-paper/70 tabular-nums">{weekXp} XP {t('هذا الأسبوع', 'this week')}</div>
            </div>
          </div>
          {nextLeague && <div className="mt-5"><div className="mb-1 flex justify-between text-xs text-paper/60"><span>{t('الدرجة التالية', 'Next class')}: {tx(nextLeague.title)}</span><span>{nextLeague.min - weekXp} XP</span></div><Bar value={weekXp / nextLeague.min} track="rgba(255,255,255,.12)" /></div>}
          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
            <Ring value={lvl.into / lvl.need} size={56} stroke={6}><span className="text-sm font-bold">{lvl.level}</span></Ring>
            <div className="text-sm"><div className="font-semibold">{t('رتبة المسافر', 'Traveller rank')} {lvl.level}</div><div className="text-paper/60 tabular-nums">{lvl.into} / {lvl.need} XP</div></div>
          </div>
        </Card>
        <Card>
          <Title kicker={t('العدّ التنازلي', 'Countdowns')}>{t('المحطات الكبرى', 'Milestones')}</Title>
          <ul className="space-y-2">
            {MILESTONES.map((m) => {
              const d = daysBetween(today, m.date)
              return (
                <li key={m.id} className={cx('flex items-center gap-3 rounded-xl px-3 py-2', d < 0 ? 'opacity-50' : d === Math.min(...MILESTONES.map((x) => daysBetween(today, x.date)).filter((x) => x >= 0)) ? 'bg-saffron-soft' : '')}>
                  <span className="text-lg">{m.emoji}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{tx(m.title)}</span><span className="text-xs text-mute">{fmtDate(m.date, lang, true)}</span></span>
                  <span className="text-sm font-bold tabular-nums">{d < 0 ? '✓' : `${d} ${t('يوم', 'd')}`}</span>
                </li>
              )
            })}
          </ul>
        </Card>
        <Card>
          <Title kicker={t('آخر النتائج', 'Recent results')}>{t('سجل الاختبارات', 'Test history')}</Title>
          {s.tests.length === 0 ? <p className="text-sm text-mute">{t('لا توجد اختبارات بعد. أنهِ أول درس!', 'No tests yet. Finish your first lesson!')}</p> : (
            <ul className="space-y-2">
              {[...s.tests].reverse().slice(0, 8).map((x) => {
                const p = x.score / x.total
                return (
                  <li key={x.id} className="flex items-center gap-3 text-sm">
                    <Pill color={p >= 0.7 ? '#12756B' : '#C8553D'}>{Math.round(p * 100)}%</Pill>
                    <span className="min-w-0 flex-1 truncate">{x.title}</span>
                    <span className="text-xs text-mute">{fmtDate(x.date, lang)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </section>

      <Card>
        <Title kicker={`${ach.filter((a) => a.done).length}/${ach.length}`}>{t('الأوسمة', 'Badges')}</Title>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {ach.map((a) => (
            <div key={a.id} className={cx('flex items-center gap-3 rounded-2xl p-3 ring-1', a.done ? 'bg-saffron-soft/60 ring-saffron/40' : 'bg-paper ring-sand')}>
              <div className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-xl', a.done ? 'bg-ink text-saffron' : 'bg-sand/60 text-mute')}><Icon name={a.icon} size={24} /></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">{tx(a.title)}</div>
                <div className="truncate text-xs text-mute">{tx(a.desc)}</div>
                {!a.done && a.progress && <Bar value={a.progress[0] / a.progress[1]} h={4} className="mt-1.5" />}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
