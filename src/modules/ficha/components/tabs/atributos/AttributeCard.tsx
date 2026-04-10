import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { updateAttribute, advanceAttribute } from '../../../services/fichaSlice'
import type { AttributeDefinition } from '@/core/data/darkheresy/attributes'
import type { AttributeValues } from '../../../types/fichaTypes'

const MAX_DOTS = 5 // cada dot = +10
const DOT_COSTS = [100, 250, 500, 750, 1000]

interface Props {
  charId: string
  def: AttributeDefinition
  values: AttributeValues
}

export function AttributeCard({ charId, def, values }: Props) {
  const dispatch = useAppDispatch()
  const char = useAppSelector(s => s.ficha.characters.find(c => c.id === charId))
  const filledDots = Math.round((values.advances || 0) / 10)
  const total = (values.base || 0) + (values.advances || 0)

  const xpAvailable = char
    ? (parseInt(char.info.experience) || 0) - (parseInt(char.info.xpSpent) || 0)
    : 0

  function setBase(value: number) {
    dispatch(updateAttribute({ id: charId, key: def.key, field: 'base', value }))
  }

  function handleDot(index: number) {
    const newDots = filledDots === index + 1 ? index : index + 1
    // Guard: if advancing, check available XP
    if (newDots > filledDots) {
      const cost = DOT_COSTS.slice(filledDots, newDots).reduce((a, b) => a + b, 0)
      if (cost > xpAvailable) return
    }
    dispatch(advanceAttribute({ id: charId, key: def.key, oldDots: filledDots, newDots }))
  }

  return (
    <div className="bg-surface border border-rim-bright hover:border-crimson-dim transition-colors px-3 py-2 flex items-center gap-3">
      {/* Nombre */}
      <div className="w-16 shrink-0">
        <p className="font-display text-[8px] uppercase tracking-[1px] text-gold leading-tight">
          {def.label}
        </p>
        <p className="font-display text-[8px] text-parchment-dim">({def.abbr})</p>
      </div>

      {/* Base */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-display text-[7px] tracking-[1px] text-parchment-dim">BASE</span>
        <input
          type="number"
          value={values.base || 0}
          min={0}
          max={99}
          onChange={e => setBase(parseInt(e.target.value) || 0)}
          className="w-12 bg-surface-2 border border-rim-bright text-parchment font-display text-base font-bold text-center py-0.5 outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Dots de avances */}
      <div className="flex flex-col items-center gap-1 flex-1">
        <span className="font-display text-[7px] tracking-[1px] text-parchment-dim">AVANCES</span>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_DOTS }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              className={[
                'w-3 h-3 border transition-all',
                i < filledDots
                  ? 'bg-crimson border-crimson'
                  : 'bg-transparent border-rim-bright hover:border-crimson-dim',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex flex-col items-center shrink-0">
        <span className="font-display text-[7px] tracking-[1px] text-parchment-dim">TOTAL</span>
        <span
          className="font-display text-2xl font-black text-crimson-bright leading-none"
          style={{ textShadow: '0 0 8px rgba(255,34,34,0.3)' }}
        >
          {total}
        </span>
      </div>
    </div>
  )
}
