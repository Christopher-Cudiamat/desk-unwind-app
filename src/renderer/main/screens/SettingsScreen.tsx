import { useId, type ReactNode } from 'react'
import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { localeNames, locales } from '@shared/i18n/locales'
import { themePreferences, type ThemePreference } from '@shared/theme'
import { SegmentedControl } from '@renderer/shared/components/SegmentedControl'
import { useDictionary, useLanguage } from '@renderer/shared/i18n'
import { useTheme } from '@renderer/shared/theme'

const themeIcons: Record<ThemePreference, LucideIcon> = { dark: Moon, light: Sun, system: Monitor }

export function SettingsScreen() {
  const t = useDictionary()

  return (
    <div className="panel-enter">
      <h1 className="text-2xl font-semibold text-fg">{t.settings.title}</h1>

      <section className="mt-5 divide-y divide-line rounded-3xl border border-line bg-surface px-6 shadow-soft">
        <h2 className="py-4 text-sm font-semibold text-fg">{t.settings.appearance}</h2>
        <SettingRow title={t.settings.theme} hint={t.settings.themeHint}>
          {(labelId) => <ThemeSwitch labelledBy={labelId} />}
        </SettingRow>
        <SettingRow title={t.settings.language} hint={t.settings.languageHint}>
          {(labelId) => <LanguageSwitch labelledBy={labelId} />}
        </SettingRow>
      </section>

      <p className="mt-6 text-xs text-subtle">{t.app.disclaimer}</p>
    </div>
  )
}

function SettingRow({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: (labelId: string) => ReactNode
}) {
  const labelId = useId()
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div>
        <p id={labelId} className="font-medium text-fg">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-muted">{hint}</p>
      </div>
      {children(labelId)}
    </div>
  )
}

export function ThemeSwitch({ labelledBy }: { labelledBy: string }) {
  const t = useDictionary()
  const preference = useTheme((s) => s.preference)
  const setPreference = useTheme((s) => s.setPreference)
  const options = themePreferences.map((value) => ({
    value,
    label: t.settings.themes[value],
    icon: themeIcons[value],
  }))

  return (
    <SegmentedControl options={options} value={preference} onChange={setPreference} labelledBy={labelledBy} />
  )
}

function LanguageSwitch({ labelledBy }: { labelledBy: string }) {
  const language = useLanguage((s) => s.language)
  const setLanguage = useLanguage((s) => s.setLanguage)
  const options = locales.map((value) => ({ value, label: localeNames[value] }))

  return (
    <SegmentedControl options={options} value={language} onChange={setLanguage} labelledBy={labelledBy} />
  )
}
