import { useState } from 'react'
import { CharacterHeader } from './CharacterHeader'
import { ExperiencePanel } from './ExperiencePanel'
import { AtributosTab } from './tabs/AtributosTab'
import { HabilidadesTab } from './tabs/HabilidadesTab'
import { TalentosTab } from './tabs/TalentosTab'
import { ArmeriaTab } from './tabs/ArmeriaTab'
import { EquipoTab } from './tabs/EquipoTab'
import { MejorasTab } from './tabs/MejorasTab'
import { PoderesPsiquicosTab } from './tabs/PoderesPsiquicosTab'

type FichaTabId =
  | 'atributos'
  | 'habilidades'
  | 'talentos'
  | 'armeria'
  | 'equipo'
  | 'mejoras'
  | 'poderes'

interface FichaTab {
  id: FichaTabId
  label: string
}

const TABS: FichaTab[] = [
  { id: 'atributos',   label: 'Atrib.'   },
  { id: 'habilidades', label: 'Habil.'   },
  { id: 'talentos',    label: 'Talent.'  },
  { id: 'armeria',     label: 'Armer.'   },
  { id: 'equipo',      label: 'Equipo'   },
  { id: 'mejoras',     label: 'Mejoras'  },
  { id: 'poderes',     label: 'Psíq.'    },
]

const TAB_CONTENT: Record<FichaTabId, React.ReactNode> = {
  atributos:   <AtributosTab />,
  habilidades: <HabilidadesTab />,
  talentos:    <TalentosTab />,
  armeria:     <ArmeriaTab />,
  equipo:      <EquipoTab />,
  mejoras:     <MejorasTab />,
  poderes:     <PoderesPsiquicosTab />,
}

export function FichaView() {
  const [activeTab, setActiveTab] = useState<FichaTabId>('atributos')

  return (
    <div className="flex flex-col flex-1">
      <CharacterHeader />
      <ExperiencePanel />

      {/* Tab bar interno de ficha */}
      <div className="flex overflow-x-auto border-b border-rim-bright bg-surface-2 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab
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
        {TAB_CONTENT[activeTab]}
      </div>
    </div>
  )
}
