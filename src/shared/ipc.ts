import type { Locale } from './i18n/locales'
import type {
  AppPlatform,
  CallState,
  FocusState,
  PlatformCapabilities,
  PresenceEvent,
  TitleBarKind,
} from './platform'
import type { ThemePreference, ThemeState } from './theme'

/** Every IPC channel lives here. The preload bridge is the only thing that uses them in a renderer. */
export const IpcChannel = {
  themeGet: 'theme:get',
  themeSet: 'theme:set',
  themeChanged: 'theme:changed',
  languageGet: 'language:get',
  languageSet: 'language:set',
  languageChanged: 'language:changed',
  platformCapabilities: 'platform:capabilities',
  /** Development builds only; the handler isn't registered when packaged. */
  devPlatformStatus: 'dev:platform-status',
} as const

/** Passed to each window at creation through `additionalArguments`, read synchronously by the preload. */
export const ARG_PREFIX = '--deskunwind-'
export const ARG_DARK = `${ARG_PREFIX}dark`
export const ARG_LANGUAGE = `${ARG_PREFIX}language=`

export type Unsubscribe = () => void

/** What the platform adapter sees right now, for the hidden styleguide page. Never stored. */
export interface DevPlatformStatus {
  platform: AppPlatform
  capabilities: PlatformCapabilities
  idleSeconds: number
  focus: FocusState
  call: CallState
  foregroundApp: string | null
  /** Presence events since launch, newest first. In memory only. */
  recentEvents: { event: PresenceEvent; at: number }[]
}

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
  /** What this OS can detect, so screens can hide or explain features ("Coming soon on Mac"). */
  capabilities(): Promise<PlatformCapabilities>
  dev: {
    /** Rejects in packaged builds. */
    platformStatus(): Promise<DevPlatformStatus>
  }
}
