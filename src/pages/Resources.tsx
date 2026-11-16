import { useState } from 'react'
import { BUDGET, PITFALLS, RESOURCES, RES_TYPES, type ResType } from '../content/data'
import { useT } from '../lib/i18n'
import { cx } from '../lib/cx'
import { Card, Ext, PageHead, Pill, Title, TxT } from '../components/ui'

export default function Resources() {
  const { t, tx } = useT()
  const [type, setType] = useState<ResType | 'all'>('all')
  const list = RESOURCES.filter((r) => type === 'all' || r.type === type)
  return (
    <div>
      <PageHead kicker={t('مختارة ومُتحقَّق منها', 'Curated and verified')} title={t('الموارد', 'Resources')} de="Die besten Quellen"
        sub={t('اخترنا الأفضل تقييمًا فقط (r/German، مجتمعات المتعلمين العرب، المراجعات). كل الروابط فُحصت يوم 11 نوفمبر 2026.', 'Only the best-rated (r/German, Arabic learner communities, reviews). All links checked on 11 Nov 2026.')} />
      <div className="mb-6 flex flex-wrap gap-1.5">
        {[{ key: 'all' as const, label: { ar: 'الكل', en: 'All' } }, ...RES_TYPES].map((x) => <button key={x.key} onClick={() => setType(x.key)} className={cx('rounded-full px-3.5 py-1.5 text-sm font-semibold', type === x.key ? 'bg-ink text-paper' : 'bg-sand/60 hover:bg-sand')}>{tx(x.label)}</button>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <Pill color="#33437A">{tx(RES_TYPES.find((x) => x.key === r.type)!.label)}</Pill>
              <Pill color="#12756B">{r.level}</Pill>
              {r.primary && <Pill color="#B57F12">{t('أساسي', 'Core')}</Pill>}
              {r.arabic && <Pill color="#C8553D">{t('بالعربية', 'Arabic')}</Pill>}
              {r.optional && <Pill color="#6B6455">{t('اختياري', 'Optional')}</Pill>}
            </div>
            <div className="de text-lg font-bold">{r.name}</div>
            <p className="mt-1 flex-1 text-sm text-ink/80"><TxT x={r.why} /></p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-sand pt-3 text-sm">
              <span className="text-mute">{tx(r.cost)}</span>
              <div className="flex flex-wrap gap-3">{r.urls.slice(0, 3).map((u, i) => <Ext key={u} href={u}>{i === 0 ? t('افتح', 'Open') : `${i + 1}`}</Ext>)}</div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <Title kicker={t('للناطقين بالعربية', 'For Arabic speakers')}>{t('أخطاء شائعة وحلولها', 'Common pitfalls and fixes')}</Title>
          <div className="space-y-3">{PITFALLS.map((p, i) => <div key={i} className="rounded-xl bg-paper p-3 ring-1 ring-sand text-sm"><div className="font-bold"><TxT x={p.pitfall} /></div><div className="mt-1 text-mute"><TxT x={p.why} /></div><div className="mt-1"><b className="text-zellige">{t('الحل', 'Fix')}:</b> <TxT x={p.fix} /></div></div>)}</div>
        </Card>
        <Card>
          <Title kicker={t('الميزانية', 'Budget')}>{t('كم تكلف الرحلة؟', 'What does it cost?')}</Title>
          <table className="w-full text-sm"><tbody>{BUDGET.map((b, i) => <tr key={i} className="border-b border-sand last:border-0"><td className="py-2.5 pe-3"><TxT x={b.item} /></td><td className="de py-2.5 text-end font-semibold whitespace-nowrap">{b.cost}</td></tr>)}</tbody></table>
        </Card>
      </div>
    </div>
  )
}
