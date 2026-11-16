/** Normalise an answer for comparison: case, spaces, punctuation, quotes. Keeps diacritics separately checkable. */
export const norm = (s: string) =>
  s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:]+/g, ' ').replace(/\s+/g, ' ').trim()
export const stripAccents = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export type Verdict = 'correct' | 'accent' | 'wrong'
export function checkAnswer(input: string, answers: string[]): Verdict {
  const n = norm(input)
  if (!n) return 'wrong'
  if (answers.some((a) => norm(a) === n)) return 'correct'
  if (answers.some((a) => stripAccents(norm(a)) === stripAccents(n))) return 'accent'
  return 'wrong'
}

export function shuffle<T>(arr: T[], seed = Math.random()): T[] {
  const a = arr.slice()
  let s = Math.floor(seed * 2 ** 31) || 1
  const rnd = () => ((s = (s * 48271) % 2147483647) / 2147483647)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
