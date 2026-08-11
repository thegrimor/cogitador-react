import { useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { Modal } from '@/shared/components/Modal'
import { FichaView, fichaReducer } from '@/modules/ficha'
import { SequitoView, sequitoReducer } from '@/modules/sequito'
import { ProyectosView, proyectosReducer } from '@/modules/proyectos'
import { NotasView, notasReducer } from '@/modules/notas'
import type { CampaignMember } from '../types/campanaTypes'

interface Props {
  member: CampaignMember
  onBack: () => void
}

type ProfileTab = 'ficha' | 'proyectos' | 'sequito' | 'notas'

const TABS: Array<{ id: ProfileTab; label: string; symbol: string }> = [
  { id: 'ficha',     label: 'Ficha',     symbol: '✦' },
  { id: 'proyectos', label: 'Proyectos', symbol: '⚙' },
  { id: 'sequito',   label: 'Séquito',   symbol: '☩' },
  { id: 'notas',     label: 'Notas',     symbol: '📜' },
]

const EMPTY_FICHA = { characters: [], activeCharacterId: null, fallen: [] }
const EMPTY_SEQUITO = { layers: [], sequito: {}, armory: [], implants: [], mechadendrites: [], equipment: [], armor: [] }
const EMPTY_PROYECTOS = { globalDay: 0, projects: [] }
const EMPTY_NOTAS = { notes: [] }

/**
 * Perfil de un jugador ajeno = su app real, no un resumen: monta las 4
 * vistas reales (Ficha/Proyectos/Séquito/Notas — las mismas que usa el
 * propio jugador) sobre un único store de Redux propio y desechable,
 * precargado con los 4 bloques de datos que trae getCampaignDetail.
 * Cualquier interacción dispara acciones reales de cada slice, pero
 * contra esa copia en memoria — no hay CloudSync aquí, así que nunca toca
 * el backend ni los datos reales del jugador.
 *
 * Overlay a pantalla completa (no embebido en el layout de CampanaView):
 * así no arrastra la cabecera "← Partidas / Nombre" ni las sub-tabs
 * Jugadores/Notas por debajo — la inmersión es la app del jugador, punto.
 */
export function PlayerProfileView({ member, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('ficha')

  const store = useMemo(() => configureStore({
    reducer: { ficha: fichaReducer, sequito: sequitoReducer, proyectos: proyectosReducer, notas: notasReducer },
    preloadedState: {
      ficha: member.ficha ?? EMPTY_FICHA,
      sequito: member.sequito ?? EMPTY_SEQUITO,
      proyectos: member.proyectos ?? EMPTY_PROYECTOS,
      notas: member.notas ?? EMPTY_NOTAS,
    },
  }), [member])

  return (
    <Modal>
    <div className="fixed inset-0 z-40 flex flex-col bg-surface font-mono text-parchment">
      <div className="flex items-center justify-between gap-3 border-b border-rim-bright bg-surface-2 px-4 py-2.5 shrink-0">
        <button
          onClick={onBack}
          className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment transition-colors"
        >
          ← Menú de la partida
        </button>
        <p className="font-display text-xs text-gold tracking-[1px] truncate">{member.username}</p>
      </div>
      <div className="border-b border-gold/40 bg-gold/10 px-3 py-1.5 shrink-0">
        <p className="font-mono text-[9px] uppercase tracking-[2px] text-gold text-center">
          🔒 Solo lectura — los cambios aquí no se guardan
        </p>
      </div>

      <Provider store={store}>
        <div className="flex flex-1 flex-col overflow-y-auto pb-16">
          {activeTab === 'ficha' && <FichaView />}
          {activeTab === 'proyectos' && <ProyectosView />}
          {activeTab === 'sequito' && <SequitoView />}
          {activeTab === 'notas' && <NotasView />}
        </div>
      </Provider>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-rim-bright bg-surface-2">
        {TABS.map(tab => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex flex-1 flex-col items-center justify-center gap-1 py-3 font-display text-[9px] uppercase tracking-[2px] transition-colors',
                isActive
                  ? 'text-crimson-bright border-t-2 border-crimson-bright -mt-px'
                  : 'text-parchment-dim border-t-2 border-transparent -mt-px hover:text-parchment',
              ].join(' ')}
            >
              <span className={['text-lg', isActive ? 'animate-pulse-mech' : ''].join(' ')}>{tab.symbol}</span>
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
    </Modal>
  )
}
