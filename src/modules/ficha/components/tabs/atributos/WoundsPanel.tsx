import { useAppDispatch } from '@/core/store/hooks'
import { updateWounds, updateFate } from '../../../services/fichaSlice'
import type { Character } from '../../../types/fichaTypes'

interface Props {
  char: Character
}

export function WoundsPanel({ char }: Props) {
  const dispatch = useAppDispatch()

  const vitals = [
    {
      label: 'Heridas Actuales',
      value: char.wounds.current,
      onChange: (v: number) => dispatch(updateWounds({ id: char.id, field: 'current', value: v })),
    },
    {
      label: 'Heridas Máximas',
      value: char.wounds.max,
      onChange: (v: number) => dispatch(updateWounds({ id: char.id, field: 'max', value: v })),
    },
    {
      label: 'Puntos de Destino',
      value: char.fate.current,
      onChange: (v: number) => dispatch(updateFate({ id: char.id, field: 'current', value: v })),
    },
    {
      label: 'Destino Máximo',
      value: char.fate.max,
      onChange: (v: number) => dispatch(updateFate({ id: char.id, field: 'max', value: v })),
    },
  ]

  return (
    <div className="bg-surface-2 border border-rim">
      <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Estado Vital
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-px bg-rim p-px">
        {vitals.map(v => (
          <div key={v.label} className="bg-surface flex flex-col items-center gap-1 px-2 py-3">
            <label className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim text-center leading-tight">
              {v.label}
            </label>
            <input
              type="number"
              value={v.value}
              min={0}
              onChange={e => v.onChange(parseInt(e.target.value) || 0)}
              className="w-full bg-surface-2 border border-rim-bright text-gold-bright font-display text-xl font-bold text-center py-1 outline-none focus:border-gold transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
