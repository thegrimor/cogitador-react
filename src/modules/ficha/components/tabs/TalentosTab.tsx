import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addTalent, removeTalent, toggleFilterCareer } from '../../services/fichaSlice'
import { TALENTS, type TalentDefinition } from '@/core/data/darkheresy'
import {
  getRankForXP, getAvailableItemsForRank, normalizeName, CAREERS_DATA, CAREER_RANKS_DATA, getRobustoLimit,
} from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../services/fichaComputed'
import { EmptyState } from '../EmptyState'
import { TalentPickerModal, type TalentSection } from './talentos/TalentPickerModal'

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
  type: 'COMBATE',
  req: '',
  desc: '',
  effect: '',
  xp: 0,
}

// Mismos valores que el <select id="talType"> del HTML legacy
const TALENT_TYPES = ['COMBATE', 'MECÁNICO', 'PSÍQUICO', 'GENERAL', 'TECH', 'BENEDICTION']

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

  const [showPicker, setShowPicker] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [manual, setManual] = useState<ManualForm>(EMPTY_MANUAL)

  if (!char) return <NoChar />

  const xpSpent      = computeXpSpent(char)
  const rankInfo     = getRankForXP(char.info.career, xpSpent, char.info.branch)
  const available    = rankInfo ? getAvailableItemsForRank(char.info.career, rankInfo.rank) : null
  const filteredTalents = (char.filterCareer && available)
    ? TALENTS.filter(t => available.has(normalizeName(t.name)))
    : TALENTS

  const sortedTalents = [...char.talents].sort((a, b) => a.name.localeCompare(b.name, 'es'))
  const ownedCounts = char.talents.reduce<Record<string, number>>((acc, t) => {
    acc[t.name] = (acc[t.name] ?? 0) + 1
    return acc
  }, {})

  // Tope de Robusto según carrera+rango (manual básico) — null = sin dato de rango, sin tope
  const robustoLimit = rankInfo ? getRobustoLimit(char.info.career, rankInfo.rank) : null
  const maxCounts: Record<string, number> = robustoLimit != null ? { Robusto: robustoLimit } : {}

  // Con "Solo carrera" activo y datos de rango disponibles: una sección por rango obtenido
  // hasta el actual, de menos a más poderoso. Si no, una única lista alfabética.
  function buildSections(): TalentSection[] {
    const careerRanks = CAREERS_DATA[char!.info.career]
    const careerItemsByRank = CAREER_RANKS_DATA[char!.info.career]
    if (char!.filterCareer && rankInfo && careerRanks && careerItemsByRank && Object.keys(careerItemsByRank).length > 0) {
      const currentIdx = careerRanks.findIndex(r => r.rank === rankInfo.rank)
      const sections: TalentSection[] = []
      for (let i = 0; i <= currentIdx; i++) {
        const rankName = careerRanks[i].rank
        const names = new Set((careerItemsByRank[rankName] ?? []).map(normalizeName))
        const talents = TALENTS
          .filter(t => names.has(normalizeName(t.name)))
          .sort((a, b) => a.name.localeCompare(b.name, 'es'))
        if (talents.length) sections.push({ label: rankName, talents })
      }
      if (sections.length) return sections
    }
    return [{ label: '', talents: [...filteredTalents].sort((a, b) => a.name.localeCompare(b.name, 'es')) }]
  }

  function handlePickerAdd(talent: TalentDefinition, xp: number) {
    const max = maxCounts[talent.name]
    if (max != null && (ownedCounts[talent.name] ?? 0) >= max) return
    dispatch(addTalent({
      charId: char!.id,
      talent: {
        name: talent.name,
        type: talent.type,
        req: talent.req,
        desc: talent.desc,
        effect: talent.effect,
        xp,
      },
    }))
  }

  function handleManualAdd() {
    if (!manual.name.trim()) return
    dispatch(addTalent({ charId: char!.id, talent: { ...manual } }))
    setManual(EMPTY_MANUAL)
    setShowManual(false)
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Registro de Talentos</h3>
        <div className="flex gap-1.5">
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
            {char.filterCareer ? '🔒 Solo carrera' : '◻ Solo carrera'}
          </button>
          <button
            onClick={() => setShowManual(v => !v)}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
          >
            + Añadir Manual
          </button>
        </div>
      </div>

      <div className="mx-4 mt-3">
        <button
          onClick={() => setShowPicker(true)}
          className="w-full font-display text-[10px] uppercase tracking-[2px] px-3 py-2.5 bg-surface-3 border border-rim-bright border-t-2 border-t-gold text-gold hover:bg-surface-4 transition-colors"
        >
          ⚡ Añadir Talento del Libro
        </button>
      </div>

      {showPicker && (
        <TalentPickerModal
          sections={buildSections()}
          ownedCounts={ownedCounts}
          maxCounts={maxCounts}
          onAdd={handlePickerAdd}
          onClose={() => setShowPicker(false)}
        />
      )}

      {showManual && (
        <div className="mx-4 mt-3 flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
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

      {char.talents.length === 0 ? (
        <div className="p-4">
          <EmptyState icon="✦" label="Sin talentos" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-2">
          {sortedTalents.map(talent => (
            // Réplica de .talent-card: borde izquierdo de acento, nombre 15px,
            // "REQUISITOS: X", efecto con prefijo ►, descripción siempre visible
            // (el legacy no la oculta tras un toggle), columna derecha con
            // coste PE (si tiene) y eliminar. Sin badge de tipo — el legacy
            // no lo muestra en la tarjeta pese a tener esa clase en el CSS.
            <div
              key={talent.id}
              className="bg-surface border border-rim border-l-[3px] border-l-crimson-dim hover:border-rim-bright hover:border-l-crimson px-3.5 py-3 flex gap-3 items-start transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-rajdhani font-bold text-[15px] text-parchment-bright mb-1">{talent.name}</div>
                {talent.req && (
                  <div className="font-mono text-[9px] tracking-[1px] text-parchment-dim mb-1">REQUISITOS: {talent.req}</div>
                )}
                {talent.effect && (
                  <div className="font-mono text-[11px] text-neon">► {talent.effect}</div>
                )}
                {talent.desc && (
                  <div className="font-rajdhani text-[11px] text-parchment-dim mt-1">{talent.desc}</div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {talent.xp > 0 && (
                  <span className="font-mono text-[10px] text-gold border border-gold px-1.5 py-0.5 whitespace-nowrap">{talent.xp} PE</span>
                )}
                <button
                  onClick={() => dispatch(removeTalent({ charId: char!.id, talentId: talent.id }))}
                  className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors"
                  aria-label="Eliminar talento"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
