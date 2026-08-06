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
    <div className="fixed inset-0 z-50 flex items-end bg-black/85" onClick={onClose}>
      <div
        className="w-full max-h-[80vh] flex flex-col border-t-2 border-gold bg-surface-2"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-rim-bright px-4 py-3 shrink-0">
          <p className="font-display text-[10px] uppercase tracking-[3px] text-gold">
            // Añadir del Libro — {title}
          </p>
          <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-sm">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex flex-col gap-1 w-[130px] shrink-0">
              <label className="font-mono text-[8px] uppercase tracking-[1px] text-parchment-dim">Categoría</label>
              <select
                value={groupFilter}
                onChange={e => { setGroupFilter(e.target.value); setSelName('') }}
                className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2 py-1.5 outline-none focus:border-gold"
              >
                <option value="">Todas</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <label className="font-mono text-[8px] uppercase tracking-[1px] text-parchment-dim">Objeto</label>
              <select
                value={selName}
                onChange={e => setSelName(e.target.value)}
                className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2 py-1.5 outline-none focus:border-gold"
              >
                <option value="">— Selecciona —</option>
                {filtered.map(e => <option key={e.name} value={e.name}>{e.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-surface border border-rim px-3 py-2.5 font-mono text-[11px] text-parchment-dim min-h-[40px] leading-relaxed">
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

          <div className="flex flex-col gap-1 w-24">
            <label className="font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim">Unidades en stock</label>
            <input
              type="number"
              value={qty}
              min={1}
              onChange={e => setQty(Number(e.target.value))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-2.5 py-1.5 outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-rim-bright px-4 py-3 shrink-0">
          <button
            onClick={onClose}
            className="font-display text-[9px] uppercase tracking-[2px] border border-rim-bright text-parchment-dim px-4 py-2 hover:text-parchment transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className="font-display text-[9px] uppercase tracking-[2px] bg-gold text-black font-bold px-4 py-2 hover:bg-gold-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
    </Modal>
  )
}
