export const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Today in the device's local time zone. `?today=YYYY-MM-DD` in the URL overrides it (handy for testing). */
export function todayISO(): string {
  if (typeof window !== 'undefined') {
    const m = window.location.search.match(/today=(\d{4}-\d{2}-\d{2})/)
    if (m) return m[1]
  }
  return toISO(new Date())
}

export const parseISO = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
export const addDays = (iso: string, n: number) => {
  const d = parseISO(iso)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
export const daysBetween = (a: string, b: string) => Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000)
/** 0 = Monday … 6 = Sunday */
export const weekday = (iso: string) => (parseISO(iso).getUTCDay() + 6) % 7
export const mondayOf = (iso: string) => addDays(iso, -weekday(iso))

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS_NL = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag']
export const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const fmt = (iso: string, withYear = false) => {
  const d = parseISO(iso)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}${withYear ? ' ' + d.getUTCFullYear() : ''}`
}
