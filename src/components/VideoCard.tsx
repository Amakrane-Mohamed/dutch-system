import { useState } from 'react'
import { VIDEOS, embedUrl, watchUrl } from '../content/videos'
import { useT } from '../lib/i18n'
import { cx } from '../lib/cx'
import { Icon } from './Icon'

/** Click-to-load YouTube (privacy-enhanced). Arabic-taught videos get a gold badge. */
export function VideoCard({ id, featured = false, className }: { id: string; featured?: boolean; className?: string }) {
  const v = VIDEOS[id]
  const [on, setOn] = useState(false)
  const { t } = useT()
  if (!v) return null
  const thumb = v.kind === 'video' ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : undefined
  return (
    <figure className={cx('overflow-hidden rounded-2xl bg-ink ring-1 ring-ink/10', className)}>
      <div className="relative aspect-video">
        {on ? (
          <iframe className="absolute inset-0 h-full w-full" src={embedUrl(v) + '&autoplay=1'} title={v.title} referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center" aria-label={t('شغّل الفيديو', 'Play video') + ': ' + v.title}>
            {thumb ? <img src={thumb} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-95" /> : <div className="zellige-bg absolute inset-0" />}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-saffron text-ink shadow-lg transition group-hover:scale-105"><Icon name="play" size={24} /></span>
            {v.kind === 'playlist' && <span className="absolute end-3 top-3 rounded-md bg-ink/80 px-2 py-0.5 text-xs font-semibold text-paper">{t('قائمة تشغيل', 'Playlist')}</span>}
          </button>
        )}
        {v.arabic && !on && (
          <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-md bg-saffron px-2 py-0.5 text-xs font-bold text-ink shadow">
            <Icon name="globe" size={13} /> {t('شرح بالعربية', 'Taught in Arabic')}
          </span>
        )}
      </div>
      <figcaption className={cx('bg-ink px-4 py-3 text-paper', featured && 'py-4')}>
        <div className={cx('line-clamp-2 font-semibold leading-snug', featured ? 'text-base' : 'text-sm')} dir="auto">{v.title}</div>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-paper/60">
          <span dir="auto" className="truncate">{v.channel}</span>
          <a href={watchUrl(v)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 text-saffron hover:underline">YouTube <Icon name="external" size={12} /></a>
        </div>
      </figcaption>
    </figure>
  )
}
