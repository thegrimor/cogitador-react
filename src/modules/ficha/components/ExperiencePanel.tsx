import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { updateCharInfo } from '../services/fichaSlice'
import { computeXpSpent } from '../services/fichaComputed'

export function ExperiencePanel() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const total     = parseInt(char?.info.experience ?? '0') || 0
  const spent     = char ? computeXpSpent(char) : 0
  const available = total - spent

  function updateXP(value: string) {
    if (!char) return
    dispatch(updateCharInfo({ id: char.id, field: 'experience', value }))
  }

  return (
    <div className="flex items-center gap-3 border-b border-rim-bright bg-surface-3 px-4 py-1.5">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-gold shrink-0">XP</p>

      <div className="flex gap-3 flex-1 items-center">
        <input
          type="number"
          value={char?.info.experience ?? '0'}
          onChange={e => updateXP(e.target.value)}
          disabled={!char}
          className="w-16 bg-transparent font-display text-lg font-bold text-gold-bright text-center outline-none disabled:opacity-40 leading-none"
        />
        <span className="text-parchment-dim text-xs">/</span>
        <span className="w-16 font-display text-lg font-bold text-parchment text-center leading-none">
          {spent}
        </span>
        <span className="text-parchment-dim text-xs">=</span>
        <span className={[
          'font-display text-lg font-bold w-16 text-center leading-none',
          available < 0 ? 'text-crimson-bright' : 'text-neon',
        ].join(' ')}>
          {available}
        </span>
      </div>
    </div>
  )
}
