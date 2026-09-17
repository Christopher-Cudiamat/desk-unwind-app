import { BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { IpcChannel } from '@shared/ipc'
import { isThemePreference, type ThemeState } from '@shared/theme'
import { settings } from './settings'
import { applyThemeToChrome } from './windows/chrome'
import { appTitleBarKind } from './windows/mainWindow'

export function currentTheme(): ThemeState {
  return { preference: settings.getTheme(), dark: nativeTheme.shouldUseDarkColors }
}

let lastBroadcast = ''

/** Pushes the theme to every window, only when it actually changed (`updated` also fires for unrelated reasons). */
function broadcast() {
  const state = currentTheme()
  const key = JSON.stringify(state)
  if (key === lastBroadcast) return
  lastBroadcast = key
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) continue
    applyThemeToChrome(win, appTitleBarKind, state.dark)
    win.webContents.send(IpcChannel.themeChanged, state)
  }
}

export function setupTheme() {
  // nativeTheme drives `prefers-color-scheme` and the native chrome; the renderer toggles `.dark`.
  nativeTheme.themeSource = settings.getTheme()
  // Windows are created with the current theme, so the startup `updated` from the line above is a no-op.
  lastBroadcast = JSON.stringify(currentTheme())
  nativeTheme.on('updated', broadcast)

  ipcMain.handle(IpcChannel.themeGet, () => currentTheme())
  ipcMain.handle(IpcChannel.themeSet, (_event, preference: unknown) => {
    if (!isThemePreference(preference)) throw new Error('Unknown theme preference')
    settings.setTheme(preference)
    nativeTheme.themeSource = preference
    // `updated` doesn't fire when only the preference changes (e.g. dark -> system on a dark OS).
    broadcast()
    return currentTheme()
  })
}
