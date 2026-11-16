import type { ReactNode } from 'react'

/** Stacked vertical bars (HTML, so they follow RTL order). */
export function StackedBars({ data, keys, colors, height = 180, format = (v: number) => String(v), labelEvery = 1 }: {
  data: { label: string; values: Record<string, number> }[]; keys: string[]; colors: Record<string, string>; height?: number; format?: (v: number) => string; labelEvery?: number
}) {
  const max = Math.max(1, ...data.map((d) => keys.reduce((a, k) => a + (d.values[k] ?? 0), 0)))
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const total = keys.reduce((a, k) => a + (d.values[k] ?? 0), 0)
          return (
            <div key={i} className="group relative flex h-full flex-1 flex-col justify-end" title={`${d.label}: ${format(total)}`}>
              <div className="pointer-events-none absolute -top-6 start-1/2 hidden -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 text-[10px] text-paper group-hover:block rtl:translate-x-1/2">{format(total)}</div>
              <div className="flex w-full flex-col-reverse overflow-hidden rounded-t-md bg-sand/40" style={{ height: `${(total / max) * 100}%`, minHeight: total ? 3 : 0 }}>
                {keys.map((k) => (d.values[k] ? <div key={k} style={{ height: `${(d.values[k] / total) * 100}%`, background: colors[k] }} /> : null))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {data.map((d, i) => <div key={i} className="flex-1 truncate text-center text-[10px] text-mute">{i % labelEvery === 0 ? d.label : ''}</div>)}
      </div>
    </div>
  )
}

export function Legend({ items }: { items: { color: string; label: ReactNode }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-mute">
      {items.map((it, i) => <span key={i} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: it.color }} />{it.label}</span>)}
    </div>
  )
}

/** Small area sparkline (SVG; numeric trend, direction-neutral). */
export function Spark({ values, color = '#E3A72F', height = 56 }: { values: number[]; color?: string; height?: number }) {
  const w = 300, max = Math.max(1, ...values)
  const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * w, height - (v / max) * (height - 6) - 3])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full rtl:-scale-x-100" style={{ height }} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} L${w},${height} L0,${height} Z`} fill={color} opacity=".15" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
