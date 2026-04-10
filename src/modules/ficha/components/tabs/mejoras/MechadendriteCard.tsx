import { useAppDispatch } from '@/core/store/hooks'
import { removeMechadendrite } from '../../../services/fichaSlice'
import type { Mechadendrite } from '../../../types/fichaTypes'

interface Props {
  charId: string
  mecha: Mechadendrite
}

export function MechadendriteCard({ charId, mecha }: Props) {
  const dispatch = useAppDispatch()

  return (
    <div className="bg-surface border border-rim border-l-2 border-l-gold hover:border-l-gold-bright transition-colors px-3 py-3">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <p className="font-rajdhani text-base font-bold text-gold-bright">{mecha.name}</p>
          <p className="font-display text-[8px] uppercase tracking-[2px] text-parchment-dim">{mecha.mechaType}</p>
        </div>
        <button
          onClick={() => dispatch(removeMechadendrite({ charId, mechaId: mecha.id }))}
          className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
        >
          ✕
        </button>
      </div>
      {mecha.desc && (
        <p className="font-rajdhani text-sm text-parchment leading-snug mb-2">{mecha.desc}</p>
      )}
      {mecha.abilities.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {mecha.abilities.map((ab, i) => (
            <p key={i} className="font-mono text-[10px] text-neon">► {ab}</p>
          ))}
        </div>
      )}
    </div>
  )
}
