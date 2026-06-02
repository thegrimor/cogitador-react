import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addInqTalent, removeInqTalent } from '../../services/fichaSlice'
import { INQUISIDOR_RANKS } from '@/core/data/darkheresy'
import { CAREERS_DATA } from '@/core/data/darkheresy/careers'
import type { Character, InqTalentType } from '../../types/fichaTypes'

const INQ_TALENT_TYPES: InqTalentType[] = [
  'Talento de Influencia',
  'Talento de Prestigio',
  'Habilidad Maestra',
  'Talento de Fe',
  'Otros Talentos',
  'Talento',
  'Habilidad',
  'Rasgo',
]

function getInquisitorRank(char: Character): number | null {
  const career = char.info.career
  const ranks = CAREERS_DATA[career]
  if (!ranks || ranks.length === 0) return null
  const rankIdx = ranks.findIndex(r => r.rank === char.info.rank)
  if (rankIdx < 0) return null
  const total = ranks.length
  if (rankIdx === total - 1) return 16
  if (rankIdx === total - 2) return 15
  if (rankIdx < 5) return null
  return Math.min(rankIdx + 4, 14)
}

function typeColor(tipo: InqTalentType): string {
  switch (tipo) {
    case 'Talento de Influencia': return 'bg-gold/20 text-gold'
    case 'Talento de Prestigio':  return 'bg-crimson/20 text-crimson-bright'
    case 'Habilidad Maestra':     return 'bg-neon/20 text-neon'
    case 'Talento de Fe':         return 'bg-parchment/10 text-parchment'
    default:                      return 'bg-surface-4 text-parchment-dim'
  }
}

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

  const [typeFilter, setTypeFilter] = useState<InqTalentType | ''>('')
  const [selectedValue, setSelectedValue] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  if (!char) return <NoChar />

  const inqRank = getInquisitorRank(char)

  const owned = new Set(char.inqTalents.map(t => t.name))

  const availableMejoras: { rank: number; mejora: typeof INQUISIDOR_RANKS[9]['mejoras'][0] }[] = []
  if (inqRank !== null) {
    for (let r = 9; r <= inqRank; r++) {
      const rankData = INQUISIDOR_RANKS[r]
      if (!rankData) continue
      rankData.mejoras.forEach(m => {
        if (owned.has(m.n)) return
        if (typeFilter && m.t !== typeFilter) return
        availableMejoras.push({ rank: r, mejora: m })
      })
    }
  }

  const selectedMejora = selectedValue
    ? availableMejoras.find(item => item.mejora.n === selectedValue)
    : null

  function handleAdd() {
    if (!selectedMejora || !char) return
    const m = selectedMejora.mejora
    dispatch(addInqTalent({
      charId: char.id,
      talent: {
        name: m.n,
        tipo: m.t,
        xp: m.c,
        req: m.r,
        desc: m.d ?? '',
      },
    }))
    setSelectedValue('')
  }

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Inquisidor</h3>
        {inqRank !== null && (
          <span className="font-display text-[9px] uppercase tracking-[1px] bg-gold/20 text-gold px-2 py-0.5 border border-gold/30">
            Rango {inqRank}
          </span>
        )}
      </div>

      {inqRank === null ? (
        <div className="px-4 py-6 text-center">
          <p className="font-mono text-xs text-parchment-dim">
            El rango de Inquisidor se desbloquea en el 6º rango de acólito.
          </p>
        </div>
      ) : (
        <>
          {INQUISIDOR_RANKS[inqRank]?.note && (
            <div className="mx-4 mt-3 border border-gold/30 bg-gold/5 px-3 py-2">
              <p className="font-mono text-[10px] text-gold leading-relaxed">
                {INQUISIDOR_RANKS[inqRank].note}
              </p>
            </div>
          )}

          <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={e => { setTypeFilter(e.target.value as InqTalentType | ''); setSelectedValue('') }}
                className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">Todos los tipos</option>
                {INQ_TALENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedValue}
                onChange={e => setSelectedValue(e.target.value)}
                className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Selecciona mejora —</option>
                {availableMejoras.map(({ rank, mejora }) => (
                  <option key={`${rank}-${mejora.n}`} value={mejora.n}>
                    [R{rank}] {mejora.n}{mejora.r && mejora.r !== '—' ? ` [${mejora.r}]` : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAdd}
                disabled={!selectedMejora}
                className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Añadir
              </button>
            </div>

            {selectedMejora && (
              <div className="bg-surface border border-rim px-3 py-2 flex flex-col gap-1">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className={`font-mono text-[10px] px-2 py-0.5 ${typeColor(selectedMejora.mejora.t)}`}>
                    {selectedMejora.mejora.t}
                  </span>
                  <span className={`font-mono text-[11px] font-bold ${selectedMejora.mejora.c < 0 ? 'text-crimson-bright' : 'text-gold'}`}>
                    {selectedMejora.mejora.c > 0 ? '+' : ''}{selectedMejora.mejora.c} XP
                  </span>
                  {selectedMejora.mejora.r && selectedMejora.mejora.r !== '—' && (
                    <span className="font-mono text-[10px] text-parchment-dim">Req: {selectedMejora.mejora.r}</span>
                  )}
                </div>
                {selectedMejora.mejora.d && (
                  <p className="font-mono text-[11px] text-parchment-dim">{selectedMejora.mejora.d}</p>
                )}
              </div>
            )}
          </div>

          {char.inqTalents.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="font-mono text-xs text-parchment-dim">Sin mejoras de Inquisidor registradas</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-rim">
              {char.inqTalents.map(talent => {
                const expanded = expandedIds.has(talent.id)
                return (
                  <div key={talent.id} className="flex flex-col px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-rajdhani font-bold text-parchment text-sm leading-none">{talent.name}</span>
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 shrink-0 ${typeColor(talent.tipo)}`}>
                            {talent.tipo}
                          </span>
                          {talent.xp !== 0 && (
                            <span className={`font-mono text-[10px] ${talent.xp < 0 ? 'text-crimson-bright' : 'text-gold'}`}>
                              {talent.xp > 0 ? '+' : ''}{talent.xp} XP
                            </span>
                          )}
                        </div>
                        {talent.req && talent.req !== '—' && (
                          <p className="font-mono text-[10px] text-parchment-dim">Req: {talent.req}</p>
                        )}
                        {talent.desc && (
                          <button
                            onClick={() => toggleExpand(talent.id)}
                            className="font-mono text-[10px] text-parchment-dim hover:text-parchment transition-colors text-left"
                          >
                            {expanded ? '▲ Ocultar descripción' : '▼ Ver descripción'}
                          </button>
                        )}
                        {expanded && talent.desc && (
                          <p className="font-mono text-[11px] text-parchment-dim border-l-2 border-rim pl-2 mt-1">{talent.desc}</p>
                        )}
                      </div>
                      <button
                        onClick={() => dispatch(removeInqTalent({ charId: char.id, talentId: talent.id }))}
                        className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0 mt-0.5"
                        aria-label="Eliminar mejora"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
