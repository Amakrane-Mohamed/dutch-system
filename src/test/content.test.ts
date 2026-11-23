import { EXAMS, LESSONS, PHASES, PRACTICE, TRACKS, WEEKS, lessonById } from '../content/data'
import { RESOURCES, resourceById } from '../content/resources'
import { VIDEOS } from '../content/videos'
import { WORDS } from '../content/vocab'

const arabic = (id: string) => VIDEOS[id]?.arabic === true
const DUTCH = /\b(Nederlands|Dutch|nl-NL|hoe gaat het|ik ben|NT2|Inburgering)\b/i

describe('journey', () => {
  it('has 42 consecutive weeks from 11 Nov 2026 to Aug 2027', () => {
    expect(WEEKS).toHaveLength(42)
    WEEKS.forEach((w, i) => expect(w.n).toBe(i + 1))
    expect(WEEKS[0].start).toBe('2026-11-11')
    expect(WEEKS[41].end.startsWith('2027-08')).toBe(true)
    for (let i = 1; i < WEEKS.length; i++) expect(WEEKS[i].start > WEEKS[i - 1].end).toBe(true)
  })
  it('every week has all four skills, a test and an Arabic video first', () => {
    for (const w of WEEKS) {
      expect(Object.keys(w.skills).sort()).toEqual(['hoeren', 'lesen', 'schreiben', 'sprechen'])
      expect(w.test.ar.length).toBeGreaterThan(0)
      expect(w.videos.length).toBeGreaterThan(0)
      expect(arabic(w.videos[0]), `week ${w.n}`).toBe(true)
      w.videos.forEach((v) => expect(VIDEOS[v], v).toBeDefined())
      w.lessons.forEach((l) => expect(lessonById(l), l).toBeDefined())
    }
  })
  it('levels cover A1 to B2 in order', () => {
    expect(PHASES.map((p) => p.key)).toEqual(['a1', 'a2', 'b1', 'b2'])
    expect(PHASES.find((p) => p.key === 'a2')!.end <= '2027-03-31').toBe(true)
  })
})

describe('lessons', () => {
  it('every lesson has an embedded Arabic YouTube video first', () => {
    expect(LESSONS.length).toBeGreaterThan(20)
    for (const l of LESSONS) {
      expect(l.videos.length, l.id).toBeGreaterThan(0)
      expect(arabic(l.videos[0]), l.id).toBe(true)
      expect(l.exercises.length, l.id).toBeGreaterThan(3)
      expect(l.title.ar.length).toBeGreaterThan(0)
      l.resources.forEach((r) => expect(resourceById(r), r).toBeDefined())
    }
  })
  it('lesson vocab ids exist', () => {
    const ids = new Set(WORDS.map((w) => w.id))
    LESSONS.forEach((l) => l.vocab.forEach((v) => expect(ids.has(v), `${l.id}:${v}`).toBe(true)))
  })
  it('contains no Dutch leftovers', () => {
    expect(JSON.stringify(LESSONS)).not.toMatch(DUTCH)
    expect(JSON.stringify(WEEKS)).not.toMatch(DUTCH)
  })
})

describe('exams, tracks, resources', () => {
  it('exams have Arabic videos and parts for all skills', () => {
    expect(EXAMS.map((e) => e.id).sort()).toEqual(['goethe-b1', 'goethe-b2', 'telc-b1', 'telc-b2'])
    for (const e of EXAMS) {
      expect(arabic(e.videos[0]), e.id).toBe(true)
      expect(new Set(e.parts.map((p) => p.skill)).size).toBe(4)
    }
    expect(PRACTICE.length).toBeGreaterThanOrEqual(11)
  })
  it('tracks cover the four skills', () => {
    expect(TRACKS.map((t) => t.key).sort()).toEqual(['hoeren', 'lesen', 'schreiben', 'sprechen'])
  })
  it('resources have https links', () => {
    for (const r of RESOURCES) { expect(r.urls.length).toBeGreaterThan(0); r.urls.forEach((u) => expect(u).toMatch(/^https:\/\//)) }
  })
  it('every video id looks like a real YouTube id', () => {
    for (const v of Object.values(VIDEOS)) expect(v.id).toMatch(v.kind === 'video' ? /^[\w-]{11}$/ : /^PL[\w-]{16,40}$/)
  })
})
