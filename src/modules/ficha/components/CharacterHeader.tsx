import { useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { selectCharacter, importCharacter, deleteCharacter, killCharacter } from '../services/fichaSlice'
import { CharacterCreateModal } from './CharacterCreateModal'
import { showToast } from '@/shared/components/Toast'
import { isLegacyExport, mapLegacyHtmlToCharacter } from '../services/fichaImportMapper'
import type { Character } from '../types/fichaTypes'

type OverlayMode = 'selector' | 'create' | null
type Role = 'inquisidor' | 'sequito'

const ROLE_LABEL: Record<Role, string> = { inquisidor: '⚔ Inquisidor', sequito: '☠ Séquito' }

export function CharacterHeader() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)
  const [overlay, setOverlay] = useState<OverlayMode>(null)
  const [createRole, setCreateRole] = useState<Role>('inquisidor')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasInquisidor = characters.some(c => c.info.role === 'inquisidor')
  const hasSequito = characters.some(c => c.info.role === 'sequito')
  const missingRoles: Role[] = [
    ...(hasInquisidor ? [] : (['inquisidor'] as Role[])),
    ...(hasSequito ? [] : (['sequito'] as Role[])),
  ]

  function openCreate(role: Role) {
    setCreateRole(role)
    setOverlay('create')
  }

  function handleExport() {
    if (!activeChar) return
    const json = JSON.stringify(activeChar, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dh_char_${activeChar.info.name.replace(/\s+/g, '_') || 'personaje'}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Personaje exportado')
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const raw: unknown = JSON.parse(evt.target?.result as string)
        let character: Character
        if (isLegacyExport(raw)) {
          character = mapLegacyHtmlToCharacter(raw)
        } else {
          character = raw as Character
        }
        dispatch(importCharacter(character))
        showToast('Personaje importado correctamente')
      } catch {
        showToast('Error al importar el fichero')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-rim-bright bg-surface-2 px-4 py-2">
        <button
          onClick={() => setOverlay('selector')}
          className="flex flex-col gap-0.5 text-left min-w-0"
        >
          <p className="font-rajdhani text-base font-semibold text-parchment leading-none truncate flex items-center gap-2">
            {activeChar?.info.name ?? '— Sin Designación —'}
            {activeChar && (
              <span className="font-display text-[8px] uppercase tracking-[1px] text-gold shrink-0">
                {ROLE_LABEL[activeChar.info.role === 'inquisidor' ? 'inquisidor' : 'sequito']}
              </span>
            )}
          </p>
          <p className="font-mono text-[10px] text-parchment-dim leading-none flex items-center gap-1">
            {activeChar
              ? `${activeChar.info.homeworld} // ${activeChar.info.career}`
              : 'Seleccionar operativo'}
            <span className="text-gold">▾</span>
          </p>
        </button>

        <div className="flex gap-1 shrink-0">
          <button
            onClick={handleExport}
            disabled={!activeChar}
            className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-gold hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ↓ Exp
          </button>
          <button
            onClick={handleImportClick}
            className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-gold hover:text-gold transition-colors"
          >
            ↑ Imp
          </button>
          {activeChar?.info.role === 'sequito' && (
            <button
              onClick={() => {
                if (!activeChar) return
                if (confirm(`¿Marcar a ${activeChar.info.name} como Caído en combate? Se creará un nuevo Séquito en blanco que hereda el 100% del PE.`)) {
                  dispatch(killCharacter(activeChar.id))
                  showToast(`${activeChar.info.name} ha caído en combate`)
                }
              }}
              className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-crimson hover:text-crimson transition-colors"
              title="Marcar como caído en combate"
            >
              ⚰
            </button>
          )}
          <button
            onClick={() => {
              if (!activeChar) return
              if (confirm(`¿Eliminar permanentemente a ${activeChar.info.name}?`)) {
                dispatch(deleteCharacter(activeChar.id))
                showToast('Personaje eliminado')
              }
            }}
            disabled={!activeChar}
            className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-crimson-bright hover:text-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Eliminar personaje"
          >
            ✕
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Importar personaje"
          />
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
              <div className="flex gap-1">
                {missingRoles.length === 0 ? (
                  <span className="font-display text-[8px] uppercase tracking-[1px] text-parchment-dim">
                    Ambos slots ocupados
                  </span>
                ) : (
                  missingRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => openCreate(role)}
                      className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-3 py-1 hover:bg-crimson-bright transition-colors"
                    >
                      + {role === 'inquisidor' ? 'Inquisidor' : 'Séquito'}
                    </button>
                  ))
                )}
              </div>
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
                          'font-rajdhani text-base font-semibold leading-none flex items-center gap-2',
                          isActive ? 'text-crimson-bright' : 'text-parchment',
                        ].join(' ')}>
                          {char.info.name || '— Sin Designación —'}
                          <span className="font-display text-[8px] uppercase tracking-[1px] text-gold">
                            {ROLE_LABEL[char.info.role === 'inquisidor' ? 'inquisidor' : 'sequito']}
                          </span>
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
        <CharacterCreateModal role={createRole} onClose={() => setOverlay(null)} />
      )}
    </>
  )
}
