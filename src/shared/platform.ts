/** Operating systems DeskUnwind knows about. Anything else gets a plain native window. */
export type AppPlatform = 'win32' | 'darwin' | 'other'

/**
 * How the window's title bar is drawn, so the renderer can leave room for native controls.
 * - `overlay-right`: Windows `titleBarOverlay`, native min/max/close (and Snap Layouts) on the right.
 * - `inset-left`: macOS `hiddenInset`, traffic lights on the left.
 * - `native`: the OS draws a normal frame; the renderer draws no title bar.
 */
export type TitleBarKind = 'overlay-right' | 'inset-left' | 'native'

export function toAppPlatform(platform: string): AppPlatform {
  return platform === 'win32' || platform === 'darwin' ? platform : 'other'
}

export function titleBarKindFor(platform: AppPlatform): TitleBarKind {
  switch (platform) {
    case 'win32':
      return 'overlay-right'
    case 'darwin':
      return 'inset-left'
    default:
      return 'native'
  }
}

/** Height of the custom title bar, shared by the main process overlay and the renderer. */
export const TITLE_BAR_HEIGHT = 40

/** What the current OS adapter can actually detect, so the UI can hide or explain the rest. */
export interface PlatformCapabilities {
  fullscreenDetection: boolean
  callDetection: boolean
  protectedApps: boolean
}

/** A platform-neutral app identifier for the protected apps list, e.g. `{ platform: 'win32', id: 'Teams.exe' }`. */
export interface AppId {
  platform: AppPlatform
  id: string
}

/** Presence changes break timing reacts to. They are never stored. */
export type PresenceEvent = 'lock' | 'unlock' | 'suspend' | 'resume'

/** `unknown` means the OS can't tell us (yet); timing treats it like `none`. */
export type FocusState = 'none' | 'fullscreen' | 'presenting' | 'do-not-disturb' | 'unknown'

export type CallState = 'in-call' | 'none' | 'unknown'
