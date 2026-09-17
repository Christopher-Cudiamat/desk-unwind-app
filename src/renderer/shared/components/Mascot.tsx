import { useId } from 'react'

export type MascotExpression =
  'normal' | 'happy' | 'focused' | 'sleepy' | 'break' | 'waiting' | 'refreshed' | 'celebrating'

type MascotProps = {
  expression?: MascotExpression
  /** Rendered width in px. Height follows the 120:104 aspect ratio. */
  size?: number
  /** Meaningful label. Omit for decorative use (the SVG is then hidden from assistive tech). */
  title?: string
  /** Occasional gentle blink. Disabled automatically for reduced motion. */
  blink?: boolean
  className?: string
}

const FACE = '#0F172A'
const SCREEN = '#F3FCFA'
const ACCENT = '#159E9A'

/**
 * The DeskUnwind mascot: a friendly monitor head.
 * Shell and screen stay constant — only the face and small screen details change.
 */
export function Mascot({ expression = 'normal', size = 120, title, blink = false, className }: MascotProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const shellId = `du-shell-${uid}`
  const decorative = !title

  return (
    <svg
      viewBox="0 0 120 104"
      width={size}
      height={(size * 104) / 120}
      className={[blink ? 'mascot-blink' : '', className ?? ''].join(' ').trim()}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <linearGradient id={shellId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3FDCCB" />
          <stop offset="1" stopColor="#159E9A" />
        </linearGradient>
      </defs>

      {/* Shell */}
      <rect x="4" y="4" width="112" height="96" rx="28" fill={`url(#${shellId})`} />
      <path
        d="M16 30 C16 20 21 15 31 14"
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Power light */}
      <circle cx="60" cy="93.5" r="2" fill="#fff" fillOpacity="0.75" />

      {/* Screen */}
      <rect x="14" y="14" width="92" height="72" rx="19" fill={SCREEN} />

      <Face expression={expression} />
    </svg>
  )
}

function Cheeks({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <g fill="#35D6C5" fillOpacity={opacity}>
      <ellipse cx="32" cy="61" rx="6" ry="3.5" />
      <ellipse cx="88" cy="61" rx="6" ry="3.5" />
    </g>
  )
}

const stroke = {
  stroke: FACE,
  strokeWidth: 3.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
}

function Face({ expression }: { expression: MascotExpression }) {
  switch (expression) {
    case 'happy':
      return (
        <g>
          <g className="mascot-eyes" {...stroke}>
            <path d="M38 49 Q44 40 50 49" />
            <path d="M70 49 Q76 40 82 49" />
          </g>
          <path
            d="M50 58 Q60 58 70 58 Q69 70 60 70 Q51 70 50 58 Z"
            fill={FACE}
            stroke={FACE}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Cheeks opacity={0.45} />
        </g>
      )

    case 'focused':
      return (
        <g>
          <g className="mascot-eyes" fill={FACE}>
            <ellipse cx="44" cy="46" rx="4" ry="5.5" />
            <ellipse cx="76" cy="46" rx="4" ry="5.5" />
          </g>
          <g {...stroke} strokeWidth={3}>
            <path d="M38 36.5 Q44 34.5 50 36.5" />
            <path d="M70 36.5 Q76 34.5 82 36.5" />
          </g>
          <path d="M55 63 H65" {...stroke} />
        </g>
      )

    case 'sleepy':
      return (
        <g>
          <g {...stroke}>
            <path d="M38 47 Q44 52 50 47" />
            <path d="M70 47 Q76 52 82 47" />
          </g>
          <ellipse cx="60" cy="64" rx="3" ry="2.6" fill={FACE} />
          <g stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M84 22 H90 L84 29 H90" />
            <path d="M93 31 H97 L93 35.5 H97" />
          </g>
          <Cheeks opacity={0.25} />
        </g>
      )

    case 'break':
      return (
        <g>
          <g {...stroke}>
            <path d="M38 47 Q44 52 50 47" />
            <path d="M70 47 Q76 52 82 47" />
          </g>
          <path d="M51 60 Q60 68 69 60" {...stroke} />
          <g fill={ACCENT}>
            <rect x="85" y="22" width="3.5" height="10" rx="1.75" />
            <rect x="91" y="22" width="3.5" height="10" rx="1.75" />
          </g>
          <Cheeks />
        </g>
      )

    case 'waiting':
      return (
        <g>
          <g className="mascot-eyes" fill={FACE}>
            <circle cx="47" cy="44" r="5" />
            <circle cx="79" cy="44" r="5" />
          </g>
          <path d="M54 62 H66" {...stroke} />
          <g fill={ACCENT}>
            <circle cx="51" cy="75" r="2" />
            <circle cx="60" cy="75" r="2" fillOpacity="0.7" />
            <circle cx="69" cy="75" r="2" fillOpacity="0.4" />
          </g>
        </g>
      )

    case 'refreshed':
      return (
        <g>
          <g className="mascot-eyes">
            <circle cx="44" cy="45" r="5.5" fill={FACE} />
            <circle cx="76" cy="45" r="5.5" fill={FACE} />
            <circle cx="46" cy="43" r="1.7" fill="#fff" />
            <circle cx="78" cy="43" r="1.7" fill="#fff" />
          </g>
          <path d="M48 58 Q60 71 72 58" {...stroke} />
          <g fill={ACCENT}>
            <Sparkle x={90} y={25} s={5} />
            <Sparkle x={27} y={25} s={3.5} />
          </g>
          <Cheeks opacity={0.45} />
        </g>
      )

    case 'celebrating':
      return (
        <g>
          <g {...stroke}>
            <path d="M38 48 Q44 39 50 48" />
            <path d="M70 48 Q76 39 82 48" />
          </g>
          <path d="M48 57 Q60 76 72 57 Z" fill={FACE} stroke={FACE} strokeWidth="2" strokeLinejoin="round" />
          <g>
            <rect x="24" y="22" width="4" height="4" rx="1" fill={ACCENT} transform="rotate(20 26 24)" />
            <circle cx="92" cy="24" r="2.2" fill="#35D6C5" />
            <rect x="86" y="72" width="4" height="4" rx="1" fill="#35D6C5" transform="rotate(-15 88 74)" />
            <circle cx="28" cy="74" r="2" fill={ACCENT} />
            <Sparkle x={98} y={40} s={3.5} fill={ACCENT} />
          </g>
          <Cheeks opacity={0.45} />
        </g>
      )

    case 'normal':
    default:
      return (
        <g>
          <g className="mascot-eyes" fill={FACE}>
            <circle cx="44" cy="45" r="5" />
            <circle cx="76" cy="45" r="5" />
          </g>
          <path d="M52 60 Q60 67 68 60" {...stroke} />
          <Cheeks />
        </g>
      )
  }
}

function Sparkle({ x, y, s, fill }: { x: number; y: number; s: number; fill?: string }) {
  const d = `M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`
  return <path d={d} fill={fill} />
}
