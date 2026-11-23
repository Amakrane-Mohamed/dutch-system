import type { PhaseKey } from './data'
import type { T } from '../lib/i18n'
import resourcesJson from './gen/resources.json'

export type ResType = 'course' | 'books' | 'vocab' | 'arabic' | 'youtube' | 'podcasts' | 'reading' | 'speaking' | 'writing' | 'exam' | 'ausbildung'
export interface Resource { id: string; name: string; type: ResType; level: string; phases: PhaseKey[]; cost: T; why: T; urls: string[]; primary?: boolean; arabic?: boolean; optional?: boolean }

export const RESOURCES = resourcesJson as unknown as Resource[]
export const resourceById = (id: string) => RESOURCES.find((r) => r.id === id)
export const RES_TYPES: { key: ResType; label: T }[] = [
  { key: 'course', label: { ar: 'الدورات', en: 'Courses' } }, { key: 'arabic', label: { ar: 'بالعربية والدارجة', en: 'In Arabic / Darija' } },
  { key: 'books', label: { ar: 'الكتب', en: 'Books' } }, { key: 'vocab', label: { ar: 'المفردات', en: 'Vocabulary' } },
  { key: 'youtube', label: { ar: 'يوتيوب', en: 'YouTube' } }, { key: 'podcasts', label: { ar: 'البودكاست', en: 'Podcasts' } },
  { key: 'reading', label: { ar: 'القراءة', en: 'Reading' } }, { key: 'speaking', label: { ar: 'المحادثة', en: 'Speaking' } },
  { key: 'writing', label: { ar: 'الكتابة', en: 'Writing' } }, { key: 'exam', label: { ar: 'الامتحانات', en: 'Exams' } },
  { key: 'ausbildung', label: { ar: 'التكوين المهني والتأشيرة', en: 'Ausbildung & visa' } },
]
