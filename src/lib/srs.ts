// SM-2 style spaced repetition, tuned for beginners (1 → 3 → interval × ease).
import { addDays } from './dates'

export interface Card { ef: number; interval: number; reps: number; due: string; lapses: number; last?: string }
export type Grade = 'again' | 'hard' | 'good' | 'easy'
const Q: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 }

export const newCard = (today: string): Card => ({ ef: 2.5, interval: 0, reps: 0, due: today, lapses: 0 })

export function review(card: Card, grade: Grade, today: string): Card {
  const q = Q[grade]
  let { ef, interval, reps, lapses } = card
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
  if (grade === 'again') {
    reps = 0
    interval = 0 // see it again in this session / today
    lapses += 1
  } else {
    if (reps === 0) interval = grade === 'easy' ? 3 : 1
    else if (reps === 1) interval = grade === 'hard' ? 2 : grade === 'easy' ? 5 : 3
    else interval = Math.max(interval + 1, Math.round(interval * (grade === 'hard' ? 1.2 : grade === 'easy' ? ef * 1.3 : ef)))
    reps += 1
  }
  return { ef: Math.round(ef * 100) / 100, interval, reps, lapses, due: addDays(today, interval), last: today }
}

export const isDue = (c: Card, today: string) => c.due <= today
export const stage = (c?: Card): 'new' | 'learning' | 'young' | 'mature' =>
  !c || (c.reps === 0 && c.lapses === 0 && !c.last) ? 'new' : c.interval < 3 ? 'learning' : c.interval < 21 ? 'young' : 'mature'

/** Preview of the next interval for a grade (for button labels). */
export const preview = (c: Card | undefined, g: Grade, today: string) => review(c ?? newCard(today), g, today).interval
