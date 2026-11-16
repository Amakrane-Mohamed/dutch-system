import { useEffect, useState } from 'react'
import { germanVoices, onVoicesChanged } from '../lib/speech'
import { useT } from '../lib/i18n'
import { KEY, defaultState, getState, migrate, replaceState, setState, useStore, type Settings as S } from '../state/store'
import { Button, Card, PageHead, Title, say } from '../components/ui'
import { Icon } from '../components/Icon'
import { NAV } from '../lib/nav'

export default function Settings() {
  const { t, tx } = useT()
  const st = useStore((s) => s.settings)
  const [voices, setVoices] = useState(germanVoices())
  useEffect(() => onVoicesChanged(() => setVoices(germanVoices())), [])
  const set = <K extends keyof S>(k: K, v: S[K]) => setState((s) => ({ ...s, settings: { ...s.settings, [k]: v } }))
  return (
    <div>
      <PageHead kicker={t('الإعدادات', 'Settings')} title={t('الإعدادات', 'Settings')} de="Einstellungen" />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <Title>{t('اللغة والصوت', 'Language and voice')}</Title>
          <div className="mb-4 flex gap-2">
            {(['ar', 'en'] as const).map((l) => <button key={l} onClick={() => set('lang', l)} className={`flex-1 rounded-xl py-3 text-sm font-bold ring-1 ${st.lang === l ? 'bg-ink text-paper ring-ink' : 'bg-paper ring-sand-2'}`}>{l === 'ar' ? 'العربية (افتراضي)' : 'English'}</button>)}
          </div>
          <label className="block text-sm"><span className="mb-1 block text-mute">{t('الصوت الألماني', 'German voice')}</span>
            <select value={st.voiceURI ?? ''} onChange={(e) => set('voiceURI', e.target.value || undefined)} className="w-full rounded-xl bg-paper px-3 py-2 ring-1 ring-sand-2">
              <option value="">{t('تلقائي (de-DE)', 'Automatic (de-DE)')}</option>
              {voices.map((v) => <option key={v.voiceURI} value={v.voiceURI}>{v.name} · {v.lang}</option>)}
            </select>
          </label>
          <label className="mt-3 block text-sm"><span className="mb-1 block text-mute">{t('سرعة النطق', 'Speech rate')}: {st.rate.toFixed(2)}</span><input type="range" min="0.5" max="1.2" step="0.05" value={st.rate} onChange={(e) => set('rate', Number(e.target.value))} className="w-full accent-[#E3A72F]" /></label>
          <Button variant="ghost" className="mt-2" onClick={() => say('Hallo Mohamed! Willkommen bei Rihla.')}><Icon name="volume" size={16} />{t('جرّب الصوت', 'Test voice')}</Button>
          {voices.length === 0 && <p className="mt-2 text-xs text-terra">{t('لا يوجد صوت ألماني على هذا الجهاز. ثبّت صوت German في إعدادات النظام.', 'No German voice on this device. Install a German voice in system settings.')}</p>}
        </Card>
        <Card>
          <Title>{t('الأهداف واللعب', 'Goals and game')}</Title>
          <label className="block text-sm"><span className="mb-1 block text-mute">{t('هدف XP اليومي', 'Daily XP goal')}</span><div className="flex gap-2">{[30, 60, 100, 150].map((v) => <button key={v} onClick={() => set('dailyXp', v)} className={`flex-1 rounded-xl py-2 text-sm font-semibold ring-1 ${st.dailyXp === v ? 'bg-saffron ring-saffron' : 'bg-paper ring-sand-2'}`}>{v}</button>)}</div></label>
          <label className="mt-3 block text-sm"><span className="mb-1 block text-mute">{t('بطاقات جديدة يوميًا', 'New cards per day')}</span><input type="number" min="0" max="60" value={st.newPerDay} onChange={(e) => set('newPerDay', Number(e.target.value))} className="w-28 rounded-xl bg-paper px-3 py-2 ring-1 ring-sand-2" /></label>
          <label className="mt-3 block text-sm"><span className="mb-1 block text-mute">{t('تاريخ امتحان B1', 'B1 exam date')}</span><input type="date" value={st.examDate} onChange={(e) => set('examDate', e.target.value)} className="rounded-xl bg-paper px-3 py-2 ring-1 ring-sand-2" /></label>
          <div className="mt-3 divide-y divide-sand">
            <Toggle st={st} set={set} k="showDarija" label={t('أظهر أمثلة بالدارجة', 'Show Darija examples')} />
            <Toggle st={st} set={set} k="sound" label={t('أصوات التفاعل', 'Feedback sounds')} />
            <Toggle st={st} set={set} k="hearts" label={t('محاولات محدودة (5) في الدروس', 'Limited attempts (5) in lessons')} />
            <Toggle st={st} set={set} k="reverse" label={t('البطاقات: من العربية إلى الألمانية', 'Cards: Arabic → German')} />
            <Toggle st={st} set={set} k="unlockAll" label={t('افتح كل المحطات', 'Unlock all stops')} />
          </div>
        </Card>
        <Card>
          <Title>{t('النسخ الاحتياطي', 'Backup')}</Title>
          <p className="mb-3 text-sm text-mute">{t('كل بياناتك محفوظة في هذا المتصفح فقط. صدّرها بانتظام.', 'All your data lives in this browser only. Export it regularly.')}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { const b = new Blob([JSON.stringify(getState(), null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `rihla-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click() }}><Icon name="arrow" size={16} className="rotate-90" />{t('تصدير', 'Export')}</Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-sand/60 px-4 py-2.5 text-sm font-semibold hover:bg-sand">{t('استيراد', 'Import')}<input type="file" accept="application/json" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; try { replaceState(migrate(JSON.parse(await f.text()))) } catch (err) { alert(String(err)) } }} /></label>
            <Button variant="danger" onClick={() => { if (confirm(t('حذف كل التقدم؟', 'Delete all progress?'))) { localStorage.removeItem(KEY); replaceState(defaultState()) } }}>{t('إعادة ضبط', 'Reset')}</Button>
          </div>
        </Card>
        <Card className="lg:hidden">
          <Title>{t('كل الصفحات', 'All pages')}</Title>
          <ul className="grid grid-cols-2 gap-2">{NAV.map((n) => <li key={n.path}><a href={`#${n.path}`} className="flex items-center gap-2 rounded-xl bg-paper px-3 py-2.5 text-sm ring-1 ring-sand"><Icon name={n.icon} size={16} />{tx(n.label)}</a></li>)}</ul>
        </Card>
        <Card>
          <Title>{t('عن رحلة', 'About Rihla')}</Title>
          <p className="text-sm text-mute">{t('رحلة · Rihla: نظام شخصي لتعلم الألمانية من الصفر إلى B2 بالعربية، من أجل Ausbildung كـ Fachinformatiker für Anwendungsentwicklung في ألمانيا. المحتوى مولَّد من scripts/content/build.py، والخطة الكاملة في german-plan.md.', 'Rihla: a personal system to learn German from zero to B2 through Arabic, for an Ausbildung as Fachinformatiker für Anwendungsentwicklung. Content is generated by scripts/content/build.py; the full plan is in german-plan.md.')}</p>
        </Card>
      </div>
    </div>
  )
}

type TKey = 'hearts' | 'sound' | 'unlockAll' | 'reverse' | 'showDarija'
function Toggle({ k, label, st, set }: { k: TKey; label: string; st: S; set: (k: TKey, v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 py-2.5 text-sm"><span>{label}</span>
      <button role="switch" aria-checked={st[k]} onClick={() => set(k, !st[k])} className={`relative h-6 w-11 rounded-full transition ${st[k] ? 'bg-zellige' : 'bg-sand-2'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-all ${st[k] ? 'start-[22px]' : 'start-0.5'}`} /></button>
    </label>
  )
}
