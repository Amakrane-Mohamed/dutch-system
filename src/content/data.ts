// Typed access to the generated content (scripts/content/build.py → src/content/gen/*.json).
import type { T, Tx } from '../lib/i18n'
export type { T, Tx }
import lessonsJson from './gen/lessons.json'
import journeyJson from './gen/journey.json'
import tracksJson from './gen/tracks.json'
import examsJson from './gen/exams.json'
import planJson from './gen/plan.json'
import resourcesJson from './gen/resources.json'

export type PhaseKey = 'a1' | 'a2' | 'b1' | 'b2'
export const PHASE_KEYS: PhaseKey[] = ['a1', 'a2', 'b1', 'b2']
export type SkillKey = 'sprechen' | 'schreiben' | 'hoeren' | 'lesen'
export const SKILL_KEYS: SkillKey[] = ['sprechen', 'schreiben', 'hoeren', 'lesen']

// ---------- lessons
export interface Example { de: string; ar: string; en: string; dar?: string }
export type Block =
  | { type: 'text' | 'tip'; md: T }
  | { type: 'examples'; items: Example[] }
  | { type: 'sounds'; title: T; items: { de: string; ar: string; tip: T }[] }
  | { type: 'table'; columns: Tx[]; rows: Tx[][] }
export interface WriteTask { prompt: Tx; minWords: number; checklist: Tx[]; model: string }
export interface ReadTask { title: string; text: string; questions: { q: string; options: string[]; answer: string }[] }
export type Exercise =
  | { type: 'mc'; q: Tx; options: Tx[]; answer: Tx; explain?: Tx; passage?: { title: string; text: string } }
  | { type: 'fill'; q: Tx; answers: string[]; hint?: Tx; explain?: Tx }
  | { type: 'order'; mean: Tx; words: string[]; answers: string[]; explain?: Tx }
  | { type: 'article'; word: string; article: 'der' | 'die' | 'das'; mean: T; explain?: Tx }
  | { type: 'listen'; text: string; mean: Tx; options?: Tx[]; answer?: Tx; q?: Tx; explain?: Tx; once?: boolean }
  | { type: 'speak'; text: string; mean: Tx; explain?: Tx }
  | { type: 'translate'; src: Tx; answers: string[]; explain?: Tx }
  | { type: 'write'; task: WriteTask }
export interface Lesson {
  id: string; order: number; level: string; title: T; titleDe: string; minutes: number; summary: T
  resources: string[]; videos: string[]; blocks: Block[]; vocab: string[]; exercises: Exercise[]
}
export const LESSONS = lessonsJson as unknown as Lesson[]
export const lessonById = (id: string) => LESSONS.find((l) => l.id === id)

// ---------- journey
export interface Drill { a: string; b: string; ar: string; tip: T }
export interface SkillWeek { goal: T; minutes: number; daily: T[]; task: string | null; material: T | null }
export interface WeekTask { id: string; kind: 'lesson' | 'nicos' | 'book' | 'speak' | 'write' | 'listen' | 'read' | 'test'; ref?: string; label?: T }
export interface Week {
  n: number; phase: PhaseKey; emoji: string; title: T; titleDe: string; start: string; end: string; dates: T
  grammar: T[]; vocab: T[]; nicos: string; book: string; lessons: string[]; videos: string[]
  speak: string; write: string; skills: Record<SkillKey, SkillWeek>; test: T; readTask: ReadTask | null; extra: T | null
  tasks: WeekTask[]; drills: Drill[]; prompt: string
}
export const WEEKS = journeyJson as unknown as Week[]
export const weekByN = (n: number) => WEEKS.find((w) => w.n === n)
export const weeksOf = (p: PhaseKey) => WEEKS.filter((w) => w.phase === p)

// ---------- tracks
export interface Method { id: string; title: T; minutes: number; steps: T[]; why: T; res: string[]; videos: string[] }
export interface Track {
  key: SkillKey; de: string; icon: string; color: string; title: T; intro: T; methods: Method[]
  ladder: { level: string; items: T[]; goal: T }[]
  drills?: Drill[]; prompts?: Record<PhaseKey, string[]>; lebenslauf?: T[]; anschreiben?: string
}
export const TRACKS = tracksJson as unknown as Track[]

// ---------- exams
export interface ExamPart { skill: SkillKey; name: string; minutes: number; detail: T; strategy: T }
export interface Exam { id: string; name: string; level: string; res: string; videos: string[]; pass: T; parts: ExamPart[] }
export interface Practice {
  id: string; level: 'b1' | 'b2'; skill: SkillKey; title: T; instr: T
  text?: string; items?: { q: string; options: string[]; answer: string }[]
  prompt?: string; minWords?: number; checklist?: T[]; model?: string
}
const ex = examsJson as unknown as { exams: Exam[]; redemittel: Record<'b1' | 'b2', [string, string[]][]>; practice: Practice[] }
export const EXAMS = ex.exams
export const REDEMITTEL = ex.redemittel
export const PRACTICE = ex.practice

// ---------- plan
export interface Phase { key: PhaseKey; label: string; start: string; end: string; hours: number; weeks: [number, number]; dates: T; book: string; test: T; can: T[]; checks: T[] }
export interface Milestone { id: string; date: string; emoji: string; title: T; note: T; city: string }
export type Activity = 'book' | 'anki' | 'listening' | 'speaking' | 'writing' | 'reading' | 'tutor' | 'exam' | 'app'
export interface DailyBlock { id: string; time: string; minutes: number; activity: Activity | null; title: T; by: Record<PhaseKey, T> }
const plan = planJson as unknown as {
  phases: Phase[]; milestones: Milestone[]; activities: { key: Activity; label: T; skill: SkillKey | null }[]
  daily: DailyBlock[]; weekly: { day: T; time: T; focus: T }[]; pitfalls: { pitfall: T; why: T; fix: T }[]; budget: { item: T; cost: string }[]
}
export const PHASES = plan.phases
export const MILESTONES = plan.milestones
export const ACTIVITIES = plan.activities
export const DAILY = plan.daily
export const WEEKLY = plan.weekly
export const PITFALLS = plan.pitfalls
export const BUDGET = plan.budget
export const PLAN_START = '2026-11-11'
export const B1_EXAM = '2027-06-04'
export const AUSBILDUNG_START = '2027-09-01'
export const phaseByKey = (k: PhaseKey) => PHASES.find((p) => p.key === k)!

// ---------- resources
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

export const SKILLS: Record<SkillKey, { de: string; title: T; color: string; icon: string }> = {
  sprechen: { de: 'Sprechen', title: { ar: 'المحادثة', en: 'Speaking' }, color: '#C8553D', icon: 'mic' },
  schreiben: { de: 'Schreiben', title: { ar: 'الكتابة', en: 'Writing' }, color: '#E3A72F', icon: 'pen' },
  hoeren: { de: 'Hören', title: { ar: 'الاستماع', en: 'Listening' }, color: '#12756B', icon: 'headphones' },
  lesen: { de: 'Lesen', title: { ar: 'القراءة', en: 'Reading' }, color: '#2F4BCE', icon: 'book' },
}
export const LEVEL_COLOR: Record<PhaseKey, string> = { a1: '#12756B', a2: '#2F4BCE', b1: '#E3A72F', b2: '#C8553D' }
