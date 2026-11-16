import type { T } from '../content/data'
export const NAV: { path: string; label: T; icon: string; group: 'learn' | 'track' | 'more' }[] = [
  { path: '/', label: { ar: 'اليوم', en: 'Today' }, icon: 'home', group: 'learn' },
  { path: '/learn', label: { ar: 'خط الرحلة', en: 'Route' }, icon: 'route', group: 'learn' },
  { path: '/journey', label: { ar: 'الأسابيع', en: 'Weeks' }, icon: 'calendar', group: 'learn' },
  { path: '/tracks', label: { ar: 'المهارات الأربع', en: 'Four skills' }, icon: 'target', group: 'learn' },
  { path: '/words', label: { ar: 'الكلمات', en: 'Words' }, icon: 'cards', group: 'learn' },
  { path: '/exams', label: { ar: 'الامتحانات', en: 'Exams' }, icon: 'exam', group: 'learn' },
  { path: '/progress', label: { ar: 'التتبع', en: 'Tracking' }, icon: 'chart', group: 'track' },
  { path: '/log', label: { ar: 'سجل الدراسة', en: 'Study log' }, icon: 'clock', group: 'track' },
  { path: '/resources', label: { ar: 'الموارد', en: 'Resources' }, icon: 'library', group: 'more' },
  { path: '/settings', label: { ar: 'الإعدادات', en: 'Settings' }, icon: 'settings', group: 'more' },
]
