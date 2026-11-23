import { Fragment, useState, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { speak, ttsSupported } from '../lib/speech'
import { getState } from '../state/store'
import { useT, type Tx } from '../lib/i18n'
import { Icon } from './Icon'

type Variant = 'primary' | 'gold' | 'ghost' | 'soft' | 'danger' | 'ok'
const V: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink-2 shadow-[inset_0_-2px_0_rgba(0,0,0,.25)]',
  gold: 'bg-saffron text-ink hover:brightness-105 shadow-[inset_0_-2px_0_rgba(0,0,0,.15)]',
  ghost: 'bg-transparent text-ink ring-1 ring-sand-2 hover:bg-sand/50',
  soft: 'bg-sand/60 text-ink hover:bg-sand',
  danger: 'bg-terra text-paper hover:brightness-105',
  ok: 'bg-zellige text-paper hover:brightness-110',
}
export function Button({ variant = 'primary', className, children, ...rest }: { variant?: Variant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={cx('inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40', V[variant], className)}>
      {children}
    </button>
  )
}
export function LinkButton({ href, variant = 'primary', className, children }: { href: string; variant?: Variant; className?: string; children: ReactNode }) {
  return <a href={href} className={cx('inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition', V[variant], className)}>{children}</a>
}

export function Card({ className, children, as: As = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' }) {
  return <As className={cx('card p-5', className)}>{children}</As>
}

export function Title({ kicker, children, right, className }: { kicker?: ReactNode; children: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={cx('mb-4 flex items-end justify-between gap-3', className)}>
      <div>
        {kicker && <div className="mb-1 text-xs font-semibold uppercase tracking-[.14em] text-saffron-deep">{kicker}</div>}
        <h2 className="text-lg font-bold text-ink">{children}</h2>
      </div>
      {right}
    </div>
  )
}

export function PageHead({ kicker, title, de, sub, right }: { kicker?: ReactNode; title: ReactNode; de?: string; sub?: ReactNode; right?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="animate-rise">
        {kicker && <div className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-saffron-deep">{kicker}</div>}
        <h1 className="text-3xl font-bold text-ink">{title}</h1>
        {de && <div className="de display mt-1 text-lg italic text-ink-3">{de}</div>}
        {sub && <p className="mt-2 max-w-3xl text-mute">{sub}</p>}
      </div>
      {right}
    </header>
  )
}

export function Bar({ value, color = '#E3A72F', className, h = 8, track = '#EADFC8' }: { value: number; color?: string; className?: string; h?: number; track?: string }) {
  return (
    <div className={cx('w-full overflow-hidden rounded-full', className)} style={{ height: h, background: track }}>
      <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
    </div>
  )
}

export function Pill({ children, color = '#0E1A3A', soft = true, className }: { children: ReactNode; color?: string; soft?: boolean; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold', className)} style={soft ? { background: color + '1F', color } : { background: color, color: '#F6F0E4' }}>{children}</span>
}

export const say = (text: string, rate?: number) => { const s = getState().settings; return speak(text, { voiceURI: s.voiceURI, rate: rate ?? s.rate }) }

export function Speak({ text, className, size = 18, label }: { text: string; className?: string; size?: number; label?: string }) {
  const [on, setOn] = useState(false)
  if (!ttsSupported()) return null
  return (
    <button type="button" aria-label={label ?? `Play: ${text}`} title={text}
      onClick={(e) => { e.stopPropagation(); say(text); setOn(true); setTimeout(() => setOn(false), 900) }}
      className={cx('inline-flex shrink-0 items-center justify-center rounded-full bg-ink/5 p-2 text-ink-2 transition hover:bg-saffron-soft hover:text-ink', on && 'bg-saffron-soft text-ink', className)}>
      <Icon name="volume" size={size} />
    </button>
  )
}

/** German text: always LTR and clickable to hear it. */
export function De({ children, className, speakable = true }: { children: string; className?: string; speakable?: boolean }) {
  if (!speakable) return <span lang="de" className={cx('de', className)}>{children}</span>
  return (
    <button type="button" lang="de" onClick={() => say(children)} title="▶"
      className={cx('de cursor-pointer rounded decoration-saffron/70 decoration-2 underline-offset-4 hover:underline', className)}>{children}</button>
  )
}

const LATIN = /([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß0-9'’.,!?…:;/()+\-– ]*[A-Za-zÄÖÜäöüß0-9.!?…)])|([A-Za-zÄÖÜäöüß])/g
/** Inline markdown: **bold** (German bold = speakable), line breaks, Latin runs isolated LTR inside Arabic. */
export function Md({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          const inner = p.slice(2, -2)
          return /[A-Za-zÄÖÜäöüß]/.test(inner) && !/[\u0600-\u06FF]/.test(inner)
            ? <strong key={i} className="font-semibold text-ink"><De>{inner}</De></strong>
            : <strong key={i} className="font-semibold text-ink">{inner}</strong>
        }
        return <Fragment key={i}>{p.split('\n').map((line, j) => (
          <Fragment key={j}>{j > 0 && <br />}{isolate(line)}</Fragment>
        ))}</Fragment>
      })}
    </span>
  )
}
function isolate(s: string): ReactNode {
  if (!/[\u0600-\u06FF]/.test(s)) return /[A-Za-z]/.test(s) ? <bdi dir="ltr" lang="de">{s}</bdi> : s
  const out: ReactNode[] = []
  let last = 0, m: RegExpExecArray | null
  LATIN.lastIndex = 0
  while ((m = LATIN.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index))
    out.push(<bdi key={m.index} dir="ltr" lang="de">{m[0]}</bdi>)
    last = m.index + m[0].length
  }
  out.push(s.slice(last))
  return out
}

export function TxT({ x, className }: { x: Tx; className?: string }) {
  const { tx } = useT()
  return <Md text={tx(x)} className={className} />
}

export function Stat({ label, value, sub, icon, color = '#0E1A3A' }: { label: ReactNode; value: ReactNode; sub?: ReactNode; icon?: string; color?: string }) {
  return (
    <div className="card flex items-center gap-4 p-4">
      {icon && <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: color + '18', color }}><Icon name={icon} size={22} /></div>}
      <div className="min-w-0">
        <div className="text-xs text-mute">{label}</div>
        <div className="text-2xl font-bold tabular-nums text-ink">{value}</div>
        {sub && <div className="text-xs text-mute">{sub}</div>}
      </div>
    </div>
  )
}

export function Tabs<K extends string>({ items, value, onChange, className }: { items: { key: K; label: ReactNode }[]; value: K; onChange: (k: K) => void; className?: string }) {
  return (
    <div className={cx('inline-flex flex-wrap gap-1 rounded-xl bg-sand/60 p-1', className)} role="tablist">
      {items.map((it) => (
        <button key={it.key} role="tab" aria-selected={value === it.key} onClick={() => onChange(it.key)}
          className={cx('rounded-lg px-3.5 py-1.5 text-sm font-semibold transition', value === it.key ? 'bg-paper-2 text-ink shadow-sm ring-1 ring-sand-2' : 'text-mute hover:text-ink')}>{it.label}</button>
      ))}
    </div>
  )
}

export function Check({ checked, onChange, children, className }: { checked: boolean; onChange: () => void; children: ReactNode; className?: string }) {
  return (
    <label className={cx('flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition hover:bg-sand/40', className)}>
      <button type="button" role="checkbox" aria-checked={checked} onClick={onChange}
        className={cx('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md ring-1 transition', checked ? 'bg-zellige text-paper ring-zellige' : 'bg-paper-2 ring-sand-2')}>
        {checked && <Icon name="check" size={14} strokeWidth={2.5} />}
      </button>
      <span className={cx('text-sm', checked && 'text-mute line-through decoration-sand-2')}>{children}</span>
    </label>
  )
}

export function Ext({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cx('inline-flex items-center gap-1 font-semibold text-majorelle hover:underline', className)}>{children}<Icon name="external" size={14} /></a>
}

export function Ring({ value, size = 64, stroke = 7, color = '#E3A72F', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#EADFC8" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))} style={{ transition: 'stroke-dashoffset .8s ease' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}
