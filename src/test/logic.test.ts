import { newCard, review, stage, isDue } from '../lib/srs'
import { checkAnswer, shuffle, norm } from '../lib/text'
import { tr } from '../lib/i18n'
import { ALL_NODES, PASS, levelExam, levelUnlocked, nodeStates, nodesFor, weekFor, weekTest, phaseFor } from '../lib/path'
import { WEEKS } from '../content/data'
import { defaultState, migrate, longestStreak, streak } from '../state/store'
import { addDays } from '../lib/dates'
import { buildDrill, DRILLS } from '../lib/drills'
import { leagueFor, playerLevel } from '../lib/game'

describe('srs', () => {
  it('grows intervals and resets on again', () => {
    let c = newCard('2026-11-11')
    c = review(c, 'good', '2026-11-11'); expect(c.interval).toBeGreaterThanOrEqual(1)
    const i1 = c.interval
    c = review(c, 'good', c.due); expect(c.interval).toBeGreaterThan(i1)
    expect(isDue(c, '2026-11-11')).toBe(false)
    c = review(c, 'again', c.due); expect(c.lapses).toBe(1)
    expect(stage(undefined)).toBe('new')
  })
})

describe('text + i18n', () => {
  it('checks German answers tolerant of case and umlaut spelling', () => {
    expect(checkAnswer('ich bin müde', ['Ich bin müde.'])).toBe('correct')
    expect(checkAnswer('ich bin mude', ['Ich bin müde.'])).toBe('accent')
    expect(checkAnswer('du bist', ['Ich bin'])).toBe('wrong')
    expect(norm('  Hallo!  ')).toBe('hallo')
  })
  it('shuffle keeps items', () => expect(shuffle([1, 2, 3, 4], 0.3).sort()).toEqual([1, 2, 3, 4]))
  it('Arabic is the default and fallback', () => {
    expect(tr({ ar: 'مرحبا', en: 'Hi' }, 'ar')).toBe('مرحبا')
    expect(tr({ ar: 'مرحبا', en: 'Hi' }, 'en')).toBe('Hi')
    expect(tr('Hallo', 'ar')).toBe('Hallo')
    expect(defaultState().settings.lang).toBe('ar')
  })
})

describe('path', () => {
  it('each level ends with an exam and each week with a test', () => {
    for (const k of ['a1', 'a2', 'b1', 'b2'] as const) {
      const n = nodesFor(k)
      expect(n[n.length - 1].kind).toBe('exam')
      expect(n.filter((x) => x.kind === 'test').length).toBe(WEEKS.filter((w) => w.phase === k).length)
    }
    expect(new Set(ALL_NODES.map((n) => n.id)).size).toBe(ALL_NODES.length)
    expect(PASS.test).toBe(0.7)
  })
  it('A1 is open on day one, B2 locked', () => {
    const s = defaultState()
    expect(levelUnlocked(s, 'a1', '2026-11-11')).toBe(true)
    expect(levelUnlocked(s, 'b2', '2026-11-11')).toBe(false)
    const st = nodeStates(s, 'a1', '2026-11-11')
    expect(Object.values(st)).toContain('current')
  })
  it('builds tests and exams with exercises', () => {
    WEEKS.forEach((w) => expect(weekTest(w, 0.5).length, `w${w.n}`).toBeGreaterThan(3))
    for (const k of ['a1', 'a2', 'b1', 'b2'] as const) expect(levelExam(k, 0.5).length).toBeGreaterThan(5)
  })
  it('maps dates to weeks and phases', () => {
    expect(weekFor('2026-11-11').n).toBe(1)
    expect(weekFor('2026-11-16').n).toBe(2)
    expect(phaseFor('2027-06-04').key).toBe('b1')
  })
  it('drills generate items', () => DRILLS.forEach((d) => expect(buildDrill(d.id, 0.2).length).toBeGreaterThan(5)))
})

describe('store + game', () => {
  it('migrates backups and rejects foreign files', () => {
    expect(migrate({ v: 1, settings: { lang: 'en' } }).settings.dailyXp).toBe(60)
    expect(() => migrate({ foo: 1 })).toThrow()
  })
  it('computes streaks', () => {
    const s = { ...defaultState(), xp: { '2026-11-11': 20, '2026-11-12': 30, '2026-11-13': 10 } }
    expect(streak(s, '2026-11-13', addDays)).toBe(3)
    expect(longestStreak(s, addDays)).toBe(3)
  })
  it('levels and train-class leagues', () => {
    expect(playerLevel(0).level).toBe(1)
    expect(leagueFor(0).de).toBeTruthy()
  })
})
