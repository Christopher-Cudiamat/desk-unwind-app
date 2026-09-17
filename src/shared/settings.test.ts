import { describe, expect, it } from 'vitest'
import { isThemePreference, resolveDark } from './theme'
import { titleBarKindFor, toAppPlatform } from './platform'
import { fill, localeFromSystem } from './i18n/locales'

describe('theme', () => {
  it('follows the system only when the preference is system', () => {
    expect(resolveDark('system', true)).toBe(true)
    expect(resolveDark('system', false)).toBe(false)
    expect(resolveDark('light', true)).toBe(false)
    expect(resolveDark('dark', false)).toBe(true)
  })

  it('rejects unknown preferences coming over IPC', () => {
    expect(isThemePreference('dark')).toBe(true)
    expect(isThemePreference('sepia')).toBe(false)
    expect(isThemePreference(undefined)).toBe(false)
  })
})

describe('platform', () => {
  it('maps each OS to its title bar style', () => {
    expect(titleBarKindFor(toAppPlatform('win32'))).toBe('overlay-right')
    expect(titleBarKindFor(toAppPlatform('darwin'))).toBe('inset-left')
    expect(titleBarKindFor(toAppPlatform('linux'))).toBe('native')
  })
})

describe('language', () => {
  it('maps OS locales to a supported language, falling back to English', () => {
    expect(localeFromSystem('it-IT')).toBe('it')
    expect(localeFromSystem('it')).toBe('it')
    expect(localeFromSystem('en-GB')).toBe('en')
    expect(localeFromSystem('fil-PH')).toBe('en')
  })

  it('fills placeholders and leaves unknown ones alone', () => {
    expect(fill('Next break in {minutes} min', { minutes: 12 })).toBe('Next break in 12 min')
    expect(fill('{missing}', {})).toBe('{missing}')
  })
})
