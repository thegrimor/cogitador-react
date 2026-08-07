import type { CampaignMember } from '../types/campanaTypes'

interface Props {
  member: CampaignMember
  onRemove?: () => void
}

/** Tarjeta de solo lectura: ficha + séquito + proyectos de un jugador de la partida. */
export function MemberSummaryCard({ member, onRemove }: Props) {
  const characters = member.ficha?.characters ?? []
  const sequitoEntries = member.sequito ? Object.values(member.sequito.sequito) : []
  const projects = member.proyectos?.projects ?? []

  return (
    <div className="border border-rim-bright bg-surface-2">
      <div className="flex items-center justify-between border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[11px] uppercase tracking-[2px] text-crimson-bright">{member.username}</h3>
        {onRemove && (
          <button
            onClick={onRemove}
            className="font-display text-[8px] uppercase tracking-[1px] border border-crimson-dim text-crimson-dim px-2 py-1 hover:bg-surface-3 transition-colors"
          >
            Quitar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 py-3">
        <section>
          <p className="font-mono text-[9px] text-parchment-dim tracking-[2px] mb-1.5">// FICHA</p>
          {characters.length === 0 ? (
            <p className="font-mono text-[10px] text-rim-bright">Sin personajes</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {characters.map(c => (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border border-rim px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-display text-xs text-white truncate">
                      {c.info.name || 'Sin designación'}
                    </span>
                    <span className="font-mono text-[9px] text-parchment-dim">
                      {c.info.career || '—'} // Rango {c.info.rank || '—'}
                    </span>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <span className="font-mono text-[10px] text-crimson-bright">
                      ♥ {c.wounds.current}/{c.wounds.max}
                    </span>
                    <span className="font-mono text-[10px] text-gold-bright">
                      ⚙ {c.fate.current}/{c.fate.max}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <p className="font-mono text-[9px] text-parchment-dim tracking-[2px] mb-1.5">// SÉQUITO</p>
          {sequitoEntries.length === 0 ? (
            <p className="font-mono text-[10px] text-rim-bright">Sin séquito</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {sequitoEntries.map(s => (
                <span
                  key={s.id}
                  className={[
                    'font-mono text-[10px] border px-2 py-1',
                    s.alive ? 'border-rim-bright text-parchment' : 'border-crimson-dim text-crimson-dim line-through',
                  ].join(' ')}
                >
                  {s.name || 'Sin nombre'} // {s.role || '—'}
                </span>
              ))}
            </div>
          )}
        </section>

        <section>
          <p className="font-mono text-[9px] text-parchment-dim tracking-[2px] mb-1.5">// PROYECTOS</p>
          {projects.length === 0 ? (
            <p className="font-mono text-[10px] text-rim-bright">Sin proyectos</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {projects.map(p => {
                const pct = p.daysTotal > 0 ? Math.min(100, Math.round((p.daysElapsed / p.daysTotal) * 100)) : 0
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 border border-rim px-3 py-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-display text-xs text-white truncate">{p.name}</span>
                      <span className="font-mono text-[9px] text-parchment-dim">{p.category}</span>
                    </div>
                    <span className="font-display text-xs text-crimson-bright shrink-0">{pct}%</span>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
