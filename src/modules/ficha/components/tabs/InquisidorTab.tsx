import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addInqMejora, removeInqMejora } from '../../services/fichaSlice'
import { INQUISIDOR_RANKS } from '@/core/data/darkheresy'
import { getInquisidorRank } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../services/fichaComputed'

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function InquisidorTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)
  const [typeFilter, setTypeFilter] = useState('')
  const [selName, setSelName] = useState('')

  if (!char) return <NoChar />

  const xpSpent = computeXpSpent(char)
  const inqRank = getInquisidorRank(char.info.career, xpSpent, char.info.branch)

  if (inqRank === null) {
    return (
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Inquisidor</h3>
        </div>
        <div className="px-4 py-10 text-center">
          <p className="font-mono text-xs text-parchment-dim">
            El rango de Inquisidor se desbloquea en el 6º rango de la carrera.
          </p>
        </div>
      </div>
    )
  }

  const inqMejoras = char.inqMejoras ?? [] // personajes persistidos antes de esta migración
  const owned = new Set(inqMejoras.map(m => m.name))
  const available: { rank: number; n: string; d?: string; c: number; t: string; r: string }[] = []
  for (let r = 9; r <= inqRank; r++) {
    const rankData = INQUISIDOR_RANKS.find(x => x.rank === r)
    if (!rankData) continue
    for (const m of rankData.mejoras) {
      if (owned.has(m.name)) continue
      if (typeFilter && m.type !== typeFilter) continue
      available.push({ rank: r, n: m.name, d: m.desc, c: m.cost, t: m.type, r: m.req })
    }
  }
  const selected = available.find(m => m.n === selName)
  const types = Array.from(new Set(INQUISIDOR_RANKS.flatMap(rd => rd.mejoras.map(m => m.type))))
  const rank9 = INQUISIDOR_RANKS.find(x => x.rank === 9)

  function handleAdd() {
    if (!selected) return
    dispatch(addInqMejora({
      charId: char!.id,
      mejora: { name: selected.n, type: selected.t, cost: selected.c, req: selected.r, desc: selected.d ?? '' },
    }))
    setSelName('')
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Inquisidor</h3>
        <span className="font-display text-[12px] text-gold">Rango {inqRank}</span>
      </div>

      {inqRank === 9 && rank9?.note && (
        <div className="px-4 py-3 bg-surface border-b border-rim">
          <p className="font-display text-[8px] uppercase tracking-[2px] text-gold mb-1">⚜ Rasgo especial del rango 9</p>
          <p className="font-mono text-[11px] text-parchment-dim">{rank9.note}</p>
        </div>
      )}

      <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setSelName('') }}
          className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
        >
          <option value="">— Todos los tipos —</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div className="flex gap-2">
          <select
            value={selName}
            onChange={e => setSelName(e.target.value)}
            className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
          >
            <option value="">— Seleccionar mejora —</option>
            {available.map(m => (
              <option key={m.n} value={m.n}>[R{m.rank}] {m.n}{m.r && m.r !== '—' ? ` [${m.r}]` : ''}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!selected}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            Añadir
          </button>
        </div>

        {selected && (
          <div className="bg-surface border border-rim px-3 py-2 flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <span className="font-mono text-[10px] bg-gold/20 text-gold px-2 py-0.5">{selected.t}</span>
              <span className={['font-mono text-[10px] font-bold', selected.c < 0 ? 'text-crimson-bright' : 'text-gold-bright'].join(' ')}>
                {selected.c > 0 ? '+' : ''}{selected.c} PE
              </span>
              {selected.r && selected.r !== '—' && (
                <span className="font-mono text-[10px] text-parchment-dim">Req: {selected.r}</span>
              )}
            </div>
            {selected.d && <p className="font-mono text-[11px] text-parchment-dim">{selected.d}</p>}
          </div>
        )}
      </div>

      {inqMejoras.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="font-mono text-xs text-parchment-dim">Sin mejoras de Inquisidor</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-rim">
          {inqMejoras.map(m => (
            <div key={m.id} className="flex items-start gap-2 px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-rajdhani font-bold text-parchment text-sm leading-none">{m.name}</span>
                  <span className="font-mono text-[10px] bg-gold/20 text-gold px-1.5 py-0.5">{m.type}</span>
                  <span className={['font-mono text-[10px] font-bold', m.cost < 0 ? 'text-crimson-bright' : 'text-gold-bright'].join(' ')}>
                    {m.cost > 0 ? '+' : ''}{m.cost} PE
                  </span>
                </div>
                {m.desc && <p className="font-mono text-[11px] text-parchment-dim">{m.desc}</p>}
              </div>
              <button
                onClick={() => dispatch(removeInqMejora({ charId: char!.id, mejoraId: m.id }))}
                className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0 mt-0.5"
                aria-label="Eliminar mejora"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
