/**
 * English copy — the source of truth for the dictionary shape. Every other locale must match
 * `Dictionary`. Strings shared with the marketing site are copied from its dictionaries so the
 * wording stays identical.
 *
 * Voice: warm, specific, a little playful. Headings are normal sentences. Never guilt-trip or nag.
 */
export const en = {
  app: {
    name: 'DeskUnwind',
    tagline: 'Take a break. Work better.',
    disclaimer: 'DeskUnwind is a wellbeing tool, not medical advice.',
  },

  nav: {
    label: 'Main',
    home: 'Home',
    schedule: 'Schedule',
    stats: 'Stats',
    settings: 'Settings',
  },

  home: {
    greeting: 'Good morning',
    rhythm: "You're in a nice rhythm today.",
    placeholder: 'Your next break and today’s rhythm will show up here.',
  },

  schedule: {
    title: 'Schedule',
    placeholder: 'Pick how often you want eye and movement breaks, and when your workday runs.',
  },

  stats: {
    title: 'This week',
    placeholder: 'Your little breaks will add up here. They stay on this computer.',
  },

  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeHint: 'Dark by default. System follows your computer’s light or dark mode.',
    themes: {
      dark: 'Dark',
      light: 'Light',
      system: 'System',
    },
    language: 'Language',
    languageHint: 'DeskUnwind remembers your choice.',
  },
}

export type Dictionary = typeof en
