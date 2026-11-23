import { lazy, Suspense, useEffect, useState } from 'react'
import { useRoute } from './lib/router'
import { applyLang } from './lib/i18n'
import { defaultState, setTemporaryState, useStore } from './state/store'
import { AuthProvider, useAuth } from './state/auth'
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
const AccessRequestPage = lazy(() => import('./pages/Account').then((m) => ({ default: m.AccessRequestPage })))

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
  const runner = /^\/learn\/(lesson\/[^/]+\/run|test|exam|drill)/.test(route)

  // Public, anonymized dashboard view used by the landing page's product preview.
  if (route === '/__preview/dashboard') return <DashboardScreenshotPreview />
  if (section === '') return <Landing />
  if (section === 'login') return <AccountPage />
  if (section === 'signup') return <SignupPage signup />
  if (!ready) return <div className="auth-loading" dir="rtl">جارٍ التحقق من حسابك…</div>
  if (!user) return <AccountPage />
  if (section === 'admin') return isAdmin ? <AdminPage /> : <div className="auth-loading" dir="rtl"><p>هاد الصفحة خاصة بمدير المنصة. حسابك ما عندوش صلاحية الإدارة.</p><a href={access === 'active' ? '#/dashboard' : '#/request-access'}>{access === 'active' ? 'رجع للتعلّم' : 'شوف حالة الطلب'}</a></div>
  if (section === 'request-access') return <AccessRequestPage />
  if (!isAdmin && access !== 'active') return <AccessRequestPage />
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
