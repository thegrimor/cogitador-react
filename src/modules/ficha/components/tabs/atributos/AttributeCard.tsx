import { useAppDispatch } from '@/core/store/hooks'
import { updateAttribute } from '../../../services/fichaSlice'
import { getAttrCostsForCareer } from '@/core/data/darkheresy/careers'
import { getAttrDots, getAttrTotal, getCountedAttrDots } from '../../../services/fichaComputed'
import type { AttributeDefinition } from '@/core/data/darkheresy/attributes'
import type { AttributeValues } from '../../../types/fichaTypes'

interface Props {
  charId: string
  career: string
  def: AttributeDefinition
  values: AttributeValues
}

const DOT_LABELS = ['S', 'I', 'C', 'E', 'H', 'M']
const DOT_TITLES = ['Simple', 'Intermedio', 'Cualificado', 'Experto', 'Heroico', 'Maestro']
const FALLBACK_COSTS: Array<number | null> = [500, 750, 1000, 2500, null, null]

// Réplica de .attr-row del HTML legacy: fila única (grid 44px|52px|1fr), sin
// "bonus externo" ni "Tirada %" — ninguno de los dos existe en la UI real del
// legacy (bonuses solo aparece como campo heredado del import, sin input).
export function AttributeCard({ charId, career, def, values }: Props) {
  const dispatch = useAppDispatch()
  const dots = getAttrDots(values)
  const costs = getAttrCostsForCareer(career)[def.key] ?? FALLBACK_COSTS
  // Dots que realmente suman al total: los heredados de una carrera
  // anterior que ya no tienen "globito" comprable en la actual no cuentan.
  const countedDots = getCountedAttrDots(values, costs)
  const total = getAttrTotal(values, costs)
  const bonus = Math.floor(total / 10)

  function update(field: keyof AttributeValues, value: number | string) {
    dispatch(updateAttribute({ id: charId, key: def.key, field, value }))
  }

  // Igual que toggleAttrDot() del HTML legacy: click en un dot ya comprado lo vende
  // (y todos los superiores); click en uno vacío compra hasta ese punto.
  function toggleDot(i: number) {
    if (costs[i] == null) return
    update('dots', dots > i ? i : i + 1)
  }

  return (
    <div className="bg-surface border border-rim-bright hover:border-crimson-dim transition-colors grid grid-cols-[44px_52px_1fr] items-center gap-2 px-3 py-2">
      {/* attr-short-block */}
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-[11px] text-gold tracking-[1px]">{def.abbr}</span>
        <span className="font-mono text-[7px] text-parchment-dim leading-tight break-words">{def.label}</span>
        <span className="font-mono text-[9px] text-parchment-dim">BR {bonus}</span>
      </div>

      {/* attr-total-block */}
      <p
        className="font-display text-[30px] font-black text-crimson-bright leading-none text-center"
        style={{ textShadow: '0 0 8px rgba(255,34,34,0.3)' }}
      >
        {total}
      </p>

      {/* attr-inputs-row: BASE + AVA dots */}
      <div className="flex items-end gap-1">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-[7px] tracking-[1px] text-parchment-dim">BASE</span>
          <input
            type="number"
            value={values.base}
            min={0}
            max={99}
            onChange={e => update('base', parseInt(e.target.value) || 0)}
            className="w-[46px] bg-surface-2 border border-rim-bright text-parchment-bright font-display text-sm font-bold text-center py-1 outline-none focus:border-gold transition-colors"
          />
        </div>
        <span className="font-display text-base text-parchment-dim pb-1.5">+</span>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="font-mono text-[7px] tracking-[1px] text-parchment-dim">AVA (+{countedDots * 10})</span>
          <div className="flex gap-[3px]">
            {DOT_LABELS.map((label, i) => {
              const cost = costs[i]
              const bought = i < dots
              const na = cost == null
              // El legacy no ofrece la casilla como botón cuando el coste es N/D:
              // solo un recuadro vacío, sin letra ni interacción (attr-dots-row).
              if (na) {
                return (
                  <div
                    key={label}
                    title="N/D"
                    className="w-[14px] h-[14px] border border-dashed border-rim opacity-30 shrink-0"
                  />
                )
              }
              return (
                <button
                  key={label}
                  onClick={() => toggleDot(i)}
                  title={`${DOT_TITLES[i]}: ${cost} PE${bought ? ' (comprado)' : ''}`}
                  className={[
                    'w-[14px] h-[14px] shrink-0 font-mono text-[7px] uppercase border flex items-center justify-center transition-colors',
                    bought
                      ? 'bg-crimson-dim border-crimson text-white'
                      : 'border-rim-bright text-parchment-dim hover:border-gold hover:text-gold',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
