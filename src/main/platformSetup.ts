import { app, ipcMain } from 'electron'
import { IpcChannel, type DevPlatformStatus } from '@shared/ipc'
import { loadPlatformAdapter, type PlatformAdapter, type PresenceEvent } from './platform'

let adapter: PlatformAdapter | null = null

/** The adapter for this OS. Only valid after `setupPlatform()` resolved. */
export function getPlatform(): PlatformAdapter {
  if (!adapter) throw new Error('Platform adapter used before setupPlatform()')
  return adapter
}

export async function setupPlatform() {
  const platform = await loadPlatformAdapter()
  adapter = platform

  ipcMain.handle(IpcChannel.platformCapabilities, () => ({ ...platform.capabilities }))

  if (!app.isPackaged) setupDevStatus(platform)

  app.on('will-quit', () => platform.dispose())
  return platform
}

/** Development only: lets the styleguide show what the adapter sees. Events live in memory, capped. */
function setupDevStatus(platform: PlatformAdapter) {
  const recentEvents: { event: PresenceEvent; at: number }[] = []
  platform.idle.onPresence((event) => {
    recentEvents.unshift({ event, at: Date.now() })
    recentEvents.length = Math.min(recentEvents.length, 8)
  })

  ipcMain.handle(IpcChannel.devPlatformStatus, async (): Promise<DevPlatformStatus> => {
    const [focus, call, foregroundApp] = await Promise.all([
      platform.focus.state(),
      platform.calls.state(),
      platform.foregroundApp.current(),
    ])
    return {
      platform: platform.platform,
      capabilities: { ...platform.capabilities },
      idleSeconds: platform.idle.idleSeconds(),
      focus,
      call,
      foregroundApp: foregroundApp?.id ?? null,
      recentEvents: [...recentEvents],
    }
  })
}
