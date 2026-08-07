import { useMemo, useState } from 'react'
import type { Note, NoteImportance } from '../../../types/fichaTypes'
import { NoteCard } from './NoteCard'
import { EmptyState } from '../../EmptyState'
import { IMPORTANCE_OPTIONS } from './noteImportance'

interface Props {
  notes: Note[]
  onCreate: () => void
  onEdit: (note: Note) => void
  onDelete: (noteId: string) => void
  onMove: (noteId: string) => void
  moveLabel: string
  emptyLabel: string
}

/** Listado de notas agrupadas por sección, con búsqueda y filtro por importancia. */
export function NotesList({ notes, onCreate, onEdit, onDelete, onMove, moveLabel, emptyLabel }: Props) {
  const [search, setSearch] = useState('')
  const [importanceFilter, setImportanceFilter] = useState<NoteImportance | ''>('')

  const sections = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = notes.filter(n => {
      if (importanceFilter && n.importance !== importanceFilter) return false
      if (!q) return true
      return n.title.toLowerCase().includes(q)
        || n.content.toLowerCase().includes(q)
        || n.section.toLowerCase().includes(q)
    })
    const bySection = new Map<string, Note[]>()
    for (const note of filtered) {
      const key = note.section.trim() || 'Sin sección'
      if (!bySection.has(key)) bySection.set(key, [])
      bySection.get(key)!.push(note)
    }
    return [...bySection.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [notes, search, importanceFilter])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en título, sección o contenido..."
          className="flex-1 min-w-[160px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
        />
        <select
          value={importanceFilter}
          onChange={e => setImportanceFilter(e.target.value as NoteImportance | '')}
          className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2 py-2 outline-none focus:border-crimson transition-colors"
        >
          <option value="">Toda importancia</option>
          {IMPORTANCE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={onCreate}
          className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
        >
          + Nota
        </button>
      </div>

      {sections.length === 0 ? (
        <EmptyState icon="📜" label={emptyLabel} />
      ) : (
        sections.map(([section, sectionNotes]) => (
          <div key={section} className="flex flex-col gap-2">
            <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// {section}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sectionNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => onEdit(note)}
                  onDelete={() => onDelete(note.id)}
                  onMove={() => onMove(note.id)}
                  moveLabel={moveLabel}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
