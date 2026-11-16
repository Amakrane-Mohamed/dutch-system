import { useMemo, useRef, useState } from 'react'
import type { Exercise } from '../content/data'
import { skillOf } from '../lib/lessons'
import { checkAnswer, shuffle, type Verdict } from '../lib/text'
import { listenOnce, speechScore, srSupported, ttsSupported } from '../lib/speech'
import { XP, confetti, sfx } from '../lib/game'
import { addXp, recordSkill, useStore } from '../state/store'
import { todayISO } from '../lib/dates'
import { useT, tr, type Tx } from '../lib/i18n'
import { cx } from '../lib/cx'
import { Button, De, Md, Ring, Speak, say } from './ui'
import { Icon } from './Icon'
import { Recorder } from './Recorder'
import { isDesktop } from '../lib/desktop'

const MAX_HEARTS = 5
export interface RunResult { score: number; total: number; xp: number; completed: boolean }
const same = (a: Tx, b: Tx) => tr(a, 'ar') === tr(b, 'ar')

export function ExerciseRunner({ exercises, level = 'a1', onFinish, onExit, bonusXp = XP.lessonBonus, passMark = 0.6, title }: {
  exercises: Exercise[]; level?: string; onFinish?: (r: RunResult) => void; onExit?: () => void; bonusXp?: number; passMark?: number; title?: string
}) {
  const { t, tx } = useT()
  const heartsOn = useStore((s) => s.settings.hearts)
  const soundOn = useStore((s) => s.settings.sound)
  const [list, setList] = useState(exercises)
  const [i, setI] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [xp, setXp] = useState(0)
  const [gain, setGain] = useState<{ n: number; k: number } | null>(null)
  const [combo, setCombo] = useState(0)
  const [phase, setPhase] = useState<'run' | 'done' | 'failed'>('run')
  const [round, setRound] = useState(0)
  const ex = list[i]
  const today = todayISO()

  const answer = (v: Verdict, opts: { free?: boolean } = {}) => {
    if (verdict) return
    setVerdict(v)
    const ok = v !== 'wrong'
    recordSkill(level, skillOf(ex), ok)
    if (ok) {
      const g = (v === 'accent' ? XP.accent : XP.correct) + (combo >= 4 ? 5 : 0)
      setXp((x) => x + g); addXp(g, today); setCombo((c) => c + 1); setGain({ n: g, k: Date.now() })
      if (soundOn) sfx.correct()
    } else {
      setCombo(0)
      if (heartsOn && !opts.free) setHearts((h) => h - 1)
      if (soundOn) sfx.wrong()
    }
  }

  const next = () => {
    const r = [...results, verdict !== 'wrong']
    setResults(r); setVerdict(null); setGain(null)
    if (heartsOn && hearts <= 0) { setPhase('failed'); onFinish?.({ score: r.filter(Boolean).length, total: list.length, xp, completed: false }); return }
    if (i + 1 >= list.length) {
      const score = r.filter(Boolean).length
      let bonus = 0
      if (score / list.length >= passMark) { bonus = bonusXp + (score === list.length ? XP.perfectBonus : 0); addXp(bonus, today) }
      setXp((x) => x + bonus)
      setPhase('done')
      if (score / list.length >= passMark) { confetti(); if (soundOn) sfx.fanfare() }
      onFinish?.({ score, total: list.length, xp: xp + bonus, completed: true })
    } else setI(i + 1)
  }

  const restart = (l: Exercise[]) => { setList(l); setI(0); setResults([]); setHearts(MAX_HEARTS); setXp(0); setCombo(0); setPhase('run'); setRound((n) => n + 1) }

  if (phase !== 'run') {
    const score = results.filter(Boolean).length
    const pct = score / Math.max(1, phase === 'failed' ? results.length : list.length)
    const passed = phase === 'done' && pct >= passMark
    const wrong = list.filter((_, k) => results[k] === false)
    return (
      <div className="card relative mx-auto max-w-2xl overflow-hidden p-0 text-center animate-rise">
        <div className={cx('zellige-bg px-6 pb-10 pt-8 text-paper', !passed && 'opacity-95')}>
          <div className="mx-auto w-fit animate-pop">
            <Ring value={pct} size={132} stroke={11} color={passed ? '#E3A72F' : '#C8553D'}>
              <span className="text-3xl font-bold tabular-nums">{Math.round(pct * 100)}%</span>
            </Ring>
          </div>
          <h2 className="mt-4 text-2xl font-bold">
            {phase === 'failed' ? t('نفدت المحاولات', 'Out of hearts') : pct >= 0.9 ? t('ممتاز! محطة جديدة', 'Excellent! New station') : passed ? t('أحسنت، واصل الطريق', 'Well done, keep going') : t('قريب جدًا، أعد المحاولة', 'Almost, try again')}
          </h2>
          <p className="mt-1 text-paper/70">
            <span className="de">{pct >= 0.9 ? 'Sehr gut!' : passed ? 'Gut gemacht!' : 'Fast geschafft!'}</span> · {score} / {list.length} {t('صحيح', 'correct')}
            {!passed && ` · ${t('النجاح', 'pass mark')} ${Math.round(passMark * 100)}%`}
          </p>
        </div>
        <div className="-mt-6 grid grid-cols-3 gap-3 px-6">
          <div className="card p-3"><div className="text-xs text-mute">XP</div><div className="text-2xl font-bold text-saffron-deep">+{xp}</div></div>
          <div className="card p-3"><div className="text-xs text-mute">{t('الدقة', 'Accuracy')}</div><div className="text-2xl font-bold text-zellige">{Math.round(pct * 100)}%</div></div>
          <div className="card p-3"><div className="text-xs text-mute">{t('الأخطاء', 'Mistakes')}</div><div className="text-2xl font-bold text-terra">{wrong.length}</div></div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-6">
          {onExit && passed && <Button variant="gold" className="min-w-40" onClick={onExit}>{t('متابعة الرحلة', 'Continue the journey')}</Button>}
          {wrong.length > 0 && <Button variant={passed ? 'ghost' : 'primary'} onClick={() => restart(wrong)}>{t(`راجع ${wrong.length} أخطاء`, `Practise ${wrong.length} mistakes`)}</Button>}
          <Button variant="ghost" onClick={() => restart(shuffle(exercises))}>{t('من البداية', 'Start over')}</Button>
          {onExit && !passed && <Button variant="soft" onClick={onExit}>{t('العودة', 'Back')}</Button>}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[72vh] max-w-3xl flex-col">
      <div className="mb-6 flex items-center gap-4">
        {onExit && <button onClick={onExit} aria-label={t('خروج', 'Quit')} className="rounded-lg p-1.5 text-mute hover:bg-sand/60 hover:text-ink"><Icon name="x" size={22} /></button>}
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-sand">
          <div className="h-full rounded-full bg-gradient-to-l from-saffron to-terra transition-all duration-500 rtl:bg-gradient-to-r" style={{ width: `${(i / list.length) * 100}%` }} />
        </div>
        <span className="text-sm tabular-nums text-mute">{i + 1}/{list.length}</span>
        {heartsOn && <span className="flex items-center gap-1 text-sm font-bold text-terra" aria-label={`${hearts}`}><Icon name="khatam" size={16} /> {hearts}</span>}
        <span className="relative flex items-center gap-1 rounded-lg bg-saffron-soft px-2 py-1 text-sm font-bold text-saffron-deep">
          <Icon name="bolt" size={15} />{xp}
          {gain && <span key={gain.k} className="absolute -top-6 end-0 animate-rise text-sm font-bold text-saffron-deep">+{gain.n}</span>}
        </span>
      </div>
      {title && <div className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-saffron-deep">{title}</div>}
      {combo >= 3 && !verdict && <div className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-terra-soft px-3 py-1 text-sm font-bold text-terra animate-pop"><Icon name="flame" size={15} /> {combo} {t('متتالية!', 'in a row!')}</div>}
      <div className="flex-1">
        <ExerciseView key={`${round}-${i}`} ex={ex} verdict={verdict} onAnswer={answer} />
      </div>
      <div className={cx('sticky bottom-16 z-10 mt-8 rounded-2xl p-4 transition lg:bottom-4', !verdict ? 'bg-transparent' : verdict === 'wrong' ? 'bg-terra-soft ring-1 ring-terra/30' : 'bg-zellige-soft ring-1 ring-zellige/30')}>
        {verdict && (
          <div className="mb-3 flex items-start justify-between gap-3 animate-rise">
            <div className={cx('text-sm', verdict === 'wrong' ? 'text-terra' : 'text-zellige')}>
              <div className="flex items-center gap-2 text-lg font-bold">
                <Icon name={verdict === 'wrong' ? 'x' : 'check'} size={20} strokeWidth={2.5} />
                {verdict === 'correct' ? <span className="de">{pick(['Richtig!', 'Sehr gut!', 'Super!', 'Genau!'])}</span> : verdict === 'accent' ? t('صحيح تقريبًا: انتبه للإملاء (ä ö ü ß)', 'Almost: watch the spelling (ä ö ü ß)') : t('الإجابة الصحيحة:', 'Correct answer:')}
              </div>
              {verdict !== 'correct' && correctText(ex) && <div className="de mt-1 text-base font-semibold text-ink">{tx(correctText(ex))}</div>}
              {'explain' in ex && ex.explain && <div className="mt-1 text-ink/80"><Md text={tx(ex.explain)} /></div>}
            </div>
            {sayable(ex) && <Speak text={sayable(ex)!} />}
          </div>
        )}
        {verdict && <Button variant={verdict === 'wrong' ? 'danger' : 'ok'} className="w-full py-3 text-base" onClick={next} autoFocus>{i + 1 >= list.length ? t('إنهاء', 'Finish') : t('متابعة', 'Continue')}</Button>}
      </div>
    </div>
  )
}

const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)]
const sayable = (ex: Exercise): string | null =>
  ex.type === 'order' ? ex.answers[0] : ex.type === 'article' ? `${ex.article} ${ex.word}` : ex.type === 'listen' ? (ex.q ? null : ex.text) : ex.type === 'speak' ? ex.text : ex.type === 'translate' ? ex.answers[0] : null
const correctText = (ex: Exercise): Tx =>
  ex.type === 'mc' ? ex.answer : ex.type === 'fill' ? ex.answers.join(' / ') : ex.type === 'order' ? ex.answers[0] : ex.type === 'article' ? `${ex.article} ${ex.word}`
    : ex.type === 'listen' ? (ex.answer ?? ex.text) : ex.type === 'speak' ? ex.text : ex.type === 'translate' ? ex.answers[0] : ''

const Prompt = ({ kicker, children }: { kicker: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <div className="mb-2 text-sm font-semibold text-mute">{kicker}</div>
    <div className="text-2xl font-bold leading-snug text-ink">{children}</div>
  </div>
)

function Choice({ label, state, onClick, n }: { label: React.ReactNode; state: 'idle' | 'right' | 'wrong' | 'dim'; onClick: () => void; n: number }) {
  return (
    <button onClick={onClick} disabled={state !== 'idle'}
      className={cx('flex w-full items-center gap-3 rounded-xl bg-paper-2 px-4 py-3.5 text-start text-base font-medium ring-1 transition',
        state === 'idle' && 'ring-sand-2 hover:-translate-y-0.5 hover:ring-ink/40 hover:shadow-sm',
        state === 'right' && 'bg-zellige-soft ring-2 ring-zellige', state === 'wrong' && 'bg-terra-soft ring-2 ring-terra', state === 'dim' && 'opacity-50 ring-sand')}>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-sand/70 text-xs font-bold text-mute">{n}</span>
      <span className="min-w-0 flex-1">{label}</span>
    </button>
  )
}

function ExerciseView({ ex, verdict, onAnswer }: { ex: Exercise; verdict: Verdict | null; onAnswer: (v: Verdict, o?: { free?: boolean }) => void }) {
  const { t, tx } = useT()
  const [picked, setPicked] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [built, setBuilt] = useState<number[]>([])
  const [heard, setHeard] = useState<string>('')
  const [rec, setRec] = useState(false)
  const [plays, setPlays] = useState(0)
  const stopRef = useRef<() => void>(() => {})
  const opts = useMemo(() => ('options' in ex && ex.options ? shuffle(ex.options) : []), [ex])
  const words = useMemo(() => (ex.type === 'order' ? shuffle(ex.words.map((w, k) => ({ w, k }))) : []), [ex])
  const isDe = (o: Tx) => typeof o === 'string' && /[A-Za-zÄÖÜäöüß]/.test(o) && !/[\u0600-\u06FF]/.test(o)
  const optLabel = (o: Tx) => (isDe(o) ? <span className="de">{tx(o)}</span> : <Md text={tx(o)} />)
  const choose = (k: number, answer: Tx) => { if (verdict) return; setPicked(k); onAnswer(same(opts[k], answer) ? 'correct' : 'wrong') }
  const stateOf = (k: number, answer: Tx): 'idle' | 'right' | 'wrong' | 'dim' => !verdict ? 'idle' : same(opts[k], answer) ? 'right' : k === picked ? 'wrong' : 'dim'
  const play = (s: string, rate?: number) => { say(s, rate); setPlays((p) => p + 1) }
  const submitText = (answers: string[]) => onAnswer(checkAnswer(text, answers))
  const input = (answers: string[], placeholder: string) => (
    <form onSubmit={(e) => { e.preventDefault(); if (!verdict && text.trim()) submitText(answers) }} className="space-y-3">
      <input dir="ltr" lang="de" autoFocus value={text} disabled={!!verdict} onChange={(e) => setText(e.target.value)} placeholder={placeholder} autoCapitalize="none" autoCorrect="off" spellCheck={false}
        className="de w-full rounded-xl bg-paper-2 px-4 py-3.5 text-lg ring-1 ring-sand-2 outline-none focus:ring-2 focus:ring-saffron" />
      <div className="flex flex-wrap items-center gap-2">
        {['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'].map((c) => <button type="button" key={c} disabled={!!verdict} onClick={() => setText((x) => x + c)} className="de rounded-lg bg-sand/60 px-3 py-1.5 font-semibold hover:bg-sand">{c}</button>)}
        <Button type="submit" className="ms-auto" disabled={!!verdict || !text.trim()}>{t('تحقّق', 'Check')}</Button>
      </div>
    </form>
  )

  switch (ex.type) {
    case 'mc':
      return (
        <div>
          {ex.passage && (
            <div className="mb-5 rounded-2xl bg-paper-2 p-5 ring-1 ring-sand">
              <div className="mb-2 flex items-center justify-between gap-2"><div className="display text-lg font-semibold italic">{ex.passage.title}</div><Speak text={ex.passage.text} /></div>
              <p dir="ltr" lang="de" className="de whitespace-pre-line leading-relaxed text-ink/90">{ex.passage.text}</p>
            </div>
          )}
          <Prompt kicker={ex.passage ? t('القراءة · Lesen', 'Reading · Lesen') : t('اختر الإجابة الصحيحة', 'Choose the right answer')}><Md text={tx(ex.q)} /></Prompt>
          <div className="grid gap-3 sm:grid-cols-2">{opts.map((o, k) => <Choice key={k} n={k + 1} label={optLabel(o)} state={stateOf(k, ex.answer)} onClick={() => choose(k, ex.answer)} />)}</div>
        </div>
      )
    case 'article':
      return (
        <div>
          <Prompt kicker={t('أي أداة؟ der / die / das', 'Which article? der / die / das')}>
            <span className="de display text-4xl">{ex.word}</span>
            <div className="mt-2 text-base font-normal text-mute">{tx(ex.mean)}</div>
          </Prompt>
          <div className="grid grid-cols-3 gap-3">
            {(['der', 'die', 'das'] as const).map((a, k) => {
              const col = a === 'der' ? '#2F4BCE' : a === 'die' ? '#C8553D' : '#12756B'
              const st = !verdict ? 'idle' : a === ex.article ? 'right' : k === picked ? 'wrong' : 'dim'
              return (
                <button key={a} disabled={!!verdict} onClick={() => { setPicked(k); onAnswer(a === ex.article ? 'correct' : 'wrong') }}
                  className={cx('de rounded-2xl py-6 text-2xl font-bold ring-2 transition', st === 'idle' && 'hover:-translate-y-0.5', st === 'dim' && 'opacity-40', st === 'wrong' && 'ring-4')}
                  style={{ color: st === 'right' ? '#F6F0E4' : col, background: st === 'right' ? col : col + '12', borderColor: col, boxShadow: `inset 0 0 0 2px ${col}` }}>{a}</button>
              )
            })}
          </div>
        </div>
      )
    case 'fill':
      return (
        <div>
          <Prompt kicker={t('أكمل الفراغ', 'Fill in the gap')}><span dir="auto"><Md text={tx(ex.q)} /></span></Prompt>
          {ex.hint && <p className="mb-3 text-sm text-mute"><Md text={tx(ex.hint)} /></p>}
          {input(ex.answers, t('اكتب بالألمانية…', 'Type in German…'))}
        </div>
      )
    case 'translate':
      return (
        <div>
          <Prompt kicker={t('ترجم إلى الألمانية', 'Translate into German')}><Md text={tx(ex.src)} /></Prompt>
          {input(ex.answers, t('الجملة بالألمانية…', 'The sentence in German…'))}
        </div>
      )
    case 'order': {
      const sentence = built.map((k) => ex.words[k]).join(' ')
      return (
        <div>
          <Prompt kicker={t('رتّب الكلمات', 'Build the sentence')}><Md text={tx(ex.mean)} /></Prompt>
          <div dir="ltr" className="mb-4 flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-sand-2 bg-paper-2 p-3">
            {built.map((k, j) => <button key={j} disabled={!!verdict} onClick={() => setBuilt(built.filter((_, x) => x !== j))} className="de rounded-lg bg-ink px-3 py-2 font-semibold text-paper animate-pop">{ex.words[k]}</button>)}
          </div>
          <div dir="ltr" className="mb-4 flex flex-wrap gap-2">
            {words.map(({ w, k }) => <button key={k} disabled={!!verdict || built.includes(k)} onClick={() => setBuilt([...built, k])} className={cx('de rounded-lg bg-paper-2 px-3 py-2 font-semibold ring-1 ring-sand-2 transition hover:ring-ink/40', built.includes(k) && 'opacity-25')}>{w}</button>)}
          </div>
          <Button disabled={!!verdict || built.length !== ex.words.length} onClick={() => onAnswer(checkAnswer(sentence, ex.answers))}>{t('تحقّق', 'Check')}</Button>
        </div>
      )
    }
    case 'listen': {
      const limit = ex.once ? 1 : 99
      return (
        <div>
          <Prompt kicker={ex.q ? t('الاستماع · Hören', 'Listening · Hören') : ex.options ? t('اسمع واختر ما سمعت', 'Listen and choose what you heard') : t('اسمع واكتب ما سمعت (إملاء)', 'Listen and type what you hear (dictation)')}>
            {ex.q ? <span className="de">{tx(ex.q)}</span> : <span className="text-base font-normal text-mute">{t('اضغط للاستماع', 'Tap to listen')}</span>}
          </Prompt>
          <div className="mb-6 flex items-center gap-3">
            <button onClick={() => play(ex.text)} disabled={!ttsSupported() || plays >= limit + (verdict ? 99 : 0)} className="grid h-20 w-20 place-items-center rounded-2xl bg-ink text-saffron shadow-lg transition hover:scale-105 disabled:opacity-40" aria-label={t('استمع', 'Listen')}><Icon name="volume" size={34} /></button>
            {!ex.q && <button onClick={() => play(ex.text, 0.6)} className="grid h-14 w-14 place-items-center rounded-2xl bg-sand/70 text-ink hover:bg-sand" aria-label={t('أبطأ', 'Slower')}><span className="text-xs font-bold">0.6×</span></button>}
            {ex.once && <span className="text-sm text-terra">{t('يُسمع مرة واحدة كما في الامتحان', 'Played once, as in the exam')}</span>}
            {!ttsSupported() && <span className="text-sm text-terra">{t('المتصفح لا يدعم الصوت', 'No speech in this browser')}</span>}
          </div>
          {ex.options ? (
            <div className="grid gap-3 sm:grid-cols-2">{opts.map((o, k) => <Choice key={k} n={k + 1} label={optLabel(o)} state={stateOf(k, ex.answer ?? ex.text)} onClick={() => choose(k, ex.answer ?? ex.text)} />)}</div>
          ) : input([ex.text], t('اكتب ما سمعت…', 'Type what you hear…'))}
          {verdict && !ex.q && <p className="mt-3 text-sm text-mute"><Md text={tx(ex.mean)} /></p>}
        </div>
      )
    }
    case 'speak': {
      const can = srSupported()
      const go = () => {
        setRec(true); setHeard('')
        stopRef.current = listenOnce((alts) => {
          const best = alts.map((a) => ({ a, s: speechScore(ex.text, a) })).sort((x, y) => y.s - x.s)[0]
          setHeard(best.a)
          onAnswer(best.s >= 0.8 ? 'correct' : best.s >= 0.6 ? 'accent' : 'wrong', { free: true })
        }, (msg) => setHeard('⚠ ' + msg), () => setRec(false))
      }
      return (
        <div>
          <Prompt kicker={t('قل هذه الجملة بصوت عالٍ · Sprechen', 'Say this sentence aloud · Sprechen')}>
            <span className="de flex items-center gap-3"><De>{ex.text}</De><Speak text={ex.text} /></span>
            <div className="mt-2 text-base font-normal text-mute"><Md text={tx(ex.mean)} /></div>
          </Prompt>
          <div className="flex flex-wrap items-center gap-3">
            {can ? (
              <button onClick={rec ? () => stopRef.current() : go} disabled={!!verdict}
                className={cx('flex items-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition', rec ? 'bg-terra text-paper animate-pulse' : 'bg-ink text-paper hover:bg-ink-2')}>
                <Icon name="mic" size={22} /> {rec ? t('أستمع إليك…', 'Listening…') : t('اضغط وتكلّم', 'Tap and speak')}
              </button>
            ) : (
              <div className="w-full space-y-3">
                <p className="rounded-xl bg-saffron-soft/60 px-4 py-2.5 text-sm text-ink">{isDesktop()
                  ? t('التعرف التلقائي على الكلام غير متاح في تطبيق سطح المكتب. استمع للنطق الصحيح، سجّل صوتك واستمع إليه وقارن، ثم قيّم نفسك:', 'Automatic speech recognition is not available in the desktop app. Listen to the model, record yourself, compare, then rate yourself:')
                  : t('التعرف على الصوت غير مدعوم في هذا المتصفح (استعمل Chrome أو Edge). سجّل صوتك وقارن، ثم قيّم نفسك:', 'Speech recognition is not available in this browser (use Chrome or Edge). Record yourself, compare, then rate yourself:')}</p>
                <Recorder disabled={!!verdict} />
              </div>
            )}
            <Button variant="ghost" disabled={!!verdict} onClick={() => onAnswer('correct', { free: true })}>{t('قلتها بشكل صحيح', 'I said it right')}</Button>
            <Button variant="soft" disabled={!!verdict} onClick={() => onAnswer('wrong', { free: true })}>{t('أحتاج تدريبًا', 'Needs practice')}</Button>
          </div>
          {heard && <p className="mt-4 text-sm text-mute">{t('سمعتُ:', 'I heard:')} <span className="de font-semibold text-ink">{heard}</span></p>}
        </div>
      )
    }
    case 'write': {
      const n = text.trim().split(/\s+/).filter(Boolean).length
      return (
        <div>
          <Prompt kicker={t('الكتابة · Schreiben', 'Writing · Schreiben')}><span className="de text-xl">{tx(ex.task.prompt)}</span></Prompt>
          <textarea dir="ltr" lang="de" value={text} onChange={(e) => setText(e.target.value)} disabled={!!verdict} rows={8} placeholder="…"
            className="de w-full rounded-2xl bg-paper-2 p-4 text-base leading-relaxed ring-1 ring-sand-2 outline-none focus:ring-2 focus:ring-saffron" />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className={cx('tabular-nums', n >= ex.task.minWords ? 'text-zellige' : 'text-mute')}>{n} / {ex.task.minWords} {t('كلمة', 'words')}</span>
            <a href="https://languagetool.org/de" target="_blank" rel="noreferrer" className="font-semibold text-majorelle hover:underline">{t('صحّح بـ LanguageTool', 'Check with LanguageTool')} ↗</a>
          </div>
          {ex.task.checklist.length > 0 && (
            <ul className="mt-4 space-y-1.5 rounded-2xl bg-sand/40 p-4 text-sm">
              <li className="mb-1 font-semibold">{t('قائمة التحقق', 'Checklist')}</li>
              {ex.task.checklist.map((c, k) => <li key={k} className="flex gap-2"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-zellige" /><Md text={tx(c)} /></li>)}
            </ul>
          )}
          {verdict && ex.task.model && (
            <div className="mt-4 rounded-2xl bg-paper-2 p-4 ring-1 ring-zellige/30">
              <div className="mb-1 text-sm font-semibold text-zellige">{t('نموذج إجابة', 'Model answer')}</div>
              <p dir="ltr" lang="de" className="de whitespace-pre-line text-sm leading-relaxed">{ex.task.model}</p>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Button disabled={!!verdict || n < Math.ceil(ex.task.minWords * 0.6)} onClick={() => onAnswer('correct', { free: true })}>{t('سلّمت النص', 'Submit text')}</Button>
            <Button variant="ghost" disabled={!!verdict} onClick={() => onAnswer('wrong', { free: true })}>{t('تخطَّ الآن', 'Skip for now')}</Button>
          </div>
        </div>
      )
    }
  }
}
