import { useAppDispatch } from '@/core/store/hooks'
import { updateWounds, updateFate, updateVital } from '../../../services/fichaSlice'
import { computeMovement } from '../../../services/fichaComputed'
import type { Character } from '../../../types/fichaTypes'

interface Props {
  char: Character
}

interface PipRowProps {
  label: string
  icon: string
  current: number
  max: number
  color: string
  onChangeCurrent: (v: number) => void
  onChangeMax: (v: number) => void
}

/** Icono clicable por punto (herida/destino): click marca hasta ese punto, click sobre el último lo retira. */
function PipRow({ label, icon, current, max, color, onChangeCurrent, onChangeMax }: PipRowProps) {
  return (
    <div className="bg-surface flex flex-col gap-1.5 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <label className="font-display text-[8px] uppercase tracking-[1px] text-parchment-dim">{label}</label>
        <div className="flex items-center gap-1">
          <span className={`font-display text-sm font-bold ${color}`}>{current}/{max}</span>
          <input
            type="number"
            value={max}
            min={0}
            onChange={e => onChangeMax(parseInt(e.target.value) || 0)}
            title={`${label} máximo`}
            className="w-12 bg-surface-2 border border-rim-bright font-mono text-[10px] text-parchment text-center py-0.5 outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map(i => (
          <button
            key={i}
            onClick={() => onChangeCurrent(i === current ? i - 1 : i)}
            className={[
              'w-6 h-6 flex items-center justify-center text-sm border transition-colors',
              i <= current
                ? `${color} border-current bg-current/10`
                : 'text-parchment-dim/30 border-rim hover:border-rim-bright',
            ].join(' ')}
            title={`Marcar ${i}`}
          >
            {icon}
          </button>
        ))}
        {max === 0 && <span className="font-mono text-[10px] text-parchment-dim/50">Sin máximo definido</span>}
      </div>
    </div>
  )
}

export function WoundsPanel({ char }: Props) {
  const dispatch = useAppDispatch()
  const mov = computeMovement(char)

  return (
    <div className="flex flex-col gap-2">
      {/* Heridas y Destino */}
      <div className="bg-surface-2 border border-rim">
        <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Estado Vital
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-rim p-px">
          <PipRow
            label="Heridas"
            icon="♥"
            current={char.wounds.current}
            max={char.wounds.max}
            color="text-crimson-bright"
            onChangeCurrent={v => dispatch(updateWounds({ id: char.id, field: 'current', value: Math.max(0, v) }))}
            onChangeMax={v => dispatch(updateWounds({ id: char.id, field: 'max', value: v }))}
          />
          <PipRow
            label="Destino"
            icon="✦"
            current={char.fate.current}
            max={char.fate.max}
            color="text-gold-bright"
            onChangeCurrent={v => dispatch(updateFate({ id: char.id, field: 'current', value: Math.max(0, v) }))}
            onChangeMax={v => dispatch(updateFate({ id: char.id, field: 'max', value: v }))}
          />
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
