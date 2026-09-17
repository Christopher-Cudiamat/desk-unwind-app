import { app } from 'electron'
import Store from 'electron-store'
import { isLocale, localeFromSystem, type Locale } from '@shared/i18n/locales'
import { DEFAULT_THEME, isThemePreference, type ThemePreference } from '@shared/theme'

/** User settings. Break history lives in SQLite, never here. */
type Settings = {
  theme: ThemePreference
  /** Unset until the user picks one; until then we follow the OS language. */
  language?: Locale
}

const store = new Store<Settings>({
  name: 'settings',
  defaults: { theme: DEFAULT_THEME },
})

export const settings = {
  getTheme(): ThemePreference {
    const value = store.get('theme')
    return isThemePreference(value) ? value : DEFAULT_THEME
  },
  setTheme(theme: ThemePreference) {
    store.set('theme', theme)
  },

  /** Call after `app` is ready: `app.getLocale()` is only reliable then. */
  getLanguage(): Locale {
    const value = store.get('language')
    return isLocale(value) ? value : localeFromSystem(app.getLocale())
  },
  setLanguage(language: Locale) {
    store.set('language', language)
  },
}
