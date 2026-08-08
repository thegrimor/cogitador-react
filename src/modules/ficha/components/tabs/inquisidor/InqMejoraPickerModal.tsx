import { useState } from 'react'
import { Modal } from '@/shared/components/Modal'
import type { InquisidorMejora } from '@/core/data/darkheresy'

export interface InqMejoraSection {
  rank: number
  /** Nota especial del rango (p.ej. tabla de coste de Heroico/Maestro en el rango 9) — se muestra fija en la sección, no solo mientras ese es el rango actual. */
  note: string
  mejoras: InquisidorMejora[]
}

interface Props {
  sections: InqMejoraSection[]
  onAdd: (mejora: InquisidorMejora) => void
  onClose: () => void
}

/**
 * Catálogo de mejoras de Inquisidor disponibles a pantalla completa — buscador + filtro de tipo +
 * secciones por rango (9 a 16, de menos a más poderoso, con la nota propia de cada rango) con
 * descripción, requisitos y coste (con signo, fijo por dato) visibles sin paso de previsualización.
 */
export function InqMejoraPickerModal({ sections, onAdd, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const types = Array.from(new Set(sections.flatMap(s => s.mejoras.map(m => m.type))))

  const q = query.trim().toLowerCase()
  const visibleSections = sections
    .map(s => ({
      ...s,
      mejoras: s.mejoras.filter(m =>
        (!q || m.name.toLowerCase().includes(q)) && (!typeFilter || m.type === typeFilter)
      ),
    }))
    .filter(s => s.mejoras.length > 0)

  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex flex-col bg-surface-2">
        <div className="flex items-center justify-between border-b border-rim px-4 py-3 shrink-0">
          <p className="font-display text-[11px] uppercase tracking-[3px] text-crimson">// Mejoras de Inquisidor Disponibles</p>
          <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-base px-1.5 py-0.5">✕</button>
        </div>

        <div className="px-4 py-2.5 border-b border-rim shrink-0 flex gap-2">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar mejora…"
            className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors placeholder:text-parchment-dim/40"
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="max-w-[160px] shrink-0 bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-2 py-2 outline-none focus:border-crimson transition-colors"
          >
            <option value="">Todos los tipos</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-3.5">
          {visibleSections.length === 0 && (
            <p className="font-mono text-[11px] text-parchment-dim text-center py-6">Sin resultados.</p>
          )}
          {visibleSections.map(section => (
            <div key={section.rank} className="flex flex-col gap-2">
              <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold sticky top-0 bg-surface-2 py-1">
                ◆ Rango {section.rank}
              </h4>
              {section.note && (
                <p className="font-mono text-[10px] text-parchment-dim bg-surface border border-rim px-2.5 py-2 leading-relaxed">{section.note}</p>
              )}
              {section.mejoras.map(m => (
                <div key={m.name} className="border border-rim-bright bg-surface px-3 py-2.5 flex flex-col gap-1.5">
                  <div className="font-rajdhani font-bold text-[14px] text-parchment-bright">{m.name}</div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="font-mono text-[9px] bg-gold/20 text-gold px-1.5 py-0.5">{m.type}</span>
                    {m.req && m.req !== '—' && <span className="font-mono text-[9px] text-parchment-dim">Req: {m.req}</span>}
                  </div>
                  {m.desc && <p className="font-rajdhani text-[12px] text-parchment-dim">{m.desc}</p>}

                  <div className="flex gap-2 items-center justify-end mt-1">
                    <span className={['font-display text-[13px]', m.cost < 0 ? 'text-crimson-bright' : 'text-gold-bright'].join(' ')}>
                      {m.cost > 0 ? '+' : ''}{m.cost} PE
                    </span>
                    <button
                      onClick={() => onAdd(m)}
                      className="font-display text-[8px] uppercase tracking-[1px] px-2.5 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-rim px-4 py-3 shrink-0">
          <button
            onClick={onClose}
            className="font-display text-[8px] uppercase tracking-[2px] bg-surface-3 border border-rim-bright text-parchment-dim px-3 py-1.5 hover:text-parchment hover:border-parchment-dim transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  )
}
