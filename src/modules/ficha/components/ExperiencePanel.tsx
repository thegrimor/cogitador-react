import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { updateCharInfo } from '../services/fichaSlice'
import { computeXpSpent } from '../services/fichaComputed'
import { getRankForXP } from '@/core/data/darkheresy'

export function ExperiencePanel() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const total     = parseInt(char?.info.experience ?? '0') || 0
  const spent     = char ? computeXpSpent(char) : 0
  const remaining = total - spent
  const rankData  = char ? getRankForXP(char.info.career, spent, char.info.branch) : null

  const remainingClass =
    remaining >= 0 ? 'text-neon' : remaining > -100 ? 'text-gold' : 'text-crimson-bright'

  function updateXP(value: string) {
    if (!char) return
    dispatch(updateCharInfo({ id: char.id, field: 'experience', value }))
  }

  return (
    <div className="flex items-center gap-4 border border-rim-bright bg-surface-2 px-4 py-2 mb-4 flex-wrap">
      <span className="font-display text-[10px] text-gold tracking-[3px] shrink-0">⚡ PUNTOS DE EXPERIENCIA</span>

      <div className="flex flex-col gap-[3px]">
        <label className="font-mono text-[9px] text-parchment-dim tracking-[2px]">PE TOTAL</label>
        <input
          type="number"
          min={0}
          value={char?.info.experience ?? '0'}
          onChange={e => updateXP(e.target.value)}
          disabled={!char}
          className="bg-surface border border-rim-bright text-gold-bright font-display text-base px-2 py-[5px] w-[100px] text-center outline-none focus:border-gold transition-colors disabled:opacity-40"
        />
      </div>

      <div className="flex flex-col gap-[3px]">
        <label className="font-mono text-[9px] text-parchment-dim tracking-[2px]">PE GASTADO</label>
        <div className="font-display text-base text-crimson-bright">{spent}</div>
      </div>

      <div className="flex flex-col gap-[3px]">
        <label className="font-mono text-[9px] text-parchment-dim tracking-[2px]">PE RESTANTE</label>
        <div className={['font-display text-base', remainingClass].join(' ')}>{remaining}</div>
      </div>

      <div className="ml-auto text-right font-mono text-[10px] text-parchment-dim">
        {rankData ? `RANGO: ${rankData.rank} (${rankData.pe} PE)` : ''}
      </div>
    </div>
  )
}
