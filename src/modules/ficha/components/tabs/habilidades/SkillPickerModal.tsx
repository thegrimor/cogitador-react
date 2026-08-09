import { useState } from 'react'
import { Modal } from '@/shared/components/Modal'
import type { SkillDefinition } from '@/core/data/darkheresy'

export interface SkillSection {
  /** Nombre del rango de carrera al que pertenece esta sección, o '' para lista plana sin agrupar. */
  label: string
  skills: SkillDefinition[]
}

const LEVEL_OPTIONS: { value: number; label: string }[] = [
  { value: 0,  label: 'Entrenado' },
  { value: 10, label: 'Avanzado'  },
  { value: 20, label: 'Maestro'   },
]

interface Props {
  sections: SkillSection[]
  /** Nombre → nivel de las habilidades que el personaje ya tiene. Ya adquirida = no se puede repetir; el nivel se ajusta con los puntos de la lista, no reañadiendo. */
  ownedLevels: Record<string, number>
  onAdd: (skill: SkillDefinition, level: number, xp: number) => void
  onClose: () => void
}

/**
 * Catálogo de habilidades disponibles a pantalla completa — mismo patrón que el de talentos:
 * buscador + secciones por rango de carrera, nivel inicial y PE editables por fila, sin paso
 * intermedio de confirmación. Una habilidad ya adquirida no se puede volver a añadir — su nivel
 * se ajusta con los puntos clicables del listado principal, no desde aquí.
 */
export function SkillPickerModal({ sections, ownedLevels, onAdd, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [xpByName, setXpByName] = useState<Record<string, number>>({})
  const [levelByName, setLevelByName] = useState<Record<string, number>>({})

  const q = query.trim().toLowerCase()
  const visibleSections = sections
    .map(s => ({ ...s, skills: q ? s.skills.filter(sk => sk.name.toLowerCase().includes(q)) : s.skills }))
    .filter(s => s.skills.length > 0)

  function xpFor(name: string) {
    return xpByName[name] ?? 100
  }
  function levelFor(name: string) {
    return levelByName[name] ?? 0
  }

  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex flex-col bg-surface-2">
        <div className="flex items-center justify-between border-b border-rim px-4 py-3 shrink-0">
          <p className="font-display text-[11px] uppercase tracking-[3px] text-crimson">// Habilidades Disponibles</p>
          <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-base px-1.5 py-0.5">✕</button>
        </div>

        <div className="px-4 py-2.5 border-b border-rim shrink-0">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar habilidad…"
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
              {section.skills.map(s => {
                const ownedLevel = ownedLevels[s.name]
                const owned = ownedLevel != null
                return (
                  <div
                    key={s.name}
                    className={[
                      'border px-3 py-2.5 flex flex-col gap-1.5',
                      owned ? 'border-rim bg-surface/60 opacity-70' : 'border-rim-bright bg-surface',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-rajdhani font-bold text-[14px] text-parchment-bright">{s.name}</span>
                      <span className="font-mono text-[9px] bg-gold/20 text-gold px-1.5 py-0.5">{s.attr}</span>
                    </div>
                    {s.notes && <p className="font-rajdhani text-[12px] text-parchment-dim">{s.notes}</p>}

                    {owned ? (
                      <p className="font-mono text-[9px] uppercase tracking-[1px] text-gold text-right mt-1">
                        Ya la tienes ({LEVEL_OPTIONS.find(o => o.value === ownedLevel)?.label ?? 'Entrenado'})
                      </p>
                    ) : (
                      <div className="flex gap-2 items-center justify-end flex-wrap mt-1">
                        <select
                          value={levelFor(s.name)}
                          onChange={e => setLevelByName(m => ({ ...m, [s.name]: Number(e.target.value) }))}
                          className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-1.5 py-1.5 outline-none focus:border-crimson transition-colors"
                        >
                          {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <span className="font-mono text-[8px] uppercase tracking-[1px] text-parchment-dim">PE</span>
                        <input
                          type="number"
                          min={0}
                          value={xpFor(s.name)}
                          onChange={e => setXpByName(m => ({ ...m, [s.name]: Number(e.target.value) || 0 }))}
                          className="w-16 bg-surface border border-rim-bright text-gold-bright font-display text-sm text-center px-1.5 py-1 outline-none focus:border-gold transition-colors"
                        />
                        <button
                          onClick={() => onAdd(s, levelFor(s.name), xpFor(s.name))}
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
