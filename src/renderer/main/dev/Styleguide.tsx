import type { ReactNode } from 'react'
import { ArrowLeft, Eye, Footprints, Hourglass } from 'lucide-react'
import { tones } from '@shared/tone'
import { Button, type ButtonSize, type ButtonVariant } from '@renderer/shared/components/Button'
import { Mascot, type MascotExpression } from '@renderer/shared/components/Mascot'
import { toneClasses } from '@renderer/shared/lib/tones'
import { cn } from '@renderer/shared/lib/cn'
import { ThemeSwitch } from '../screens/SettingsScreen'
import { useRoute } from '../store/route'

/* Hidden developer page: #/dev/styleguide (Ctrl/Cmd+Shift+Y in dev). Not translated on purpose. */

const colorTokens = [
  'bg',
  'surface',
  'surface-muted',
  'fg',
  'muted',
  'subtle',
  'line',
  'line-strong',
  'brand',
  'brand-deep',
  'brand-text',
  'brand-soft',
  'accent',
  'accent-deep',
  'accent-text',
  'accent-soft',
  'warm',
  'warm-text',
  'warm-soft',
  'tint-mint',
  'tint-sky',
  'tint-warm',
  'ink',
]

const expressions: { expression: MascotExpression; meaning: string }[] = [
  { expression: 'focused', meaning: 'Working, next break counting down' },
  { expression: 'break', meaning: 'During an eye or stretch break' },
  { expression: 'happy', meaning: 'Greeting, break accepted' },
  { expression: 'waiting', meaning: 'Smart Pause is holding a break' },
  { expression: 'refreshed', meaning: 'Break just completed' },
  { expression: 'celebrating', meaning: 'End of day, streak milestone' },
  { expression: 'sleepy', meaning: 'Paused, idle, outside work hours' },
  { expression: 'normal', meaning: 'Fallback' },
]

const toneUse = {
  mint: 'Eye breaks, on, progress',
  sky: 'Movement, longer resets',
  warm: 'Waiting, celebrations',
}
const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'ink']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']

export function Styleguide() {
  const navigate = useRoute((s) => s.navigate)

  return (
    <div className="panel-enter space-y-10 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="-ml-3" onClick={() => navigate('home')}>
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Button>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.02em] text-fg">Styleguide</h1>
          <p id="styleguide-theme" className="mt-1 text-muted">
            Tokens, type, buttons, tones and the mascot, straight from the site.
          </p>
        </div>
        <ThemeSwitch labelledBy="styleguide-theme" />
      </div>

      <Section title="Colors">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-3">
          {colorTokens.map((token) => (
            <div key={token} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div
                className="h-14 border-b border-line"
                style={{ background: token === 'ink' ? '#0f172a' : `var(--${token})` }}
              />
              <p className="selectable px-3 py-2 font-mono text-xs text-muted">{token}</p>
            </div>
          ))}
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="bg-brand-gradient h-14 border-b border-line" />
            <p className="px-3 py-2 font-mono text-xs text-muted">brand-gradient</p>
          </div>
        </div>
      </Section>

      <Section title="Type">
        <div className="space-y-3 rounded-3xl border border-line bg-surface p-6">
          <p className="font-display text-4xl font-semibold tracking-[-0.02em] text-fg">
            Set up before your coffee gets cold
          </p>
          <p className="text-lg font-semibold text-fg">Plus Jakarta Sans for the interface</p>
          <p className="leading-relaxed text-muted">
            A gentle desktop buddy that reminds you to rest your eyes and stretch, and politely waits when
            you're busy.
          </p>
          <p className="tabular text-3xl font-bold tracking-tight text-fg">12:07 · 0:20 · 1:11:11</p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="space-y-3 rounded-3xl border border-line bg-surface p-6">
          {variants.map((variant) => (
            <div
              key={variant}
              className={cn(
                'flex flex-wrap items-center gap-3 rounded-2xl p-2',
                variant === 'ink' && 'bg-brand',
              )}
            >
              {sizes.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {variant} {size}
                </Button>
              ))}
              <Button variant={variant} size="sm" disabled>
                disabled
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tones">
        <div className="grid gap-3 sm:grid-cols-3">
          {tones.map((tone) => {
            const classes = toneClasses[tone]
            const Icon = tone === 'mint' ? Eye : tone === 'sky' ? Footprints : Hourglass
            return (
              <div
                key={tone}
                className="rounded-2xl border border-line-strong bg-surface p-3.5 shadow-lifted"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-xl',
                      classes.soft,
                    )}
                  >
                    <Icon className={cn('size-5', classes.text)} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className={cn('text-sm font-semibold', classes.text)}>{tone}</p>
                    <p className="truncate text-xs text-muted">{toneUse[tone]}</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div className={cn('h-full w-2/3 rounded-full', classes.solid)} />
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Mascot">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
          {expressions.map(({ expression, meaning }) => (
            <div key={expression} className="rounded-2xl border border-line bg-surface p-4 text-center">
              <div className="mx-auto flex size-24 items-center justify-center rounded-2xl bg-tint-mint">
                <Mascot expression={expression} size={72} title={`Mascot, ${expression}`} blink />
              </div>
              <p className="mt-3 text-sm font-semibold text-fg">{expression}</p>
              <p className="mt-0.5 text-xs text-muted">{meaning}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Depth and motion">
        <div className="grid gap-4 sm:grid-cols-3">
          {(['shadow-soft', 'shadow-lifted', 'shadow-window'] as const).map((shadow) => (
            <div
              key={shadow}
              className={cn('rounded-3xl bg-surface p-6 text-sm font-semibold text-fg', shadow)}
            >
              {shadow}
            </div>
          ))}
          <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-6">
            <span className="breathe flex size-16 items-center justify-center rounded-full bg-tint-mint">
              <span className="size-8 rounded-full bg-brand" />
            </span>
            <p className="text-sm text-muted">.breathe</p>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-6">
            <span className="nudge-glow size-4 rounded-full border-2 border-brand bg-surface" />
            <p className="text-sm text-muted">.nudge-glow</p>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-subtle">{title}</h2>
      {children}
    </section>
  )
}
