import type { Character } from '@/modules/ficha'
import { ReadOnlyFicha } from './ReadOnlyFicha'
import type { CampaignMemberNote, CampaignMemberProject, CampaignMemberSequitoEntry } from '../types/campanaTypes'

interface Props {
  characters: Character[]
  sequitoEntries: CampaignMemberSequitoEntry[]
  projects: CampaignMemberProject[]
  notes: CampaignMemberNote[]
}

/**
 * Bloque de solo lectura reutilizado tanto para ver a otro jugador
 * (MemberSummaryCard) como en su día para "Mi perfil". Los personajes sin
 * nombre (los 2 slots vacíos que se crean solos en ficha) no cuentan como
 * "tener personaje" — así admin/master, que no juegan, no salen con nada
 * en esta sección.
 */
export function ProfileSections({ characters, sequitoEntries, projects, notes }: Props) {
  const hasRealCharacter = characters.some(c => c.info.name?.trim())

  return (
    <div className="flex flex-col gap-3">
      <section>
        <p className="font-mono text-[9px] text-parchment-dim tracking-[2px] mb-1.5">// FICHA</p>
        {!hasRealCharacter ? (
          <p className="font-mono text-[10px] text-rim-bright">Sin personajes</p>
        ) : (
          <ReadOnlyFicha characters={characters} />
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
