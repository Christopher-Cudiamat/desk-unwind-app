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
