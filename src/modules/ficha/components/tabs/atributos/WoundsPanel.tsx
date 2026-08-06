import { useState } from 'react'
import { useAppDispatch } from '@/core/store/hooks'
import {
  updateWounds, updateFate, updateVital,
  updateMoney, addCurrency, updateCurrency, removeCurrency, updateNotes,
  killCharacter,
} from '../../../services/fichaSlice'
import { computeMovement } from '../../../services/fichaComputed'
import { showToast } from '@/shared/components/Toast'
import { KillConfirmModal } from '../../KillConfirmModal'
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

interface CounterRowProps {
  title: string
  value: number
  max: number
  color: string
  icon: string
  iconClass: string
  emptyMessage: string
  onChange: (v: number) => void
}

/**
 * Fila "// LOCURA" / "// CORRUPCIÓN" del legacy: botones −1/+1 más una fila de
 * iconos clicables (uno por punto actual) — clic en el icono i reduce a i,
 * igual que renderInsanity()/renderCorruption().
 */
function CounterRow({ title, value, max, color, icon, iconClass, emptyMessage, onChange }: CounterRowProps) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[9px] text-parchment-dim tracking-[2px]">// {title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(Math.max(0, value - 1))}
            className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2 py-1 hover:text-parchment hover:border-parchment-dim transition-colors"
          >
            − 1
          </button>
          <button
            onClick={() => onChange(Math.min(max, value + 1))}
            className={['font-display text-[8px] uppercase tracking-[1px] px-2 py-1 text-white transition-colors', color].join(' ')}
          >
            + 1
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 min-h-[22px]">
        {value === 0 ? (
          <span className="font-mono text-[10px] text-rim-bright">{emptyMessage}</span>
        ) : (
          Array.from({ length: value }, (_, i) => (
            <span
              key={i}
              onClick={() => onChange(i)}
              title={`Clic para reducir a ${i}`}
              className={['cursor-pointer leading-none select-none text-sm transition-transform hover:scale-110', iconClass].join(' ')}
            >
              {icon}
            </span>
          ))
        )}
      </div>
      <div className="flex justify-between mt-1">
        <span className="font-mono text-[9px] text-parchment-dim">
          Puntos de {title.toLowerCase()}: <span className="text-parchment">{value}</span>/{max}
        </span>
      </div>
    </div>
  )
}

export function WoundsPanel({ char }: Props) {
  const dispatch = useAppDispatch()
  const mov = computeMovement(char)
  const [showKillModal, setShowKillModal] = useState(false)

  function confirmKill() {
    dispatch(killCharacter(char.id))
    showToast(`⚰ ${char.info.name || 'El acólito'} ha caído. Nuevo acólito con ${char.info.experience || 0} PE heredados.`)
    setShowKillModal(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-surface-2 border border-rim">
        <div className="flex items-center justify-between border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Estado
          </h3>
          {char.info.role === 'sequito' && (
            <button
              onClick={() => setShowKillModal(true)}
              className="font-display text-[8px] uppercase tracking-[1px] px-2.5 py-1.5"
              style={{ background: '#3a0a0a', color: '#c87070', border: '1px solid #7a1a1a' }}
            >
              ☠ Caído en Combate
            </button>
          )}
        </div>
        <div className="px-4 py-3 divide-y divide-rim">
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
          <CounterRow
            title="LOCURA"
            value={char.insanity}
            max={100}
            color="bg-purple-700 hover:bg-purple-600"
            icon="🧠"
            iconClass="text-purple-400 [text-shadow:0_0_6px_rgba(180,74,255,0.5)]"
            emptyMessage="Sin puntos de locura"
            onChange={v => dispatch(updateVital({ id: char.id, field: 'insanity', value: v }))}
          />
          <CounterRow
            title="CORRUPCIÓN"
            value={char.corruption}
            max={100}
            color="bg-crimson hover:bg-crimson-bright"
            icon="☠"
            iconClass="text-crimson [text-shadow:0_0_6px_rgba(196,30,30,0.5)]"
            emptyMessage="Sin puntos de corrupción"
            onChange={v => dispatch(updateVital({ id: char.id, field: 'corruption', value: v }))}
          />
        </div>

        {/* Movimiento (calculado de Ag/10) */}
        <div className="border-t border-rim px-4 py-3">
          <span className="font-mono text-[9px] text-parchment-dim tracking-[2px]">
            // MOVIMIENTO <span className="text-rim-bright">(calculado de Ag/10)</span>
          </span>
          <div className="mt-2 grid grid-cols-4 gap-px bg-rim p-px">
            {[
              { label: 'Paso', value: `${mov.step}m` },
              { label: 'Movimiento', value: `${mov.move}m` },
              { label: 'Mov. Completo', value: `${mov.full}m` },
              { label: 'Carga', value: `${mov.charge}m` },
            ].map(m => (
              <div key={m.label} className="bg-surface flex flex-col items-center gap-1 px-2 py-2">
                <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim text-center">
                  {m.label}
                </span>
                <span className="font-display text-base font-bold text-neon">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tesoro */}
        <div className="border-t border-rim px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-parchment-dim tracking-[2px]">// TESORO</span>
            <button
              onClick={() => dispatch(addCurrency({ charId: char.id, currency: { name: 'NUEVA DIVISA', amount: 0 } }))}
              className="font-display text-[8px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-2.5 py-1.5 hover:border-gold hover:text-gold transition-colors"
            >
              + Divisa
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-mono text-[11px] text-parchment-dim uppercase tracking-[1px] shrink-0">Tronos ₮</label>
            <input
              type="number"
              value={char.moneyThrones}
              onChange={e => dispatch(updateMoney({ charId: char.id, thrones: Number(e.target.value) }))}
              className="w-28 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-center"
            />
          </div>
          {char.currencies.map((cur, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={cur.name}
                onChange={e => dispatch(updateCurrency({ charId: char.id, idx, currency: { name: e.target.value, amount: cur.amount } }))}
                placeholder="Divisa"
                className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
              />
              <input
                type="number"
                value={cur.amount}
                onChange={e => dispatch(updateCurrency({ charId: char.id, idx, currency: { name: cur.name, amount: Number(e.target.value) } }))}
                className="w-24 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-center"
              />
              <button
                onClick={() => dispatch(removeCurrency({ charId: char.id, idx }))}
                className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0"
                aria-label="Eliminar divisa"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Notas rápidas */}
        <div className="border-t border-rim px-4 py-3 flex flex-col gap-2">
          <span className="font-mono text-[9px] text-parchment-dim tracking-[2px]">// NOTAS RÁPIDAS</span>
          <textarea
            value={char.quickNotes}
            onChange={e => dispatch(updateNotes({ charId: char.id, field: 'quickNotes', value: e.target.value }))}
            placeholder="Notas de sesión, recordatorios..."
            className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full min-h-[70px] resize-y"
          />
        </div>

        {/* Influencia */}
        <div className="border-t border-rim px-4 py-3 flex flex-col gap-2">
          <span className="font-mono text-[9px] text-parchment-dim tracking-[2px]">// INFLUENCIA</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] uppercase tracking-[1px] text-parchment-dim">General</label>
              <textarea
                value={char.influenceGeneral}
                onChange={e => dispatch(updateNotes({ charId: char.id, field: 'influenceGeneral', value: e.target.value }))}
                placeholder="Contactos, favores, influencias generales..."
                rows={3}
                className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full resize-y"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] uppercase tracking-[1px] text-parchment-dim">Planetaria</label>
              <textarea
                value={char.influencePlanetary}
                onChange={e => dispatch(updateNotes({ charId: char.id, field: 'influencePlanetary', value: e.target.value }))}
                placeholder="Influencias en el planeta actual..."
                rows={3}
                className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full resize-y"
              />
            </div>
          </div>
        </div>
      </div>

      {showKillModal && (
        <KillConfirmModal
          name={char.info.name || 'Acólito sin nombre'}
          xp={Number(char.info.experience) || 0}
          onConfirm={confirmKill}
          onCancel={() => setShowKillModal(false)}
        />
      )}
    </div>
  )
}
