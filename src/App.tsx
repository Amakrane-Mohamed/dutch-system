import { lazy, Suspense, useEffect, useState } from 'react'
import { useRoute } from './lib/router'
import { applyLang } from './lib/i18n'
import { defaultState, setTemporaryState, useStore } from './state/store'
import { AuthProvider, useAuth } from './state/auth'
import { Icon } from './components/Icon'
const Layout = lazy(() => import('./components/Layout').then((m) => ({ default: m.Layout })))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Learn = lazy(() => import('./pages/Learn'))
const Journey = lazy(() => import('./pages/Journey'))
const Tracks = lazy(() => import('./pages/Tracks'))
const Words = lazy(() => import('./pages/Words'))
const Exams = lazy(() => import('./pages/Exams'))
const ProgressPage = lazy(() => import('./pages/Progress'))
const Log = lazy(() => import('./pages/Log'))
const Resources = lazy(() => import('./pages/Resources'))
const Settings = lazy(() => import('./pages/Settings'))
const Landing = lazy(() => import('./pages/Landing'))
const AdminPage = lazy(() => import('./pages/Admin'))
const AccountPage = lazy(() => import('./pages/Account').then((m) => ({ default: m.AccountPage })))
const SignupPage = lazy(() => import('./pages/Account').then((m) => ({ default: m.AccountPage })))

function LockedAccessDialog() {
  const [open, setOpen] = useState(true)
  if (!open) return null
  const message = encodeURIComponent('سلام، تسجلت فـ RihlaDeutch وبغيت نعرف طريقة الخلاص وتفعيل فضاءات التعلّم.')
  return <div className="access-dialog-backdrop" role="presentation"><section className="access-dialog" role="dialog" aria-modal="true" aria-labelledby="access-dialog-title" dir="rtl">
    <button className="access-dialog-close" onClick={() => setOpen(false)} aria-label="سدّ الرسالة">×</button>
    <div className="access-dialog-lock"><Icon name="lock" size={25} /></div>
    <span className="eyebrow">مرحبا بك فـ رِحلة</span>
    <h2 id="access-dialog-title">حسابك واجد، وفضاءات التعلّم غادي يتفعّلو قريب</h2>
    <p>تقدر تدخل للمنصة دابا. تسنّى حتى يتاصل بيك الدعم باش يشرح ليك طريقة الخلاص ويفعّل ليك فضاءات التعلّم.</p>
    <a className="whatsapp-contact" href={`https://wa.me/212709319893?text=${message}`} target="_blank" rel="noreferrer">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.03 3.2A12.66 12.66 0 0 0 5.14 22.32L3.4 28.7l6.55-1.72A12.67 12.67 0 1 0 16.03 3.2Zm0 22.98c-1.93 0-3.82-.52-5.48-1.5l-.4-.24-3.89 1.02 1.04-3.79-.26-.42a10.27 10.27 0 1 1 8.99 4.93Zm5.64-7.69c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.69.16-.2.31-.79 1- .97 1.2-.18.2-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.64.14-.14.31-.36.46-.54.15-.18.2-.31.31-.51.1-.2.05-.39-.03-.54-.08-.16-.69-1.67-.95-2.29-.25-.6-.5-.52-.69-.53h-.59c-.2 0-.54.08-.82.39-.28.31-1.08 1.05-1.08 2.57s1.1 2.98 1.25 3.19c.15.2 2.17 3.32 5.25 4.65.73.31 1.3.5 1.74.64.73.23 1.39.2 1.91.12.58-.09 1.83-.75 2.09-1.48.26-.72.26-1.34.18-1.48-.08-.13-.28-.21-.59-.36Z"/></svg>
      راسل الدعم على واتساب
    </a>
    <button className="access-dialog-later" onClick={() => setOpen(false)}>ندخل للمنصة دابا</button>
  </section></div>
}

function DashboardScreenshotPreview() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const restore = setTemporaryState(defaultState())
    setReady(true)
    return restore
  }, [])
  if (!ready) return <div className="auth-loading" dir="rtl">كنوجدو معاينة لوحة التعلّم…</div>
  return <Layout route="/dashboard"><Dashboard /></Layout>
}

function AppRoutes() {
  const { user, access, isAdmin, ready } = useAuth()
  const route = useRoute()
  const lang = useStore((s) => s.settings.lang)
  const section = route.split('/')[1] ?? ''
  useEffect(() => { applyLang(lang); document.title = lang === 'ar' ? 'RihlaDeutch — الألمانية بالدارجة' : 'RihlaDeutch · Learn German through Darija' }, [lang])
  useEffect(() => { window.scrollTo(0, 0) }, [route])
  useEffect(() => {
    if (ready && user && access === 'active' && !isAdmin && section === 'resources') window.location.hash = '#/dashboard'
  }, [ready, user, access, isAdmin, section])
  useEffect(() => {
    if (ready && user && section === 'request-access') window.location.hash = '#/dashboard'
    else if (ready && user && !isAdmin && access !== 'active' && section && section !== 'dashboard') window.location.hash = '#/dashboard'
  }, [ready, user, access, isAdmin, section])
  const runner = /^\/learn\/(lesson\/[^/]+\/run|test|exam|drill)/.test(route)

  // Public, anonymized dashboard view used by the landing page's product preview.
  if (route === '/__preview/dashboard') return <DashboardScreenshotPreview />
  if (section === '') return <Landing />
  if (section === 'login') return <AccountPage />
  if (section === 'signup') return <SignupPage signup />
  if (!ready) return <div className="auth-loading" dir="rtl">جارٍ التحقق من حسابك…</div>
  if (!user) return <AccountPage />
  if (section === 'admin') return isAdmin ? <AdminPage /> : <div className="auth-loading" dir="rtl"><p>هاد الصفحة خاصة بمدير المنصة. حسابك ما عندوش صلاحية الإدارة.</p><a href={access === 'active' ? '#/dashboard' : '#/request-access'}>{access === 'active' ? 'رجع للتعلّم' : 'شوف حالة الطلب'}</a></div>
  if (!isAdmin && access !== 'active') return <Layout route="/dashboard"><Dashboard /><LockedAccessDialog /></Layout>
  if (section === 'resources' && !isAdmin) return <div className="auth-loading" dir="rtl">كنرجّعوك للوحة التعلّم…</div>

  const page = (() => {
    switch (section) {
      case 'dashboard': return <Dashboard />
      case 'learn': return <Learn route={route} />
      case 'journey': return <Journey route={route} />
      case 'tracks': return <Tracks />
      case 'words': return <Words />
      case 'exams': return <Exams />
      case 'progress': return <ProgressPage />
      case 'log': return <Log />
      case 'resources': return isAdmin ? <Resources /> : <Dashboard />
      case 'settings': return <Settings />
      default: return <p>404 · <a className="text-majorelle" href="#/dashboard">لوحة التعلّم</a></p>
    }
  })()
  return <Layout route={route} bare={runner}>{page}</Layout>
}

export default function App() {
  return <AuthProvider><Suspense fallback={<div className="auth-loading" dir="rtl">جارٍ فتح رِحلة…</div>}><AppRoutes /></Suspense></AuthProvider>
}
