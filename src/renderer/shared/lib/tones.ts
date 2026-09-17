import type { Tone } from '@shared/tone'

/** Flat colour pairings per tone — soft tint for surfaces, solid for active marks. Same as the site. */
export const toneClasses: Record<Tone, { soft: string; solid: string; text: string }> = {
  mint: { soft: 'bg-tint-mint', solid: 'bg-brand', text: 'text-brand-text' },
  sky: { soft: 'bg-tint-sky', solid: 'bg-accent', text: 'text-accent-text' },
  warm: { soft: 'bg-tint-warm', solid: 'bg-warm', text: 'text-warm-text' },
}
