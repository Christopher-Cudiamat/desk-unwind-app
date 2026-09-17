import type { DeskUnwindApi } from '../shared/ipc'

declare global {
  interface Window {
    deskUnwind: DeskUnwindApi
  }
}

export {}
