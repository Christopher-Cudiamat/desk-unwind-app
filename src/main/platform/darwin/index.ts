import { powerMonitor } from 'electron'
import { createPowerMonitorIdle } from '../common/powerMonitorIdle'
import {
  noCapabilities,
  unavailableCalls,
  unavailableFocus,
  unavailableForegroundApp,
} from '../common/unavailable'
import type { PlatformAdapter } from '../types'

/**
 * macOS adapter. Idle, lock and sleep already work through powerMonitor. The rest reports
 * "unavailable" so the UI can say "Coming soon on Mac" instead of showing a broken feature.
 */
export function createDarwinAdapter(): PlatformAdapter {
  const idle = createPowerMonitorIdle(powerMonitor)

  return {
    platform: 'darwin',
    idle,
    // TODO(mac): fullscreen / presenting via CGWindowList, Focus via the Focus status API
    // (needs the `com.apple.developer.focus-status` entitlement and the user's permission).
    focus: unavailableFocus,
    // TODO(mac): mic/camera in use via CoreAudio `kAudioDevicePropertyDeviceIsRunningSomewhere`
    // and CoreMediaIO. Must stay `unknown` in sandboxed Mac App Store builds if access is denied.
    calls: unavailableCalls,
    // TODO(mac): NSWorkspace.frontmostApplication bundle identifier only (e.g. com.microsoft.teams2).
    foregroundApp: unavailableForegroundApp,
    // TODO(mac): turn flags on as each detector lands.
    capabilities: noCapabilities,
    dispose: () => idle.dispose(),
  }
}
