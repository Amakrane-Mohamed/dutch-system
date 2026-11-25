import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import { supabase } from '../lib/supabase'
import { Wordmark } from '../components/Brand'
import { Icon } from '../components/Icon'

type ProfileRow = { id: string; email: string | null; first_name?: string | null; family_name?: string | null; full_name?: string | null; age?: number | null; city?: string | null; goal_level?: string | null; phone?: string | null; plan?: string | null; is_admin?: boolean }
type RequestRow = { id: string; user_id: string; payment_method: string; payment_reference: string; plan?: string | null; status: string; created_at: string; profile?: ProfileRow }

export default function AdminPage() {
  const { isAdmin, user, signOut } = useAuth()
  const [rows, setRows] = useState<RequestRow[]>([])
  const [unapproved, setUnapproved] = useState<ProfileRow[]>([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const load = useCallback(async () => {
    if (!supabase || !isAdmin) return
    setLoading(true); setError('')
    const result = await supabase.from('access_requests').select('id,user_id,payment_method,payment_reference,plan,status,created_at').eq('status', filter).order('created_at', { ascending: false })
    let requestData = result.data as RequestRow[] | null
    let requestError = result.error
    // Keep the admin page usable when the deployed database is one migration behind.
    if (result.error?.code === '42703' || result.error?.message.includes('access_requests.plan')) {
      const fallback = await supabase.from('access_requests').select('id,user_id,payment_method,payment_reference,status,created_at').eq('status', filter).order('created_at', { ascending: false })
      requestData = fallback.data as RequestRow[] | null
      requestError = fallback.error
    }
    if (requestError) { setError(requestError.message); setLoading(false); return }
    const requests = requestData ?? []
    const profiles = await supabase.from('profiles').select('id,email,first_name,family_name,full_name,age,city,goal_level,phone,plan,is_admin')
    let profileData = profiles.data as ProfileRow[] | null
    let profileError = profiles.error
    if (profiles.error?.code === '42703') {
      const fallback = await supabase.from('profiles').select('id,email,is_admin')
      profileData = fallback.data as ProfileRow[] | null
      profileError = fallback.error
    }
    if (profileError) { setError(profileError.message); setLoading(false); return }
    const byId = new Map((profileData ?? []).map((p) => [p.id, p]))
    const [entitlements, existingRequests] = await Promise.all([
      supabase.from('entitlements').select('user_id').eq('active', true),
      supabase.from('access_requests').select('user_id'),
    ])
    if (entitlements.error || existingRequests.error) {
      setError(entitlements.error?.message ?? existingRequests.error?.message ?? 'تعذر تحميل الحسابات')
      setLoading(false)
      return
    }
    const activeIds = new Set((entitlements.data ?? []).map((entry) => entry.user_id))
    const requestUserIds = new Set((existingRequests.data ?? []).map((entry) => entry.user_id))
    setRows(requests.map((r) => ({ ...r, plan: (r.plan ?? byId.get(r.user_id)?.plan) === 'yearly' ? 'yearly' : 'monthly', profile: byId.get(r.user_id) })))
    setUnapproved((profileData ?? []).filter((profile) => !profile.is_admin && !activeIds.has(profile.id) && !requestUserIds.has(profile.id)))
    setLoading(false)
  }, [filter, isAdmin])
  useEffect(() => { void load() }, [load])

  const review = async (id: string, decision: 'approved' | 'rejected') => {
    if (!supabase) return
    setBusyId(id); setError('')
    const result = await supabase.rpc('review_rihla_access_request', { request_id: id, decision })
    setBusyId('')
    if (result.error) setError(result.error.message)
    else await load()
  }

  const activateAccount = async (id: string) => {
    if (!supabase) return
    setBusyId(`account:${id}`); setError('')
    const result = await supabase.rpc('grant_rihla_access', { target_user: id })
    setBusyId('')
    if (result.error) setError(result.error.message)
    else await load()
  }

  if (!isAdmin) return <div className="admin-lock" dir="rtl"><Icon name="lock" size={26} /><h1>هاد الصفحة غير لمدير المنصة</h1><p>تأكّد بلي الحساب ديالك عندو صلاحية الإدارة.</p><a className="btn btn-dark" href="#/dashboard">رجع للتعلّم</a></div>
  return <div className="admin-page" dir="rtl"><aside className="admin-sidebar"><a href="#/"><Wordmark dark /></a><div className="admin-menu-active"><Icon name="brief" size={18} /> تسيير الدخول</div><a className="admin-side-link" href="#/dashboard"><Icon name="book" size={18} /> شوف بحال المتعلّم</a><div className="admin-side-foot"><span className="admin-avatar">{user?.email?.[0]?.toUpperCase() ?? 'R'}</span><div><b>مدير رِحلة</b><small>{user?.email}</small></div></div></aside><main className="admin-main"><header className="admin-topbar"><div><span className="eyebrow">فضاء التسيير</span><h1>طلبات الدخول</h1></div><div className="admin-top-actions"><button className="icon-button" title="حدّث الطلبات" onClick={() => void load()}><Icon name="swap" size={18} /></button><button className="admin-signout" onClick={() => void signOut()}>خرج</button></div></header>
    <section className="admin-summary"><div><span>الطلبات اللي كيتراجعو</span><b>{filter === 'pending' ? rows.length : '—'}</b><small>تأكّد من التحويل قبل ما تفعّل الحساب</small></div><div className="summary-icon"><Icon name="ticket" size={20} /></div></section>
    <div className="requests-heading"><div><h2>الطلبات كاملين</h2><p>راجع معلومات التحويل، ومن بعد فعّل الدخول للحساب.</p></div><div className="filter-tabs">{[['pending','كيتراجع'],['approved','مفعّل'],['rejected','مرفوض']].map(([key,label])=><button key={key} className={filter===key?'selected':''} onClick={()=>setFilter(key)}>{label}</button>)}</div></div>
    {error && <div className="inline-alert" role="alert">{error}</div>}
    <section className="request-table">{loading ? <div className="table-empty">كنحمّلو الطلبات…</div> : !rows.length ? <div className="table-empty"><span className="empty-icon"><Icon name="check" size={22} /></span><b>ما كاين حتى طلب هنا</b><span>ملي شي متعلّم يصيفط طلب، غادي يبان هنا.</span></div> : <>{rows.map((row) => {
      const learner = row.profile
      const learnerName = learner?.full_name || [learner?.first_name, learner?.family_name].filter(Boolean).join(' ') || learner?.email || 'متعلّم جديد'
      const planLabel = row.plan === 'yearly' ? 'سنوي · 500 DH' : 'شهري · 100 DH'
      return <article className="request-row" key={row.id}>
        <div className="request-person"><span className="person-avatar">{learnerName[0]?.toUpperCase() || 'م'}</span><div><b>{learnerName}</b><small>{learner?.email} · {learner?.age ? `${learner.age} عام` : 'العمر غير مسجل'} · {learner?.city || 'المدينة غير مسجلة'} · الهدف {learner?.goal_level || '—'}</small><small dir="ltr">{learner?.phone || '—'}</small></div></div>
        <div className="request-payment"><span>الخطة وطريقة الخلاص</span><b>{planLabel}</b><small>{row.payment_method}</small></div>
        <div className="request-ref"><span>مرجع التحويل</span><b>{row.payment_reference}</b><small>تسيفط نهار {new Date(row.created_at).toLocaleDateString('ar-MA', { day: 'numeric', month: 'long', year: 'numeric' })}</small></div>
        <span className={`request-status status-${row.status}`}>{row.status === 'pending' ? 'كيتراجع' : row.status === 'approved' ? 'مفعّل' : 'مرفوض'}</span>
        {row.status === 'pending' && <div className="request-actions"><button className="approve-button" disabled={busyId===row.id} onClick={() => void review(row.id, 'approved')}><Icon name="check" size={16} /> قبل وفعّل</button><button className="reject-button" disabled={busyId===row.id} onClick={() => void review(row.id, 'rejected')}>رفض</button></div>}
      </article>
    })}</>}</section>
    <section style={{ marginTop: 34 }}><div className="requests-heading"><div><h2>حسابات تسجلات ومازال ما تفعّلاتش</h2><p>هاد الحسابات ما صيفطوش طلب تحويل. تأكّد من الخلاص مع المتعلّم قبل التفعيل.</p></div><b style={{ minWidth: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#fff4d2', color: '#826300', fontSize: 13 }}>{unapproved.length}</b></div>{loading ? <div className="table-empty">كنحمّلو الحسابات…</div> : !unapproved.length ? <div className="table-empty">ما كاين حتى حساب آخر خاصّو التفعيل.</div> : <div className="request-table">{unapproved.map((profile) => {
      const learnerName = profile.full_name || [profile.first_name, profile.family_name].filter(Boolean).join(' ') || profile.email || 'متعلّم جديد'
      const phoneDigits = profile.phone?.replace(/\D/g, '')
      const whatsappNumber = phoneDigits?.startsWith('0') ? `212${phoneDigits.slice(1)}` : phoneDigits
      const planLabel = profile.plan === 'yearly' ? 'سنوي · 500 DH' : 'شهري · 100 DH'
      const message = encodeURIComponent('سلام، كنأكدو وضعية التسجيل ديالك فـ RihlaDeutch.')
      return <article className="request-row" key={profile.id}>
        <div className="request-person"><span className="person-avatar">{learnerName[0]?.toUpperCase() || 'م'}</span><div><b>{learnerName}</b><small>{profile.email || 'بلا إيميل'} · {profile.age ? `${profile.age} عام` : 'العمر غير مسجل'} · {profile.city || 'المدينة غير مسجلة'}</small><small dir="ltr">{profile.phone || '—'}</small></div></div>
        <div className="request-payment"><span>الخطة</span><b>{planLabel}</b><small>الهدف {profile.goal_level || '—'}</small></div>
        {whatsappNumber && <a style={{ color: '#168b45', fontSize: 10, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }} href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer">تواصل عبر واتساب</a>}
        <button className="approve-button" disabled={busyId === `account:${profile.id}`} onClick={() => void activateAccount(profile.id)}><Icon name="check" size={16} /> فعّل الدخول</button>
      </article>
    })}</div>}</section>
    <div className="admin-note"><Icon name="lock" size={16} /><span>قبول طلب التحويل أو تفعيل الحساب كيفتح فضاءات التعلّم فالحين. راجع الخلاص قبل التفعيل.</span></div></main></div>
}
