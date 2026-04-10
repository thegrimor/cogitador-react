import { useAppDispatch } from '@/core/store/hooks'
import { removeWeapon } from '../../../services/fichaSlice'
import type { Weapon } from '../../../types/fichaTypes'

interface Props {
  charId: string
  weapon: Weapon
}

export function WeaponCard({ charId, weapon }: Props) {
  const dispatch = useAppDispatch()

  return (
    <div className="bg-surface border border-rim border-l-2 border-l-crimson-dim hover:border-l-crimson transition-colors px-3 py-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-rajdhani text-base font-bold text-parchment">{weapon.name}</span>
          <span className="font-display text-[7px] uppercase tracking-[1px] px-1.5 py-0.5 border border-crimson text-crimson">
            {weapon.cls}
          </span>
          <span className="font-display text-[7px] uppercase tracking-[1px] px-1.5 py-0.5 border border-rim-bright text-parchment-dim">
            {weapon.dmgType}
          </span>
        </div>
        <button
          onClick={() => dispatch(removeWeapon({ charId, weaponId: weapon.id }))}
          className="text-parchment-dim hover:text-crimson-bright transition-colors font-display text-[10px] shrink-0 px-1"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {weapon.range && weapon.range !== '-' && (
          <div className="flex flex-col">
            <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim">Alcance</span>
            <span className="font-display text-xs text-gold-bright">{weapon.range}</span>
          </div>
        )}
        {weapon.rof && weapon.rof !== '-' && (
          <div className="flex flex-col">
            <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim">ROF</span>
            <span className="font-display text-xs text-gold-bright">{weapon.rof}</span>
          </div>
        )}
        {weapon.dmg && (
          <div className="flex flex-col">
            <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim">Daño</span>
            <span className="font-display text-xs text-gold-bright">{weapon.dmg}</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim">Pen</span>
          <span className="font-display text-xs text-gold-bright">{weapon.pen}</span>
        </div>
        {weapon.clip && weapon.clip !== '-' && (
          <div className="flex flex-col">
            <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim">Cargador</span>
            <span className="font-display text-xs text-gold-bright">{weapon.clip}</span>
          </div>
        )}
      </div>

      {weapon.notes && (
        <p className="font-rajdhani text-sm text-parchment-dim mt-1">{weapon.notes}</p>
      )}
    </div>
  )
}
