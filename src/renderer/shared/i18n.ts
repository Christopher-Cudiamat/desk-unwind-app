import { create } from 'zustand'
import { dictionaries, type Dictionary } from '@shared/i18n/dictionaries'
import { intlLocale, type Locale } from '@shared/i18n/locales'

type LanguageStore = {
  language: Locale
  setLanguage: (language: Locale) => void
}

/** Mirrors the saved language. Main owns the setting and tells every window when it changes. */
export const useLanguage = create<LanguageStore>((set) => ({
  language: window.deskUnwind.language.initial,
  setLanguage: (language) => {
    set({ language })
    void window.deskUnwind.language.set(language)
  },
}))

export function useDictionary(): Dictionary {
  return dictionaries[useLanguage((s) => s.language)]
}

/** BCP 47 tag for `Intl` formatting in the current language. */
export function useIntlLocale(): string {
  return intlLocale[useLanguage((s) => s.language)]
}

/** Call once per window, before the first render. */
export function initLanguage() {
  const bridge = window.deskUnwind.language
  const apply = (language: Locale) => {
    document.documentElement.lang = language
    useLanguage.setState({ language })
  }
  apply(bridge.initial)
  bridge.onChange(apply)
  void bridge.get().then(apply)
}
