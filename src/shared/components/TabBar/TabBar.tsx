export type TabId = 'ficha' | 'proyectos' | 'sequito'

interface Tab {
  id: TabId
  label: string
  symbol: string
}

interface TabBarProps {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS: Tab[] = [
  { id: 'ficha',     label: 'Ficha',     symbol: '✦' },
  { id: 'proyectos', label: 'Proyectos', symbol: '⚙' },
  { id: 'sequito',   label: 'Séquito',   symbol: '☩' },
]

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-rim-bright bg-surface-2">
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 font-display text-[9px] uppercase tracking-[2px] transition-colors',
              isActive
                ? 'text-crimson-bright border-t-2 border-crimson-bright -mt-px'
                : 'text-parchment-dim border-t-2 border-transparent -mt-px hover:text-parchment',
            ].join(' ')}
          >
            <span className={['text-lg', isActive ? 'animate-pulse-mech' : ''].join(' ')}>
              {tab.symbol}
            </span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
