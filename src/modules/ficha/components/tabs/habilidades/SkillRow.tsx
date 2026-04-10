import { useAppDispatch } from '@/core/store/hooks'
import { removeSkill, setSkillLevel } from '../../../services/fichaSlice'
import type { Skill } from '../../../types/fichaTypes'

const LEVEL_BONUS = [-20, 0, 10, 20]
const LEVEL_LABELS = ['No entrenado', 'Entrenado', 'Avanzado', 'Maestro']

interface Props {
  charId: string
  skill: Skill
  attrTotal: number
}

export function SkillRow({ charId, skill, attrTotal }: Props) {
  const dispatch = useAppDispatch()
  const levelBonus = LEVEL_BONUS[skill.level] ?? -20
  const total = attrTotal + levelBonus + (skill.bonus || 0)

  function handleDot(dotIndex: number) {
    // dot 0 = level 1, dot 1 = level 2, dot 2 = level 3
    // click on filled dot at its own level → drop to that level - 1
    const newLevel = skill.level === dotIndex + 1 ? dotIndex : dotIndex + 1
    dispatch(setSkillLevel({ charId, skillId: skill.id, level: newLevel }))
  }

  return (
    <div className="bg-surface border border-rim hover:border-rim-bright transition-colors px-3 py-2 flex items-center gap-2">
      {/* Nombre + notas */}
      <div className="flex-1 min-w-0">
        <p className="font-rajdhani text-sm font-semibold text-parchment truncate">{skill.name}</p>
        {skill.notes && (
          <p className="font-mono text-[9px] text-parchment-dim truncate">{skill.notes}</p>
        )}
      </div>

      {/* Atributo base */}
      <span className="font-display text-[9px] text-parchment-dim w-7 text-center shrink-0">
        {skill.attr}
      </span>

      {/* Dots de nivel (3 máx) */}
      <div className="flex gap-1 shrink-0" title={LEVEL_LABELS[skill.level]}>
        {[0, 1, 2].map(i => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={[
              'w-2.5 h-2.5 border transition-all',
              i < skill.level
                ? 'bg-crimson border-crimson'
                : 'bg-transparent border-rim-bright hover:border-crimson-dim',
            ].join(' ')}
          />
        ))}
      </div>

      {/* Bonus adicional */}
      <span className="font-mono text-[9px] text-gold w-6 text-center shrink-0">
        {skill.bonus ? `+${skill.bonus}` : ''}
      </span>

      {/* Total % */}
      <span className="font-display text-sm font-bold text-gold-bright w-10 text-right shrink-0">
        {total}%
      </span>

      {/* Eliminar */}
      <button
        onClick={() => dispatch(removeSkill({ charId, skillId: skill.id }))}
        className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
      >
        ✕
      </button>
    </div>
  )
}
