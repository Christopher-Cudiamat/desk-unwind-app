import type { CallDetector, FocusDetector, ForegroundAppDetector, PlatformCapabilities } from '../types'

/* Safe stand-ins for detectors an OS doesn't have (yet). Timing treats them as "nothing going on". */

export const unavailableFocus: FocusDetector = { state: async () => 'unknown' }

export const unavailableCalls: CallDetector = { state: async () => 'unknown' }

export const unavailableForegroundApp: ForegroundAppDetector = { current: async () => null }

export const noCapabilities: Readonly<PlatformCapabilities> = Object.freeze({
  fullscreenDetection: false,
  callDetection: false,
  protectedApps: false,
})
