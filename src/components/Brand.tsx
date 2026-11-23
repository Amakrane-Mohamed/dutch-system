import { cx } from '../lib/cx'

/** Minimal one-color lion mark used as the product logo. */
export function LionMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <img src="/rihladeutch-lion.svg" width={size} height={size} className={cx('brand-mark', className)} alt="" aria-hidden="true" />
  )
}

export function Wordmark({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div dir="ltr" className={cx('flex items-center gap-3', className)}>
      <LionMark size={36} />
      <div className="leading-none">
        <div className={cx('wordmark-name', dark ? 'text-paper' : 'text-ink')}>
          <span className="wordmark-rihla">Rihla</span><span className="wordmark-deutch">Deutch</span>
        </div>
        <div className={cx('wordmark-tagline', dark ? 'text-paper/60' : 'text-mute')}>
          <span>DEUTSCH</span><i /> <span>DARIJA</span>
        </div>
      </div>
    </div>
  )
}
