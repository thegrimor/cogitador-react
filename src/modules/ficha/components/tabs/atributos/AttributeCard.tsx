import { useAppDispatch } from '@/core/store/hooks'
import { updateAttribute } from '../../../services/fichaSlice'
import { getAttrCostsForCareer } from '@/core/data/darkheresy/careers'
import { getAttrDots, getAttrTotal } from '../../../services/fichaComputed'
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

export function AttributeCard({ charId, career, def, values }: Props) {
  const dispatch = useAppDispatch()
  const dots = getAttrDots(values)
  const total = getAttrTotal(values)
  const bonus = Math.floor(total / 10)
  const costs = getAttrCostsForCareer(career)[def.key] ?? FALLBACK_COSTS

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
    <div className="bg-surface border border-rim-bright hover:border-crimson-dim transition-colors">
      <div className="flex items-start justify-between px-3 pt-2 pb-1 gap-2">
        <div>
          <p className="font-display text-[9px] uppercase tracking-[2px] text-gold">
            {def.abbr} <span className="text-parchment-dim">({def.label})</span>
          </p>
          <p className="font-mono text-[9px] text-parchment-dim">BR {bonus}</p>
        </div>
        <p
          className="font-display text-2xl font-black text-crimson-bright leading-none"
          style={{ textShadow: '0 0 10px rgba(255,34,34,0.3)' }}
        >
          {total}
        </p>
      </div>

      {/* BASE + puntos de mejora (dots) */}
      <div className="flex items-end gap-2 px-3 pb-2">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[7px] tracking-[1px] text-parchment-dim">BASE</span>
          <input
            type="number"
            value={values.base}
            min={0}
            max={99}
            onChange={e => update('base', parseInt(e.target.value) || 0)}
            className="w-16 bg-surface-2 border border-rim-bright text-parchment-bright font-display text-base font-bold text-center py-1 outline-none focus:border-gold transition-colors"
          />
        </div>
        <span className="font-display text-lg text-parchment-dim pb-1">+</span>
        <div className="flex flex-col gap-1 flex-1">
          <span className="font-display text-[7px] tracking-[1px] text-parchment-dim">AVA (+{dots * 10})</span>
          <div className="flex gap-1">
            {DOT_LABELS.map((label, i) => {
              const cost = costs[i]
              const bought = i < dots
              const na = cost == null
              return (
                <button
                  key={label}
                  disabled={na}
                  onClick={() => toggleDot(i)}
                  title={na ? `${DOT_TITLES[i]}: N/D` : `${DOT_TITLES[i]}: ${cost} PE${bought ? ' (comprado)' : ''}`}
                  className={[
                    'flex-1 h-7 font-display text-[10px] uppercase border transition-colors',
                    na
                      ? 'border-dashed border-rim text-rim-bright opacity-30 cursor-not-allowed'
                      : bought
                      ? 'border-crimson bg-crimson/20 text-crimson-bright'
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

      {/* Bonus externo */}
      <div className="flex items-end gap-2 px-3 pb-2">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[7px] tracking-[1px] text-parchment-dim">BONUS EXT</span>
          <input
            type="number"
            value={values.bonuses}
            min={-99}
            max={99}
            onChange={e => update('bonuses', parseInt(e.target.value) || 0)}
            className="w-16 bg-surface-2 border border-rim-bright text-parchment-bright font-display text-base font-bold text-center py-1 outline-none focus:border-gold transition-colors"
          />
        </div>
        {values.bonuses !== 0 && (
          <input
            type="text"
            value={values.bonusNote}
            placeholder="Origen del bonus..."
            onChange={e => update('bonusNote', e.target.value)}
            className="flex-1 bg-transparent border-b border-rim font-mono text-[10px] text-gold outline-none placeholder:text-parchment-dim/40 py-1.5"
          />
        )}
      </div>

      <p className="font-mono text-[9px] text-parchment-dim px-3 pb-2">
        Tirada: {total}%
      </p>
    </div>
  )
}
