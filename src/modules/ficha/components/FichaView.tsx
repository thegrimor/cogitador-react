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
        Tab bar interno de ficha — réplica pixel a pixel de .tabs/.tab del
        HTML legacy: flex-wrap (varias filas, no scroll lateral), cada tab
        con su propio borde de 3 lados (sin el inferior), fondo bg2/bg3,
        9px/letter-spacing 1px/padding 9px 10px por defecto y 8px/sin
        tracking/padding 8px 6px en ≤600px (aquí: base = móvil, sm: = ancho,
        ya que el proyecto es mobile-first). El tab activo cambia su borde a
        rojo y su borde inferior a 2px del color de fondo (se funde con el
        panel de abajo) — no es un subrayado de color.
      */}
      <div className="flex flex-wrap border-b-2 border-crimson-dim">
        {visibleTabs.map((tab) => {
          const isActive = tab.id === effectiveTab
          const base = 'flex-[1_1_calc(33.333%-2px)] sm:flex-1 sm:min-w-[80px] px-1.5 py-2 sm:px-2.5 sm:py-2.5 font-display text-[8px] sm:text-[9px] tracking-normal sm:tracking-[1px] uppercase whitespace-nowrap text-center cursor-pointer transition-colors border-l border-r border-t'
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                base,
                isActive
                  ? 'bg-surface-3 text-crimson-bright border-crimson-dim border-b-2 border-b-surface-3'
                  : 'bg-surface-2 text-parchment-dim border-rim hover:text-parchment hover:bg-surface-3',
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
