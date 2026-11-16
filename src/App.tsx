import { useEffect } from 'react'
import { useRoute } from './lib/router'
import { applyLang } from './lib/i18n'
import { useStore } from './state/store'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import Learn from './pages/Learn'
import Journey from './pages/Journey'
import Tracks from './pages/Tracks'
import Words from './pages/Words'
import Exams from './pages/Exams'
import ProgressPage from './pages/Progress'
import Log from './pages/Log'
import Resources from './pages/Resources'
import Settings from './pages/Settings'

export default function App() {
  const route = useRoute()
  const lang = useStore((s) => s.settings.lang)
  const section = route.split('/')[1] ?? ''
  useEffect(() => { applyLang(lang); document.title = lang === 'ar' ? 'رحلة · Rihla — الألمانية من الصفر إلى B2' : 'Rihla · German from zero to B2' }, [lang])
  useEffect(() => { window.scrollTo(0, 0) }, [route])
  const runner = /^\/learn\/(lesson\/[^/]+\/run|test|exam|drill)/.test(route)
  const page = (() => {
    switch (section) {
      case '': return <Dashboard />
      case 'learn': return <Learn route={route} />
      case 'journey': return <Journey route={route} />
      case 'tracks': return <Tracks />
      case 'words': return <Words />
      case 'exams': return <Exams />
      case 'progress': return <ProgressPage />
      case 'log': return <Log />
      case 'resources': return <Resources />
      case 'settings': return <Settings />
      default: return <p>404 · <a className="text-majorelle" href="#/">Home</a></p>
    }
  })()
  return <Layout route={route} bare={runner}>{page}</Layout>
}
