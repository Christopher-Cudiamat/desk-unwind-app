import type { KeyboardEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../lib/cn'

export type SegmentedOption<T extends string> = { value: T; label: string; icon?: LucideIcon }

/** A radio group drawn as segments. Arrow keys move and select, like a native radio group. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  labelledBy,
}: {
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  labelledBy: string
}) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    const back = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
    if (!forward && !back) return
    event.preventDefault()
    const index = options.findIndex((option) => option.value === value)
    const next = (index + (forward ? 1 : -1) + options.length) % options.length
    onChange(options[next]!.value)
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')
    buttons[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
      className="inline-flex gap-1 rounded-xl border border-line bg-surface-muted p-1"
    >
      {options.map(({ value: option, label, icon: Icon }) => {
        const selected = option === value
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors duration-200',
              selected ? 'bg-surface text-fg shadow-soft' : 'text-muted hover:text-fg',
            )}
          >
            {Icon && <Icon className="size-3.5" aria-hidden />}
            {label}
          </button>
        )
      })}
    </div>
  )
}
