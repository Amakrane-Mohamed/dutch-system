import { useState } from 'react'
import { SKILLS, TRACKS, type SkillKey } from '../content/data'
import { useT } from '../lib/i18n'
import { VideoCard } from '../components/VideoCard'
import { Card, De, PageHead, Speak, Tabs, Title, TxT } from '../components/ui'
import { Icon } from '../components/Icon'
import { useAuth } from '../state/auth'
import { AdminResourceLink } from '../components/AdminResourceLink'

export default function Tracks() {
  const { t, tx } = useT()
  const { isAdmin } = useAuth()
  const [k, setK] = useState<SkillKey>('sprechen')
  const tr = TRACKS.find((x) => x.key === k)!
  const meta = SKILLS[k]
  return (
    <div>
      <PageHead kicker={t('مسارات المهارات', 'Skill tracks')} title={t('المهارات الأربع: الطريقة', 'The four skills: the method')} de="Sprechen · Schreiben · Hören · Lesen"
        sub={isAdmin ? t('طرق مجرّبة يوصي بها متعلمون كثيرون، مع سلّم موارد لكل مستوى.', 'Proven methods and a resource ladder for each level.') : t('خطوات واضحة باش تطوّر المحادثة والكتابة والاستماع والقراية.', 'Clear steps to build speaking, writing, listening, and reading skills.')} />
      <Tabs className="mb-6" value={k} onChange={setK} items={TRACKS.map((x) => ({ key: x.key, label: <span className="flex items-center gap-2"><Icon name={SKILLS[x.key].icon} size={16} />{tx(x.title)}</span> }))} />
      <div className="mb-6 rounded-3xl p-6 ring-1" style={{ background: meta.color + '10', boxShadow: `inset 0 0 0 1px ${meta.color}30` }}>
        <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl text-paper" style={{ background: meta.color }}><Icon name={meta.icon} size={24} /></div><div><div className="text-xl font-bold">{tx(tr.title)}</div><div className="de display italic text-ink-3">{tr.de}</div></div></div>
        <p className="naskh mt-3 max-w-4xl text-[17px]"><TxT x={tr.intro} /></p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4 md:grid-cols-2">
          {tr.methods.map((m) => (
            <Card key={m.id}>
              <div className="mb-3 flex items-center justify-between gap-2"><div className="font-bold">{tx(m.title)}</div><span className="rounded-md px-2 py-0.5 text-xs font-bold text-paper" style={{ background: meta.color }}>{m.minutes} {t('د', 'min')}</span></div>
              <ol className="space-y-2 text-sm">{m.steps.map((s, i) => <li key={i} className="flex gap-2"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[10px] font-bold text-paper">{i + 1}</span><TxT x={s} /></li>)}</ol>
              <p className="mt-3 rounded-xl bg-sand/40 p-3 text-xs text-ink/80"><b>{t('لماذا؟', 'Why?')}</b> <TxT x={m.why} /></p>
              {isAdmin && m.res.length > 0 && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">{m.res.map((r) => <AdminResourceLink key={r} id={r} isAdmin={isAdmin} />)}</div>}
              {m.videos.length > 0 && <div className="mt-3 grid grid-cols-2 gap-2">{m.videos.slice(0, 2).map((v) => <VideoCard key={v} id={v} />)}</div>}
            </Card>
          ))}
          {tr.drills && (
            <Card className="md:col-span-2">
              <Title kicker={t('للناطقين بالعربية', 'For Arabic speakers')}>{t('أزواج النطق', 'Sound pairs')}</Title>
              <div className="grid gap-3 md:grid-cols-2">
                {tr.drills.map((d) => (
                  <div key={d.a} className="flex items-start gap-3 rounded-xl bg-paper p-3 ring-1 ring-sand">
                    <div className="flex shrink-0 flex-col gap-1"><Speak text={d.a} size={15} /><Speak text={d.b} size={15} /></div>
                    <div><div className="text-lg"><De className="font-bold">{d.a}</De> <span className="text-mute">/</span> <De className="font-bold">{d.b}</De> <span className="text-sm text-mute">{d.ar}</span></div><div className="text-sm text-ink/80"><TxT x={d.tip} /></div></div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {tr.lebenslauf && (
            <>
              <Card>
                <Title kicker="Lebenslauf">{t('بنية السيرة الذاتية الألمانية', 'German CV structure')}</Title>
                <ul className="space-y-2 text-sm">{tr.lebenslauf.map((x, i) => <li key={i} className="flex gap-2"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-zellige" /><TxT x={x} /></li>)}</ul>
              </Card>
              <Card>
                <Title kicker="Anschreiben">{t('نموذج رسالة الترشيح', 'Model cover letter')}</Title>
                <pre dir="ltr" lang="de" className="de max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-paper p-4 text-[13px] leading-relaxed ring-1 ring-sand scroll-thin">{tr.anschreiben}</pre>
              </Card>
            </>
          )}
          {tr.prompts && (
            <Card className="md:col-span-2">
              <Title kicker={t('اليوميات', 'Journal')}>{t('مواضيع الكتابة حسب المستوى', 'Writing prompts by level')}</Title>
              <div className="grid gap-4 md:grid-cols-4">{Object.entries(tr.prompts).map(([lv, ps]) => <div key={lv}><div className="mb-2 text-sm font-bold">{lv.toUpperCase()}</div><ul className="space-y-1.5 text-sm">{ps.map((p) => <li key={p} className="de rounded-lg bg-paper px-3 py-2 ring-1 ring-sand">{p}</li>)}</ul></div>)}</div>
            </Card>
          )}
        </div>
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Card>
            <Title kicker={t('السلّم', 'The ladder')}>{t('من A1 إلى B2', 'From A1 to B2')}</Title>
            <ol className="relative space-y-5 ps-6">
              <span className="absolute bottom-2 top-2 start-[7px] w-0.5 rounded bg-sand-2" />
              {tr.ladder.map((l) => (
                <li key={l.level} className="relative">
                  <span className="absolute -start-6 top-0.5 h-4 w-4 rounded-full ring-4 ring-paper-2" style={{ background: meta.color }} />
                  <div className="font-bold">{l.level}</div>
                  <ul className="mt-1 space-y-1 text-sm text-ink/80">{l.items.map((x, i) => <li key={i}>• <TxT x={x} /></li>)}</ul>
                  <div className="mt-1.5 text-xs font-semibold" style={{ color: meta.color }}>{t('الهدف', 'Goal')}: <TxT x={l.goal} /></div>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  )
}
