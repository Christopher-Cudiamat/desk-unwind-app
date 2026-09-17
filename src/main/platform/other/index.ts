import { powerMonitor } from 'electron'
import { createPowerMonitorIdle } from '../common/powerMonitorIdle'
import {
  noCapabilities,
  unavailableCalls,
  unavailableFocus,
  unavailableForegroundApp,
} from '../common/unavailable'
import type { PlatformAdapter } from '../types'

/** Any other OS (e.g. a Linux dev machine): idle, lock and sleep only. */
export function createOtherAdapter(): PlatformAdapter {
  const idle = createPowerMonitorIdle(powerMonitor)

  return {
    platform: 'other',
    idle,
    focus: unavailableFocus,
    calls: unavailableCalls,
    foregroundApp: unavailableForegroundApp,
    capabilities: noCapabilities,
    dispose: () => idle.dispose(),
  }
}
