import { useAppDispatch } from '@/core/store/hooks'
import { removeTalent } from '../../../services/fichaSlice'
import type { Talent } from '../../../types/fichaTypes'

const TYPE_COLORS: Record<string, string> = {
  COMBATE:     'text-crimson border-crimson',
  MECÁNICO:    'text-gold border-gold',
  PSÍQUICO:    'text-blue border-blue',
  GENERAL:     'text-parchment-dim border-rim-bright',
  BENEDICTION: 'text-neon border-neon',
  TECH:        'text-gold border-gold',
  OTRO:        'text-parchment-dim border-rim-bright',
}

interface Props {
  charId: string
  talent: Talent
}

export function TalentCard({ charId, talent }: Props) {
  const dispatch = useAppDispatch()
  const typeColor = TYPE_COLORS[talent.type] ?? TYPE_COLORS['OTRO']

  return (
    <div className="bg-surface border border-rim border-l-2 border-l-crimson-dim hover:border-l-crimson transition-colors px-3 py-3 flex gap-3 items-start">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-rajdhani text-base font-bold text-parchment leading-none">
            {talent.name}
          </span>
          <span className={`font-display text-[7px] uppercase tracking-[1px] px-1.5 py-0.5 border ${typeColor}`}>
            {talent.type}
          </span>
        </div>
        {talent.desc && (
          <p className="font-rajdhani text-sm text-parchment-dim leading-snug mb-1">
            {talent.desc}
          </p>
        )}
        {talent.effect && (
          <p className="font-mono text-[10px] text-neon">
            ► {talent.effect}
          </p>
        )}
      </div>
      <button
        onClick={() => dispatch(removeTalent({ charId, talentId: talent.id }))}
        className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
      >
        ✕
      </button>
    </div>
  )
}
