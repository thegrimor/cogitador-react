import { useState } from 'react'
import { useAppDispatch } from '@/core/store/hooks'
import { addSequito, addSequitoBulk } from '../services/sequitoSlice'
import { showToast } from '@/shared/components/Toast'
import { Modal } from '@/shared/components/Modal'

interface Props {
  layerId: string
  onClose: () => void
}

type Mode = 'single' | 'bulk'

export function AddSeqModal({ layerId, onClose }: Props) {
  const dispatch = useAppDispatch()
  const [mode, setMode] = useState<Mode>('single')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [baseName, setBaseName] = useState('')
  const [bulkRole, setBulkRole] = useState('')
  const [qty, setQty] = useState(5)
  const [start, setStart] = useState(1)

  function handleSubmit() {
    if (mode === 'single') {
      const finalName = name.trim() || 'Séquito'
      dispatch(addSequito({ layerId, name: finalName, role: role.trim() }))
      showToast('Séquito añadido')
    } else {
      const finalBase = baseName.trim() || 'Séquito'
      const finalQty = Math.min(200, Math.max(1, qty))
      dispatch(addSequitoBulk({ layerId, baseName: finalBase, role: bulkRole.trim(), qty: finalQty, start }))
      showToast(`${finalQty} séquito añadidos`)
    }
    onClose()
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <Modal>
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="w-full sm:max-w-md border-t-[3px] border-crimson bg-surface-2 border border-rim-bright flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-rim px-[18px] py-[14px] flex-shrink-0">
          <h3 className="font-display text-[11px] uppercase tracking-[3px] text-crimson">
            // AÑADIR SÉQUITO
          </h3>
          <button
            onClick={onClose}
            className="text-parchment-dim hover:text-crimson-bright transition-colors text-[13px] px-[5px] py-0.5"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-[18px] space-y-3">
          <div className="flex flex-col gap-[5px]">
            <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
              Modo
            </label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value as Mode)}
              className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson"
            >
              <option value="single">Individual</option>
              <option value="bulk">En masa</option>
            </select>
          </div>

          {mode === 'single' ? (
            <>
              <div className="flex flex-col gap-[5px]">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nombre del séquito..."
                  autoFocus
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson placeholder:text-parchment-dim/40"
                />
              </div>
              <div className="flex flex-col gap-[5px]">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Rol / Tipo
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="Guardia, Espía, Técnico..."
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson placeholder:text-parchment-dim/40"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-[5px]">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Nombre base
                </label>
                <input
                  type="text"
                  value={baseName}
                  onChange={e => setBaseName(e.target.value)}
                  placeholder="Guardia"
                  autoFocus
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson placeholder:text-parchment-dim/40"
                />
              </div>
              <div className="flex flex-col gap-[5px]">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Rol
                </label>
                <input
                  type="text"
                  value={bulkRole}
                  onChange={e => setBulkRole(e.target.value)}
                  placeholder="Guardia personal"
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson placeholder:text-parchment-dim/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-[5px]">
                  <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    value={qty}
                    min={1}
                    max={200}
                    onChange={e => setQty(Number(e.target.value))}
                    className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson"
                  />
                </div>
                <div className="flex flex-col gap-[5px]">
                  <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                    Numeración desde
                  </label>
                  <input
                    type="number"
                    value={start}
                    min={1}
                    onChange={e => setStart(Number(e.target.value))}
                    className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 border-t border-rim px-[18px] py-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-surface-3 border border-rim-bright py-2 font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment hover:border-parchment-dim transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-crimson py-2 font-display text-[9px] uppercase tracking-[2px] text-white hover:bg-crimson-bright transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
    </Modal>
  )
}
