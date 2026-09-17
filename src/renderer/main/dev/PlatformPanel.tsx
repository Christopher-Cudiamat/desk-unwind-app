import { useEffect, useState } from 'react'
import { Camera, Lock, LockOpen, Maximize, Moon, Shield, Sun, Timer, type LucideIcon } from 'lucide-react'
import type { DevPlatformStatus } from '@shared/ipc'
import type { PresenceEvent } from '@shared/platform'
import { Mascot } from '@renderer/shared/components/Mascot'
import { cn } from '@renderer/shared/lib/cn'

/* Dev only: what the platform adapter sees, refreshed every second. Display only, never used for timing. */

const AWAY_AFTER_SECONDS = 60

const eventDisplay: Record<PresenceEvent, { label: string; icon: LucideIcon }> = {
  lock: { label: 'Screen locked', icon: Lock },
  unlock: { label: 'Screen unlocked', icon: LockOpen },
  suspend: { label: 'Went to sleep', icon: Moon },
  resume: { label: 'Woke up', icon: Sun },
}

function formatIdle(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = String(seconds % 60).padStart(2, '0')
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`
}

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
})

export function PlatformPanel() {
  const [status, setStatus] = useState<DevPlatformStatus | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const refresh = () =>
      window.deskUnwind.dev.platformStatus().then(
        (next) => !cancelled && setStatus(next),
        () => !cancelled && setFailed(true),
      )
    void refresh()
    const id = window.setInterval(refresh, 1000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  if (failed) {
    return <p className="text-sm text-muted">Platform status is only available in development.</p>
  }
  if (!status) {
    return (
      <div className="h-56 motion-safe:animate-pulse rounded-3xl border border-line bg-surface" aria-hidden />
    )
  }

  const away = status.idleSeconds >= AWAY_AFTER_SECONDS
  const lockKeys = status.platform === 'darwin' ? 'Ctrl + Cmd + Q' : 'Win + L'
  const { capabilities } = status

  const detectors: { label: string; icon: LucideIcon; on: boolean; reading: string }[] = [
    { label: 'Idle, lock and sleep', icon: Timer, on: true, reading: `${status.idleSeconds}s idle` },
    {
      label: 'Fullscreen and Focus Assist',
      icon: Maximize,
      on: capabilities.fullscreenDetection,
      reading: status.focus,
    },
    { label: 'Calls (mic or camera)', icon: Camera, on: capabilities.callDetection, reading: status.call },
    {
      label: 'Protected apps',
      icon: Shield,
      on: capabilities.protectedApps,
      reading: status.foregroundApp ?? 'unknown',
    },
  ]

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col rounded-3xl border border-line bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted">Idle for</p>
            <p className="tabular mt-1 text-5xl font-bold tracking-tight text-fg">
              {formatIdle(status.idleSeconds)}
            </p>
          </div>
          <div
            className={cn(
              'flex size-20 shrink-0 items-center justify-center rounded-2xl motion-safe:transition-colors motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',
              away ? 'bg-tint-warm' : 'bg-tint-mint',
            )}
          >
            <Mascot expression={away ? 'sleepy' : 'focused'} size={60} blink={!away} />
          </div>
        </div>
        <p
          className={cn(
            'mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            away ? 'bg-warm-soft text-warm-text' : 'bg-brand-soft text-brand-text',
          )}
        >
          <span className={cn('size-1.5 rounded-full', away ? 'bg-warm' : 'bg-brand')} />
          {away ? 'Stepped away' : 'At the desk'}
        </p>
        <p className="mt-auto pt-5 text-xs leading-relaxed text-muted">
          Counts from your last key press or mouse move, system-wide. Nothing about what you type is read.
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-2">
        <ul className="divide-y divide-line">
          {detectors.map(({ label, icon: Icon, on, reading }) => (
            <li key={label} className="flex items-center gap-3 px-4 py-3">
              <span
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-xl',
                  on ? 'bg-tint-mint text-brand-text' : 'bg-surface-muted text-subtle',
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-fg">{label}</p>
                <p className="tabular truncate font-mono text-xs text-muted">{reading}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                  on ? 'bg-brand-soft text-brand-text' : 'bg-surface-muted text-muted',
                )}
              >
                {on ? 'Working' : 'Not yet'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-6 lg:col-span-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-fg">Lock, unlock, sleep and wake</p>
          <p className="text-xs text-muted">Kept in memory while the app runs, never saved</p>
        </div>
        {status.recentEvents.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-surface-muted px-4 py-5 text-center text-sm text-muted">
            Nothing yet. Lock your screen with{' '}
            <kbd className="rounded-md border border-line-strong bg-surface px-1.5 py-0.5 font-sans text-xs font-semibold text-fg">
              {lockKeys}
            </kbd>{' '}
            and come back.
          </p>
        ) : (
          <ol className="mt-3 space-y-1">
            {status.recentEvents.map(({ event, at }, index) => {
              const { label, icon: Icon } = eventDisplay[event]
              const sleeping = event === 'lock' || event === 'suspend'
              return (
                <li key={`${at}-${index}`} className="flex items-center gap-3 rounded-xl px-2 py-1.5">
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg',
                      sleeping ? 'bg-tint-sky text-accent-text' : 'bg-tint-mint text-brand-text',
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="flex-1 text-sm text-fg">{label}</span>
                  <time className="tabular text-xs text-muted" dateTime={new Date(at).toISOString()}>
                    {timeFormat.format(at)}
                  </time>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </div>
  )
}
