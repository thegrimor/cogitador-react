import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addTalent, removeTalent, toggleFilterCareer } from '../../services/fichaSlice'
import { TALENTS } from '@/core/data/darkheresy'
import { getRankForXP, getAvailableItemsForRank, normalizeName } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../services/fichaComputed'

type ManualForm = {
  name: string
  type: string
  req: string
  desc: string
  effect: string
  xp: number
}

const EMPTY_MANUAL: ManualForm = {
  name: '',
  type: 'Combat',
  req: '',
  desc: '',
  effect: '',
  xp: 0,
}

const TALENT_TYPES = ['Combat', 'Social', 'Mental', 'Physical', 'Stealth', 'Tech', 'Otro']

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function TalentosTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [selectedTalentName, setSelectedTalentName] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [manual, setManual] = useState<ManualForm>(EMPTY_MANUAL)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  if (!char) return <NoChar />

  const xpSpent      = computeXpSpent(char)
  const rankInfo     = getRankForXP(char.info.career, xpSpent)
  const available    = rankInfo ? getAvailableItemsForRank(char.info.career, rankInfo.rank) : null
  const filteredTalents = (char.filterCareer && available)
    ? TALENTS.filter(t => available.has(normalizeName(t.name)))
    : TALENTS

  const selectedDef = TALENTS.find(t => t.name === selectedTalentName)

  function handleQuickAdd() {
    if (!selectedDef) return
    dispatch(addTalent({
      charId: char!.id,
      talent: {
        name: selectedDef.name,
        type: selectedDef.type,
        req: selectedDef.req,
        desc: selectedDef.desc,
        effect: selectedDef.effect,
        xp: 0,
      },
    }))
    setSelectedTalentName('')
  }

  function handleManualAdd() {
    if (!manual.name.trim()) return
    dispatch(addTalent({ charId: char!.id, talent: { ...manual } }))
    setManual(EMPTY_MANUAL)
    setShowManual(false)
  }

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Talentos</h3>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => dispatch(toggleFilterCareer(char!.id))}
            className={[
              'font-display text-[8px] uppercase tracking-[1px] border px-2 py-1.5 transition-colors shrink-0',
              char.filterCareer
                ? 'border-crimson text-crimson bg-crimson/10'
                : 'border-rim-bright text-parchment-dim hover:border-gold hover:text-gold',
            ].join(' ')}
            title={char.filterCareer ? 'Mostrar todos los talentos' : 'Solo talentos de carrera'}
          >
            {char.filterCareer ? '🔒 Carrera' : '◻ Carrera'}
          </button>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTalentName}
            onChange={e => setSelectedTalentName(e.target.value)}
            className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
          >
            <option value="">— Seleccionar talento —</option>
            {filteredTalents.map(t => (
              <option key={t.name} value={t.name}>{t.name} [{t.type}]</option>
            ))}
          </select>
          <button
            onClick={handleQuickAdd}
            disabled={!selectedDef}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            Añadir
          </button>
        </div>

        {selectedDef && (
          <div className="bg-surface border border-rim px-3 py-2 flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <span className="font-mono text-[10px] bg-gold/20 text-gold px-2 py-0.5">{selectedDef.type}</span>
              <span className="font-mono text-[10px] text-parchment-dim">Req: {selectedDef.req}</span>
            </div>
            <p className="font-mono text-[11px] text-parchment-dim">{selectedDef.desc}</p>
            <p className="font-mono text-[11px] text-neon">{selectedDef.effect}</p>
          </div>
        )}

        <button
          onClick={() => setShowManual(v => !v)}
          className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment border border-rim-bright px-3 py-1.5 transition-colors text-left"
        >
          {showManual ? '▲ Ocultar formulario manual' : '▼ Añadir manualmente'}
        </button>

        {showManual && (
          <div className="flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
            <input
              placeholder="Nombre"
              value={manual.name}
              onChange={e => setManual(m => ({ ...m, name: e.target.value }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={manual.type}
                onChange={e => setManual(m => ({ ...m, type: e.target.value }))}
                className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                {TALENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                placeholder="Requisitos"
                value={manual.req}
                onChange={e => setManual(m => ({ ...m, req: e.target.value }))}
                className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              />
            </div>
            <textarea
              placeholder="Descripción"
              value={manual.desc}
              onChange={e => setManual(m => ({ ...m, desc: e.target.value }))}
              rows={2}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors resize-y"
            />
            <input
              placeholder="Efecto"
              value={manual.effect}
              onChange={e => setManual(m => ({ ...m, effect: e.target.value }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
            <input
              type="number"
              placeholder="XP"
              value={manual.xp}
              onChange={e => setManual(m => ({ ...m, xp: Number(e.target.value) }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
            <button
              onClick={handleManualAdd}
              disabled={!manual.name.trim()}
              className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Añadir Manual
            </button>
          </div>
        )}
      </div>

      {char.talents.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="font-mono text-xs text-parchment-dim">Sin talentos registrados</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-rim">
          {char.talents.map(talent => {
            const expanded = expandedIds.has(talent.id)
            return (
              <div key={talent.id} className="flex flex-col px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
                <div className="flex items-start gap-2">
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-rajdhani font-bold text-parchment text-sm leading-none">{talent.name}</span>
                      <span className="font-mono text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 shrink-0">{talent.type}</span>
                      {talent.xp > 0 && (
                        <span className="font-mono text-[10px] text-parchment-dim">{talent.xp} XP</span>
                      )}
                    </div>
                    {talent.req && (
                      <p className="font-mono text-[10px] text-parchment-dim">Req: {talent.req}</p>
                    )}
                    {talent.effect && (
                      <p className="font-mono text-[11px] text-neon">{talent.effect}</p>
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
                    onClick={() => dispatch(removeTalent({ charId: char!.id, talentId: talent.id }))}
                    className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0 mt-0.5"
                    aria-label="Eliminar talento"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
