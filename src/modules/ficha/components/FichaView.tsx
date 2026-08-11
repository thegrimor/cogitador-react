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
import { PariaTab } from './tabs/PariaTab'
import { CaidosTab } from './tabs/CaidosTab'
import type { Character } from '../types/fichaTypes'

// 10 tabs del HTML legacy (charinfo/attrs/vital/skills/talents/armory/
// mechadendrites/powers/inquisidor/fallen) + 'xp', mejora consciente sin
// equivalente en el legacy (aprobada explícitamente, no forma parte de la
// migración 1:1) + 'paria', subclase nueva (ver CLAUDE.md).
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
  | 'paria'
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
  { id: 'paria',           label: 'Paria'      },
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
  paria:           <PariaTab />,
  caidos:          <CaidosTab />,
}

// Un Nulo/Paria nunca tiene Poderes Psíquicos, Factor Psíquico, Fe Pura ni Hechicería
// (regla del rasgo Nulo) — por eso se comprueba subclass antes que carrera/talentos.
function hasPsychicAccess(char?: Character) {
  if (!char) return false
  if (char.info.subclass === 'paria') return false
  if (char.info.career === 'Psíquico Imperial') return true
  return char.talents.some(t => /^Factor psíquico/i.test(t.name))
}

export function FichaView() {
  const [activeTab, setActiveTab] = useState<FichaTabId>('personaje')
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)

  // Inquis./Paria solo son visibles con la subclase correspondiente; Psíq. solo con
  // Factor Psíquico (talento o carrera pertinente), nunca con subclase Paria.
  const visibleTabs = TABS.filter(t => {
    if (t.id === 'inquisidor') return activeChar?.info.subclass === 'inquisidor'
    if (t.id === 'paria') return activeChar?.info.subclass === 'paria'
    if (t.id === 'poderes') return hasPsychicAccess(activeChar)
    return true
  })
  // Si el personaje activo cambia y el tab activo deja de estar disponible, no nos
  // quedamos en un tab oculto.
  const effectiveTab: FichaTabId = visibleTabs.some(t => t.id === activeTab)
    ? activeTab
    : 'personaje'

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
