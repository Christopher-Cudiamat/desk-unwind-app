import { app } from 'electron'
import { setupLanguage } from './language'
import { setupTheme } from './theme'
import { showMainWindow } from './windows/mainWindow'

const APP_ID = 'com.deskunwind.app'

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showMainWindow()
  })

  // Windows uses the app user model ID for notifications and taskbar grouping.
  app.setAppUserModelId(APP_ID)

  void app.whenReady().then(() => {
    setupTheme()
    setupLanguage()
    showMainWindow()

    app.on('activate', () => {
      showMainWindow()
    })
  })

  // TODO(step 3): keep running in the tray / menu bar instead of quitting.
  app.on('window-all-closed', () => {
    app.quit()
  })
}
