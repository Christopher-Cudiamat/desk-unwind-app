import '@renderer/shared/styles/app.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initLanguage } from '@renderer/shared/i18n'
import { initTheme } from '@renderer/shared/theme'
import { App } from './App'

initTheme()
initLanguage()
document.documentElement.dataset['platform'] = window.deskUnwind.platform

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
