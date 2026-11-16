import { useSyncExternalStore } from 'react'
import type { Card } from '../lib/srs'
import type { Activity } from '../content/data'
import { B1_EXAM, AUSBILDUNG_START } from '../content/data'
import type { Lang } from '../lib/i18n'

export interface LogEntry { id: string; date: string; activity: Activity; minutes: number; note?: string; source?: string }
export interface Mock { id: string; date: string; type: string; skill: string; score: number; max: number; passed: boolean; note?: string }
export interface Settings {
  lang: Lang; examDate: string; ausbildung: string; newPerDay: number; voiceURI?: string; rate: number
  reverse: boolean; dailyXp: number; dailyMinutes: number; hearts: boolean; sound: boolean; unlockAll: boolean; showDarija: boolean
}
export interface TestResult { id: string; date: string; kind: 'lesson' | 'unit' | 'level' | 'practice' | 'drill'; ref: string; title: string; score: number; total: number; level: string }
export interface NodeDone { date: string; best: number }

export interface AppState {
  v: 1
  settings: Settings
  tasks: Record<string, string> // `w${n}:${taskId}` or phase check id -> date done
  srs: Record<string, Card>
  newIntro: Record<string, number>
  reviews: Record<string, number>
  daily: Record<string, string[]> // date -> daily block ids done
  log: LogEntry[]
  mocks: Mock[]
  xp: Record<string, number> // date -> XP
  nodes: Record<string, NodeDone>
  tests: TestResult[]
  skills: Record<string, { c: number; t: number }> // `${level}:${skill}` and `all:${skill}`
  seenAch: string[]
}

export const KEY = 'rihla:v1'
export const defaultState = (): AppState => ({
  v: 1,
  settings: { lang: 'ar', examDate: B1_EXAM, ausbildung: AUSBILDUNG_START, newPerDay: 20, rate: 0.9, reverse: false, dailyXp: 60, dailyMinutes: 120, hearts: false, sound: true, unlockAll: false, showDarija: true },
  tasks: {}, srs: {}, newIntro: {}, reviews: {}, daily: {}, log: [], mocks: [], xp: {}, nodes: {}, tests: [], skills: {}, seenAch: [],
})

export function migrate(raw: unknown): AppState {
  const base = defaultState()
  if (!raw || typeof raw !== 'object' || (raw as { v?: number }).v !== 1) throw new Error('Not a Rihla backup (missing "v": 1)')
  const r = raw as Partial<AppState>
  return { ...base, ...r, settings: { ...base.settings, ...(r.settings ?? {}) } } as AppState
}

function load(): AppState {
  try {
    const s = localStorage.getItem(KEY)
    return s ? migrate(JSON.parse(s)) : defaultState()
  } catch {
    return defaultState()
  }
}

let state: AppState = typeof localStorage !== 'undefined' ? load() : defaultState()
const listeners = new Set<() => void>()

export function getState() { return state }
export function setState(fn: (s: AppState) => AppState) {
  state = fn(state)
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  listeners.forEach((l) => l())
}
export function replaceState(next: AppState) { setState(() => next) }
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l) }

export function useStore<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(state))
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

// ---- derived helpers ------------------------------------------------------
export function activeDays(s: AppState): Set<string> {
  const d = new Set<string>()
  s.log.forEach((e) => e.minutes > 0 && d.add(e.date))
  Object.entries(s.reviews).forEach(([k, v]) => v > 0 && d.add(k))
  Object.entries(s.daily).forEach(([k, v]) => v.length && d.add(k))
  Object.entries(s.xp).forEach(([k, v]) => v > 0 && d.add(k))
  return d
}

export function streak(s: AppState, today: string, addDays: (iso: string, n: number) => string): number {
  const days = activeDays(s)
  let cur = days.has(today) ? today : addDays(today, -1)
  let n = 0
  while (days.has(cur)) { n++; cur = addDays(cur, -1) }
  return n
}

export function longestStreak(s: AppState, addDays: (iso: string, n: number) => string): number {
  const days = [...activeDays(s)].sort()
  let best = 0, cur = 0, prev = ''
  for (const d of days) {
    cur = prev && addDays(prev, 1) === d ? cur + 1 : 1
    best = Math.max(best, cur); prev = d
  }
  return best
}

/** Minutes per day: logged minutes (app sessions log themselves too). */
export function minutesByDay(s: AppState): Record<string, number> {
  const m: Record<string, number> = {}
  s.log.forEach((e) => { m[e.date] = (m[e.date] ?? 0) + e.minutes })
  return m
}

export const totalMinutes = (s: AppState) => s.log.reduce((a, e) => a + e.minutes, 0)
export const totalXp = (s: AppState) => Object.values(s.xp).reduce((a, b) => a + b, 0)
export function addXp(n: number, date: string) {
  setState((s) => ({ ...s, xp: { ...s.xp, [date]: (s.xp[date] ?? 0) + n } }))
}
export function recordSkill(level: string, skill: string, ok: boolean) {
  setState((s) => {
    const sk = { ...s.skills }
    for (const key of [`${level}:${skill}`, `all:${skill}`]) {
      const cur = sk[key] ?? { c: 0, t: 0 }
      sk[key] = { c: cur.c + (ok ? 1 : 0), t: cur.t + 1 }
    }
    return { ...s, skills: sk }
  })
}
export function toggleTask(id: string, date: string) {
  setState((s) => {
    const t = { ...s.tasks }
    if (t[id]) delete t[id]
    else t[id] = date
    return { ...s, tasks: t }
  })
}
