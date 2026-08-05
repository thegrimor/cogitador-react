import { useState } from 'react'
import { useAppSelector } from '@/core/store/hooks'
import { CharacterHeader } from './CharacterHeader'
import { ExperiencePanel } from './ExperiencePanel'
import { AtributosTab } from './tabs/AtributosTab'
import { HabilidadesTab } from './tabs/HabilidadesTab'
import { TalentosTab } from './tabs/TalentosTab'
import { ArmeriaTab } from './tabs/ArmeriaTab'
import { MejorasTab } from './tabs/MejorasTab'
import { PoderesPsiquicosTab } from './tabs/PoderesPsiquicosTab'
import { XpTab } from './tabs/XpTab'
import { InquisidorTab } from './tabs/InquisidorTab'
import { CaidosTab } from './tabs/CaidosTab'

type FichaTabId =
  | 'atributos'
  | 'habilidades'
  | 'talentos'
  | 'armeria'
  | 'mejoras'
  | 'poderes'
  | 'xp'
  | 'inquisidor'
  | 'caidos'

interface FichaTab {
  id: FichaTabId
  label: string
}

const TABS: FichaTab[] = [
  { id: 'atributos',   label: 'Atrib.'   },
  { id: 'habilidades', label: 'Habil.'   },
  { id: 'talentos',    label: 'Talent.'  },
  { id: 'armeria',     label: 'Armer.'   },
  { id: 'mejoras',     label: 'Mejoras'  },
  { id: 'poderes',     label: 'Psíq.'    },
  { id: 'xp',          label: 'XP'       },
  { id: 'inquisidor',  label: 'Inquis.'  },
  { id: 'caidos',      label: 'Caídos'   },
]

const TAB_CONTENT: Record<FichaTabId, React.ReactNode> = {
  atributos:   <AtributosTab />,
  habilidades: <HabilidadesTab />,
  talentos:    <TalentosTab />,
  armeria:     <ArmeriaTab />,
  mejoras:     <MejorasTab />,
  poderes:     <PoderesPsiquicosTab />,
  xp:          <XpTab />,
  inquisidor:  <InquisidorTab />,
  caidos:      <CaidosTab />,
}

export function FichaView() {
  const [activeTab, setActiveTab] = useState<FichaTabId>('atributos')
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)

  // El tab Inquisidor solo es visible para el slot con role='inquisidor'
  const visibleTabs = TABS.filter(t => t.id !== 'inquisidor' || activeChar?.info.role === 'inquisidor')
  // Si el personaje activo cambia y deja de ser Inquisidor, no nos quedamos en un tab oculto
  const effectiveTab: FichaTabId = activeTab === 'inquisidor' && activeChar?.info.role !== 'inquisidor'
    ? 'atributos'
    : activeTab

  return (
    <div className="flex flex-col flex-1">
      <CharacterHeader />
      <ExperiencePanel />

      {/* Tab bar interno de ficha */}
      <div className="flex overflow-x-auto border-b border-rim-bright bg-surface-2 scrollbar-none">
        {visibleTabs.map((tab) => {
          const isActive = tab.id === effectiveTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex-shrink-0 px-3 py-2 font-display text-[9px] uppercase tracking-[1px] transition-colors border-b-2 whitespace-nowrap',
                isActive
                  ? 'text-crimson-bright border-crimson-bright'
                  : 'text-parchment-dim border-transparent hover:text-parchment',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Contenido del tab activo */}
      <div className="flex flex-col flex-1">
        {TAB_CONTENT[effectiveTab]}
      </div>
    </div>
  )
}
