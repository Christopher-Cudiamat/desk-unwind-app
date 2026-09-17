import type { Locale } from './locales'
import { en, type Dictionary } from './en'
import { it } from './it'

export type { Dictionary }

export const dictionaries: Record<Locale, Dictionary> = { en, it }
