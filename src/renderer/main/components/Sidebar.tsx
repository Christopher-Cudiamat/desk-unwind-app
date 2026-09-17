import { BarChart3, CalendarClock, House, Settings, type LucideIcon } from 'lucide-react'
import { useDictionary } from '@renderer/shared/i18n'
import { cn } from '@renderer/shared/lib/cn'
import { useRoute, type Screen } from '../store/route'

const items: { screen: Screen; icon: LucideIcon }[] = [
  { screen: 'home', icon: House },
  { screen: 'schedule', icon: CalendarClock },
  { screen: 'stats', icon: BarChart3 },
]

/** Icon rail, styled like the product mockup on the site. */
export function Sidebar() {
  const t = useDictionary()

  return (
    <nav
      aria-label={t.nav.label}
      className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-line bg-surface-muted/40 py-4"
    >
      {items.map((item) => (
        <NavButton key={item.screen} {...item} label={t.nav[item.screen]} />
      ))}
      <div className="mt-auto">
        <NavButton screen="settings" icon={Settings} label={t.nav.settings} />
      </div>
    </nav>
  )
}

function NavButton({ screen, icon: Icon, label }: { screen: Screen; icon: LucideIcon; label: string }) {
  const route = useRoute((s) => s.route)
  const navigate = useRoute((s) => s.navigate)
  const active = route === screen

  return (
    <button
      type="button"
      onClick={() => navigate(screen)}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      title={label}
      className={cn(
        'flex size-10 items-center justify-center rounded-xl transition-colors duration-200',
        active ? 'bg-brand-soft text-brand-text' : 'text-subtle hover:bg-surface-muted hover:text-fg',
      )}
    >
      <Icon className="size-[1.125rem]" aria-hidden />
    </button>
  )
}
