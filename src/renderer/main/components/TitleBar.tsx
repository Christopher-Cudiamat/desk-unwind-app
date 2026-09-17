import { TITLE_BAR_HEIGHT } from '@shared/platform'
import { Mascot } from '@renderer/shared/components/Mascot'
import { cn } from '@renderer/shared/lib/cn'

/**
 * Draggable title bar that leaves room for the native controls:
 * Windows draws min/max/close on the right (titleBarOverlay), macOS draws traffic lights on the left.
 */
export function TitleBar() {
  const kind = window.deskUnwind.titleBar
  if (kind === 'native') return null

  return (
    <header
      className="app-drag flex shrink-0 items-center border-b border-line bg-surface-muted"
      style={{ height: TITLE_BAR_HEIGHT }}
    >
      <div
        className={cn(
          'flex h-full items-center gap-2 text-xs font-semibold text-fg',
          kind === 'inset-left' ? 'pl-[84px]' : 'pl-3.5',
        )}
        // With the Windows overlay, keep content clear of the native buttons.
        style={kind === 'overlay-right' ? { width: 'env(titlebar-area-width, 100%)' } : undefined}
      >
        <Mascot size={16} />
        DeskUnwind
      </div>
    </header>
  )
}
