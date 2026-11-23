import { MILESTONES } from '../content/data'
import { daysBetween } from '../lib/dates'
import { useT, fmtDate } from '../lib/i18n'

// Stylised geography: Casablanca (south-west) → Berlin (north-east). Maps keep geography in both languages.
const POS: Record<string, [number, number]> = {
  Casablanca: [70, 300], Rabat: [165, 262], Tanger: [262, 214], Madrid: [392, 238], Paris: [530, 150],
  'Köln': [648, 118], Frankfurt: [742, 166], Leipzig: [858, 108], Berlin: [952, 62],
}
const CITY_AR: Record<string, string> = { Casablanca: 'الدار البيضاء', Rabat: 'الرباط', Tanger: 'طنجة', Madrid: 'مدريد', Paris: 'باريس', 'Köln': 'كولونيا', Frankfurt: 'فرانكفورت', Leipzig: 'لايبزيغ', Berlin: 'برلين' }

export function JourneyMap({ today }: { today: string }) {
  const { t, tx, lang } = useT()
  const ms = MILESTONES.filter((m) => m.city && POS[m.city])
  const pts = ms.map((m) => POS[m.city])
  // train position: interpolate by date between milestone stations
  let k = 0
  while (k < ms.length - 1 && today >= ms[k + 1].date) k++
  let pos = pts[0], frac = 0
  if (today >= ms[ms.length - 1].date) { pos = pts[pts.length - 1]; frac = 1 }
  else if (today > ms[0].date) {
    const a = ms[k], b = ms[k + 1]
    const f = Math.max(0, Math.min(1, daysBetween(a.date, today) / Math.max(1, daysBetween(a.date, b.date))))
    pos = [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f]
    frac = (k + f) / (ms.length - 1)
  }
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const done = [...pts.slice(0, k + 1), pos].map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ')
  const daysLeft = daysBetween(today, ms[ms.length - 1].date)
  return (
    <div className="relative overflow-hidden rounded-3xl border border-sand bg-white p-6 text-ink shadow-[0_14px_40px_-28px_rgba(20,20,20,.3)]">
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[.16em] text-terra">{t('خط رحلتك', 'Your line')}</div>
          <h2 className="mt-1 text-2xl font-bold">{t('من الدار البيضاء إلى برلين', 'Casablanca to Berlin')}</h2>
          <p className="mt-1 text-sm text-mute">{t('كل محطة هي هدف في خطتك. القطار يتحرك مع التاريخ، وأنت تملأ الطريق بالدراسة.', 'Every station is a goal in your plan. The train moves with the calendar; you fill the route with study.')}</p>
        </div>
        <div className="flex gap-3 text-center">
          <div className="rounded-2xl bg-paper px-4 py-2 ring-1 ring-sand"><div className="text-2xl font-bold tabular-nums text-terra">{Math.round(frac * 100)}%</div><div className="text-[11px] text-mute">{t('من الطريق', 'of the route')}</div></div>
          <div className="rounded-2xl bg-paper px-4 py-2 ring-1 ring-sand"><div className="text-2xl font-bold tabular-nums">{Math.max(0, daysLeft)}</div><div className="text-[11px] text-mute">{t('يومًا إلى برلين', 'days to Berlin')}</div></div>
        </div>
      </div>
      <svg viewBox="0 0 1020 360" className="relative z-10 mt-2 w-full" role="img" aria-label={t('خريطة الرحلة', 'Journey map')}>
        <path d={line} fill="none" stroke="#e5e5e5" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d={line} fill="none" stroke="#a3a3a3" strokeOpacity=".65" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
        <path d={done} fill="none" stroke="#FFCE00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {ms.map((m, i) => {
          const [x, y] = pts[i]
          const passed = today >= m.date
          const up = i % 2 === 0
          return (
            <g key={m.id}>
              <circle cx={x} cy={y} r={passed ? 11 : 9} fill={passed ? '#FFCE00' : '#fff'} stroke={passed ? '#DD0000' : '#a3a3a3'} strokeWidth="3" />
              {m.id === 'b1exam' && <circle cx={x} cy={y} r="17" fill="none" stroke="#C8553D" strokeWidth="2" strokeDasharray="3 4" />}
              <text x={x} y={up ? y - 44 : y + 34} textAnchor="middle" fill="#171717" fontSize="15" fontWeight="700">{lang === 'ar' ? CITY_AR[m.city] : m.city}</text>
              <text x={x} y={up ? y - 26 : y + 52} textAnchor="middle" fill="#947000" fontSize="12.5">{tx(m.title)}</text>
              <text x={x} y={up ? y - 11 : y + 67} textAnchor="middle" fill="#686868" fontSize="11">{fmtDate(m.date, lang)}</text>
            </g>
          )
        })}
        <g transform={`translate(${pos[0]} ${pos[1]})`}>
          <circle r="22" fill="#C8553D" opacity=".25"><animate attributeName="r" values="18;26;18" dur="2.4s" repeatCount="indefinite" /></circle>
          <rect x="-15" y="-12" width="30" height="24" rx="7" fill="#C8553D" stroke="#F6F0E4" strokeWidth="2.5" />
          <rect x="-9" y="-7" width="18" height="7" rx="2" fill="#F6F0E4" />
          <circle cx="-7" cy="6" r="2" fill="#F6F0E4" /><circle cx="7" cy="6" r="2" fill="#F6F0E4" />
        </g>
      </svg>
    </div>
  )
}
