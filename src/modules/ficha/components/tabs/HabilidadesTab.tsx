import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addSkill, updateSkill, removeSkill, toggleFilterCareer } from '../../services/fichaSlice'
import { SKILLS, findCoveringMasterSkill, type SkillDefinition } from '@/core/data/darkheresy'
import { ATTRIBUTES } from '@/core/data/darkheresy'
import {
  getRankForXP, getAvailableItemsForRank, normalizeName, getAttrCostsForCareer, CAREERS_DATA, CAREER_RANKS_DATA,
} from '@/core/data/darkheresy/careers'
import { computeXpSpent, getAttrTotal } from '../../services/fichaComputed'
import { EmptyState } from '../EmptyState'
import type { Skill } from '../../types/fichaTypes'
import { SkillPickerModal, type SkillSection } from './habilidades/SkillPickerModal'

const LEVEL_OPTIONS: { value: number; label: string }[] = [
  { value: -20, label: 'No entrenado' },
  { value: 0,   label: 'Entrenado'    },
  { value: 10,  label: 'Avanzado'     },
  { value: 20,  label: 'Maestro'      },
]

function levelLabel(level: number): string {
  return LEVEL_OPTIONS.find(o => o.value === level)?.label ?? 'Entrenado'
}

// Igual que cycleSkillLevel() del HTML legacy: 3 puntos (uno por Entrenado/
// Avanzado/Maestro). "No entrenado" (-20) es el estado con los 3 vacíos, sin
// punto propio. El legacy guarda un índice 0-3; aquí se guarda en puntos
// (-20/0/10/20), así que se convierte antes y después de aplicar el ciclo.
const LEVEL_INDEX = [-20, 0, 10, 20]
function cycleSkillDot(currentLevelPoints: number, dotIndex: number): number {
  const rawIndex = LEVEL_INDEX.indexOf(currentLevelPoints)
  const newRawIndex = rawIndex === dotIndex + 1 ? dotIndex : dotIndex + 1
  return LEVEL_INDEX[newRawIndex] ?? 0
}

type ManualForm = {
  name: string
  attr: string
  level: number
  bonus: number
  notes: string
  xp: number
}

const EMPTY_MANUAL: ManualForm = {
  name: '',
  attr: 'WS',
  level: 0,
  bonus: 0,
  notes: '',
  xp: 0,
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

export function HabilidadesTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [showPicker, setShowPicker] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [manual, setManual] = useState<ManualForm>(EMPTY_MANUAL)

  if (!char) return <NoChar />

  const xpSpent   = computeXpSpent(char)
  const rankInfo  = getRankForXP(char.info.career, xpSpent, char.info.branch)
  const available = rankInfo ? getAvailableItemsForRank(char.info.career, rankInfo.rank) : null

  const filteredSkills = (char.filterCareer && available)
    ? SKILLS.filter(s => available.has(normalizeName(s.name)))
    : SKILLS

  // Habilidades Maestras (Ascension) ya adquiridas como mejora de Inquisidor — marcan las
  // habilidades individuales que sustituyen, sin borrarlas.
  const ownedMejoraNames = new Set((char.inqMejoras ?? []).map(m => m.name))
  const ownedLevels = Object.fromEntries(char.skills.map(s => [s.name, s.level]))

  function calcTotal(skill: Skill): number {
    const levelBonus = skill.level === -20 ? -20 : skill.level
    const costs = getAttrCostsForCareer(char!.info.career)[skill.attr]
    return getAttrTotal(char!.attrs[skill.attr], costs) + levelBonus + skill.bonus
  }

  // Con "Solo carrera" activo y datos de rango disponibles: una sección por rango obtenido
  // hasta el actual, de menos a más poderoso. Si no, una única lista alfabética.
  function buildSections(): SkillSection[] {
    const careerRanks = CAREERS_DATA[char!.info.career]
    const careerItemsByRank = CAREER_RANKS_DATA[char!.info.career]
    if (char!.filterCareer && rankInfo && careerRanks && careerItemsByRank && Object.keys(careerItemsByRank).length > 0) {
      const currentIdx = careerRanks.findIndex(r => r.rank === rankInfo.rank)
      const sections: SkillSection[] = []
      for (let i = 0; i <= currentIdx; i++) {
        const rankName = careerRanks[i].rank
        const names = new Set((careerItemsByRank[rankName] ?? []).map(normalizeName))
        const skills = SKILLS
          .filter(s => names.has(normalizeName(s.name)))
          .sort((a, b) => a.name.localeCompare(b.name, 'es'))
        if (skills.length) sections.push({ label: rankName, skills })
      }
      if (sections.length) return sections
    }
    return [{ label: '', skills: [...filteredSkills].sort((a, b) => a.name.localeCompare(b.name, 'es')) }]
  }

  function handlePickerAdd(skill: SkillDefinition, level: number, xp: number) {
    if (char!.skills.some(s => s.name === skill.name)) return
    dispatch(addSkill({
      charId: char!.id,
      skill: {
        name: skill.name,
        attr: skill.attr,
        level,
        bonus: 0,
        notes: skill.notes ?? '',
        xp,
      },
    }))
  }

  function handleManualAdd() {
    if (!manual.name.trim()) return
    dispatch(addSkill({ charId: char!.id, skill: { ...manual } }))
    setManual(EMPTY_MANUAL)
    setShowManual(false)
  }

  function handleDotClick(skill: Skill, dotIndex: number) {
    dispatch(updateSkill({
      charId: char!.id,
      skill: { ...skill, level: cycleSkillDot(skill.level, dotIndex) },
    }))
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Registro de Habilidades</h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => dispatch(toggleFilterCareer(char!.id))}
            className={[
              'font-display text-[8px] uppercase tracking-[1px] border px-2 py-1.5 transition-colors shrink-0',
              char.filterCareer
                ? 'border-crimson text-crimson bg-crimson/10'
                : 'border-rim-bright text-parchment-dim hover:border-gold hover:text-gold',
            ].join(' ')}
            title={char.filterCareer ? 'Mostrar todas las habilidades' : 'Solo habilidades de carrera'}
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
          ⚡ Añadir Habilidad del Libro
        </button>
      </div>

      {showPicker && (
        <SkillPickerModal
          sections={buildSections()}
          ownedLevels={ownedLevels}
          onAdd={handlePickerAdd}
          onClose={() => setShowPicker(false)}
        />
      )}

      {showManual && (
        <div className="mx-4 mt-3 flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Nombre"
              value={manual.name}
              onChange={e => setManual(m => ({ ...m, name: e.target.value }))}
              className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
            <select
              value={manual.attr}
              onChange={e => setManual(m => ({ ...m, attr: e.target.value }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            >
              {ATTRIBUTES.map(a => (
                <option key={a.key} value={a.key}>{a.abbr}</option>
              ))}
            </select>
            <select
              value={manual.level}
              onChange={e => setManual(m => ({ ...m, level: Number(e.target.value) }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            >
              {LEVEL_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Bonus"
              value={manual.bonus}
              onChange={e => setManual(m => ({ ...m, bonus: Number(e.target.value) }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
            <input
              type="number"
              placeholder="XP"
              value={manual.xp}
              onChange={e => setManual(m => ({ ...m, xp: Number(e.target.value) }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
            <input
              placeholder="Notas"
              value={manual.notes}
              onChange={e => setManual(m => ({ ...m, notes: e.target.value }))}
              className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
          </div>
          <button
            onClick={handleManualAdd}
            disabled={!manual.name.trim()}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Añadir Manual
          </button>
        </div>
      )}

      <div className="px-4 pt-4 pb-1">
        <p className="font-mono text-[9px] text-parchment-dim tracking-[1px]">
          NIVEL: ○○○ No entrenado (-20) &nbsp;|&nbsp; ●○○ Entrenado (+0) &nbsp;|&nbsp; ●●○ Avanzado (+10) &nbsp;|&nbsp; ●●● Maestro (+20)
        </p>
      </div>

      {char.skills.length === 0 ? (
        <div className="p-4">
          <EmptyState icon="📋" label="Sin habilidades" />
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-rim">
          {char.skills.map(skill => {
            const total = calcTotal(skill)
            const dotsFilled = LEVEL_INDEX.indexOf(skill.level)
            const coveringMaster = findCoveringMasterSkill(skill.name, ownedMejoraNames)
            return (
              // Réplica de .skill-row: fila única con nombre+notas, atributo,
              // 3 puntos de nivel clicables, bonus (solo lectura — el legacy
              // no permite editarlo tras crear la habilidad), total en % y
              // coste PE. flex-wrap añadido sobre el original (que no lo
              // lleva) para no romper el layout en móvil con nombres largos.
              <div
                key={skill.id}
                className={[
                  'flex items-center flex-wrap gap-2.5 px-3 py-2 bg-surface-2 hover:bg-surface-3 transition-colors',
                  coveringMaster ? 'opacity-60' : '',
                ].join(' ')}
              >
                <div className="flex-1 min-w-[120px]">
                  <div className="font-rajdhani font-semibold text-sm text-parchment leading-tight truncate">{skill.name}</div>
                  {skill.notes && (
                    <div className="font-mono text-[10px] text-parchment-dim truncate">{skill.notes}</div>
                  )}
                  {coveringMaster && (
                    <div className="font-mono text-[9px] uppercase tracking-[1px] text-gold truncate">
                      ⬡ Cubierta por {coveringMaster.name} (+20)
                    </div>
                  )}
                </div>
                <span className="font-mono text-[10px] text-parchment-dim w-[30px] text-center shrink-0">{skill.attr}</span>
                <div className="flex gap-1 shrink-0" title={levelLabel(skill.level)}>
                  {[0, 1, 2].map(i => (
                    <button
                      key={i}
                      onClick={() => handleDotClick(skill, i)}
                      className={[
                        'w-[10px] h-[10px] border transition-colors',
                        i < dotsFilled ? 'bg-crimson border-crimson' : 'border-rim-bright hover:border-crimson',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-gold w-[30px] text-center shrink-0">
                  {skill.bonus ? `+${skill.bonus}` : ''}
                </span>
                <span className="font-display text-[13px] font-bold text-gold-bright w-9 text-right shrink-0">{total}%</span>
                {skill.xp > 0 && (
                  <span className="font-mono text-[9px] text-parchment-dim w-10 text-center shrink-0">{skill.xp}PE</span>
                )}
                <button
                  onClick={() => dispatch(removeSkill({ charId: char!.id, skillId: skill.id }))}
                  className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0"
                  aria-label="Eliminar habilidad"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
