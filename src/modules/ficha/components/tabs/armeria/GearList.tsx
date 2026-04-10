import { useAppDispatch } from '@/core/store/hooks'
import { removeGear, updateGearQty } from '../../../services/fichaSlice'
import type { GearItem } from '../../../types/fichaTypes'

interface Props {
  charId: string
  gear: GearItem[]
}

export function GearList({ charId, gear }: Props) {
  const dispatch = useAppDispatch()

  if (gear.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim">
          Sin equipo registrado
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-px bg-rim">
      {gear.map(item => (
        <div
          key={item.id}
          className="bg-surface px-3 py-2 flex items-center gap-2"
        >
          <div className="flex-1 min-w-0">
            <p className="font-rajdhani text-sm font-semibold text-parchment">{item.name}</p>
            {item.notes && (
              <p className="font-mono text-[9px] text-parchment-dim truncate">{item.notes}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => dispatch(updateGearQty({ charId, itemId: item.id, qty: item.qty - 1 }))}
              className="w-5 h-5 border border-rim-bright text-parchment-dim hover:border-crimson-dim font-display text-xs flex items-center justify-center transition-colors"
            >
              −
            </button>
            <span className="font-display text-xs text-gold w-6 text-center">×{item.qty}</span>
            <button
              onClick={() => dispatch(updateGearQty({ charId, itemId: item.id, qty: item.qty + 1 }))}
              className="w-5 h-5 border border-rim-bright text-parchment-dim hover:border-crimson-dim font-display text-xs flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={() => dispatch(removeGear({ charId, itemId: item.id }))}
            className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
