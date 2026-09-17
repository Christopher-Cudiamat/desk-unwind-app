import { join } from 'node:path'
import { BrowserWindow, nativeTheme, shell } from 'electron'
import { ARG_DARK, ARG_LANGUAGE } from '@shared/ipc'
import { titleBarKindFor, toAppPlatform } from '@shared/platform'
import { settings } from '../settings'
import { titleBarOptions, windowBackground } from './chrome'

export const appPlatform = toAppPlatform(process.platform)
export const appTitleBarKind = titleBarKindFor(appPlatform)

let mainWindow: BrowserWindow | null = null

export function getMainWindow() {
  return mainWindow
}

export function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    mainWindow = createMainWindow()
    return mainWindow
  }
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.show()
  mainWindow.focus()
  return mainWindow
}

function createMainWindow() {
  const dark = nativeTheme.shouldUseDarkColors
  const win = new BrowserWindow({
    width: 980,
    height: 660,
    minWidth: 760,
    minHeight: 540,
    show: false,
    title: 'DeskUnwind',
    backgroundColor: windowBackground(dark),
    ...titleBarOptions(appTitleBarKind, dark),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: [`${ARG_LANGUAGE}${settings.getLanguage()}`, ...(dark ? [ARG_DARK] : [])],
    },
  })

  win.once('ready-to-show', () => win.show())
  // `ready-to-show` can be skipped when the native theme changes while the page loads; never stay hidden.
  win.webContents.once('did-finish-load', () => {
    if (!win.isVisible()) win.show()
  })
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null
  })

  // No in-app navigation away from the bundle, and no new Electron windows from content.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== win.webContents.getURL()) event.preventDefault()
  })

  loadRenderer(win, 'main')
  return win
}

/** Loads a renderer entry (`src/renderer/<entry>/index.html`) from the dev server or the build. */
export function loadRenderer(win: BrowserWindow, entry: string) {
  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (devUrl) {
    void win.loadURL(`${devUrl}/${entry}/index.html`)
  } else {
    void win.loadFile(join(__dirname, `../renderer/${entry}/index.html`))
  }
}
