import { useAppDispatch } from '@/core/store/hooks'
import { updateCharInfo } from '../../../services/fichaSlice'
import { CAREERS, getRankForXP, getRankSiblings } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../../services/fichaComputed'
import type { Character } from '../../../types/fichaTypes'

interface Props {
  char: Character
}

export function CharInfoGrid({ char }: Props) {
  const dispatch = useAppDispatch()
  const xpSpent = computeXpSpent(char)
  const rankInfo = getRankForXP(char.info.career, xpSpent, char.info.branch)
  const siblings = getRankSiblings(char.info.career, xpSpent)
  const counterpartLabel = char.info.role === 'inquisidor' ? 'Acólito' : 'Inquisidor'
  // Personajes persistidos antes del modelo de 2 slots (role vacío): pedir asignación única
  const needsRole = char.info.role !== 'inquisidor' && char.info.role !== 'sequito'

  return (
    <div className="bg-surface-2 border border-rim">
      <div className="flex items-center border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Carrera y Datos de Identificación
        </h3>
      </div>
      {needsRole && (
        <div className="flex items-center gap-2 border-b border-rim bg-gold/10 px-4 py-2">
          <span className="font-mono text-[10px] text-parchment-dim">Personaje sin rol asignado:</span>
          <button
            onClick={() => dispatch(updateCharInfo({ id: char.id, field: 'role', value: 'inquisidor' }))}
            className="font-display text-[8px] uppercase tracking-[1px] border border-gold text-gold px-2 py-1 hover:bg-gold/10 transition-colors"
          >
            Asignar Inquisidor
          </button>
          <button
            onClick={() => dispatch(updateCharInfo({ id: char.id, field: 'role', value: 'sequito' }))}
            className="font-display text-[8px] uppercase tracking-[1px] border border-gold text-gold px-2 py-1 hover:bg-gold/10 transition-colors"
          >
            Asignar Séquito
          </button>
        </div>
      )}

      <div className="p-3 flex flex-col gap-3">
        {/* Career-box: Profesión + Rango auto-calculado (+ rama si hay ambigüedad) */}
        <div className="bg-surface border border-gold border-l-4 border-l-gold-bright px-4 py-3">
          <label className="block font-display text-[9px] uppercase tracking-[3px] text-gold mb-2">
            Profesión
          </label>
          <select
            value={char.info.career}
            onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'career', value: e.target.value }))}
            className="w-full bg-surface-2 border border-gold text-gold-bright font-display text-[13px] px-2.5 py-2 outline-none mb-3"
          >
            <option value="" className="bg-surface-3">— Seleccionar —</option>
            {CAREERS.map(c => (
              <option key={c} value={c} className="bg-surface-3">{c}</option>
            ))}
          </select>

          <div className="flex justify-between items-center gap-3">
            <div>
              <div className="font-mono text-[8px] text-parchment-dim tracking-[2px] mb-1">RANGO ACTUAL</div>
              <div className="font-display text-[17px] text-gold-bright leading-tight">
                {rankInfo ? rankInfo.rank : '—'}
              </div>
              <div className="font-mono text-[9px] text-parchment-dim mt-0.5">
                PE: {rankInfo?.pe ?? '0-499'}
              </div>
            </div>
            <div className="font-mono text-[9px] text-parchment-dim border border-rim px-2 py-1 text-center max-w-[100px] shrink-0">
              AUTO<br />CALCULADO
            </div>
          </div>

          {siblings.length > 1 && (
            <div className="mt-2.5">
              <label className="block font-display text-[8px] uppercase tracking-[2px] text-gold mb-1">
                ⚠ Elige Rama
              </label>
              <select
                value={rankInfo?.rank ?? ''}
                onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'branch', value: e.target.value }))}
                className="w-full bg-surface-2 border border-gold text-gold-bright font-mono text-xs px-2 py-1.5 outline-none"
              >
                {siblings.map(s => (
                  <option key={s.rank} value={s.rank} className="bg-surface-3">{s.rank}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Campos de identificación — cajas individuales, igual que .info-field del legacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="bg-surface border border-rim-bright px-3 py-2.5">
            <label className="block font-display text-[9px] uppercase tracking-[2px] text-parchment-dim mb-1.5">
              Nombre
            </label>
            <input
              type="text"
              value={char.info.name}
              placeholder="Nombre del operativo"
              onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'name', value: e.target.value }))}
              className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40"
            />
          </div>

          <div className="bg-surface border border-rim-bright px-3 py-2.5">
            <label className="block font-display text-[9px] uppercase tracking-[2px] text-parchment-dim mb-1.5">
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

          <div className="bg-surface border border-rim-bright px-3 py-2.5">
            <label className="block font-display text-[9px] uppercase tracking-[2px] text-parchment-dim mb-1.5">
              {counterpartLabel}
            </label>
            <input
              type="text"
              value={char.info.counterpart ?? ''}
              placeholder={counterpartLabel}
              onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'counterpart', value: e.target.value }))}
              className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40"
            />
          </div>

          <div className="bg-surface border border-rim-bright px-3 py-2.5">
            <label className="block font-display text-[9px] uppercase tracking-[2px] text-parchment-dim mb-1.5">
              Ordo
            </label>
            <input
              type="text"
              value={char.info.ordo ?? ''}
              placeholder="Ej: Xenos"
              onChange={e => dispatch(updateCharInfo({ id: char.id, field: 'ordo', value: e.target.value }))}
              className="w-full bg-transparent font-rajdhani text-[15px] font-semibold text-parchment outline-none placeholder:text-parchment-dim/40"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
