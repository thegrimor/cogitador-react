import { useAppSelector } from '@/core/store/hooks'
import { getAttrTotal } from '../../services/fichaComputed'
import { ATTRIBUTES, getAttrCostsForCareer } from '@/core/data/darkheresy'
import { EmptyState } from '../EmptyState'

export function CaidosTab() {
  const { fallen } = useAppSelector(s => s.ficha)

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Honor a los Caídos
        </h3>
      </div>

      {fallen.length === 0 ? (
        <div className="p-4">
          <EmptyState icon="⚰" label="Ningún caído" />
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-4">
          {[...fallen].reverse().map(char => (
            <div key={char.id} className="bg-surface border border-[#3a1a1a] border-l-[3px] border-l-[#7a1a1a] px-3.5 py-3 opacity-80">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-rajdhani text-base font-bold text-[#c87070] leading-tight">
                    ⚰ {char.info.name || 'Desconocido'}
                  </p>
                  <p className="font-mono text-[9px] tracking-[1px] text-parchment-dim">
                    {char.info.career || '—'} // {char.info.rank || '—'} — Caído: {char.diedAt || '?'}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-gold shrink-0">{char.xpInherited || 0} PE</span>
              </div>
              <div className="mt-2 flex gap-1.5 flex-wrap">
                {Object.entries(char.attrs).map(([key, val]) => {
                  const def = ATTRIBUTES.find(d => d.key === key)
                  const costs = getAttrCostsForCareer(char.info.career)[key]
                  const total = getAttrTotal(val, costs)
                  return (
                    <div key={key} className="text-center font-mono text-[9px] text-parchment-dim">
                      {def?.abbr ?? key}
                      <br />
                      <span className="text-parchment text-xs">{total}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
