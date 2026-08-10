import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { FichaView, fichaReducer } from '@/modules/ficha'
import type { Character, FichaState } from '@/modules/ficha'

interface Props {
  characters: Character[]
}

/**
 * Ficha real de un jugador ajeno — reutiliza FichaView y sus 11 tabs tal
 * cual las ve el propio jugador, montadas sobre un store de Redux propio y
 * desechable (no el store de la app). Cualquier interacción dispara
 * acciones reales de fichaSlice, pero contra esta copia en memoria: no hay
 * CloudSync aquí, así que nunca toca los datos reales del jugador ni el
 * backend, aunque master/admin toquen algo mientras navegan.
 */
export function ReadOnlyFicha({ characters }: Props) {
  const store = useMemo(() => {
    const preloadedState: { ficha: FichaState } = {
      ficha: { characters, activeCharacterId: characters[0]?.id ?? null, fallen: [] },
    }
    return configureStore({ reducer: { ficha: fichaReducer }, preloadedState })
  }, [characters])

  return (
    <div className="border border-rim-bright">
      <div className="border-b border-gold/40 bg-gold/10 px-3 py-1.5">
        <p className="font-mono text-[9px] uppercase tracking-[2px] text-gold">
          🔒 Solo lectura — los cambios aquí no se guardan
        </p>
      </div>
      <Provider store={store}>
        <FichaView />
      </Provider>
    </div>
  )
}
