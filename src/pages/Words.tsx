import { useMemo, useState } from 'react'
import { WORDS, TOPICS, ARTICLE_COLOR, emojiFor, pluralOf, type Word } from '../content/vocab'
import { todayISO } from '../lib/dates'
import { useT } from '../lib/i18n'
import { cx } from '../lib/cx'
import { DRILLS } from '../lib/drills'
import { XP } from '../lib/game'
import { isDue, newCard, preview, review, stage, type Grade } from '../lib/srs'
import { addXp, setState, useStore } from '../state/store'
import { Button, Card, PageHead, Speak, Stat, Title, say } from '../components/ui'
import { Icon } from '../components/Icon'

const TOPIC_AR: Record<string, string> = { greetings: 'التحيات', pronouns: 'الضمائر', verbs: 'الأفعال', people: 'الناس', family: 'العائلة', body: 'الجسم', home: 'البيت', food: 'الطعام', city: 'المدينة', time: 'الوقت', work: 'العمل', it: 'المعلوميات', 'free time': 'الفراغ', clothes: 'الملابس', animals: 'الحيوانات', general: 'عام', adjectives: 'الصفات', function: 'كلمات وظيفية', questions: 'الأسئلة', numbers: 'الأرقام' }

export default function Words() {
  const { t, lang } = useT()
  const today = todayISO()
  const srs = useStore((s) => s.srs)
  const newPerDay = useStore((s) => s.settings.newPerDay)
  const introduced = useStore((s) => s.newIntro[today] ?? 0)
  const reverse = useStore((s) => s.settings.reverse)
  const [session, setSession] = useState<Word[] | null>(null)
  const [topic, setTopic] = useState('all')
  const [q, setQ] = useState('')
  const due = WORDS.filter((w) => srs[w.id] && isDue(srs[w.id], today))
  const fresh = WORDS.filter((w) => !srs[w.id]).slice(0, Math.max(0, newPerDay - introduced))
  const learned = WORDS.filter((w) => (srs[w.id]?.reps ?? 0) >= 1).length
  const mature = WORDS.filter((w) => stage(srs[w.id]) === 'mature').length
  const list = WORDS.filter((w) => (topic === 'all' || w.topic === topic) && (!q || (w.de + w.ar + w.en).toLowerCase().includes(q.toLowerCase())))

  if (session) return <Review cards={session} reverse={reverse} onDone={() => setSession(null)} />
  return (
    <div>
      <PageHead kicker={t('التكرار المتباعد', 'Spaced repetition')} title={t('الكلمات', 'Words')} de="Wortschatz mit Artikel und Plural"
        sub={t('كل اسم مع der / die / das والجمع. الألوان: der أزرق ماجوريل، die طيني، das فيروزي.', 'Every noun with der / die / das and its plural. Colours: der Majorelle blue, die terracotta, das teal.')}
        right={<Button variant="gold" className="px-6 py-3 text-base" disabled={!due.length && !fresh.length} onClick={() => setSession([...due, ...fresh])}><Icon name="cards" size={18} />{t('ابدأ المراجعة', 'Start review')} · {due.length + fresh.length}</Button>} />
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="clock" color="#C8553D" label={t('مستحقة اليوم', 'Due today')} value={due.length} />
        <Stat icon="sparkle" color="#B57F12" label={t('جديدة اليوم', 'New today')} value={fresh.length} sub={`${introduced}/${newPerDay}`} />
        <Stat icon="check" color="#12756B" label={t('متعلّمة', 'Learned')} value={learned} sub={`/ ${WORDS.length}`} />
        <Stat icon="star" color="#2F4BCE" label={t('راسخة (21+ يومًا)', 'Mature (21+ days)')} value={mature} />
      </section>
      <Card className="mb-6">
        <Title kicker={t('تمارين سريعة', 'Quick drills')}>{t('درّب عضلة الأداة', 'Train the article muscle')}</Title>
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          {DRILLS.map((d) => (
            <a key={d.id} href={`#/learn/drill/${d.id}`} className="group rounded-2xl bg-paper p-4 ring-1 ring-sand transition hover:-translate-y-0.5 hover:ring-ink/30">
              <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-ink text-saffron"><Icon name={d.icon} size={20} /></div>
              <div className="font-semibold">{lang === 'ar' ? d.title.ar : d.title.en}</div>
              <div className="mt-1 text-xs text-mute">{lang === 'ar' ? d.desc.ar : d.desc.en}</div>
            </a>
          ))}
        </div>
      </Card>
      <Card>
        <Title kicker={`${list.length} ${t('كلمة', 'words')}`} right={<input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('ابحث…', 'Search…')} className="w-56 rounded-xl bg-paper px-3 py-2 text-sm ring-1 ring-sand-2 outline-none focus:ring-saffron" />}>{t('القاموس', 'Word list')}</Title>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {['all', ...TOPICS].map((tp) => <button key={tp} onClick={() => setTopic(tp)} className={cx('rounded-full px-3 py-1 text-xs font-semibold', topic === tp ? 'bg-ink text-paper' : 'bg-sand/60 text-ink hover:bg-sand')}>{tp === 'all' ? t('الكل', 'All') : lang === 'ar' ? TOPIC_AR[tp] ?? tp : tp}</button>)}
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {list.slice(0, 120).map((w) => (
            <div key={w.id} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2 ring-1 ring-sand">
              <span className="text-lg">{emojiFor(w)}</span>
              <div className="min-w-0 flex-1"><div className={cx('de font-semibold', ARTICLE_COLOR[w.article])}>{w.de}</div>{pluralOf(w) && <div className="de text-xs text-mute">{pluralOf(w)}</div>}</div>
              <div className="text-end text-sm"><div className="font-semibold">{w.ar}</div><div className="text-xs text-mute">{w.en}</div></div>
              <Speak text={w.de} size={14} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Review({ cards, reverse, onDone }: { cards: Word[]; reverse: boolean; onDone: () => void }) {
  const { t } = useT()
  const today = todayISO()
  const srs = useStore((s) => s.srs)
  const [queue, setQueue] = useState(cards)
  const [flip, setFlip] = useState(false)
  const [done, setDone] = useState(0)
  const w = queue[0]
  const grades: { g: Grade; label: string; cls: string }[] = useMemo(() => [
    { g: 'again', label: t('مرة أخرى', 'Again'), cls: 'bg-terra text-paper' }, { g: 'hard', label: t('صعب', 'Hard'), cls: 'bg-sand text-ink' },
    { g: 'good', label: t('جيد', 'Good'), cls: 'bg-zellige text-paper' }, { g: 'easy', label: t('سهل', 'Easy'), cls: 'bg-majorelle text-paper' },
  ], [t])
  if (!w) return (
    <Card className="mx-auto max-w-xl text-center">
      <Icon name="check" size={48} className="mx-auto text-zellige" />
      <h2 className="mt-3 text-2xl font-bold">{t('انتهت المراجعة!', 'Review done!')} <span className="de italic text-saffron-deep">Toll!</span></h2>
      <p className="mt-1 text-mute">{done} {t('بطاقة', 'cards')}</p>
      <Button className="mt-5" onClick={onDone}>{t('العودة', 'Back')}</Button>
    </Card>
  )
  const grade = (g: Grade) => {
    const isNew = !srs[w.id]
    const next = review(srs[w.id] ?? newCard(today), g, today)
    setState((s) => ({ ...s, srs: { ...s.srs, [w.id]: next }, reviews: { ...s.reviews, [today]: (s.reviews[today] ?? 0) + 1 }, newIntro: isNew ? { ...s.newIntro, [today]: (s.newIntro[today] ?? 0) + 1 } : s.newIntro }))
    addXp(XP.card, today)
    setQueue(g === 'again' ? [...queue.slice(1), w] : queue.slice(1)); setFlip(false); setDone((d) => d + 1)
  }
  const front = reverse ? <div className="text-4xl font-bold">{w.ar}</div> : <div className={cx('de display text-5xl font-semibold', ARTICLE_COLOR[w.article])}>{w.de}</div>
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-3"><button onClick={onDone} className="rounded-lg p-1.5 text-mute hover:bg-sand/60"><Icon name="x" size={22} /></button><div className="h-2 flex-1 overflow-hidden rounded-full bg-sand"><div className="h-full bg-saffron transition-all" style={{ width: `${(done / (done + queue.length)) * 100}%` }} /></div><span className="text-sm tabular-nums text-mute">{queue.length}</span></div>
      <button onClick={() => { setFlip(true); if (!reverse) say(w.de) }} className="card zellige-light flex min-h-80 w-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="text-5xl">{emojiFor(w)}</div>
        {front}
        {flip ? (
          <div className="animate-rise space-y-1">
            {reverse ? <div className={cx('de display text-4xl font-semibold', ARTICLE_COLOR[w.article])}>{w.de}</div> : <div className="text-3xl font-bold">{w.ar}</div>}
            {pluralOf(w) && <div className="de text-mute">{pluralOf(w)}</div>}
            <div className="text-sm text-mute">{w.en}</div>
          </div>
        ) : <div className="text-sm text-mute">{t('اضغط لرؤية الإجابة', 'Tap to reveal')}</div>}
      </button>
      {flip && (
        <div className="mt-4 grid grid-cols-4 gap-2 animate-rise">
          {grades.map((g) => <button key={g.g} onClick={() => grade(g.g)} className={cx('rounded-xl py-3 text-sm font-bold', g.cls)}>{g.label}<div className="text-[11px] font-medium opacity-75">{preview(srs[w.id], g.g, today)} {t('يوم', 'd')}</div></button>)}
        </div>
      )}
    </div>
  )
}
