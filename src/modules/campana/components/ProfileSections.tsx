import type {
  CampaignMemberCharacter,
  CampaignMemberNote,
  CampaignMemberProject,
  CampaignMemberSequitoEntry,
} from '../types/campanaTypes'

interface Props {
  characters: CampaignMemberCharacter[]
  sequitoEntries: CampaignMemberSequitoEntry[]
  projects: CampaignMemberProject[]
  notes: CampaignMemberNote[]
}

/**
 * Bloque de solo lectura reutilizado tanto para ver a otro jugador
 * (MemberSummaryCard) como para "Mi perfil" (lo que ven de mí los demás).
 * Los personajes sin nombre (los 2 slots vacíos que se crean solos en
 * ficha) no cuentan como "tener personaje" — así admin/master, que no
 * juegan, no salen con tarjetas fantasma.
 */
export function ProfileSections({ characters, sequitoEntries, projects, notes }: Props) {
  const realCharacters = characters.filter(c => c.info.name?.trim())

  return (
    <div className="flex flex-col gap-3">
      <section>
        <p className="font-mono text-[9px] text-parchment-dim tracking-[2px] mb-1.5">// FICHA</p>
        {realCharacters.length === 0 ? (
          <p className="font-mono text-[10px] text-rim-bright">Sin personajes</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {realCharacters.map(c => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border border-rim px-3 py-2"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-display text-xs text-white truncate">{c.info.name}</span>
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

      <section>
        <p className="font-mono text-[9px] text-parchment-dim tracking-[2px] mb-1.5">// NOTAS</p>
        {notes.length === 0 ? (
          <p className="font-mono text-[10px] text-rim-bright">Sin notas</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {notes.map(n => (
              <div key={n.id} className="border border-rim px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xs text-white truncate">{n.title || 'Sin título'}</span>
                  <span className="font-mono text-[9px] text-parchment-dim uppercase shrink-0">{n.importance}</span>
                </div>
                <span className="font-mono text-[9px] text-parchment-dim">{n.section || 'Grupo'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
