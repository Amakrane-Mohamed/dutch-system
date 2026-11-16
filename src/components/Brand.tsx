import { cx } from '../lib/cx'

/** The Rihla mark: an 8-point khatam (zellige star) with a rail line through it. */
export function Khatam({ size = 36, className, ring = '#E3A72F', fill = '#0E1A3A', line = '#F6F0E4' }: { size?: number; className?: string; ring?: string; fill?: string; line?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g transform="translate(24 24)">
        <rect x="-15" y="-15" width="30" height="30" rx="3" fill={fill} stroke={ring} strokeWidth="2" />
        <rect x="-15" y="-15" width="30" height="30" rx="3" fill={fill} stroke={ring} strokeWidth="2" transform="rotate(45)" />
        <circle r="7.5" fill="none" stroke={ring} strokeWidth="1.5" />
        <path d="M-11 4 L11 -4" stroke={line} strokeWidth="2" strokeLinecap="round" />
        <circle cx="-11" cy="4" r="2.2" fill="#C8553D" />
        <circle cx="11" cy="-4" r="2.2" fill="#12756B" />
      </g>
    </svg>
  )
}

export function Wordmark({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <Khatam size={40} fill={dark ? '#1C2B5A' : '#0E1A3A'} />
      <div className="leading-none">
        <div className={cx('flex items-baseline gap-2', dark ? 'text-paper' : 'text-ink')}>
          <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-naskh)' }}>رحلة</span>
          <span className="display text-xl font-semibold italic text-saffron">Rihla</span>
        </div>
        <div className={cx('mt-1 text-[11px] tracking-wide', dark ? 'text-paper/60' : 'text-mute')}>
          <span>الدار البيضاء</span> <span className="text-saffron">←</span> <span className="de">Berlin</span>
        </div>
      </div>
    </div>
  )
}
