import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addInqMejora, removeInqMejora, updateInqMejoraNotes } from '../../services/fichaSlice'
import { INQUISIDOR_RANKS } from '@/core/data/darkheresy'
import { getInquisidorRank } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../services/fichaComputed'
import { EmptyState } from '../EmptyState'

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
        <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Talentos de Inquisidor</h3>
          <span className="font-display text-[12px] text-parchment-dim">Sin rango</span>
        </div>

        <div className="mx-4 mt-3 bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
          <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Selector Rápido</h4>
          <div className="flex flex-wrap gap-2 items-end">
            <select
              disabled
              className="max-w-[160px] shrink-0 bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-2 py-2 outline-none opacity-60"
            >
              <option>Todos los tipos</option>
            </select>
            <select
              disabled
              className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment-dim font-mono text-sm px-3 py-2 outline-none opacity-60"
            >
              <option>— Sin rango desbloqueado —</option>
            </select>
            <button
              disabled
              className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white opacity-40 cursor-not-allowed shrink-0"
            >
              Añadir
            </button>
          </div>
        </div>

        <div className="mx-4 mt-3 bg-surface border border-gold border-l-4 border-l-gold-bright px-3.5 py-3">
          <p className="font-mono text-xs text-parchment leading-relaxed">
            El rango de Inquisidor se desbloquea en el 6º rango de acólito.
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
      mejora: { name: selected.n, type: selected.t, cost: selected.c, req: selected.r, desc: selected.d ?? '', notes: '' },
    }))
    setSelName('')
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Talentos de Inquisidor</h3>
        <span className="font-display text-[12px] text-gold-bright">Rango {inqRank}</span>
      </div>

      {inqRank === 9 && rank9?.note && (
        <div className="mx-4 mt-3 bg-surface border border-gold border-l-4 border-l-gold-bright px-3.5 py-3">
          <p className="font-display text-[8px] uppercase tracking-[2px] text-gold mb-1.5">⚜ Rasgo especial del rango 9</p>
          <p className="font-mono text-xs text-parchment leading-relaxed">{rank9.note}</p>
        </div>
      )}

      <div className="mx-4 mt-3 bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
        <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Selector Rápido</h4>
        <div className="flex flex-wrap gap-2 items-end">
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setSelName('') }}
            className="max-w-[160px] shrink-0 bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-2 py-2 outline-none focus:border-crimson transition-colors"
          >
            <option value="">Todos los tipos</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={selName}
            onChange={e => setSelName(e.target.value)}
            className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
          >
            <option value="">— Seleccionar mejora —</option>
            {available.map(m => (
              <option key={m.n} value={m.n}>[R{m.rank}] {m.n}{m.r && m.r !== '—' ? ` [${m.r}]` : ''}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!selected}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            Añadir
          </button>
        </div>

        {selected && (
          <p className="font-mono text-[11px] mt-2">
            <span className="text-gold">{selected.t}</span>
            {' · '}
            <b className={selected.c < 0 ? 'text-crimson-bright' : 'text-gold-bright'}>
              {selected.c > 0 ? '+' : ''}{selected.c} PE
            </b>
            {selected.r && selected.r !== '—' && (
              <>{' · '}Req: <span className="text-parchment-dim">{selected.r}</span></>
            )}
            {selected.d && (
              <>
                <br />
                <span className="text-parchment">{selected.d}</span>
              </>
            )}
          </p>
        )}
      </div>

      {inqMejoras.length === 0 ? (
        <div className="p-4">
          <EmptyState icon="⚜" label="Sin talentos de Inquisidor" />
        </div>
      ) : (
        <div className="flex flex-col px-4 py-2">
          {inqMejoras.map(m => (
            <div key={m.id} className="flex flex-col items-stretch gap-1 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-rajdhani text-[15px] font-bold text-gold-bright mb-1">{m.name}</div>
                  <div className="font-mono text-[9px] tracking-[2px] text-gold mb-1.5">
                    {m.type}{m.req && m.req !== '—' ? ` · Req: ${m.req}` : ''}
                  </div>
                  {m.desc && <div className="font-mono text-[11px] text-parchment mt-1 leading-relaxed">{m.desc}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={['font-display text-[10px]', m.cost < 0 ? 'text-crimson-bright' : 'text-parchment-dim'].join(' ')}>
                    {m.cost > 0 ? '+' : ''}{m.cost} PE
                  </span>
                  <button
                    onClick={() => dispatch(removeInqMejora({ charId: char!.id, mejoraId: m.id }))}
                    className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors"
                    aria-label="Eliminar mejora"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <textarea
                placeholder="Notas personales..."
                value={m.notes ?? ''}
                onChange={e => dispatch(updateInqMejoraNotes({ charId: char!.id, mejoraId: m.id, notes: e.target.value }))}
                className="bg-surface border border-rim text-parchment font-mono text-[11px] px-2 py-1.5 outline-none focus:border-crimson transition-colors resize-y min-h-9 w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
