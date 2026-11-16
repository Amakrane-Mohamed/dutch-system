// The route: each level is a train line, each week a station (unit), lessons/study/test are stops.
import { LESSONS, PHASES, PRACTICE, WEEKS, lessonById, weeksOf, type Exercise, type PhaseKey, type Practice, type T, type Week } from '../content/data'
import { lessonSession, readingItems, skillItems } from './lessons'
import { shuffle } from './text'
import type { AppState } from '../state/store'

export type NodeKind = 'lesson' | 'study' | 'test' | 'exam'
export interface PathNode { id: string; kind: NodeKind; level: PhaseKey; week?: number; ref: string; title: T; de?: string }

export const nodeHref = (n: PathNode) =>
  n.kind === 'lesson' ? `/learn/lesson/${n.ref}` : n.kind === 'test' ? `/learn/test/${n.ref}` : n.kind === 'exam' ? `/learn/exam/${n.ref}` : `/learn/study/${n.ref}`

export const PASS = { lesson: 0.6, test: 0.7, exam: 0.6 }

export function nodesForWeek(w: Week): PathNode[] {
  const out: PathNode[] = []
  for (const id of w.lessons) {
    const l = lessonById(id)
    if (l) out.push({ id: `L:${id}`, kind: 'lesson', level: w.phase, week: w.n, ref: id, title: l.title, de: l.titleDe })
  }
  if (!w.lessons.length) out.push({ id: `S:${w.n}`, kind: 'study', level: w.phase, week: w.n, ref: String(w.n), title: w.title, de: w.titleDe })
  out.push({ id: `T:${w.n}`, kind: 'test', level: w.phase, week: w.n, ref: String(w.n), title: { ar: `اختبار الأسبوع ${w.n}`, en: `Week ${w.n} test` } })
  return out
}

export function nodesFor(level: PhaseKey): PathNode[] {
  const out = weeksOf(level).flatMap(nodesForWeek)
  out.push({ id: `E:${level}`, kind: 'exam', level, ref: level, title: { ar: `امتحان المستوى ${level.toUpperCase()}`, en: `${level.toUpperCase()} level exam` } })
  return out
}
export const ALL_NODES = PHASES.flatMap((p) => nodesFor(p.key))
export const nodeById = (id: string) => ALL_NODES.find((n) => n.id === id)

export function levelUnlocked(s: AppState, level: PhaseKey, today: string): boolean {
  if (s.settings.unlockAll) return true
  const i = PHASES.findIndex((p) => p.key === level)
  if (i === 0) return true
  return !!s.nodes[`E:${PHASES[i - 1].key}`] || today >= PHASES[i].start
}

export type NodeState = 'done' | 'current' | 'locked' | 'open'
export function nodeStates(s: AppState, level: PhaseKey, today: string): Record<string, NodeState> {
  const nodes = nodesFor(level)
  const out: Record<string, NodeState> = {}
  const open = levelUnlocked(s, level, today)
  let currentSet = false
  nodes.forEach((n, i) => {
    if (s.nodes[n.id]) { out[n.id] = 'done'; return }
    const prevDone = i === 0 ? open : !!s.nodes[nodes[i - 1].id]
    if (!currentSet && prevDone) { out[n.id] = 'current'; currentSet = true; return }
    out[n.id] = s.settings.unlockAll ? 'open' : 'locked'
  })
  if (!currentSet && open) {
    const first = nodes.find((n) => !s.nodes[n.id])
    if (first) out[first.id] = 'current'
  }
  return out
}

export const levelProgress = (s: AppState, level: PhaseKey) => {
  const n = nodesFor(level)
  return n.filter((x) => s.nodes[x.id]).length / n.length
}

/** The node to continue with: first open node in the earliest unlocked level that is not complete. */
export function currentNode(s: AppState, today: string): PathNode | undefined {
  for (const p of PHASES) {
    if (!levelUnlocked(s, p.key, today)) continue
    const st = nodeStates(s, p.key, today)
    const n = nodesFor(p.key).find((x) => st[x.id] === 'current')
    if (n) return n
  }
  return undefined
}

// ---------- tests
const MIN_WORDS: Record<PhaseKey, number> = { a1: 30, a2: 60, b1: 80, b2: 150 }
const CHECK: Record<PhaseKey, T[]> = {
  a1: [{ ar: 'جمل كاملة مع الفعل في الموضع الثاني', en: 'Full sentences with the verb second' }, { ar: 'الأداة الصحيحة مع كل اسم', en: 'The right article with every noun' }, { ar: 'حرف كبير لكل اسم', en: 'A capital letter for every noun' }],
  a2: [{ ar: 'تحية وخاتمة', en: 'Greeting and closing' }, { ar: 'جملة واحدة على الأقل مع weil أو dass', en: 'At least one weil/dass sentence' }, { ar: 'Perfekt صحيح', en: 'Correct Perfekt' }],
  b1: [{ ar: 'كل النقاط مذكورة', en: 'All points covered' }, { ar: 'روابط: deshalb, außerdem, trotzdem', en: 'Connectors: deshalb, außerdem, trotzdem' }, { ar: 'رأيك مع تبرير', en: 'Your opinion with reasons' }],
  b2: [{ ar: 'بنية: مقدمة – عرض – خاتمة', en: 'Structure: intro – body – conclusion' }, { ar: 'روابط B2 و Nominalisierung', en: 'B2 connectors and nominalisation' }, { ar: 'حجج مع وضد', en: 'Arguments for and against' }],
}
export const weekWriteTask = (w: Week): Exercise => ({ type: 'write', task: { prompt: w.write, minWords: MIN_WORDS[w.phase], checklist: CHECK[w.phase], model: '' } })

export function practiceItems(p: Practice): Exercise[] {
  if (p.skill === 'lesen' && p.text && p.items) return p.items.map((q) => ({ type: 'mc', q: q.q, options: q.options, answer: q.answer, passage: { title: p.title.ar, text: p.text! } }))
  if (p.skill === 'hoeren' && p.text && p.items) return p.items.map((q) => ({ type: 'listen', text: p.text!, q: q.q, options: q.options, answer: q.answer, mean: p.instr, once: /once|مرة واحدة/.test(p.instr.en + p.instr.ar) }))
  if (p.skill === 'schreiben' && p.prompt) return [{ type: 'write', task: { prompt: p.prompt, minWords: p.minWords ?? 80, checklist: p.checklist ?? [], model: p.model ?? '' } }]
  if (p.skill === 'sprechen' && p.prompt) return [{ type: 'speak', text: p.prompt.split('–')[0].replace(/^Thema:\s*/, '').trim(), mean: p.instr }]
  return []
}

const lessonsUpTo = (w: Week) => LESSONS.filter((l) => WEEKS.some((x) => x.n <= w.n && x.phase === w.phase && x.lessons.includes(l.id)))

/** Weekly test: the week's lessons (or the level so far), the reading text, practice sets from B1, and the writing task. */
export function weekTest(w: Week, seed = Math.random()): Exercise[] {
  const own = w.lessons.map(lessonById).filter((l): l is NonNullable<typeof l> => !!l)
  const ls = own.length ? own : lessonsUpTo(w).slice(-4)
  const core = shuffle(ls.flatMap((l) => l.exercises), seed).slice(0, own.length ? 8 : 6)
  const extra = shuffle(ls.flatMap((l) => skillItems(l, seed)), seed).slice(0, 4)
  const read = w.readTask ? readingItems(w.readTask) : []
  let practice: Exercise[] = []
  if (w.phase === 'b1' || w.phase === 'b2') {
    const sets = PRACTICE.filter((p) => p.level === w.phase)
    const lesen = sets.filter((p) => p.skill === 'lesen'), hoeren = sets.filter((p) => p.skill === 'hoeren')
    practice = [...practiceItems(lesen[w.n % lesen.length]), ...practiceItems(hoeren[w.n % hoeren.length])]
  }
  return [...shuffle([...core, ...extra], seed), ...read, ...practice, weekWriteTask(w)]
}

/** End-of-level exam. A1/A2: mixed lesson items + readings + writing; B1/B2: all practice sets (exam format). */
export function levelExam(level: PhaseKey, seed = Math.random()): Exercise[] {
  const ws = weeksOf(level)
  if (level === 'b1' || level === 'b2') return PRACTICE.filter((p) => p.level === level && p.skill !== 'sprechen').flatMap(practiceItems)
  const ls = LESSONS.filter((l) => ws.some((w) => w.lessons.includes(l.id)))
  const core = shuffle(ls.flatMap((l) => l.exercises), seed).slice(0, 14)
  const extra = shuffle(ls.flatMap((l) => skillItems(l, seed)), seed).slice(0, 6)
  const reads = shuffle(ws.filter((w) => w.readTask), seed).slice(0, 2).flatMap((w) => readingItems(w.readTask!))
  return [...shuffle([...core, ...extra], seed), ...reads, weekWriteTask(ws[ws.length - 1])]
}

export function sessionForNode(n: PathNode, seed?: number): Exercise[] {
  if (n.kind === 'lesson') { const l = lessonById(n.ref); return l ? lessonSession(l, seed) : [] }
  if (n.kind === 'test') { const w = WEEKS.find((x) => x.n === Number(n.ref)); return w ? weekTest(w, seed) : [] }
  if (n.kind === 'exam') return levelExam(n.level, seed)
  return []
}

/** Week progress 0..1 from the journey checklist (lessons and test count automatically from the path). */
export function weekProgress(s: AppState, w: Week): { done: number; total: number } {
  let done = 0
  for (const t of w.tasks) {
    const auto = t.kind === 'lesson' ? !!s.nodes[`L:${t.ref}`] : t.kind === 'test' ? !!s.nodes[`T:${w.n}`] : false
    if (auto || s.tasks[`w${w.n}:${t.id}`]) done++
  }
  return { done, total: w.tasks.length }
}
export const weekFor = (iso: string): Week => (iso < WEEKS[0].start ? WEEKS[0] : WEEKS.find((w) => iso >= w.start && iso <= w.end) ?? WEEKS[WEEKS.length - 1])
export const phaseFor = (iso: string) => PHASES.find((p) => iso >= p.start && iso <= p.end) ?? (iso < PHASES[0].start ? PHASES[0] : PHASES[PHASES.length - 1])
