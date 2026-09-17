import type { IdleDetector, PresenceEvent } from '../types'

/** The slice of Electron's `powerMonitor` we use, so the detector can be tested without Electron. */
export interface PowerMonitorLike {
  getSystemIdleTime(): number
  on(event: string, listener: () => void): unknown
  removeListener(event: string, listener: () => void): unknown
}

const presenceEvents: Record<string, PresenceEvent> = {
  'lock-screen': 'lock',
  'unlock-screen': 'unlock',
  suspend: 'suspend',
  resume: 'resume',
}

/** Idle time and presence events from `powerMonitor`, which behaves the same on Windows and macOS. */
export function createPowerMonitorIdle(powerMonitor: PowerMonitorLike): IdleDetector & { dispose(): void } {
  const listeners = new Set<(event: PresenceEvent) => void>()

  const handlers = Object.entries(presenceEvents).map(([name, event]) => {
    const handler = () => {
      for (const listener of [...listeners]) {
        try {
          listener(event)
        } catch (error) {
          console.error(`[platform] ${event} listener failed`, error)
        }
      }
    }
    powerMonitor.on(name, handler)
    return [name, handler] as const
  })

  return {
    idleSeconds: () => Math.max(0, Math.floor(powerMonitor.getSystemIdleTime())),
    onPresence(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    dispose() {
      for (const [name, handler] of handlers) powerMonitor.removeListener(name, handler)
      listeners.clear()
    },
  }
}
