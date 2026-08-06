import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addXpEntry, removeXpEntry } from '../../services/fichaSlice'
import { getRankForXP } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../services/fichaComputed'

export function XpTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [amount, setAmount]   = useState('')
  const [reason, setReason]   = useState('')

  if (!char) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          Sin operativo seleccionado
        </p>
      </div>
    )
  }

  const total     = parseInt(char.info.experience) || 0
  const spent     = computeXpSpent(char)
  const available = total - spent
  const rankInfo  = getRankForXP(char.info.career, spent, char.info.branch)

  function handleAdd() {
    const n = parseInt(amount)
    if (!n || n <= 0) return
    dispatch(addXpEntry({ id: char!.id, entry: { amount: n, reason: reason.trim() || 'Sin motivo' } }))
    setAmount('')
    setReason('')
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">

      {/* Resumen de rango */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Rango & Clase
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-px bg-rim p-px">
          <div className="bg-surface flex flex-col items-center py-3 px-2">
            <span className="font-rajdhani text-lg font-bold text-gold-bright leading-tight text-center">
              {rankInfo?.rank ?? '—'}
            </span>
            <span className="font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mt-1">Rango</span>
            {rankInfo && (
              <span className="font-mono text-[9px] text-parchment-dim">{rankInfo.pe} PE</span>
            )}
          </div>
          <div className="bg-surface flex flex-col items-center py-3 px-2">
            <span className="font-rajdhani text-xl font-bold text-parchment leading-none text-center">
              {char.info.career || '—'}
            </span>
            <span className="font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mt-1">Carrera</span>
          </div>
        </div>
      </div>

      {/* Añadir XP */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Añadir Experiencia
          </h3>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex gap-2 flex-wrap">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="XP"
              min={1}
              className="w-24 bg-surface border border-rim-bright text-gold-bright font-display text-lg text-center px-2 py-2 outline-none focus:border-gold transition-colors"
            />
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Motivo (sesión, logro...)"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 min-w-[100px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!amount || parseInt(amount) <= 0}
              className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-3 py-2 hover:bg-crimson-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              + Añadir
            </button>
          </div>

          {/* Totales */}
          <div className="flex flex-wrap gap-4 items-center font-mono text-xs text-parchment-dim border-t border-rim pt-2">
            <span>Total: <span className="text-gold-bright font-bold">{total}</span></span>
            <span>Gastado: <span className="text-parchment font-bold">{spent}</span></span>
            <span>
              Disponible:{' '}
              <span className={[
                'font-bold',
                available >= 0 ? 'text-neon' : available > -100 ? 'text-gold' : 'text-crimson-bright',
              ].join(' ')}>
                {available}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Log de XP */}
      {char.xpLog.length > 0 && (
        <div className="bg-surface-2 border border-rim">
          <div className="border-b border-rim bg-crimson/5 px-4 py-2">
            <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
              // Registro de XP
            </h3>
          </div>
          <div className="flex flex-col divide-y divide-rim">
            {char.xpLog.map(entry => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-2 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-display text-base font-bold text-gold-bright shrink-0">
                    +{entry.amount}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-xs text-parchment truncate">{entry.reason}</span>
                    <span className="font-mono text-[9px] text-parchment-dim">{entry.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeXpEntry({ charId: char.id, entryId: entry.id }))}
                  className="font-mono text-xs text-crimson-dim hover:text-crimson-bright transition-colors shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
