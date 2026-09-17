import { create } from 'zustand'

export const screens = ['home', 'schedule', 'stats', 'settings'] as const
export type Screen = (typeof screens)[number]

/** `dev/styleguide` is hidden: reachable only by its hash or the dev shortcut. */
export type Route = Screen | 'dev/styleguide'

function parseHash(hash: string): Route {
  const value = hash.replace(/^#\/?/, '')
  if (value === 'dev/styleguide') return value
  return (screens as readonly string[]).includes(value) ? (value as Screen) : 'home'
}

type RouteStore = {
  route: Route
  navigate: (route: Route) => void
}

export const useRoute = create<RouteStore>((set) => ({
  route: parseHash(window.location.hash),
  navigate: (route) => {
    window.location.hash = `/${route}`
    set({ route })
  },
}))

window.addEventListener('hashchange', () => {
  useRoute.setState({ route: parseHash(window.location.hash) })
})
