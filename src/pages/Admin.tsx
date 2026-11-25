import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import { supabase } from '../lib/supabase'
import { Wordmark } from '../components/Brand'
import { Icon } from '../components/Icon'

type ProfileRow = { id: string; email: string | null; first_name?: string | null; family_name?: string | null; full_name?: string | null; age?: number | null; city?: string | null; goal_level?: string | null; phone?: string | null; plan?: string | null }
type RequestRow = { id: string; user_id: string; payment_method: string; payment_reference: string; plan?: string | null; status: string; created_at: string; profile?: ProfileRow }

export default function AdminPage() {
  const { isAdmin, user, signOut } = useAuth()
  const [rows, setRows] = useState<RequestRow[]>([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const load = useCallback(async () => {
    if (!supabase || !isAdmin) return
    setLoading(true); setError('')
    let result = await supabase.from('access_requests').select('id,user_id,payment_method,payment_reference,plan,status,created_at').eq('status', filter).order('created_at', { ascending: false })
    // Keep the admin page usable when the deployed database is one migration behind.
    if (result.error?.code === '42703' || result.error?.message.includes('access_requests.plan')) {
      result = await supabase.from('access_requests').select('id,user_id,payment_method,payment_reference,status,created_at').eq('status', filter).order('created_at', { ascending: false })
    }
    if (result.error) { setError(result.error.message); setLoading(false); return }
    const requests = (result.data ?? []) as RequestRow[]
    if (!requests.length) { setRows([]); setLoading(false); return }
    let profiles = await supabase.from('profiles').select('id,email,first_name,family_name,full_name,age,city,goal_level,phone,plan').in('id', [...new Set(requests.map((r) => r.user_id))])
    if (profiles.error?.code === '42703') {
      profiles = await supabase.from('profiles').select('id,email').in('id', [...new Set(requests.map((r) => r.user_id))])
    }
    if (profiles.error) { setError(profiles.error.message); setLoading(false); return }
    const byId = new Map(((profiles.data ?? []) as ProfileRow[]).map((p) => [p.id, p]))
    setRows(requests.map((r) => ({ ...r, plan: (r.plan ?? byId.get(r.user_id)?.plan) === 'yearly' ? 'yearly' : 'monthly', profile: byId.get(r.user_id) })))
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
    <div className="admin-note"><Icon name="lock" size={16} /><span>القبول كيفعّل الدخول ديال الحساب فالحين. راجع التحويل قبل ما تقبل الطلب.</span></div></main></div>
}
