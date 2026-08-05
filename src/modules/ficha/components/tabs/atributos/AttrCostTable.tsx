import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { getAttrCostsForCareer } from '@/core/data/darkheresy/careers'
import { getAttrDots } from '../../../services/fichaComputed'
import type { Character } from '../../../types/fichaTypes'

const TIER_LABELS = ['Simple', 'Intermedio', 'Cualificado', 'Experto', 'Heroico', 'Maestro']

interface Props {
  char: Character
}

/** Tabla "// Costes de mejora (PE)" — igual que renderAttrCostTable() del HTML legacy. */
export function AttrCostTable({ char }: Props) {
  const costs = getAttrCostsForCareer(char.info.career)

  return (
    <div className="bg-surface-2 border border-rim overflow-x-auto">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Costes de Mejora (PE)
        </h3>
      </div>
      {Object.keys(costs).length === 0 ? (
        <p className="px-4 py-4 font-mono text-xs text-parchment-dim">
          Selecciona una carrera para ver los costes de mejora.
        </p>
      ) : (
        <table className="w-full text-[11px] font-mono">
          <thead>
            <tr className="border-b-2 border-crimson-dim">
              <th className="px-2 py-1.5 text-left font-display text-[8px] uppercase tracking-[1px] text-parchment-dim">Caract.</th>
              {TIER_LABELS.map((label, i) => (
                <th key={label} className="px-2 py-1.5 text-center font-display text-[8px] uppercase tracking-[1px] text-parchment-dim">
                  {label}<br /><span className="text-rim-bright text-[7px]">(+{(i + 1) * 10})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ATTRIBUTES.map(def => {
              const attrCosts = costs[def.key] ?? []
              const dots = getAttrDots(char.attrs[def.key])
              return (
                <tr key={def.key} className="border-b border-rim">
                  <td className="px-2 py-1.5 font-display text-[10px] text-gold-bright">{def.abbr}</td>
                  {[0, 1, 2, 3, 4, 5].map(i => {
                    const c = attrCosts[i]
                    const bought = i < dots
                    const na = c == null
                    return (
                      <td
                        key={i}
                        className={[
                          'px-2 py-1.5 text-center',
                          na ? 'text-rim-bright' : bought ? 'text-parchment-dim bg-crimson/10 line-through' : 'text-parchment',
                        ].join(' ')}
                      >
                        {na ? '—' : c.toLocaleString('es')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
