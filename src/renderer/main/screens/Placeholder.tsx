import type { ReactNode } from 'react'
import { Mascot, type MascotExpression } from '@renderer/shared/components/Mascot'
import { toneClasses } from '@renderer/shared/lib/tones'
import { cn } from '@renderer/shared/lib/cn'
import type { Tone } from '@shared/tone'

/** Temporary screen body until the real screen is built in its step. */
export function Placeholder({
  title,
  body,
  mood,
  tone,
  children,
}: {
  title: string
  body: string
  mood: MascotExpression
  tone: Tone
  children?: ReactNode
}) {
  return (
    <div className="panel-enter">
      <h1 className="text-2xl font-semibold text-fg">{title}</h1>
      <div className="mt-5 flex items-center gap-5 rounded-3xl border border-line bg-surface p-6 shadow-soft">
        <span
          className={cn(
            'flex size-20 shrink-0 items-center justify-center rounded-2xl',
            toneClasses[tone].soft,
          )}
        >
          <Mascot expression={mood} size={56} blink />
        </span>
        <p className="max-w-md text-pretty leading-relaxed text-muted">{body}</p>
      </div>
      {children}
    </div>
  )
}
