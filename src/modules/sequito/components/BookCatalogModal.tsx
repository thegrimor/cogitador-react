import { useState } from 'react'
import { Modal } from '@/shared/components/Modal'

export interface CatalogEntry {
  name: string
  type: string
  notes: string
}

interface Props {
  title: string
  entries: CatalogEntry[]
  onPick: (entry: CatalogEntry) => void
  onClose: () => void
}

/** Modal de catálogo genérico ("+ del libro") — comparte lógica entre Armería e Inventario. */
export function BookCatalogModal({ title, entries, onPick, onClose }: Props) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? entries.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.type.toLowerCase().includes(query.toLowerCase())
      )
    : entries

  return (
    <Modal>
    <div className="fixed inset-0 z-50 flex items-end bg-black/85" onClick={onClose}>
      <div
        className="w-full max-h-[80vh] flex flex-col border-t-2 border-gold bg-surface-2"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-rim-bright px-4 py-3 shrink-0">
          <p className="font-display text-[10px] uppercase tracking-[3px] text-gold">
            // {title} — Del Libro
          </p>
          <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-sm">✕</button>
        </div>

        <div className="px-4 py-3 border-b border-rim-bright shrink-0">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre o grupo..."
            className="w-full bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold placeholder:text-parchment-dim/40"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center font-mono text-xs text-parchment-dim">
              Sin resultados
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-rim">
              {filtered.map(entry => (
                <button
                  key={entry.name}
                  onClick={() => onPick(entry)}
                  className="flex flex-col gap-0.5 px-4 py-2.5 text-left hover:bg-surface-3 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-rajdhani font-semibold text-parchment text-sm">{entry.name}</span>
                    {entry.type && (
                      <span className="font-mono text-[9px] bg-gold/20 text-gold px-1.5 py-0.5 shrink-0">{entry.type}</span>
                    )}
                  </div>
                  {entry.notes && (
                    <p className="font-mono text-[10px] text-parchment-dim line-clamp-2">{entry.notes}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </Modal>
  )
}
