import { powerMonitor } from 'electron'
import { createPowerMonitorIdle } from '../common/powerMonitorIdle'
import {
  noCapabilities,
  unavailableCalls,
  unavailableFocus,
  unavailableForegroundApp,
} from '../common/unavailable'
import type { PlatformAdapter } from '../types'

/** Windows adapter. Create it after `app` is ready (powerMonitor isn't available before). */
export function createWin32Adapter(): PlatformAdapter {
  const idle = createPowerMonitorIdle(powerMonitor)

  return {
    platform: 'win32',
    idle,
    // TODO(step 6): SHQueryUserNotificationState for fullscreen, presenting and Focus Assist.
    focus: unavailableFocus,
    // TODO(step 6): HKCU\...\CapabilityAccessManager\ConsentStore\{microphone,webcam}, any LastUsedTimeStop == 0.
    calls: unavailableCalls,
    // TODO(step 6): foreground process executable name only (e.g. POWERPNT.EXE).
    foregroundApp: unavailableForegroundApp,
    // Each flag turns on as its detector lands in step 6.
    capabilities: noCapabilities,
    dispose: () => idle.dispose(),
  }
}
