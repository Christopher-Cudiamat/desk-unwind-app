export const themePreferences = ['dark', 'light', 'system'] as const
export type ThemePreference = (typeof themePreferences)[number]

/** What the renderer needs: the saved choice and whether dark colors are in effect right now. */
export type ThemeState = {
  preference: ThemePreference
  dark: boolean
}

/** Dark by default; people can switch to Light or follow the System. */
export const DEFAULT_THEME: ThemePreference = 'dark'

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (themePreferences as readonly string[]).includes(value)
}

export function resolveDark(preference: ThemePreference, systemDark: boolean): boolean {
  return preference === 'system' ? systemDark : preference === 'dark'
}
