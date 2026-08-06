import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { ensureBothSlots, selectCharacter, importCharacter } from '../services/fichaSlice'
import { showToast } from '@/shared/components/Toast'
import { isLegacyExport, mapLegacyHtmlToCharacter } from '../services/fichaImportMapper'
import type { Character } from '../types/fichaTypes'

type Role = 'inquisidor' | 'sequito'

// Igual que updatePJButtons() del HTML legacy: la etiqueta es el nombre del
// personaje una vez puesto, o el rol por defecto si aún está en blanco.
const ROLE_FALLBACK_LABEL: Record<Role, string> = { inquisidor: '⚔ Inquisidor', sequito: '☠ Séquito' }

export function CharacterHeader() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const activeChar = characters.find(c => c.id === activeCharacterId)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Modelo de 2 slots fijos: sin flujo de alta, se garantizan al montar.
  useEffect(() => {
    dispatch(ensureBothSlots())
  }, [dispatch])

  const inquisidor = characters.find(c => c.info.role === 'inquisidor')
  const sequito = characters.find(c => c.info.role === 'sequito')

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
    <div className="flex flex-col gap-2 border-b border-rim-bright bg-surface-2 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-rajdhani text-base font-semibold text-parchment leading-none truncate">
            {activeChar?.info.name || 'Sin Designación'}
          </p>
          <p className="font-mono text-[10px] text-parchment-dim leading-none">
            Rango {activeChar?.info.rank || 1} // {activeChar?.info.career || '—'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={handleExport}
          className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-gold hover:text-gold transition-colors"
        >
          ↓ Exportar
        </button>
        <button
          onClick={handleImportClick}
          className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:border-gold hover:text-gold transition-colors"
        >
          ↑ Importar
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Importar personaje"
        />

        {/* Selector de rol — los 2 slots existen siempre, igual que pjBtn0/pjBtn1 */}
        <div className="flex gap-1 ml-auto">
          {inquisidor && (
            <button
              onClick={() => dispatch(selectCharacter(inquisidor.id))}
              className={[
                'font-display text-[8px] uppercase tracking-[1px] border px-2 py-1 transition-colors',
                activeCharacterId === inquisidor.id
                  ? 'border-gold text-gold'
                  : 'border-rim-bright text-parchment-dim hover:text-parchment',
              ].join(' ')}
            >
              {activeCharacterId === inquisidor.id ? '▶ ' : ''}
              {inquisidor.info.name || ROLE_FALLBACK_LABEL.inquisidor}
            </button>
          )}
          {sequito && (
            <button
              onClick={() => dispatch(selectCharacter(sequito.id))}
              className={[
                'font-display text-[8px] uppercase tracking-[1px] border px-2 py-1 transition-colors',
                activeCharacterId === sequito.id
                  ? 'border-gold text-gold'
                  : 'border-rim-bright text-parchment-dim hover:text-parchment',
              ].join(' ')}
            >
              {activeCharacterId === sequito.id ? '▶ ' : ''}
              {sequito.info.name || ROLE_FALLBACK_LABEL.sequito}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
