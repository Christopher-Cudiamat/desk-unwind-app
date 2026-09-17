import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ink'
export type ButtonSize = 'sm' | 'md' | 'lg'

// Classes ported from the site's components/ui/Button.tsx.
const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background-color,box-shadow,transform,border-color,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 motion-safe:active:translate-y-px disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gradient text-ink shadow-[0_1px_0_rgb(255_255_255/0.35)_inset,0_6px_16px_-6px_rgb(29_138_214/0.45)] hover:shadow-[0_1px_0_rgb(255_255_255/0.35)_inset,0_10px_24px_-8px_rgb(29_138_214/0.5)] motion-safe:hover:-translate-y-px',
  secondary:
    'border border-line-strong bg-surface text-fg shadow-soft hover:border-brand-deep/40 hover:bg-surface-muted',
  ghost: 'text-fg hover:bg-surface-muted',
  /** Dark button for use on bright coloured panels. */
  ink: 'bg-ink text-white shadow-soft hover:bg-ink/85 motion-safe:hover:-translate-y-px',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-12 px-6 text-base',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className)
}

type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant; size?: ButtonSize }

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />
}
