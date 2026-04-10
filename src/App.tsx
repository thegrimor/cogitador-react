import { useState } from 'react'
import { TabBar } from '@/shared/components/TabBar'
import type { TabId } from '@/shared/components/TabBar'
import { FichaView } from '@/modules/ficha'
import { ProyectosView } from '@/modules/proyectos'
import { SequitoView } from '@/modules/sequito'
import { useAppSelector } from '@/core/store/hooks'

const VIEWS: Record<TabId, React.ReactNode> = {
  ficha:     <FichaView />,
  proyectos: <ProyectosView />,
  sequito:   <SequitoView />,
}

const TAB_SUBTITLES: Record<TabId, string> = {
  ficha:     '',
  proyectos: '// Registro Operacional',
  sequito:   '// Acólitos y Aliados',
}

function AppHeader({ activeTab }: { activeTab: TabId }) {
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)

  const subtitle = activeTab === 'ficha'
    ? `Rango ${activeChar?.rank ?? 1} // ${activeChar?.role ?? 'Acólito'} — ${activeChar?.name ?? 'Sin Designación'}`
    : TAB_SUBTITLES[activeTab]

  return (
    <header className="relative z-10 overflow-hidden border-b-2 border-crimson bg-surface-2 px-4 py-3">
      <div className="animate-shimmer absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson to-transparent opacity-60" />

      <div className="flex items-center gap-3">
        <span className="animate-spin-slow text-2xl leading-none text-crimson-dim select-none">
          ⚙
        </span>
        <div className="flex flex-col gap-0.5">
          <h1
            className="font-display text-base font-black uppercase tracking-[3px] text-crimson-bright leading-none"
            style={{ textShadow: '0 0 12px rgba(255,34,34,0.4)' }}
          >
            Dark Heresy Cogitator
          </h1>
          <p className="font-display text-[8px] uppercase tracking-[3px] text-gold leading-none">
            {subtitle || '// Adeptus Mechanicus'}
          </p>
        </div>
      </div>
    </header>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('ficha')

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden font-mono text-parchment bg-surface">
      <div className="scanline" />

      <AppHeader activeTab={activeTab} />

      <main className="relative z-10 flex flex-1 flex-col pb-16">
        {VIEWS[activeTab]}
      </main>

      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
