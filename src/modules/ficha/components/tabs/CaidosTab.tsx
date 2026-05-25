import { useAppSelector } from '@/core/store/hooks'

export function CaidosTab() {
  const { fallen } = useAppSelector(s => s.ficha)

  if (fallen.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-16">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          // Sin bajas registradas
        </p>
        <p className="font-mono text-xs text-parchment-dim/50 text-center max-w-48">
          Los agentes caídos quedan aquí como memoria del Omnissiah.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
          // Registro de Bajas
        </h3>
      </div>

      <div className="flex flex-col divide-y divide-rim">
        {fallen.map(char => {
          const xpTotal = parseInt(char.info.experience) || 0
          return (
            <div key={char.id} className="px-4 py-4 bg-surface-2 hover:bg-surface-3 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-col gap-0.5">
                  <p className="font-rajdhani text-base font-semibold text-parchment leading-none">
                    {char.info.name || '— Sin nombre —'}
                  </p>
                  <p className="font-mono text-[10px] text-parchment-dim">
                    {char.info.career} // {char.info.homeworld}
                  </p>
                  <p className="font-mono text-[10px] text-parchment-dim">
                    {char.info.rank}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="font-display text-[8px] uppercase tracking-[1px] text-crimson border border-crimson px-2 py-0.5">
                    Caído
                  </span>
                  <span className="font-mono text-[9px] text-parchment-dim">{char.diedAt}</span>
                </div>
              </div>

              {/* XP summary */}
              <div className="grid grid-cols-3 gap-px bg-rim p-px">
                <div className="bg-surface flex flex-col items-center py-2 px-2">
                  <span className="font-display text-sm font-bold text-gold-bright">{xpTotal}</span>
                  <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim mt-0.5">XP Total</span>
                </div>
                <div className="bg-surface flex flex-col items-center py-2 px-2">
                  <span className="font-display text-sm font-bold text-parchment">{char.xpInherited}</span>
                  <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim mt-0.5">Heredado</span>
                </div>
                <div className="bg-surface flex flex-col items-center py-2 px-2">
                  <span className="font-display text-sm font-bold text-parchment-dim">
                    {char.wounds.max}
                  </span>
                  <span className="font-display text-[7px] uppercase tracking-[1px] text-parchment-dim mt-0.5">Heridas</span>
                </div>
              </div>

              {/* Attribute summary */}
              <div className="mt-2 grid grid-cols-9 gap-px bg-rim p-px">
                {Object.entries(char.attrs).map(([key, val]) => {
                  const total = val.base + val.advances + val.bonuses
                  return (
                    <div key={key} className="bg-surface flex flex-col items-center py-1.5 px-0.5">
                      <span className="font-display text-[7px] text-parchment-dim">{key}</span>
                      <span className="font-display text-xs font-bold text-parchment">{total}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
