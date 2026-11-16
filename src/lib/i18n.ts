import { useStore } from '../state/store'

export type Lang = 'ar' | 'en'
export interface T { ar: string; en: string }
export type Tx = string | T

export const tr = (x: Tx | undefined | null, lang: Lang): string => (x == null ? '' : typeof x === 'string' ? x : x[lang] ?? x.ar)

/** Arabic-first i18n hook. `t('عربي', 'English')` and `tx(T | string)`. */
export function useT() {
  const lang = useStore((s) => s.settings.lang)
  return {
    lang,
    dir: lang === 'ar' ? ('rtl' as const) : ('ltr' as const),
    t: (ar: string, en: string) => (lang === 'ar' ? ar : en),
    tx: (x: Tx | undefined | null) => tr(x, lang),
  }
}

export function applyLang(lang: Lang) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

const AR_DIGITS = false // keep Western digits: they are standard in Morocco and in German exams
export const num = (n: number, lang: Lang = 'ar') => (AR_DIGITS && lang === 'ar' ? n.toLocaleString('ar-EG') : n.toLocaleString(lang === 'ar' ? 'fr-MA' : 'en-GB'))

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const DAYS_AR = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
export const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const monthName = (m: number, lang: Lang) => (lang === 'ar' ? MONTHS_AR : MONTHS_EN)[m]
export function fmtDate(iso: string, lang: Lang, withYear = false) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${monthName(m - 1, lang)}${withYear ? ' ' + y : ''}`
}
