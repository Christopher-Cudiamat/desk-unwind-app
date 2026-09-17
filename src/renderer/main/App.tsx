import { useEffect } from 'react'
import { useDictionary } from '@renderer/shared/i18n'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { Styleguide } from './dev/Styleguide'
import { Placeholder } from './screens/Placeholder'
import { SettingsScreen } from './screens/SettingsScreen'
import { useRoute } from './store/route'

export function App() {
  const route = useRoute((s) => s.route)
  const navigate = useRoute((s) => s.navigate)
  const t = useDictionary()

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'y') {
        navigate('dev/styleguide')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return (
    <div className="flex h-full flex-col bg-bg">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto px-8 py-7">
          <div key={route} className="mx-auto max-w-4xl">
            {route === 'home' && (
              <Placeholder title={t.home.greeting} body={t.home.placeholder} mood="happy" tone="mint" />
            )}
            {route === 'schedule' && (
              <Placeholder title={t.schedule.title} body={t.schedule.placeholder} mood="focused" tone="sky" />
            )}
            {route === 'stats' && (
              <Placeholder title={t.stats.title} body={t.stats.placeholder} mood="celebrating" tone="warm" />
            )}
            {route === 'settings' && <SettingsScreen />}
            {route === 'dev/styleguide' && <Styleguide />}
          </div>
        </main>
      </div>
    </div>
  )
}
