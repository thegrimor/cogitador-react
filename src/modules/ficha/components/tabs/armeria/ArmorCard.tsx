import { useAppDispatch } from '@/core/store/hooks'
import { removeArmor } from '../../../services/fichaSlice'
import type { Armor } from '../../../types/fichaTypes'

interface Props {
  charId: string
  armor: Armor
}

export function ArmorCard({ charId, armor }: Props) {
  const dispatch = useAppDispatch()

  const locations = [
    { label: 'Cabeza', value: armor.head },
    { label: 'Cuerpo',  value: armor.body  },
    { label: 'Brazos', value: armor.arms  },
    { label: 'Piernas', value: armor.legs  },
  ]

  return (
    <div className="bg-surface border border-rim px-3 py-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="font-rajdhani text-base font-bold text-parchment">{armor.name}</span>
          {armor.notes && (
            <p className="font-mono text-[10px] text-parchment-dim mt-0.5">{armor.notes}</p>
          )}
        </div>
        <button
          onClick={() => dispatch(removeArmor({ charId, armorId: armor.id }))}
          className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1">
        {locations.map(loc => (
          <div key={loc.label} className="bg-surface-2 border border-rim-bright text-center py-1.5">
            <p className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim">{loc.label}</p>
            <p className="font-display text-lg font-bold text-neon leading-none mt-0.5">{loc.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
