import { useAppDispatch } from '@/core/store/hooks'
import { removeAugmentation } from '../../../services/fichaSlice'
import type { Augmentation } from '../../../types/fichaTypes'

interface Props {
  charId: string
  aug: Augmentation
}

export function AugmentationCard({ charId, aug }: Props) {
  const dispatch = useAppDispatch()

  return (
    <div className="bg-surface border border-rim border-l-2 border-l-blue hover:border-l-blue/80 transition-colors px-3 py-3">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <p className="font-rajdhani text-base font-bold text-blue">{aug.name}</p>
          <p className="font-display text-[8px] uppercase tracking-[2px] text-parchment-dim">{aug.loc}</p>
        </div>
        <button
          onClick={() => dispatch(removeAugmentation({ charId, augId: aug.id }))}
          className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
        >
          ✕
        </button>
      </div>
      {aug.desc && (
        <p className="font-rajdhani text-sm text-parchment leading-snug mb-1">{aug.desc}</p>
      )}
      {aug.bonus && (
        <p className="font-mono text-[10px] text-neon">► {aug.bonus}</p>
      )}
    </div>
  )
}
