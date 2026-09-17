import { noCapabilities } from '../common/unavailable'
import type {
  AppPlatform,
  CallState,
  FocusState,
  PlatformAdapter,
  PlatformCapabilities,
  PresenceEvent,
} from '../types'

/** A scriptable adapter for tests: set what the "OS" reports, then fire presence events. */
export interface FakePlatformAdapter extends PlatformAdapter {
  setIdleSeconds(seconds: number): void
  /** Adds idle time, like the user stepping away. */
  advanceIdle(seconds: number): void
  /** Resets idle time to zero, like a key press. */
  touch(): void
  emit(event: PresenceEvent): void
  setFocus(state: FocusState): void
  setCall(state: CallState): void
  setForegroundApp(id: string | null): void
  readonly listenerCount: number
  readonly disposed: boolean
}

export function createFakePlatformAdapter(
  options: { platform?: AppPlatform; capabilities?: Partial<PlatformCapabilities> } = {},
): FakePlatformAdapter {
  const platform = options.platform ?? 'win32'
  const listeners = new Set<(event: PresenceEvent) => void>()
  let idleSeconds = 0
  let focus: FocusState = 'none'
  let call: CallState = 'none'
  let foregroundApp: string | null = null
  let disposed = false

  return {
    platform,
    capabilities: { ...noCapabilities, ...options.capabilities },
    idle: {
      idleSeconds: () => idleSeconds,
      onPresence(listener) {
        listeners.add(listener)
        return () => {
          listeners.delete(listener)
        }
      },
    },
    focus: { state: async () => focus },
    calls: { state: async () => call },
    foregroundApp: {
      current: async () => (foregroundApp === null ? null : { platform, id: foregroundApp }),
    },
    dispose() {
      listeners.clear()
      disposed = true
    },

    setIdleSeconds(seconds) {
      idleSeconds = Math.max(0, Math.floor(seconds))
    },
    advanceIdle(seconds) {
      idleSeconds += Math.max(0, Math.floor(seconds))
    },
    touch() {
      idleSeconds = 0
    },
    emit(event) {
      for (const listener of [...listeners]) listener(event)
    },
    setFocus(state) {
      focus = state
    },
    setCall(state) {
      call = state
    },
    setForegroundApp(id) {
      foregroundApp = id
    },
    get listenerCount() {
      return listeners.size
    },
    get disposed() {
      return disposed
    },
  }
}
