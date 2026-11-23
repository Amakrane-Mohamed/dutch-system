import type { ReactNode } from 'react'
import { NAV } from '../lib/nav'
import { useT, fmtDate } from '../lib/i18n'
import { cx } from '../lib/cx'
import { addDays, todayISO } from '../lib/dates'
import { playerLevel } from '../lib/game'
import { weekFor } from '../lib/path'
import { setState, streak, totalXp, useStore } from '../state/store'
import { Icon } from './Icon'
import { Wordmark } from './Brand'
import { Ring } from './ui'
import { useAuth } from '../state/auth'

export function Layout({ route, children, bare = false }: { route: string; children: ReactNode; bare?: boolean }) {
  const { t, tx, lang } = useT()
  const { user, isAdmin, signOut } = useAuth()
  const today = todayISO()
  const st = useStore((s) => streak(s, today, addDays))
  const xp = useStore(totalXp)
  const todayXp = useStore((s) => s.xp[today] ?? 0)
  const goal = useStore((s) => s.settings.dailyXp)
  const lvl = playerLevel(xp)
  const wk = weekFor(today)
  const active = (p: string) => (p === '/' ? route === '/' : route === p || route.startsWith(p + '/'))
  const groups: { key: 'learn' | 'track' | 'more'; label: string }[] = [
    { key: 'learn', label: t('التعلّم', 'Learn') }, { key: 'track', label: t('التقدّم', 'Progress') }, { key: 'more', label: t('المزيد', 'More') },
  ]
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      {/* Sidebar (start side: right in Arabic) */}
      <div className="hidden border-e border-sand bg-white lg:block"><aside className="sticky top-0 flex h-screen flex-col overflow-y-auto px-5 py-6 text-ink scroll-thin">
        <a href="#/dashboard" className="mb-8 block"><Wordmark /></a>
        <nav className="flex-1 space-y-6">
          {groups.map((g) => (
            <div key={g.key}>
              <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[.14em] text-mute/70">{g.label}</div>
              <ul className="space-y-0.5">
                {NAV.filter((n) => n.group === g.key && (isAdmin || n.path !== '/resources')).map((n) => (
                  <li key={n.path}>
                    <a href={`#${n.path}`} className={cx('group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                      active(n.path) ? 'bg-saffron-soft text-ink' : 'text-mute hover:bg-paper hover:text-ink')}>
                      <Icon name={n.icon} size={19} className={active(n.path) ? 'text-terra' : 'text-mute group-hover:text-terra'} />
                      {tx(n.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-sand">
          <div className="flex items-center gap-3">
            <Ring value={todayXp / goal} size={52} stroke={6} color="#E3A72F"><Icon name="bolt" size={18} className="text-saffron" /></Ring>
            <div className="text-sm">
              <div className="font-semibold">{t('هدف اليوم', 'Daily goal')}</div>
              <div className="tabular-nums text-mute">{todayXp} / {goal} XP</div>
            </div>
          </div>
          <button onClick={() => setState((s) => ({ ...s, settings: { ...s.settings, lang: lang === 'ar' ? 'en' : 'ar' } }))}
            className="mt-4 flex w-full items-center justify-between rounded-lg bg-white px-3 py-2 text-xs text-mute ring-1 ring-sand hover:bg-saffron-soft">
            <span className="flex items-center gap-2"><Icon name="globe" size={14} />{t('لغة الواجهة', 'Interface')}</span>
            <span className="font-semibold text-saffron">{lang === 'ar' ? 'English' : 'الدارجة'}</span>
          </button>
        </div>
      </aside></div>

      <div className="min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-sand bg-paper/90 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-10">
            <a href="#/dashboard" className="lg:hidden"><Wordmark /></a>
            <div className="hidden items-center gap-3 text-sm text-mute lg:flex">
              <Icon name="calendar" size={16} className="text-saffron-deep" />
              <span>{fmtDate(today, lang, true)}</span>
              <span className="text-sand-2">•</span>
              <a href={`#/journey/${wk.n}`} className="font-semibold text-ink hover:underline">{t('الأسبوع', 'Week')} {wk.n} / 42</a>
              <span className="text-sand-2">•</span>
              <span className="truncate">{tx(wk.title)}</span>
            </div>
            <div className="ms-auto flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-xl bg-terra-soft px-3 py-1.5 text-sm font-bold text-terra" title={t('أيام متتالية', 'Streak')}>
                <Icon name="flame" size={18} className={st > 0 ? 'animate-flicker' : ''} /> <span className="tabular-nums">{st}</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-saffron-soft px-3 py-1.5 text-sm font-bold text-saffron-deep" title="XP">
                <Icon name="bolt" size={17} /> <span className="tabular-nums">{xp.toLocaleString('en')}</span>
              </span>
              <a href="#/progress" className="hidden items-center gap-2 rounded-xl bg-ink px-3 py-1.5 text-sm font-bold text-paper sm:flex" title={t('رتبة المسافر', 'Traveller rank')}>
                <Icon name="khatam" size={16} className="text-saffron" /> {t('الرتبة', 'Rank')} {lvl.level}
              </a>
              {isAdmin && <a href="#/admin" className="hidden rounded-xl border border-sand px-3 py-1.5 text-xs font-semibold text-mute hover:bg-white sm:inline-flex">{t('الإدارة', 'Admin')}</a>}
              <button onClick={() => void signOut()} className="hidden max-w-36 truncate rounded-xl border border-sand px-3 py-1.5 text-xs font-medium text-mute hover:bg-white sm:block" title={user?.email}>{t('خروج', 'Sign out')}</button>
            </div>
          </div>
        </header>
        <main className={cx('mx-auto max-w-[1400px] px-5 pb-28 pt-8 lg:px-10 lg:pb-12', bare && 'max-w-4xl')}>{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav aria-label={t('التنقّل الرئيسي', 'Main navigation')} className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-paper-2/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <ul className={cx('grid', isAdmin ? 'grid-cols-6' : 'grid-cols-5')}>
          {[NAV[0], NAV[1], NAV[4], NAV[6], NAV[9]].map((n) => (
            <li key={n.path}>
              <a href={`#${n.path}`} className={cx('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', active(n.path) ? 'text-terra' : 'text-mute')}>
                <Icon name={n.icon} size={22} />{tx(n.label)}
              </a>
            </li>
          ))}
          {isAdmin && <li><a href="#/admin" className={cx('flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium', active('/admin') ? 'text-terra' : 'text-mute')}><Icon name="brief" size={22} />{t('الإدارة', 'Admin')}</a></li>}
        </ul>
      </nav>
    </div>
  )
}
