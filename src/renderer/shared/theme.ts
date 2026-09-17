import { create } from 'zustand'
import { DEFAULT_THEME, type ThemePreference, type ThemeState } from '@shared/theme'

function applyDarkClass(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

type ThemeStore = ThemeState & {
  setPreference: (preference: ThemePreference) => void
}

/** Mirrors the main process theme. Main owns the setting; this only displays it and sends changes. */
export const useTheme = create<ThemeStore>((set) => ({
  preference: DEFAULT_THEME,
  dark: window.deskUnwind.theme.initialDark,
  setPreference: (preference) => {
    set({ preference })
    void window.deskUnwind.theme.set(preference)
  },
}))

/** Call once per window, before the first render, so the first paint already has the right colors. */
export function initTheme() {
  const bridge = window.deskUnwind.theme
  const apply = (state: ThemeState) => {
    applyDarkClass(state.dark)
    useTheme.setState(state)
  }
  applyDarkClass(bridge.initialDark)
  bridge.onChange(apply)
  void bridge.get().then(apply)
}
