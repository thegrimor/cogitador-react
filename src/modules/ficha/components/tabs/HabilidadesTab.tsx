import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addSkill, removeSkill, setSkillLevel } from '../../services/fichaSlice'
import { SKILLS } from '@/core/data/darkheresy/skills'

const LEVEL_BONUS = [-20, 0, 10, 20]
const LEVEL_LABELS = ['No entrenado (−20)', 'Entrenado (+0)', 'Avanzado (+10)', 'Maestro (+20)']

function attrTotal(attrs: Record<string, { base: number; advances: number; bonuses: number }>, key: string) {
  const a = attrs[key]
  if (!a) return 0
  return (a.base || 0) + (a.advances || 0) + (a.bonuses || 0)
}

export function HabilidadesTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'todas' | 'basica' | 'avanzada'>('todas')

  if (!char) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          Sin operativo seleccionado
        </p>
      </div>
    )
  }

  // index de habilidades ya en ficha por key
  const skillMap = new Map(char.skills.map(s => [s.name, s]))

  const filtered = SKILLS.filter(def => {
    const matchSearch = !search || def.label.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'todas' ||
      (filter === 'basica'   && !def.advanced) ||
      (filter === 'avanzada' &&  def.advanced)
    return matchSearch && matchFilter
  })

  function handleAdd(skillKey: string, label: string, attr: string) {
    if (skillMap.has(label)) return
    dispatch(addSkill({ charId: char!.id, skill: { name: label, attr, level: 1, bonus: 0, notes: '' } }))
  }

  function handleDot(skillId: string, currentLevel: number, dotIndex: number) {
    const newLevel = currentLevel === dotIndex + 1 ? dotIndex : dotIndex + 1
    dispatch(setSkillLevel({ charId: char!.id, skillId, level: newLevel }))
  }

  function handleRemove(skillId: string) {
    dispatch(removeSkill({ charId: char!.id, skillId }))
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Habilidades
          </h3>
          <p className="font-mono text-[9px] text-parchment-dim mt-1">
            ○○○ No ent. (−20) &nbsp;|&nbsp; ●○○ Entrenado (+0) &nbsp;|&nbsp; ●●○ Avanzado (+10) &nbsp;|&nbsp; ●●● Maestro (+20)
          </p>
        </div>

        {/* Búsqueda + filtro */}
        <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar habilidad..."
            className="w-full bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
          />
          <div className="flex gap-px">
            {(['todas', 'basica', 'avanzada'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  'flex-1 py-1 font-display text-[8px] uppercase tracking-[1px] border transition-colors',
                  filter === f
                    ? 'bg-crimson border-crimson text-white'
                    : 'border-rim-bright text-parchment-dim hover:border-parchment hover:text-parchment',
                ].join(' ')}
              >
                {f === 'todas' ? 'Todas' : f === 'basica' ? 'Básicas' : 'Avanzadas'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-px bg-rim">
          {filtered.map(def => {
            const charSkill = skillMap.get(def.label)
            const level = charSkill?.level ?? 0
            const base  = attrTotal(char.attrs, def.linkedAttribute)
            const total = base + (LEVEL_BONUS[level] ?? -20)

            return (
              <div
                key={def.key}
                className={[
                  'px-3 py-2 flex items-center gap-2 transition-colors',
                  charSkill ? 'bg-surface' : 'bg-surface-2 opacity-70 hover:opacity-100',
                ].join(' ')}
              >
                {/* Nombre */}
                <div className="flex-1 min-w-0">
                  <p className={[
                    'font-rajdhani text-sm font-semibold truncate',
                    charSkill ? 'text-parchment' : 'text-parchment-dim',
                  ].join(' ')}>
                    {def.label}
                  </p>
                  {charSkill && (
                    <p className="font-mono text-[8px] text-parchment-dim/60">
                      {LEVEL_LABELS[level]}
                    </p>
                  )}
                </div>

                {/* Attr */}
                <span className="font-display text-[9px] text-parchment-dim w-7 text-center shrink-0">
                  {def.linkedAttribute}
                </span>

                {/* Dots */}
                <div className="flex gap-1 shrink-0">
                  {[0, 1, 2].map(i => (
                    <button
                      key={i}
                      onClick={() => charSkill
                        ? handleDot(charSkill.id, level, i)
                        : handleAdd(def.key, def.label, def.linkedAttribute)
                      }
                      disabled={!charSkill && i > 0}
                      className={[
                        'w-2.5 h-2.5 border transition-all',
                        charSkill && i < level
                          ? 'bg-crimson border-crimson'
                          : 'bg-transparent border-rim-bright hover:border-crimson-dim',
                        !charSkill && i > 0 ? 'opacity-0 pointer-events-none' : '',
                      ].join(' ')}
                    />
                  ))}
                </div>

                {/* Total o añadir */}
                {charSkill ? (
                  <>
                    <span className="font-display text-sm font-bold text-gold-bright w-10 text-right shrink-0">
                      {total}%
                    </span>
                    <button
                      onClick={() => handleRemove(charSkill.id)}
                      className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAdd(def.key, def.label, def.linkedAttribute)}
                    className="shrink-0 font-display text-[9px] uppercase tracking-[1px] px-2 py-1 border border-rim-bright text-parchment-dim hover:border-crimson hover:text-crimson transition-colors"
                  >
                    +
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
