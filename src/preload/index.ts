import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { defaultLocale, isLocale, type Locale } from '@shared/i18n/locales'
import { ARG_DARK, ARG_LANGUAGE, IpcChannel, type DeskUnwindApi, type DevPlatformStatus } from '@shared/ipc'
import { titleBarKindFor, toAppPlatform, type PlatformCapabilities } from '@shared/platform'
import type { ThemePreference, ThemeState } from '@shared/theme'

const platform = toAppPlatform(process.platform)
const languageArg = process.argv.find((arg) => arg.startsWith(ARG_LANGUAGE))?.slice(ARG_LANGUAGE.length)

const api: DeskUnwindApi = {
  platform,
  titleBar: titleBarKindFor(platform),
  theme: {
    initialDark: process.argv.includes(ARG_DARK),
    get: () => ipcRenderer.invoke(IpcChannel.themeGet) as Promise<ThemeState>,
    set: (preference: ThemePreference) =>
      ipcRenderer.invoke(IpcChannel.themeSet, preference) as Promise<ThemeState>,
    onChange(listener) {
      const handler = (_event: IpcRendererEvent, state: ThemeState) => listener(state)
      ipcRenderer.on(IpcChannel.themeChanged, handler)
      return () => ipcRenderer.removeListener(IpcChannel.themeChanged, handler)
    },
  },
  language: {
    initial: isLocale(languageArg) ? languageArg : defaultLocale,
    get: () => ipcRenderer.invoke(IpcChannel.languageGet) as Promise<Locale>,
    set: (language: Locale) => ipcRenderer.invoke(IpcChannel.languageSet, language) as Promise<Locale>,
    onChange(listener) {
      const handler = (_event: IpcRendererEvent, language: Locale) => listener(language)
      ipcRenderer.on(IpcChannel.languageChanged, handler)
      return () => ipcRenderer.removeListener(IpcChannel.languageChanged, handler)
    },
  },
  capabilities: () => ipcRenderer.invoke(IpcChannel.platformCapabilities) as Promise<PlatformCapabilities>,
  dev: {
    platformStatus: () => ipcRenderer.invoke(IpcChannel.devPlatformStatus) as Promise<DevPlatformStatus>,
  },
}

contextBridge.exposeInMainWorld('deskUnwind', api)
