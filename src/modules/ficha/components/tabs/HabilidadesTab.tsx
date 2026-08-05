import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addSkill, updateSkill, removeSkill, toggleFilterCareer } from '../../services/fichaSlice'
import { SKILLS } from '@/core/data/darkheresy'
import { ATTRIBUTES } from '@/core/data/darkheresy'
import { getRankForXP, getAvailableItemsForRank, normalizeName } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../services/fichaComputed'
import type { Skill } from '../../types/fichaTypes'

const LEVEL_OPTIONS: { value: number; label: string }[] = [
  { value: -20, label: 'No entrenado' },
  { value: 0,   label: 'Entrenado'    },
  { value: 10,  label: 'Avanzado'     },
  { value: 20,  label: 'Maestro'      },
]

function levelLabel(level: number): string {
  return LEVEL_OPTIONS.find(o => o.value === level)?.label ?? 'Entrenado'
}

function nextLevel(current: number): number {
  const values = [-20, 0, 10, 20]
  const idx = values.indexOf(current)
  return values[(idx + 1) % values.length]
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

  const [selectedSkillName, setSelectedSkillName] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [manual, setManual] = useState<ManualForm>(EMPTY_MANUAL)

  if (!char) return <NoChar />

  const xpSpent   = computeXpSpent(char)
  const rankInfo  = getRankForXP(char.info.career, xpSpent, char.info.branch)
  const available = rankInfo ? getAvailableItemsForRank(char.info.career, rankInfo.rank) : null

  const filteredSkills = (char.filterCareer && available)
    ? SKILLS.filter(s => available.has(normalizeName(s.name)))
    : SKILLS

  const selectedDef = SKILLS.find(s => s.name === selectedSkillName)

  function getAttrTotal(attrKey: string): number {
    const v = char!.attrs[attrKey]
    if (!v) return 0
    return v.base + v.advances + v.bonuses
  }

  function calcTotal(skill: Skill): number {
    const levelBonus = skill.level === -20 ? -20 : skill.level
    return getAttrTotal(skill.attr) + levelBonus + skill.bonus
  }

  function handleQuickAdd() {
    if (!selectedDef) return
    dispatch(addSkill({
      charId: char!.id,
      skill: {
        name: selectedDef.name,
        attr: selectedDef.attr,
        level: 0,
        bonus: 0,
        notes: selectedDef.notes ?? '',
        xp: 0,
      },
    }))
    setSelectedSkillName('')
  }

  function handleManualAdd() {
    if (!manual.name.trim()) return
    dispatch(addSkill({ charId: char!.id, skill: { ...manual } }))
    setManual(EMPTY_MANUAL)
    setShowManual(false)
  }

  function handleLevelCycle(skill: Skill) {
    dispatch(updateSkill({
      charId: char!.id,
      skill: { ...skill, level: nextLevel(skill.level) },
    }))
  }

  function handleBonusChange(skill: Skill, val: number) {
    dispatch(updateSkill({ charId: char!.id, skill: { ...skill, bonus: val } }))
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Habilidades</h3>
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
            title={char.filterCareer ? 'Mostrar todas las habilidades' : 'Solo habilidades de carrera'}
          >
            {char.filterCareer ? '🔒 Carrera' : '◻ Carrera'}
          </button>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSkillName}
            onChange={e => setSelectedSkillName(e.target.value)}
            className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
          >
            <option value="">— Seleccionar habilidad —</option>
            {filteredSkills.map(s => (
              <option key={s.name} value={s.name}>{s.name} ({s.attr})</option>
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
          <div className="bg-surface border border-rim px-3 py-2 flex gap-3 items-start">
            <span className="font-mono text-[10px] bg-gold/20 text-gold px-2 py-0.5 shrink-0">{selectedDef.attr}</span>
            <p className="font-mono text-[11px] text-parchment-dim">{selectedDef.notes ?? 'Habilidad estándar'}</p>
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
      </div>

      {char.skills.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="font-mono text-xs text-parchment-dim">Sin habilidades registradas</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-rim">
          {char.skills.map(skill => {
            const total = calcTotal(skill)
            return (
              <div key={skill.id} className="flex items-start gap-3 px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-rajdhani font-semibold text-parchment text-sm leading-none">{skill.name}</span>
                    <span className="font-mono text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 shrink-0">{skill.attr}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleLevelCycle(skill)}
                      className="font-mono text-[10px] border border-rim-bright text-parchment-dim px-2 py-0.5 hover:border-crimson hover:text-crimson transition-colors shrink-0"
                      title="Pulsa para cambiar nivel"
                    >
                      {levelLabel(skill.level)}
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] text-parchment-dim">+</span>
                      <input
                        type="number"
                        value={skill.bonus}
                        onChange={e => handleBonusChange(skill, Number(e.target.value))}
                        className="w-14 bg-surface border border-rim-bright text-parchment font-mono text-[11px] px-2 py-0.5 outline-none focus:border-gold transition-colors text-center"
                      />
                    </div>
                    <span className="font-mono text-[11px] text-neon font-bold">= {total}</span>
                    {skill.xp > 0 && (
                      <span className="font-mono text-[10px] text-parchment-dim">{skill.xp} XP</span>
                    )}
                  </div>
                  {skill.notes && (
                    <p className="font-mono text-[10px] text-parchment-dim italic">{skill.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => dispatch(removeSkill({ charId: char!.id, skillId: skill.id }))}
                  className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0 mt-0.5"
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
