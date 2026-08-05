import { useAppDispatch } from '@/core/store/hooks'
import { updateWounds, updateFate, updateVital } from '../../../services/fichaSlice'
import { computeMovement } from '../../../services/fichaComputed'
import type { Character } from '../../../types/fichaTypes'

interface Props {
  char: Character
}

interface PipRowProps {
  title: string
  maxLabel: string
  icon: string
  current: number
  max: number
  emptyMessage: string
  aliveTitle: string
  deadTitle: string
  filledClass: string
  emptyClass: string
  decLabel: string
  incLabel: string
  onChangeCurrent: (v: number) => void
  onChangeMax: (v: number) => void
  onDelta: (delta: number) => void
  onInc: () => void
}

/**
 * Fila de iconos clicables (heridas ♥ / destino ⚙), fiel al HTML legacy:
 * click en un icono "vivo" hiere hasta ese punto, click en uno "vacío" sana hasta ese punto.
 * Sin cajas ni bordes — solo el símbolo con glow, igual que `renderWounds`/`renderFate`.
 */
function PipRow({
  title, maxLabel, icon, current, max, emptyMessage, aliveTitle, deadTitle,
  filledClass, emptyClass, decLabel, incLabel, onChangeCurrent, onChangeMax, onDelta, onInc,
}: PipRowProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <span className="font-mono text-[9px] text-parchment-dim tracking-[2px]">// {title}</span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] text-parchment-dim">{maxLabel}</span>
          <input
            type="number"
            min={0}
            value={max}
            onChange={e => onChangeMax(parseInt(e.target.value) || 0)}
            className="w-12 bg-surface border border-rim-bright text-gold-bright font-display text-[13px] text-center px-1.5 py-0.5 outline-none focus:border-gold transition-colors"
          />
          <button
            onClick={() => onDelta(-1)}
            className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:text-parchment hover:border-parchment-dim transition-colors"
          >
            {decLabel}
          </button>
          <button
            onClick={onInc}
            className="font-display text-[8px] uppercase tracking-[1px] bg-gold text-black px-2 py-1 hover:bg-gold-bright transition-colors"
          >
            {incLabel}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 min-h-[26px]">
        {max === 0 ? (
          <span className="font-mono text-[10px] text-rim-bright">{emptyMessage}</span>
        ) : (
          Array.from({ length: max }, (_, i) => i).map(i => {
            const alive = i < current
            return (
              <span
                key={i}
                onClick={() => onChangeCurrent(alive ? i : i + 1)}
                title={alive ? aliveTitle : deadTitle}
                className={[
                  'cursor-pointer leading-none select-none transition-transform hover:scale-110',
                  alive ? filledClass : emptyClass,
                ].join(' ')}
                style={{ fontSize: icon === '♥' ? 22 : 20 }}
              >
                {icon}
              </span>
            )
          })
        )}
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
            // Estado
          </h3>
        </div>
        <div className="px-4 py-3">
          <PipRow
            title="HERIDAS"
            maxLabel="MÁX"
            icon="♥"
            current={char.wounds.current}
            max={char.wounds.max}
            emptyMessage="Define las heridas máximas arriba"
            aliveTitle="Sano (clic para herir)"
            deadTitle="Herido (clic para sanar)"
            filledClass="text-crimson [text-shadow:0_0_8px_rgba(196,30,30,0.6)]"
            emptyClass="text-[#2a1a1a]"
            decLabel="Herida −1"
            incLabel="Recuperar +1"
            onChangeCurrent={v => dispatch(updateWounds({ id: char.id, field: 'current', value: Math.max(0, v) }))}
            onChangeMax={v => dispatch(updateWounds({ id: char.id, field: 'max', value: v }))}
            onDelta={delta => dispatch(updateWounds({
              id: char.id, field: 'current',
              value: Math.max(0, Math.min(char.wounds.max, char.wounds.current + delta)),
            }))}
            onInc={() => dispatch(updateWounds({
              id: char.id, field: 'current',
              value: Math.max(0, Math.min(char.wounds.max, char.wounds.current + 1)),
            }))}
          />
          <PipRow
            title="DESTINO"
            maxLabel="MÁXIMO (inicio sesión)"
            icon="⚙"
            current={char.fate.current}
            max={char.fate.max}
            emptyMessage="Define el destino máximo arriba"
            aliveTitle="Disponible"
            deadTitle="Gastado"
            filledClass="text-gold-bright [text-shadow:0_0_8px_rgba(200,150,42,0.6)]"
            emptyClass="text-[#2a1a08] grayscale"
            decLabel="Gastar"
            incLabel="Nueva sesión"
            onChangeCurrent={v => dispatch(updateFate({ id: char.id, field: 'current', value: Math.max(0, v) }))}
            onChangeMax={v => dispatch(updateFate({ id: char.id, field: 'max', value: v }))}
            onDelta={delta => dispatch(updateFate({
              id: char.id, field: 'current',
              value: Math.max(0, Math.min(char.fate.max, char.fate.current + delta)),
            }))}
            onInc={() => dispatch(updateFate({ id: char.id, field: 'current', value: char.fate.max }))}
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
