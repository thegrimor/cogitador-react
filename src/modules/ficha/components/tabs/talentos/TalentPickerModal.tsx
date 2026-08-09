import { useState } from 'react'
import { Modal } from '@/shared/components/Modal'
import type { TalentDefinition } from '@/core/data/darkheresy'

export interface TalentSection {
  /** Nombre del rango de carrera al que pertenece esta sección, o '' para lista plana sin agrupar. */
  label: string
  talents: TalentDefinition[]
}

interface Props {
  sections: TalentSection[]
  /** Nº de veces que el personaje ya tiene cada talento (por nombre) — no bloquea salvo que haya tope en maxCounts. */
  ownedCounts: Record<string, number>
  /** Tope de compras por nombre (p.ej. Robusto según carrera+rango, manual básico). Sin entrada = sin tope. */
  maxCounts?: Record<string, number>
  onAdd: (talent: TalentDefinition, xp: number) => void
  onClose: () => void
}

/**
 * Catálogo de talentos disponibles a pantalla completa — buscador + secciones (por rango de
 * carrera, de menos a más poderoso, o una única lista alfabética sin carrera activa) con
 * descripción, efecto y PE editable visibles por fila, sin paso intermedio de confirmación.
 */
export function TalentPickerModal({ sections, ownedCounts, maxCounts, onAdd, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [xpByName, setXpByName] = useState<Record<string, number>>({})

  const q = query.trim().toLowerCase()
  const visibleSections = sections
    .map(s => ({ ...s, talents: q ? s.talents.filter(t => t.name.toLowerCase().includes(q)) : s.talents }))
    .filter(s => s.talents.length > 0)

  function xpFor(name: string) {
    return xpByName[name] ?? 100
  }

  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex flex-col bg-surface-2">
        <div className="flex items-center justify-between border-b border-rim px-4 py-3 shrink-0">
          <p className="font-display text-[11px] uppercase tracking-[3px] text-crimson">// Talentos Disponibles</p>
          <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-base px-1.5 py-0.5">✕</button>
        </div>

        <div className="px-4 py-2.5 border-b border-rim shrink-0">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar talento…"
            className="w-full bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors placeholder:text-parchment-dim/40"
          />
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-3.5">
          {visibleSections.length === 0 && (
            <p className="font-mono text-[11px] text-parchment-dim text-center py-6">Sin resultados.</p>
          )}
          {visibleSections.map(section => (
            <div key={section.label || '__flat__'} className="flex flex-col gap-2">
              {section.label && (
                <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold sticky top-0 bg-surface-2 py-1">
                  ◆ {section.label}
                </h4>
              )}
              {section.talents.map(t => {
                const count = ownedCounts[t.name] ?? 0
                const max = maxCounts?.[t.name]
                const atCap = max != null && count >= max
                return (
                  <div
                    key={t.name}
                    className={[
                      'border px-3 py-2.5 flex flex-col gap-1.5',
                      atCap ? 'border-rim bg-surface/60 opacity-70' : count > 0 ? 'border-gold/50 bg-surface' : 'border-rim-bright bg-surface',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-rajdhani font-bold text-[14px] text-parchment-bright">{t.name}</span>
                      {count > 0 && (
                        <span className="font-mono text-[9px] uppercase tracking-[1px] text-gold">
                          ✓ Ya tienes ×{count}{max != null ? `/${max}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className="font-mono text-[9px] bg-gold/20 text-gold px-1.5 py-0.5">{t.type}</span>
                      <span className="font-mono text-[9px] text-parchment-dim">Req: {t.req}</span>
                    </div>
                    {t.desc && <p className="font-rajdhani text-[12px] text-parchment-dim">{t.desc}</p>}
                    {t.effect && <p className="font-mono text-[10px] text-neon">► {t.effect}</p>}

                    {atCap ? (
                      <p className="font-mono text-[9px] uppercase tracking-[1px] text-crimson-bright text-right mt-1">
                        Tope alcanzado ({count}/{max})
                      </p>
                    ) : (
                      <div className="flex gap-2 items-center justify-end mt-1">
                        <span className="font-mono text-[8px] uppercase tracking-[1px] text-parchment-dim">PE</span>
                        <input
                          type="number"
                          min={0}
                          value={xpFor(t.name)}
                          onChange={e => setXpByName(m => ({ ...m, [t.name]: Number(e.target.value) || 0 }))}
                          className="w-16 bg-surface border border-rim-bright text-gold-bright font-display text-sm text-center px-1.5 py-1 outline-none focus:border-gold transition-colors"
                        />
                        <button
                          onClick={() => onAdd(t, xpFor(t.name))}
                          className="font-display text-[8px] uppercase tracking-[1px] px-2.5 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
                        >
                          Añadir
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
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
