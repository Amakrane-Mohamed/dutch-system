import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { supabase, hasSupabaseConfig } from '../lib/supabase'
import { useAuth } from '../state/auth'
import { LionMark, Wordmark } from '../components/Brand'
import { Icon } from '../components/Icon'
import { planKey, PLANS, type PlanKey } from '../content/plans'

export function AccountPage({ signup = false }: { signup?: boolean }) {
  const { user, access, isAdmin, ready } = useAuth()
  const [mode, setMode] = useState(signup ? 'signup' : 'login')
  const [firstName, setFirstName] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [age, setAge] = useState('')
  const [city, setCity] = useState('')
  const [goalLevel, setGoalLevel] = useState('B2')
  const [phone, setPhone] = useState('')
  const [plan, setPlan] = useState<PlanKey>('monthly')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => { setMode(signup ? 'signup' : 'login') }, [signup])

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage('')
    if (!supabase) { setMessage('زيد رابط Supabase والمفتاح العلني فـ .env.local باش يخدم التسجيل.'); return }
    setBusy(true)
    const result = mode === 'signup'
      ? await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: {
            first_name: firstName.trim(),
            family_name: familyName.trim(),
            full_name: `${firstName.trim()} ${familyName.trim()}`,
            age: Number(age),
            city: city.trim(),
            goal_level: goalLevel,
            phone: phone.trim(),
            plan,
          } },
        })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (result.error) { setMessage(result.error.message); return }
    if (mode === 'signup' && !result.data.session) setMessage('باقي غير تأكد الإيميل ديالك، ومن بعد دخل للحساب.')
    else window.location.hash = mode === 'signup' ? '#/request-access' : '#/dashboard'
  }

  return <div className="account-page" dir="rtl">
    <aside className="account-aside"><a href="#/"><Wordmark /></a><div className="account-aside-copy"><span className="eyebrow eyebrow-light">من أول كلمة حتى لأول حوار</span><h1>الألمانية غادي تولّي واضحة،<br /><em>درس مور درس.</em></h1><p>دخل معلوماتك واختار الهدف ديالك. منين يتأكد الخلاص، نحلّو ليك الدروس.</p><div className="account-aside-note"><span>„</span><div><b>Guten Tag, wie geht es dir?</b><small>نهارك مبروك، كيداير؟</small></div></div><div className="account-aside-visual"><LionMark size={94} /><div><b>يلا نبداو!</b><small>اختار المستوى اللي باغي توصل ليه</small></div><span>✓</span></div></div><span className="account-aside-footer">RIHLADEUTCH</span></aside>
    <main className="account-main"><a className="back-home" href="#/"><Icon name="chevron" size={16} /> الصفحة الرئيسية</a>
      <div className={`account-form-wrap ${mode === 'signup' ? 'signup-active' : ''}`}><a className="account-mobile-brand" href="#/"><Wordmark /></a><span className="eyebrow">{mode === 'signup' ? 'حساب جديد' : 'مرحبا رجعتي'}</span><h2>{mode === 'signup' ? 'بدا رحلتك' : 'دخل لحسابك'}</h2><p className="account-intro">{mode === 'signup' ? 'عمّر المعلومات واختار الخطة اللي مناسبة ليك.' : 'دخل بالإيميل وكلمة السر ديالك.'}</p>
        {!hasSupabaseConfig && <div className="inline-alert">الحسابات مازال ما خداماش. خاصنا رابط المشروع والمفتاح العلني من Supabase.</div>}
        {user && ready && <div className="signed-in-box"><b>راك داخل للحساب ديالك دابا</b><span>{user.email}</span><a href={isAdmin ? '#/admin' : access === 'active' ? '#/dashboard' : '#/request-access'} className="btn btn-dark">كمل</a></div>}
        {!user && <form className={`account-form ${mode === 'signup' ? 'signup-form' : ''}`} onSubmit={submit}>
          {mode === 'signup' && <div className="signup-fields">
            <label>الاسم الشخصي<input autoComplete="given-name" required maxLength={80} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="الاسم" /></label>
            <label>النسب<input autoComplete="family-name" required maxLength={80} value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="النسب" /></label>
            <label>العمر<input type="number" inputMode="numeric" min={13} max={100} required value={age} onChange={(e) => setAge(e.target.value)} placeholder="مثال: 24" /></label>
            <label>المدينة<input autoComplete="address-level2" required maxLength={100} value={city} onChange={(e) => setCity(e.target.value)} placeholder="فين ساكن؟" /></label>
            <label>رقم الهاتف<input type="tel" autoComplete="tel" required minLength={7} maxLength={24} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 6…" /></label>
            <label>المستوى اللي باغي توصل ليه<select required value={goalLevel} onChange={(e) => setGoalLevel(e.target.value)}><option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option></select></label>
          </div>}
          {mode === 'signup' && <fieldset className="signup-plan"><legend>اختار الخطة</legend><div className="plan-options">{Object.values(PLANS).map((option) => <label className={`plan-option ${plan === option.key ? 'selected' : ''}`} key={option.key}>
            <input type="radio" name="plan" value={option.key} checked={plan === option.key} onChange={() => setPlan(option.key)} />
            <span><b>{option.name}</b><strong>{option.price} DH</strong><small>لـ{option.period}</small></span>
            {option.key === 'yearly' && <i>أوفر</i>}
          </label>)}</div></fieldset>}
          <label>الإيميل<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" /></label>
          <label>كلمة السر<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="على الأقل 8 حروف" /></label>
          {message && <div className="inline-alert" role="alert">{message}</div>}
          <button className="btn btn-dark account-submit" disabled={busy}>{busy ? 'كنوجدو الحساب…' : mode === 'signup' ? 'دير الحساب' : 'دخول'}<Icon name="arrow" size={17} /></button>
          {mode === 'signup' && <p className="form-terms">من بعد التسجيل غادي تبقى الدروس مسدودة حتى نراجعو الخلاص.</p>}
        </form>}
        {!user && <div className="account-switch">{mode === 'signup' ? 'عندك حساب؟' : 'باقي ما عندكش حساب؟'} <button onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setMessage('') }}>{mode === 'signup' ? 'دخل لحسابك' : 'دير حساب'}</button></div>}
      </div>
      <small className="account-privacy">معلوماتك كيبانو غير ليك ولمدير المنصة.</small>
    </main>
  </div>
}

export function AccessRequestPage() {
  const { user, access, refreshAccess, signOut } = useAuth()
  const [method, setMethod] = useState('')
  const [reference, setReference] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const selectedPlan = planKey(user?.user_metadata?.plan)
  const plan = PLANS[selectedPlan]
  if (access === 'pending') return <AccessStatus title="طلبك وصل" body={`الدعم غادي يتاصل بيك باش يتأكد من الخلاص ديال الخطة ${plan.name}. من بعد كيفعّل المدير الدخول للدروس.`} detail={`${plan.price} DH · ${plan.period}`} />
  if (access === 'active') return <AccessStatus title="الحساب ديالك واجد" body="تفعّل الدخول ديالك. تقدر تبدا الدروس دابا." action={<a className="btn btn-dark" href="#/dashboard">سير للوحة التعلّم <Icon name="arrow" size={17} /></a>} />

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setMessage('')
    if (!supabase || !user) { setBusy(false); setMessage('دخل لحسابك باش تصيفط الطلب.'); return }
    const { error } = await supabase.from('access_requests').insert({ user_id: user.id, plan: selectedPlan, payment_method: method.trim(), payment_reference: reference.trim() })
    setBusy(false)
    if (error) setMessage(error.code === '23505' ? 'عندك طلب كيتراجع دابا. تسنّى الجواب ديالنا.' : error.message)
    else await refreshAccess()
  }

  return <div className="access-page" dir="rtl"><header className="access-header"><a href="#/"><Wordmark /></a><button className="text-link" onClick={() => void signOut()}>خرج من الحساب</button></header><main className="access-panel"><div className="access-icon"><Icon name="lock" size={24} /></div><span className="eyebrow">دروسك مسدودين دابا</span><h1>فعّل الحساب ديالك</h1><p>خلص الخطة اللي اخترتي، ومن بعد صيفط طريقة الخلاص والمرجع باش نراجعو الطلب.</p>
    <div className="selected-plan-card"><div><small>الخطة المختارة</small><b>{plan.name}</b></div><strong>{plan.price} DH <small>/ {plan.period}</small></strong></div>
    <div className="payment-note"><Icon name="lock" size={17} /><span>الخلاص كيدوز خارج الموقع. منين تصيفط الطلب، الدعم غادي يتاصل بيك باش يتأكد منو.</span></div>
    <form className="account-form" onSubmit={submit}><label>طريقة الخلاص<input required maxLength={80} value={method} onChange={(e) => setMethod(e.target.value)} placeholder="مثال: تحويل بنكي" /></label><label>مرجع التحويل<input required minLength={2} maxLength={500} value={reference} onChange={(e) => setReference(e.target.value)} placeholder="الرقم اللي فالإيصال" /></label>{message && <div className="inline-alert" role="alert">{message}</div>}<button className="btn btn-dark account-submit" disabled={busy}>{busy ? 'كنصيفطو الطلب…' : 'صيفط الطلب للمراجعة'}<Icon name="arrow" size={17} /></button></form>
    <div className="request-email">الطلب مربوط بالحساب <b>{user?.email}</b></div></main></div>
}

function AccessStatus({ title, body, action, detail }: { title: string; body: string; action?: ReactNode; detail?: string }) {
  const { signOut } = useAuth()
  return <div className="access-page" dir="rtl"><header className="access-header"><a href="#/"><Wordmark /></a><button className="text-link" onClick={() => void signOut()}>خرج من الحساب</button></header><main className="access-panel status-panel"><div className="access-icon"><Icon name="check" size={24} /></div><span className="eyebrow">حساب رِحلة</span><h1>{title}</h1><p>{body}</p>{detail && <div className="status-hint">{detail}</div>}{action}</main></div>
}
