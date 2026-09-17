# DeskUnwind desktop app: rules for agents

DeskUnwind is a friendly desktop buddy that reminds people to rest their eyes, stretch and step
away, and politely waits when they're busy. The marketing site at
`C:\Users\tops\dev\desk-unwind` (read-only) is the source of truth for concept, voice and visuals.
The app must feel like the same product.

## Stack

Electron + electron-vite (main / preload / renderer) · React 19 + strict TypeScript · Tailwind v4 ·
lucide-react · Zustand · electron-store (settings) · better-sqlite3 (break events) ·
electron-builder + electron-updater · Vitest + Playwright (Electron) · ESLint + Prettier.

## Platforms: Windows first, Mac-ready

- Windows ships first. macOS must be addable **without touching core logic**.
- `src/main/core/` is platform-agnostic: it never imports OS-specific Electron APIs or native
  modules, and never checks `process.platform`. It talks only to interfaces.
- All OS-specific behaviour lives behind `src/main/platform/` adapters (`types.ts` interfaces,
  `index.ts` picks by `process.platform` with lazy imports, `win32/` real, `darwin/` safe stubs with
  `// TODO(mac):` notes). Native modules load lazily, only on their OS.
- `capabilities` flags tell the UI which features the current OS supports. Hide or explain the
  rest ("Coming soon on Mac"). Adapters must degrade gracefully (e.g. sandboxed Mac App Store builds).
- Small OS differences (title bar, tray vs menu bar, "Quit" wording, paths) go through helpers,
  not scattered `if`s. Protected apps use platform-neutral IDs: `{ platform, id }`.

## Architecture

- **Main process owns all timing**: scheduler, Smart Pause, database, licensing. Renderers only
  display state and send commands. Never schedule with renderer timers.
- Security: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`. The only IPC surface
  is the typed preload bridge `window.deskUnwind`, with contracts in `src/shared/`.
- Single instance. The app keeps running in the tray / menu bar when the window closes.
- Scheduler and streak logic are pure, with an injectable clock, and unit-tested.

## No secrets, provider-agnostic licensing

- The app never contains payment API keys, webhook secrets or license-signing private keys. It
  embeds only the license **public** key.
- Buying happens on the website (PayMongo checkout in the browser). The app never handles payment;
  "Upgrade" opens the pricing page. The app talks only to the License API
  (`src/shared/license-api.ts`), never to PayMongo or any payment provider. A new payment provider
  must need zero app changes.
- Features ask only the `entitlements` module (`free` | `personal`). It reads pluggable
  `EntitlementSource`s (license key now; Microsoft Store and Apple IAP later). The highest wins.
- Offline first: verify the signed token locally on every launch, re-validate quietly when online,
  60-day grace period with a friendly note. Never downgrade mid-session. Free features never need
  internet. Never hard-code prices.

## Privacy promises (enforced in code)

Never take screenshots, log keystrokes, score productivity or report to anyone. Stats stay on the
computer. No telemetry by default; crash reporting only opt-in. Only check what break timing needs
(idle time, call/fullscreen active, foreground app vs the protected list) and **store none of it**,
only break events. The only network calls are license activation/validation and update checks.
Show "DeskUnwind is a wellbeing tool, not medical advice." in Settings/About.

## Visual design

- Tokens in `src/renderer/shared/styles/tokens.css` are copied verbatim from the site's
  `app/globals.css`. Use the token classes (`bg-bg`, `bg-surface`, `text-fg`, `text-muted`,
  `border-line`, `bg-brand-soft`, `text-brand-text`, `bg-tint-mint`, `text-ink`...). Don't invent colors.
- Plus Jakarta Sans for UI. Fraunces (`font-display`, SOFT 100) only for big friendly headings.
  `tabular` for every time and countdown. Fonts are bundled locally.
- Rounded everything; `shadow-soft` / `shadow-lifted` / `shadow-window`. Flat tints, no glow orbs.
- Tones `{ soft, solid, text }`: **mint** eye breaks / on / progress, **sky** movement and longer
  resets, **warm** Smart Pause waiting and celebrations.
- The mascot (`Mascot.tsx`) is copied unchanged from the site; its expression shows app state.
- Motion uses `cubic-bezier(0.22, 1, 0.36, 1)` and always sits inside
  `prefers-reduced-motion: no-preference`.
- Theme: **Dark is the default**, then Light / System, via `nativeTheme`, `.dark` on `<html>`. The choice is saved.
- Accessibility: full keyboard use, visible focus rings, `*-text` tokens for text contrast, toasts
  and break windows never steal or trap focus.

## Voice

Warm, specific, a little playful. Headings are normal sentences; "Short. Punchy." is only for the
tagline. Never guilt-trip or nag; skipping a break is fine. Reuse the site's strings where they
match. `en` is the source of truth (`type Dictionary = typeof en`); `it` matches its shape and is
written naturally, not word for word. Format with `Intl` (`en-US`, `it-IT`). Language defaults to the
OS language and the user's choice is saved in settings and applied to every window.

## Working here

- Check current docs for Electron, electron-vite, electron-builder, Tailwind before using an API.
- Scripts: `npm run dev`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
- Build order lives in the original brief; finish one step at a time and show the user.
