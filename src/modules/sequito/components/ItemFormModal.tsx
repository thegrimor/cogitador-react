import { useState } from 'react'
import { Modal } from '@/shared/components/Modal'

export interface ItemFormData {
  name: string
  type: string
  stock: number
  notes: string
}

interface Props {
  title: string
  initial?: ItemFormData
  namePlaceholder: string
  typePlaceholder: string
  notesPlaceholder: string
  onSave: (data: ItemFormData) => void
  onClose: () => void
}

/** Modal de alta/edición manual de un objeto de inventario — equivalente al "+ MANUAL" / "EDITAR OBJETO" del HTML legacy. */
export function ItemFormModal({ title, initial, namePlaceholder, typePlaceholder, notesPlaceholder, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState(initial?.type ?? '')
  const [stock, setStock] = useState(initial?.stock ?? 1)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  function handleConfirm() {
    if (!name.trim()) return
    onSave({ name: name.trim(), type: type.trim(), stock: Math.max(0, stock) || 1, notes: notes.trim() })
  }

  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/85" onClick={onClose}>
        <div
          className="w-full max-w-[480px] max-h-[90vh] flex flex-col border border-rim-bright border-t-[3px] border-t-crimson bg-surface-2"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-rim px-[18px] py-[14px] shrink-0">
            <p className="font-display text-[11px] uppercase tracking-[3px] text-crimson">// {title}</p>
            <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-[13px] px-[5px] py-0.5">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-3">
            <div className="flex flex-col gap-[5px]">
              <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">Nombre</label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={namePlaceholder}
                className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson placeholder:text-parchment-dim/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              <div className="flex flex-col gap-[5px]">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">Tipo / Categoría</label>
                <input
                  type="text"
                  value={type}
                  onChange={e => setType(e.target.value)}
                  placeholder={typePlaceholder}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson placeholder:text-parchment-dim/40"
                />
              </div>
              <div className="flex flex-col gap-[5px]">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">Unidades</label>
                <input
                  type="number"
                  value={stock}
                  min={0}
                  onChange={e => setStock(Number(e.target.value))}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">Notas / Stats</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={notesPlaceholder}
                className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson placeholder:text-parchment-dim/40"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-rim px-[18px] py-3 shrink-0">
            <button
              onClick={onClose}
              className="font-display text-[7px] uppercase tracking-[2px] bg-surface-3 border border-rim-bright text-parchment-dim px-[9px] py-1 hover:text-parchment hover:border-parchment-dim transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!name.trim()}
              className="font-display text-[7px] uppercase tracking-[2px] bg-crimson text-white px-[9px] py-1 hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
