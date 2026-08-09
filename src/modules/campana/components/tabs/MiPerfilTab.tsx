import { useAppSelector } from '@/core/store/hooks'
import { ProfileSections } from '../ProfileSections'

/** Lo que ven de mí los demás miembros de la partida: mi ficha (si tengo personajes reales), séquito, proyectos y notas. */
export function MiPerfilTab() {
  const { characters } = useAppSelector(s => s.ficha)
  const { sequito } = useAppSelector(s => s.sequito)
  const { projects } = useAppSelector(s => s.proyectos)
  const { notes } = useAppSelector(s => s.notas)

  return (
    <div className="flex flex-col gap-3">
      <ProfileSections
        characters={characters.map(c => ({
          id: c.id,
          info: { name: c.info.name, rank: c.info.rank, career: c.info.career, homeworld: c.info.homeworld },
          wounds: c.wounds,
          fate: c.fate,
        }))}
        sequitoEntries={Object.values(sequito).map(s => ({ id: s.id, name: s.name, role: s.role, alive: s.alive }))}
        projects={projects.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          status: p.status,
          daysTotal: p.daysTotal,
          daysElapsed: p.daysElapsed,
        }))}
        notes={notes.map(n => ({
          id: n.id,
          title: n.title,
          section: n.section,
          importance: n.importance,
          content: n.content,
          characterId: n.characterId,
        }))}
      />
      <p className="font-mono text-[9px] text-parchment-dim mt-2">
        Esto es lo que ven de ti los demás miembros de la partida.
      </p>
    </div>
  )
}
