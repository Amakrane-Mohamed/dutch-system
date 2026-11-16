import { addDays } from './dates'
import { WORDS } from '../content/vocab'
import type { T } from '../content/data'
import { longestStreak, streak, totalMinutes, totalXp, type AppState } from '../state/store'

export const XP = { correct: 10, accent: 8, lessonBonus: 20, perfectBonus: 10, testBonus: 40, examBonus: 100, study: 30, card: 2, task: 5 }

/** Traveller rank from total XP: rank n needs 50·n·(n−1) XP (0, 100, 300, 600, 1000 …). */
export function playerLevel(xp: number) {
  let n = 1
  while (50 * (n + 1) * n <= xp) n++
  const floor = 50 * n * (n - 1), next = 50 * (n + 1) * n
  return { level: n, into: xp - floor, need: next - floor }
}

/** Weekly "class" by XP this week: travel classes on the Casablanca → Berlin train. */
export const LEAGUES: { min: number; title: T; de: string; color: string }[] = [
  { min: 0, title: { ar: 'مسافر', en: 'Traveller' }, de: 'Reisender', color: '#8A7F6A' },
  { min: 150, title: { ar: 'الدرجة الثانية', en: 'Second class' }, de: '2. Klasse', color: '#12756B' },
  { min: 400, title: { ar: 'الدرجة الأولى', en: 'First class' }, de: '1. Klasse', color: '#2F4BCE' },
  { min: 800, title: { ar: 'عربة الطعام', en: 'Dining car' }, de: 'Speisewagen', color: '#C8553D' },
  { min: 1400, title: { ar: 'مقصورة القائد', en: 'Driver\'s cab' }, de: 'Führerstand', color: '#E3A72F' },
]
export const leagueFor = (weekXp: number) => [...LEAGUES].reverse().find((l) => weekXp >= l.min)!

export interface Achievement { id: string; title: T; desc: T; icon: string; done: boolean; progress?: [number, number] }
export function achievements(s: AppState, today: string): Achievement[] {
  const xp = totalXp(s)
  const st = Math.max(streak(s, today, addDays), longestStreak(s, addDays))
  const learned = WORDS.filter((w) => (s.srs[w.id]?.reps ?? 0) >= 1).length
  const sk = (k: string) => s.skills[`all:${k}`]?.c ?? 0
  const lessonsDone = Object.keys(s.nodes).filter((k) => k.startsWith('L:')).length
  const hrs = totalMinutes(s) / 60
  const a = (id: string, ar: string, en: string, dar: string, den: string, icon: string, cur: number, goal: number): Achievement =>
    ({ id, title: { ar, en }, desc: { ar: dar, en: den }, icon, done: cur >= goal, progress: [Math.min(cur, goal), goal] })
  return [
    a('first', 'التذكرة الأولى', 'First ticket', 'أنهِ أول درس', 'Finish your first lesson', 'ticket', lessonsDone, 1),
    a('lessons10', 'عشر محطات', 'Ten stops', 'أنهِ 10 دروس', 'Finish 10 lessons', 'route', lessonsDone, 10),
    a('streak3', 'الشرارة', 'Spark', '3 أيام متتالية', '3-day streak', 'flame', st, 3),
    a('streak7', 'أسبوع كامل', 'Full week', '7 أيام متتالية', '7-day streak', 'flame', st, 7),
    a('streak30', 'لا يتوقف', 'Unstoppable', '30 يومًا متتاليًا', '30-day streak', 'flame', st, 30),
    a('xp500', '500 نقطة', '500 XP', 'اجمع 500 نقطة خبرة', 'Earn 500 XP', 'star', xp, 500),
    a('xp5000', '5000 نقطة', '5,000 XP', 'اجمع 5000 نقطة خبرة', 'Earn 5,000 XP', 'star', xp, 5000),
    a('words50', 'حقيبة الكلمات', 'Word bag', 'تعلّم 50 بطاقة', 'Learn 50 flashcards', 'cards', learned, 50),
    a('words300', 'قاموس متنقل', 'Walking dictionary', 'تعلّم 300 بطاقة', 'Learn 300 flashcards', 'cards', learned, 300),
    a('listen50', 'أذن ألمانية', 'German ear', '50 إجابة استماع صحيحة', '50 listening items right', 'headphones', sk('hoeren'), 50),
    a('speak25', 'الصوت الواثق', 'Confident voice', '25 تمرين نطق صحيح', '25 speaking items right', 'mic', sk('sprechen'), 25),
    a('write10', 'القلم', 'The pen', '10 تمارين كتابة', '10 writing items done', 'pen', sk('schreiben'), 10),
    a('unittest', 'نجحت!', 'Passed!', 'انجح في اختبار أسبوع', 'Pass a weekly test', 'medal', s.tests.filter((t) => t.kind === 'unit' && t.score / t.total >= 0.7).length, 1),
    a('perfect', 'بلا أخطاء', 'Flawless', '100٪ في درس', '100% on a lesson', 'check', s.tests.filter((t) => t.kind === 'lesson' && t.score === t.total).length, 1),
    a('hours10', '10 ساعات', '10 hours', 'سجّل 10 ساعات دراسة', 'Log 10 study hours', 'clock', hrs, 10),
    a('hours100', '100 ساعة', '100 hours', 'سجّل 100 ساعة دراسة', 'Log 100 study hours', 'clock', hrs, 100),
    a('a1', 'محطة A1', 'Station A1', 'انجح في امتحان A1', 'Pass the A1 exam', 'khatam', s.nodes['E:a1'] ? 1 : 0, 1),
    a('a2', 'محطة A2', 'Station A2', 'انجح في امتحان A2', 'Pass the A2 exam', 'khatam', s.nodes['E:a2'] ? 1 : 0, 1),
    a('b1', 'محطة B1', 'Station B1', 'انجح في امتحان B1 التجريبي', 'Pass the B1 mock', 'khatam', s.nodes['E:b1'] ? 1 : 0, 1),
    a('b2', 'وصلت إلى برلين', 'Arrived in Berlin', 'أنهِ مسار B2', 'Finish the B2 route', 'train', s.nodes['E:b2'] ? 1 : 0, 1),
  ]
}

// ---- feedback: sounds (Web Audio, no files) and confetti -----------------
let ctx: AudioContext | null = null
function tone(freqs: number[], dur = 0.12, type: OscillatorType = 'sine', gap = 0.09) {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = ctx ?? new AC()
    const t0 = ctx.currentTime
    freqs.forEach((f, i) => {
      const o = ctx!.createOscillator(), g = ctx!.createGain()
      o.type = type; o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t0 + i * gap)
      g.gain.exponentialRampToValueAtTime(0.16, t0 + i * gap + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * gap + dur)
      o.connect(g).connect(ctx!.destination)
      o.start(t0 + i * gap); o.stop(t0 + i * gap + dur + 0.02)
    })
  } catch { /* audio blocked */ }
}
export const sfx = {
  correct: () => tone([587, 880], 0.16, 'sine'),
  wrong: () => tone([247, 196], 0.2, 'triangle', 0.12),
  fanfare: () => tone([392, 523, 659, 784], 0.26, 'sine', 0.13),
}

/** Celebration: falling 8-point zellige stars in the brand palette. */
export function confetti(pieces = 90) {
  if (typeof document === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const c = document.createElement('canvas')
  c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60'
  document.body.appendChild(c)
  const dpr = window.devicePixelRatio || 1
  c.width = innerWidth * dpr; c.height = innerHeight * dpr
  const g = c.getContext('2d')!
  g.scale(dpr, dpr)
  const colors = ['#E3A72F', '#C8553D', '#12756B', '#2F4BCE', '#F6F0E4', '#0E1A3A']
  const ps = Array.from({ length: pieces }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.3,
    vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 5,
    rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2, col: colors[(Math.random() * colors.length) | 0],
  }))
  const star = (r: number) => {
    g.beginPath()
    for (let i = 0; i < 16; i++) { const a = (i * Math.PI) / 8, rr = i % 2 ? r * 0.55 : r; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) }
    g.closePath(); g.fill()
  }
  let frame = 0
  const step = () => {
    g.clearRect(0, 0, innerWidth, innerHeight)
    ps.forEach((p) => {
      p.vy += 0.3; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.col; star(p.r); g.restore()
    })
    if (++frame < 160) requestAnimationFrame(step)
    else c.remove()
  }
  requestAnimationFrame(step)
}
