import { LESSONS, type Example, type Exercise, type Lesson, type ReadTask, type SkillKey } from '../content/data'
import { shuffle } from './text'

export type Skill = SkillKey | 'grammatik' | 'wortschatz'
export const skillOf = (e: Exercise): Skill =>
  e.type === 'mc' ? (e.passage ? 'lesen' : 'grammatik') : e.type === 'listen' ? 'hoeren' : e.type === 'speak' ? 'sprechen'
    : e.type === 'translate' || e.type === 'write' ? 'schreiben' : e.type === 'article' ? 'wortschatz' : 'grammatik'

/** Examples usable for audio / speaking / translation (single, clean sentences). */
export const cleanExamples = (l: Lesson): Example[] =>
  l.blocks.flatMap((b) => (b.type === 'examples' ? b.items : []))
    .filter((e) => !/[/→]/.test(e.de) && e.de.length <= 70 && /[.?!]$/.test(e.de))

const allExamples = () => LESSONS.flatMap(cleanExamples)
const mean = (e: Example) => ({ ar: e.ar, en: e.en })

/** Listening, speaking and translation items generated from a lesson's examples. */
export function skillItems(l: Lesson, seed = Math.random()): Exercise[] {
  const ex = shuffle(cleanExamples(l), seed)
  if (ex.length === 0) return []
  const pool = allExamples()
  const same = cleanExamples(l)
  const distract = (t: string) => {
    const s = same.filter((e) => e.de !== t).map((e) => e.de)
    const other = shuffle(pool.filter((e) => e.de !== t && !s.includes(e.de)).map((e) => e.de), seed)
    return [...shuffle(s, seed), ...other].slice(0, 3)
  }
  const a = ex[0], b = ex[1 % ex.length], c = ex[2 % ex.length], d = ex[3 % ex.length]
  const out: Exercise[] = [
    { type: 'listen', text: a.de, mean: mean(a), options: [a.de, ...distract(a.de)], answer: a.de, explain: mean(a) },
    { type: 'speak', text: b.de, mean: mean(b) },
    { type: 'translate', src: mean(c), answers: [c.de], explain: c.de },
  ]
  if (ex.length > 3) out.push({ type: 'listen', text: d.de, mean: mean(d), explain: mean(d) })
  return out
}

/** A lesson session: authored exercises + four-skill items, interleaved. */
export function lessonSession(l: Lesson, seed = Math.random()): Exercise[] {
  const core = l.exercises
  const extra = skillItems(l, seed)
  const out: Exercise[] = []
  const step = Math.max(1, Math.floor(core.length / (extra.length + 1)))
  let k = 0
  core.forEach((e, i) => { out.push(e); if ((i + 1) % step === 0 && k < extra.length) out.push(extra[k++]) })
  while (k < extra.length) out.push(extra[k++])
  return out
}

export const readingItems = (r: ReadTask): Exercise[] =>
  r.questions.map((q) => ({ type: 'mc', q: q.q, options: q.options, answer: q.answer, passage: { title: r.title, text: r.text } }))
