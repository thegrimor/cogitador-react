import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { selectCharacter } from '../services/fichaSlice'
import { CharacterCreateModal } from './CharacterCreateModal'

type OverlayMode = 'selector' | 'create' | null

export function CharacterHeader() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)
  const [overlay, setOverlay] = useState<OverlayMode>(null)

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-rim-bright bg-surface-2 px-4 py-2">
        <button
          onClick={() => setOverlay('selector')}
          className="flex flex-col gap-0.5 text-left min-w-0"
        >
          <p className="font-rajdhani text-base font-semibold text-parchment leading-none truncate">
            {activeChar?.info.name ?? '— Sin Designación —'}
          </p>
          <p className="font-mono text-[10px] text-parchment-dim leading-none flex items-center gap-1">
            {activeChar
              ? `${activeChar.info.homeworld} // ${activeChar.info.career}`
              : 'Seleccionar operativo'}
            <span className="text-gold">▾</span>
          </p>
        </button>

        <div className="flex gap-1 shrink-0">
          <button className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-gold hover:text-gold transition-colors">
            ↓ Exp
          </button>
          <button className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-gold hover:text-gold transition-colors">
            ↑ Imp
          </button>
        </div>
      </div>

      {/* Selector de personaje */}
      {overlay === 'selector' && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/80"
          onClick={() => setOverlay(null)}
        >
          <div
            className="w-full border-t-2 border-crimson bg-surface-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-rim-bright px-4 py-3">
              <p className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
                // Seleccionar Operativo
              </p>
              <button
                onClick={() => setOverlay('create')}
                className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-3 py-1 hover:bg-crimson-bright transition-colors"
              >
                + Nuevo
              </button>
            </div>

            {characters.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="font-mono text-xs text-parchment-dim">Sin operativos registrados</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {characters.map(char => {
                  const isActive = char.id === activeCharacterId
                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        dispatch(selectCharacter(char.id))
                        setOverlay(null)
                      }}
                      className={[
                        'flex items-center justify-between px-4 py-3 border-b border-rim transition-colors text-left border-l-2',
                        isActive
                          ? 'bg-crimson/10 border-l-crimson'
                          : 'hover:bg-surface-3 border-l-transparent',
                      ].join(' ')}
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className={[
                          'font-rajdhani text-base font-semibold leading-none',
                          isActive ? 'text-crimson-bright' : 'text-parchment',
                        ].join(' ')}>
                          {char.info.name}
                        </p>
                        <p className="font-mono text-[10px] text-parchment-dim">
                          Rango {char.info.rank} // {char.info.career} — {char.info.homeworld}
                        </p>
                      </div>
                      {isActive && (
                        <span className="font-display text-[8px] text-crimson uppercase tracking-[2px]">
                          Activo
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            <button
              onClick={() => setOverlay(null)}
              className="w-full py-3 font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal creación */}
      {overlay === 'create' && (
        <CharacterCreateModal onClose={() => setOverlay(null)} />
      )}
    </>
  )
}
