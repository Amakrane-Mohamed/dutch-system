import { NOUNS, WORDS, bare } from '../content/vocab'
import { LESSONS, type Exercise, type T } from '../content/data'
import { shuffle } from './text'

export const DRILLS: { id: string; title: T; desc: T; icon: string }[] = [
  { id: 'article', title: { ar: 'تمرين der / die / das', en: 'der / die / das drill' }, desc: { ar: '20 اسمًا عشوائيًا. العربية فيها أداة واحدة؛ هذا التمرين يبني العادة الألمانية.', en: '20 random nouns. Arabic has one article; this builds the German habit.' }, icon: 'khatam' },
  { id: 'arabic', title: { ar: 'من العربية إلى الألمانية', en: 'Arabic → German' }, desc: { ar: '15 كلمة: اختر الكلمة الألمانية مع أداتها.', en: '15 words: pick the German word with its article.' }, icon: 'swap' },
  { id: 'meaning', title: { ar: 'معنى الكلمة', en: 'Word meaning' }, desc: { ar: '15 كلمة ألمانية: اختر المعنى بالعربية.', en: '15 German words: pick the meaning.' }, icon: 'cards' },
  { id: 'order', title: { ar: 'ترتيب الجملة', en: 'Word order builder' }, desc: { ar: 'كل جمل الترتيب من الدروس: الفعل في الموضع الثاني!', en: 'All sentence-building items: verb in position 2!' }, icon: 'route' },
  { id: 'mixed', title: { ar: 'مراجعة مختلطة', en: 'Mixed review' }, desc: { ar: '15 تمرينًا عشوائيًا من كل الدروس: مراجعة الأحد.', en: '15 random exercises from all lessons: the Sunday review.' }, icon: 'shuffle' },
]

export function buildDrill(id: string, seed = Math.random()): Exercise[] {
  if (id === 'article') {
    return shuffle(NOUNS, seed).slice(0, 20)
      .map((w) => ({ type: 'article', word: bare(w), article: w.article as 'der' | 'die' | 'das', mean: { ar: w.ar, en: w.en }, explain: { ar: `${w.de} = ${w.ar}`, en: `${w.de} = ${w.en}` } }))
  }
  if (id === 'meaning' || id === 'arabic') {
    const pool = shuffle(WORDS.filter((w) => w.topic !== 'numbers'), seed).slice(0, 15)
    return pool.map((w) => {
      const others = shuffle(WORDS.filter((x) => x.id !== w.id && x.topic === w.topic && x.ar !== w.ar), seed).slice(0, 3)
      if (id === 'meaning') return { type: 'mc', q: { ar: `ما معنى «${w.de}»؟`, en: `What does “${w.de}” mean?` }, options: [{ ar: w.ar, en: w.en }, ...others.map((o) => ({ ar: o.ar, en: o.en }))], answer: { ar: w.ar, en: w.en }, explain: { ar: `${w.de} = ${w.ar}`, en: `${w.de} = ${w.en}` } }
      return { type: 'mc', q: { ar: `${w.ar} = ؟`, en: `${w.en} = ?` }, options: [w.de, ...others.map((o) => o.de)], answer: w.de, explain: { ar: `${w.de} = ${w.ar}`, en: `${w.de} = ${w.en}` } }
    })
  }
  if (id === 'order') return shuffle(LESSONS.flatMap((l) => l.exercises.filter((e) => e.type === 'order')), seed)
  return shuffle(LESSONS.flatMap((l) => l.exercises), seed).slice(0, 15)
}
