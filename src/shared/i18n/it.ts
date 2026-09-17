import type { Dictionary } from './en'

/** Italian copy. Shape must match `en.ts`. Same voice: caldo, concreto, un po' giocoso. */
export const it: Dictionary = {
  app: {
    name: 'DeskUnwind',
    tagline: 'Fai una pausa. Lavora meglio.',
    disclaimer: 'DeskUnwind è uno strumento per il benessere, non un consiglio medico.',
  },

  nav: {
    label: 'Principale',
    home: 'Home',
    schedule: 'Programma',
    stats: 'Statistiche',
    settings: 'Impostazioni',
  },

  home: {
    greeting: 'Buongiorno',
    rhythm: 'Oggi hai trovato un bel ritmo.',
    placeholder: 'Qui vedrai la tua prossima pausa e il ritmo di oggi.',
  },

  schedule: {
    title: 'Programma',
    placeholder:
      'Scegli ogni quanto fare pause per gli occhi e per muoverti, e gli orari della tua giornata.',
  },

  stats: {
    title: 'Questa settimana',
    placeholder: 'Qui si sommano le tue piccole pause. Restano su questo computer.',
  },

  settings: {
    title: 'Impostazioni',
    appearance: 'Aspetto',
    theme: 'Tema',
    themeHint: 'Scuro di default. Sistema segue la modalità chiara o scura del computer.',
    themes: {
      dark: 'Scuro',
      light: 'Chiaro',
      system: 'Sistema',
    },
    language: 'Lingua',
    languageHint: 'DeskUnwind si ricorda la tua scelta.',
  },
}
