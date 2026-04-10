import { useAppDispatch } from '@/core/store/hooks'
import { updateAttribute } from '../../../services/fichaSlice'
import type { AttributeDefinition } from '@/core/data/darkheresy/attributes'
import type { AttributeValues } from '../../../types/fichaTypes'

interface Props {
  charId: string
  def: AttributeDefinition
  values: AttributeValues
}

export function AttributeCard({ charId, def, values }: Props) {
  const dispatch = useAppDispatch()
  const total = (values.base || 0) + (values.advances || 0) + (values.bonuses || 0)
  const bonus = Math.floor(total / 10)

  function update(field: keyof AttributeValues, value: number | string) {
    dispatch(updateAttribute({ id: charId, key: def.key, field, value }))
  }

  return (
    <div className="bg-surface border border-rim-bright hover:border-crimson-dim transition-colors">
      <div className="px-3 pt-2 pb-1">
        <p className="font-display text-[9px] uppercase tracking-[2px] text-gold">
          {def.label} <span className="text-parchment-dim">({def.abbr})</span>
        </p>
      </div>

      {/* Inputs: base + avances + bonus */}
      <div className="flex gap-2 px-3 pb-2 items-end">
        {(
          [
            { field: 'base',     label: 'BASE'     },
            { field: 'advances', label: 'AVANCES'  },
            { field: 'bonuses',  label: 'BONUS EXT'},
          ] as const
        ).map(({ field, label }) => (
          <div key={field} className="flex flex-col gap-1 flex-1">
            <span className="font-display text-[7px] tracking-[1px] text-parchment-dim">{label}</span>
            <input
              type="number"
              value={values[field] as number}
              min={field === 'bonuses' ? -99 : 0}
              max={99}
              onChange={e => update(field, parseInt(e.target.value) || 0)}
              className="w-full bg-surface-2 border border-rim-bright text-parchment-bright font-display text-base font-bold text-center py-1 outline-none focus:border-gold transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Separador */}
      <div className="mx-3 h-px bg-rim" />

      {/* Total */}
      <div className="px-3 py-2 text-center">
        <p
          className="font-display text-3xl font-black text-crimson-bright leading-none"
          style={{ textShadow: '0 0 10px rgba(255,34,34,0.3)' }}
        >
          {total}
        </p>
        <p className="font-mono text-[9px] text-parchment-dim mt-1">
          Bonus: {bonus} &nbsp;|&nbsp; Tirada: {total}%
        </p>
      </div>

      {/* Nota de bonus (solo si hay bonus externo) */}
      {values.bonuses !== 0 && (
        <div className="px-3 pb-2">
          <input
            type="text"
            value={values.bonusNote}
            placeholder="Origen del bonus..."
            onChange={e => update('bonusNote', e.target.value)}
            className="w-full bg-transparent border-b border-rim font-mono text-[10px] text-gold outline-none placeholder:text-parchment-dim/40 py-0.5"
          />
        </div>
      )}
    </div>
  )
}
