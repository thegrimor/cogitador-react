import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addXpEntry } from '../../services/fichaSlice'
import { CharInfoGrid } from './atributos/CharInfoGrid'
import { CAREERS, getCareerRank } from '@/core/data/darkheresy/careers'

export function XpTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [amount, setAmount] = useState('')

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
  const spent     = parseInt(char.info.xpSpent)    || 0
  const available = total - spent

  const career    = CAREERS.find(c => c.key === char.info.career)
  const rankInfo  = career ? getCareerRank(career, spent) : null
  const nextRank  = career?.ranks.find(r => r.minXp > spent) ?? null

  function handleAdd() {
    const n = parseInt(amount)
    if (!n || n <= 0) return
    dispatch(addXpEntry({ id: char!.id, entry: { amount: n, reason: '' } }))
    setAmount('')
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">

      {/* Datos del personaje */}
      <CharInfoGrid char={char} />

      {/* Rango actual */}
      {rankInfo && (
        <div className="bg-surface-2 border border-rim">
          <div className="border-b border-rim bg-crimson/5 px-4 py-2">
            <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
              // Rango Actual
            </h3>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <p className="font-rajdhani text-xl font-bold text-parchment leading-none">
                {rankInfo.name}
              </p>
              <p className="font-mono text-[10px] text-parchment-dim">
                {rankInfo.minXp} – {rankInfo.maxXp === Infinity ? '∞' : rankInfo.maxXp} XP
              </p>
            </div>
            {nextRank && (
              <p className="font-mono text-[10px] text-gold text-right">
                Siguiente: <span className="font-bold">{nextRank.name}</span>
                <br />en {nextRank.minXp - spent} XP
              </p>
            )}
          </div>
        </div>
      )}

      {/* Añadir XP */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Añadir Experiencia
          </h3>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="XP"
              min={1}
              className="flex-1 bg-surface border border-rim-bright text-gold-bright font-display text-lg text-center px-2 py-2 outline-none focus:border-gold transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!amount || parseInt(amount) <= 0}
              className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-4 py-2 hover:bg-crimson-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <div className="flex gap-6 items-center font-mono text-xs text-parchment-dim border-t border-rim pt-2">
            <span>Total: <span className="text-gold-bright font-bold">{total}</span></span>
            <span>Gastado: <span className="text-parchment font-bold">{spent}</span></span>
            <span>Libre: <span className={available < 0 ? 'text-crimson-bright font-bold' : 'text-neon font-bold'}>{available}</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
