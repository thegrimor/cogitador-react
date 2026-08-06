import { useMemo, useState } from 'react'
import { Modal } from '@/shared/components/Modal'

export interface CatalogEntry {
  name: string
  type: string
  notes: string
}

interface Props {
  title: string
  entries: CatalogEntry[]
  onPick: (entry: CatalogEntry, qty: number) => void
  onClose: () => void
}

/** Modal de catálogo genérico ("+ del libro") — filtro por categoría + selector + preview + stock, igual que openAddFromBook()/openCatalogModal() del HTML legacy. */
export function BookCatalogModal({ title, entries, onPick, onClose }: Props) {
  const [groupFilter, setGroupFilter] = useState('')
  const [selName, setSelName] = useState('')
  const [qty, setQty] = useState(1)

  const groups = useMemo(() => Array.from(new Set(entries.map(e => e.type))).sort(), [entries])
  const filtered = groupFilter ? entries.filter(e => e.type === groupFilter) : entries
  const selected = entries.find(e => e.name === selName)

  function handleConfirm() {
    if (!selected) return
    onPick(selected, Math.max(1, qty))
  }

  return (
    <Modal>
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/85" onClick={onClose}>
      <div
        className="w-full max-w-[480px] max-h-[90vh] flex flex-col border border-rim-bright border-t-[3px] border-t-crimson bg-surface-2"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-rim px-[18px] py-[14px] shrink-0">
          <p className="font-display text-[11px] uppercase tracking-[3px] text-crimson">
            // Añadir del Libro{title ? ` — ${title}` : ''}
          </p>
          <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-[13px] px-[5px] py-0.5">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-end mb-3">
            <div className="flex flex-col gap-1 w-[130px] shrink-0">
              <label className="font-mono text-[8px] text-parchment-dim tracking-[1px]">Categoría</label>
              <select
                value={groupFilter}
                onChange={e => { setGroupFilter(e.target.value); setSelName('') }}
                className="bg-surface-2 border border-rim-bright text-parchment font-mono text-[11px] px-[7px] py-[5px] outline-none"
              >
                <option value="">Todas</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <label className="font-mono text-[8px] text-parchment-dim tracking-[1px]">Objeto</label>
              <select
                value={selName}
                onChange={e => setSelName(e.target.value)}
                className="bg-surface-2 border border-rim-bright text-parchment font-mono text-[11px] px-[7px] py-[5px] outline-none"
              >
                <option value="">— Selecciona —</option>
                {filtered.map(e => <option key={e.name} value={e.name}>{e.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-surface border border-rim px-3 py-[10px] font-mono text-[11px] text-parchment-dim min-h-[40px] leading-[1.8] mb-3">
            {selected ? (
              <>
                <div className="font-rajdhani font-bold text-sm text-parchment mb-1">{selected.name}</div>
                <span className="text-gold text-[9px]">{selected.type}</span>
                <br />
                <span className="text-parchment">{selected.notes}</span>
              </>
            ) : (
              'Selecciona un objeto para ver sus características.'
            )}
          </div>

          <div className="flex flex-col gap-[5px] w-24">
            <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">Unidades en stock</label>
            <input
              type="number"
              value={qty}
              min={1}
              onChange={e => setQty(Number(e.target.value))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-[10px] py-[7px] outline-none focus:border-crimson"
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
            disabled={!selected}
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
