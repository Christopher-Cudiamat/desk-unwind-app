import { BrowserWindow, ipcMain } from 'electron'
import { isLocale } from '@shared/i18n/locales'
import { IpcChannel } from '@shared/ipc'
import { settings } from './settings'

export function setupLanguage() {
  ipcMain.handle(IpcChannel.languageGet, () => settings.getLanguage())
  ipcMain.handle(IpcChannel.languageSet, (_event, language: unknown) => {
    if (!isLocale(language)) throw new Error('Unsupported language')
    settings.setLanguage(language)
    // Every window (main, toast, break) switches together.
    for (const win of BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send(IpcChannel.languageChanged, language)
    }
    return language
  })
}
