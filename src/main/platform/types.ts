import type {
  AppId,
  AppPlatform,
  CallState,
  FocusState,
  PlatformCapabilities,
  PresenceEvent,
} from '@shared/platform'

export type { AppId, AppPlatform, CallState, FocusState, PlatformCapabilities, PresenceEvent }

export type Unsubscribe = () => void

export interface IdleDetector {
  /** Whole seconds since the last keyboard or mouse input anywhere on the system. */
  idleSeconds(): number
  /** Lock / unlock / suspend / resume. */
  onPresence(listener: (event: PresenceEvent) => void): Unsubscribe
}

/** Fullscreen, presenting or Do Not Disturb (Focus Assist on Windows). */
export interface FocusDetector {
  state(): Promise<FocusState>
}

/** Whether the microphone or camera is in use right now. Nothing about which app or what's said. */
export interface CallDetector {
  state(): Promise<CallState>
}

/** The frontmost app's identifier only (e.g. `Teams.exe`). Never window titles or content. */
export interface ForegroundAppDetector {
  current(): Promise<AppId | null>
}

/**
 * Everything OS-specific that break timing needs. `core/` only ever sees this interface.
 * Adapters degrade gracefully: when something can't be detected they report `unknown` / `null`
 * and turn the matching capability off rather than throwing.
 */
export interface PlatformAdapter {
  platform: AppPlatform
  idle: IdleDetector
  focus: FocusDetector
  calls: CallDetector
  foregroundApp: ForegroundAppDetector
  capabilities: Readonly<PlatformCapabilities>
  /** Removes OS listeners. Called on quit. */
  dispose(): void
}
