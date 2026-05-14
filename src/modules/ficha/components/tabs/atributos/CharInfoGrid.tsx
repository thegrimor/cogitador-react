import { useAppDispatch } from '@/core/store/hooks'
import { updateCharInfo } from '../../../services/fichaSlice'
import { CAREERS, getRankForXP } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../../services/fichaComputed'
import type { Character } from '../../../types/fichaTypes'

interface Props {
  char: Character
}

export function CharInfoGrid({ char }: Props) {
  const dispatch = useAppDispatch()
  const xpSpent = computeXpSpent(char)
  const rankInfo = getRankForXP(char.info.career, xpSpent)

  return (
    <div className="bg-surface-2 border border-rim">
      <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Datos de Identificación
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-px bg-rim p-px">
        {/* Nombre */}
        <div className="bg-surface px-3 py-2">
          <label className="block font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">
            Designación / Nombre
          </label>
          <input
            type="text"
            value={char.info.name}
            placeholder="Nombre del operativo"
            onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'name', value: e.target.value }))}
            className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40"
          />
        </div>

        {/* Carrera */}
        <div className="bg-surface px-3 py-2">
          <label className="block font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">
            Carrera
          </label>
          <select
            value={char.info.career}
            onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'career', value: e.target.value }))}
            className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none"
          >
            <option value="" className="bg-surface-3">— Seleccionar —</option>
            {CAREERS.map(c => (
              <option key={c} value={c} className="bg-surface-3">{c}</option>
            ))}
          </select>
        </div>

        {/* Mundo de Origen */}
        <div className="bg-surface px-3 py-2">
          <label className="block font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">
            Mundo de Origen
          </label>
          <input
            type="text"
            value={char.info.homeworld}
            placeholder="Scintilla"
            onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'homeworld', value: e.target.value }))}
            className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40"
          />
        </div>

        {/* Rango (auto-calculado) */}
        <div className="bg-surface px-3 py-2">
          <label className="block font-display text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">
            Rango
          </label>
          <p className="font-rajdhani text-[15px] font-semibold text-gold leading-tight">
            {rankInfo ? rankInfo.rank : char.info.rank || '—'}
          </p>
          {rankInfo && (
            <p className="font-mono text-[9px] text-parchment-dim">{rankInfo.pe} PE</p>
          )}
        </div>
      </div>
    </div>
  )
}
