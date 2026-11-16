import { useMemo, useState } from 'react'
import { addDays, mondayOf, parseISO } from '../lib/dates'
import { DAYS_AR, DAYS_EN, monthName, useT, fmtDate } from '../lib/i18n'
import { minutesByDay, useStore } from '../state/store'
import { cx } from '../lib/cx'
import { Tabs } from './ui'

export const HEAT = ['#EDE3CC', '#F3D9A0', '#E9B655', '#D3842F', '#A9432C']
const level = (v: number, steps: number[]) => (v <= 0 ? 0 : v < steps[0] ? 1 : v < steps[1] ? 2 : v < steps[2] ? 3 : 4)

/** GitHub-style year heatmap (53 weeks from the plan start). Flows right→left in Arabic automatically (CSS grid). */
export function Heatmap({ start = '2026-11-09', weeks = 53, today, compact = false }: { start?: string; weeks?: number; today: string; compact?: boolean }) {
  const { t, lang } = useT()
  const [metric, setMetric] = useState<'min' | 'xp'>('min')
  const s = useStore((x) => x)
  const mins = useMemo(() => minutesByDay(s), [s])
  const xp = useStore((s) => s.xp)
  const data = metric === 'min' ? mins : xp
  const steps = metric === 'min' ? [30, 60, 120] : [30, 80, 150]
  const first = mondayOf(start)
  const cols = useMemo(() => Array.from({ length: weeks }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d))), [first, weeks])
  const size = compact ? 11 : 14, gap = compact ? 3 : 4
  const total = Object.entries(data).filter(([d]) => d >= first && d <= today).reduce((a, [, v]) => a + v, 0)
  const activeDays = Object.entries(data).filter(([d, v]) => v > 0 && d >= first && d <= today).length
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-mute">
          <span className="font-bold text-ink tabular-nums">{total.toLocaleString('en')}</span> {metric === 'min' ? t('دقيقة', 'minutes') : 'XP'} · <span className="font-bold text-ink tabular-nums">{activeDays}</span> {t('يوم دراسة', 'study days')}
        </div>
        <Tabs items={[{ key: 'min', label: t('الدقائق', 'Minutes') }, { key: 'xp', label: 'XP' }]} value={metric} onChange={setMetric} />
      </div>
      <div className="overflow-x-auto pb-1 scroll-thin">
        <div className="inline-flex gap-2">
          <div className="grid pt-5" style={{ gridTemplateRows: `repeat(7, ${size}px)`, rowGap: gap }}>
            {(lang === 'ar' ? DAYS_AR : DAYS_EN).map((d, i) => <span key={d} className="text-[10px] leading-none text-mute" style={{ visibility: i % 2 === 0 ? 'visible' : 'hidden' }}>{lang === 'ar' ? d.slice(0, 3) : d}</span>)}
          </div>
          <div>
            <div className="mb-1 flex h-4" style={{ gap }}>
              {cols.map((c, i) => {
                const d = parseISO(c[0]); const prev = i > 0 ? parseISO(cols[i - 1][0]) : null
                const show = !prev || prev.getUTCMonth() !== d.getUTCMonth()
                return <div key={i} className="relative text-[10px] text-mute" style={{ width: size }}>{show && <span className="absolute start-0 whitespace-nowrap">{monthName(d.getUTCMonth(), lang)}</span>}</div>
              })}
            </div>
            <div className="grid grid-flow-col" style={{ gridTemplateRows: `repeat(7, ${size}px)`, gridAutoColumns: size, gap }} role="img" aria-label={t('خريطة الدراسة السنوية', 'Yearly study heatmap')}>
              {cols.flat().map((d) => {
                const v = data[d] ?? 0
                const future = d > today
                return <div key={d} title={`${fmtDate(d, lang, true)}: ${v} ${metric === 'min' ? t('دقيقة', 'min') : 'XP'}`}
                  className={cx('rounded-[3px] transition-transform hover:scale-125', d === today && 'ring-2 ring-ink ring-offset-1 ring-offset-paper-2')}
                  style={{ background: future ? '#F3EDE0' : HEAT[level(v, steps)], opacity: future ? 0.6 : 1 }} />
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-mute">
        {t('أقل', 'Less')} {HEAT.map((c) => <span key={c} className="h-3 w-3 rounded-[3px]" style={{ background: c }} />)} {t('أكثر', 'More')}
      </div>
    </div>
  )
}
