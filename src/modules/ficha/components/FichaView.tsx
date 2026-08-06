import { useState } from 'react'
import { useAppSelector } from '@/core/store/hooks'
import { CharacterHeader } from './CharacterHeader'
import { ExperiencePanel } from './ExperiencePanel'
import { PersonajeTab } from './tabs/PersonajeTab'
import { CaracteristicasTab } from './tabs/CaracteristicasTab'
import { EstadoTab } from './tabs/EstadoTab'
import { HabilidadesTab } from './tabs/HabilidadesTab'
import { TalentosTab } from './tabs/TalentosTab'
import { ArmeriaTab } from './tabs/ArmeriaTab'
import { MejorasTab } from './tabs/MejorasTab'
import { PoderesPsiquicosTab } from './tabs/PoderesPsiquicosTab'
import { XpTab } from './tabs/XpTab'
import { InquisidorTab } from './tabs/InquisidorTab'
import { CaidosTab } from './tabs/CaidosTab'

// 10 tabs del HTML legacy (charinfo/attrs/vital/skills/talents/armory/
// mechadendrites/powers/inquisidor/fallen) + 'xp', mejora consciente sin
// equivalente en el legacy (aprobada explícitamente, no forma parte de la
// migración 1:1).
type FichaTabId =
  | 'personaje'
  | 'caracteristicas'
  | 'estado'
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
  { id: 'personaje',       label: 'Personaje' },
  { id: 'caracteristicas', label: 'Caract.'    },
  { id: 'estado',          label: 'Estado'     },
  { id: 'habilidades',     label: 'Habil.'     },
  { id: 'talentos',        label: 'Talent.'    },
  { id: 'armeria',         label: 'Armer.'     },
  { id: 'mejoras',         label: 'Mejoras'    },
  { id: 'poderes',         label: 'Psíq.'      },
  { id: 'xp',              label: 'XP'         },
  { id: 'inquisidor',      label: 'Inquis.'    },
  { id: 'caidos',          label: 'Caídos'     },
]

const TAB_CONTENT: Record<FichaTabId, React.ReactNode> = {
  personaje:       <PersonajeTab />,
  caracteristicas: <CaracteristicasTab />,
  estado:          <EstadoTab />,
  habilidades:     <HabilidadesTab />,
  talentos:        <TalentosTab />,
  armeria:         <ArmeriaTab />,
  mejoras:         <MejorasTab />,
  poderes:         <PoderesPsiquicosTab />,
  xp:              <XpTab />,
  inquisidor:      <InquisidorTab />,
  caidos:          <CaidosTab />,
}

export function FichaView() {
  const [activeTab, setActiveTab] = useState<FichaTabId>('personaje')
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)

  // El tab Inquisidor solo es visible para el slot con role='inquisidor'
  const visibleTabs = TABS.filter(t => t.id !== 'inquisidor' || activeChar?.info.role === 'inquisidor')
  // Si el personaje activo cambia y deja de ser Inquisidor, no nos quedamos en un tab oculto
  const effectiveTab: FichaTabId = activeTab === 'inquisidor' && activeChar?.info.role !== 'inquisidor'
    ? 'personaje'
    : activeTab

  return (
    <div className="flex flex-col flex-1">
      <CharacterHeader />
      <ExperiencePanel />

      {/*
        Tab bar interno de ficha — el legacy usa flex-wrap (varias filas de
        ~33% de ancho cada tab en móvil), NO scroll horizontal. Ver .tabs/.tab
        del HTML original.
      */}
      <div className="flex flex-wrap border-b-2 border-crimson-dim bg-surface-2">
        {visibleTabs.map((tab) => {
          const isActive = tab.id === effectiveTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex-[1_1_calc(33.333%-2px)] sm:flex-1 sm:min-w-[80px] px-2 py-2 font-display text-[9px] uppercase tracking-[1px] transition-colors border-b-2 whitespace-nowrap text-center',
                isActive
                  ? 'text-crimson-bright border-crimson-bright bg-surface-3'
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
