import { useAppDispatch } from '@/core/store/hooks'
import { updateWounds, updateFate, updateVital } from '../../../services/fichaSlice'
import { computeMovement } from '../../../services/fichaComputed'
import type { Character } from '../../../types/fichaTypes'

interface Props {
  char: Character
}

export function WoundsPanel({ char }: Props) {
  const dispatch = useAppDispatch()
  const mov = computeMovement(char)

  const vitals = [
    {
      label: 'Heridas Act.',
      value: char.wounds.current,
      onChange: (v: number) => dispatch(updateWounds({ id: char.id, field: 'current', value: v })),
    },
    {
      label: 'Heridas Máx.',
      value: char.wounds.max,
      onChange: (v: number) => dispatch(updateWounds({ id: char.id, field: 'max', value: v })),
    },
    {
      label: 'Destino Act.',
      value: char.fate.current,
      onChange: (v: number) => dispatch(updateFate({ id: char.id, field: 'current', value: v })),
    },
    {
      label: 'Destino Máx.',
      value: char.fate.max,
      onChange: (v: number) => dispatch(updateFate({ id: char.id, field: 'max', value: v })),
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      {/* Heridas y Destino */}
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

      {/* Insanidad y Corrupción */}
      <div className="bg-surface-2 border border-rim">
        <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Condición Mental
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-px bg-rim p-px">
          {[
            {
              label: 'Insanidad',
              value: char.insanity,
              max: 100,
              color: 'text-neon',
              onChange: (v: number) => dispatch(updateVital({ id: char.id, field: 'insanity', value: v })),
            },
            {
              label: 'Corrupción',
              value: char.corruption,
              max: 100,
              color: 'text-crimson-bright',
              onChange: (v: number) => dispatch(updateVital({ id: char.id, field: 'corruption', value: v })),
            },
          ].map(v => (
            <div key={v.label} className="bg-surface flex flex-col gap-1 px-3 py-3">
              <div className="flex justify-between items-center">
                <label className="font-display text-[8px] uppercase tracking-[1px] text-parchment-dim">
                  {v.label}
                </label>
                <span className={`font-display text-sm font-bold ${v.color}`}>
                  {v.value}/{v.max}
                </span>
              </div>
              <input
                type="range"
                value={v.value}
                min={0}
                max={v.max}
                onChange={e => v.onChange(parseInt(e.target.value))}
                className="w-full accent-crimson h-1"
              />
              <input
                type="number"
                value={v.value}
                min={0}
                max={v.max}
                onChange={e => v.onChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-20 bg-surface-2 border border-rim-bright font-mono text-xs text-center py-1 outline-none focus:border-crimson transition-colors text-parchment"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Movimiento derivado de Ag */}
      <div className="bg-surface-2 border border-rim">
        <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Movimiento
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-px bg-rim p-px">
          {[
            { label: 'Paso', value: `${mov.step}m` },
            { label: 'Mov', value: `${mov.move}m` },
            { label: 'Carga', value: `${mov.charge}m` },
            { label: 'Comp.', value: `${mov.full}m` },
          ].map(m => (
            <div key={m.label} className="bg-surface flex flex-col items-center gap-1 px-2 py-2">
              <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim">
                {m.label}
              </span>
              <span className="font-display text-base font-bold text-neon">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
