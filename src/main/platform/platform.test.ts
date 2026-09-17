import { EventEmitter } from 'node:events'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPowerMonitorIdle } from './common/powerMonitorIdle'
import { createFakePlatformAdapter } from './testing/fakePlatformAdapter'
import type { PresenceEvent } from './types'

/** A stand-in for Electron's powerMonitor: an event emitter with a settable idle time. */
class FakePowerMonitor extends EventEmitter {
  idle = 0
  getSystemIdleTime() {
    return this.idle
  }
}

const powerMonitor = new FakePowerMonitor()
vi.mock('electron', () => ({ powerMonitor }))

beforeEach(() => {
  powerMonitor.removeAllListeners()
  powerMonitor.idle = 0
})

describe('powerMonitor idle detector', () => {
  it('reports whole, non-negative idle seconds', () => {
    const idle = createPowerMonitorIdle(powerMonitor)
    powerMonitor.idle = 42.9
    expect(idle.idleSeconds()).toBe(42)
    powerMonitor.idle = -1
    expect(idle.idleSeconds()).toBe(0)
  })

  it('maps lock, unlock, suspend and resume to presence events', () => {
    const idle = createPowerMonitorIdle(powerMonitor)
    const seen: PresenceEvent[] = []
    idle.onPresence((event) => seen.push(event))

    for (const name of ['lock-screen', 'unlock-screen', 'suspend', 'resume', 'on-battery']) {
      powerMonitor.emit(name)
    }
    expect(seen).toEqual(['lock', 'unlock', 'suspend', 'resume'])
  })

  it('stops notifying after unsubscribe, and one failing listener does not block others', () => {
    const idle = createPowerMonitorIdle(powerMonitor)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const removed = vi.fn()
    const kept = vi.fn()
    idle.onPresence(() => {
      throw new Error('boom')
    })
    const unsubscribe = idle.onPresence(removed)
    idle.onPresence(kept)

    unsubscribe()
    powerMonitor.emit('lock-screen')

    expect(removed).not.toHaveBeenCalled()
    expect(kept).toHaveBeenCalledWith('lock')
    expect(errors).toHaveBeenCalledOnce()
    errors.mockRestore()
  })

  it('removes its OS listeners on dispose', () => {
    const idle = createPowerMonitorIdle(powerMonitor)
    expect(powerMonitor.listenerCount('suspend')).toBe(1)
    idle.dispose()
    expect(powerMonitor.eventNames()).toEqual([])
  })
})

describe('adapter selection', () => {
  it.each([
    ['win32', 'win32'],
    ['darwin', 'darwin'],
    ['linux', 'other'],
  ] as const)('picks the %s adapter', async (nodePlatform, expected) => {
    const { loadPlatformAdapter } = await import('./index')
    const adapter = await loadPlatformAdapter(nodePlatform)
    expect(adapter.platform).toBe(expected)

    powerMonitor.idle = 7
    expect(adapter.idle.idleSeconds()).toBe(7)
    adapter.dispose()
    expect(powerMonitor.eventNames()).toEqual([])
  })

  it('reports detectors that are not built yet as unknown, never throwing', async () => {
    const { loadPlatformAdapter } = await import('./index')
    for (const platform of ['win32', 'darwin', 'linux']) {
      const adapter = await loadPlatformAdapter(platform)
      await expect(adapter.focus.state()).resolves.toBe('unknown')
      await expect(adapter.calls.state()).resolves.toBe('unknown')
      await expect(adapter.foregroundApp.current()).resolves.toBeNull()
      expect(adapter.capabilities).toEqual({
        fullscreenDetection: false,
        callDetection: false,
        protectedApps: false,
      })
      adapter.dispose()
    }
  })
})

describe('fake platform adapter', () => {
  it('can be scripted like a real OS', async () => {
    const fake = createFakePlatformAdapter({ platform: 'darwin', capabilities: { callDetection: true } })
    const seen: PresenceEvent[] = []
    const unsubscribe = fake.idle.onPresence((event) => seen.push(event))

    fake.advanceIdle(30)
    fake.advanceIdle(15)
    expect(fake.idle.idleSeconds()).toBe(45)
    fake.touch()
    expect(fake.idle.idleSeconds()).toBe(0)

    fake.emit('suspend')
    unsubscribe()
    fake.emit('resume')
    expect(seen).toEqual(['suspend'])
    expect(fake.listenerCount).toBe(0)

    fake.setCall('in-call')
    fake.setFocus('presenting')
    fake.setForegroundApp('com.microsoft.teams2')
    await expect(fake.calls.state()).resolves.toBe('in-call')
    await expect(fake.focus.state()).resolves.toBe('presenting')
    await expect(fake.foregroundApp.current()).resolves.toEqual({
      platform: 'darwin',
      id: 'com.microsoft.teams2',
    })
    expect(fake.capabilities).toEqual({
      fullscreenDetection: false,
      callDetection: true,
      protectedApps: false,
    })

    fake.dispose()
    expect(fake.disposed).toBe(true)
  })
})
