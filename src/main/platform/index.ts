import { toAppPlatform } from '@shared/platform'
import type { PlatformAdapter } from './types'

export type * from './types'

/**
 * Picks the adapter for this OS. Imports are lazy so each OS loads only its own code (and, later,
 * its own native modules). Call after `app.whenReady()`.
 */
export async function loadPlatformAdapter(platform: string = process.platform): Promise<PlatformAdapter> {
  switch (toAppPlatform(platform)) {
    case 'win32': {
      const { createWin32Adapter } = await import('./win32')
      return createWin32Adapter()
    }
    case 'darwin': {
      const { createDarwinAdapter } = await import('./darwin')
      return createDarwinAdapter()
    }
    default: {
      const { createOtherAdapter } = await import('./other')
      return createOtherAdapter()
    }
  }
}
