export const locales = ['en', 'it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Shown in each language's own name, so people can always find theirs. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
}

/** BCP 47 tags for Intl formatting (dates, times, prices). */
export const intlLocale: Record<Locale, string> = {
  en: 'en-US',
  it: 'it-IT',
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

/** Maps an OS locale like "it-IT" or "en-GB" to a supported language. */
export function localeFromSystem(tag: string): Locale {
  const base = tag.toLowerCase().split(/[-_]/)[0]
  return isLocale(base) ? base : defaultLocale
}

/** Fills "{name}" placeholders: fill("Next break in {minutes} min", { minutes: 12 }). */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}
