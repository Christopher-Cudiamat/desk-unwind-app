import type { Locale } from './i18n/locales'
import type { AppPlatform, TitleBarKind } from './platform'
import type { ThemePreference, ThemeState } from './theme'

/** Every IPC channel lives here. The preload bridge is the only thing that uses them in a renderer. */
export const IpcChannel = {
  themeGet: 'theme:get',
  themeSet: 'theme:set',
  themeChanged: 'theme:changed',
  languageGet: 'language:get',
  languageSet: 'language:set',
  languageChanged: 'language:changed',
} as const

/** Passed to each window at creation through `additionalArguments`, read synchronously by the preload. */
export const ARG_PREFIX = '--deskunwind-'
export const ARG_DARK = `${ARG_PREFIX}dark`
export const ARG_LANGUAGE = `${ARG_PREFIX}language=`

export type Unsubscribe = () => void

/** The typed bridge exposed as `window.deskUnwind`. Renderers display state and send commands. */
export interface DeskUnwindApi {
  platform: AppPlatform
  titleBar: TitleBarKind
  theme: {
    /** Dark mode at window creation, so the first paint uses the right colors. */
    initialDark: boolean
    get(): Promise<ThemeState>
    set(preference: ThemePreference): Promise<ThemeState>
    onChange(listener: (state: ThemeState) => void): Unsubscribe
  }
  language: {
    /** Saved (or OS) language at window creation, so the first render is already translated. */
    initial: Locale
    get(): Promise<Locale>
    set(language: Locale): Promise<Locale>
    onChange(listener: (language: Locale) => void): Unsubscribe
  }
}
