import type { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { TITLE_BAR_HEIGHT, type TitleBarKind } from '@shared/platform'

/*
 * Per-OS window chrome, kept in one place so windows don't grow their own `if (mac)` checks.
 * Colors mirror the design tokens: `--bg`, `--surface-muted` and `--subtle` (light / dark).
 */

const palette = {
  light: { background: '#fafaf7', titleBar: '#f3f4ef', symbols: '#6b7280' },
  dark: { background: '#0f172a', titleBar: '#1b263c', symbols: '#8894a8' },
} as const

export function windowBackground(dark: boolean) {
  return dark ? palette.dark.background : palette.light.background
}

export function titleBarOptions(kind: TitleBarKind, dark: boolean): BrowserWindowConstructorOptions {
  switch (kind) {
    case 'overlay-right': {
      const colors = dark ? palette.dark : palette.light
      return {
        titleBarStyle: 'hidden',
        titleBarOverlay: { color: colors.titleBar, symbolColor: colors.symbols, height: TITLE_BAR_HEIGHT },
      }
    }
    case 'inset-left':
      return {
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 14, y: Math.round((TITLE_BAR_HEIGHT - 16) / 2) },
      }
    case 'native':
      return {}
  }
}

/** Keeps native chrome in step with the theme after the window exists. */
export function applyThemeToChrome(win: BrowserWindow, kind: TitleBarKind, dark: boolean) {
  win.setBackgroundColor(windowBackground(dark))
  if (kind === 'overlay-right') {
    const colors = dark ? palette.dark : palette.light
    win.setTitleBarOverlay({ color: colors.titleBar, symbolColor: colors.symbols, height: TITLE_BAR_HEIGHT })
  }
}
