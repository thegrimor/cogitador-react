import { useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import {
  addNote, updateNote, removeNote,
  addGroupNote, updateGroupNote, removeGroupNote,
  moveNoteToGroup, moveNoteToCharacter,
} from '../../services/fichaSlice'
import { NotesList } from './notas/NotesList'
import { NoteFormModal } from './notas/NoteFormModal'
import type { Note, NoteImportance } from '../../types/fichaTypes'

type Scope = 'personal' | 'grupo'

// Referencia estable para el fallback de arrays ausentes en estado persistido
// antiguo — un `[]` inline en cada render rompería la memoización de abajo.
const EMPTY_NOTES: Note[] = []

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

/**
 * Notas temáticas por sección (nombre + importancia + sección libre).
 * Dos ámbitos: personales (Character.notes) y de grupo (FichaState.groupNotes,
 * compartidas entre Inquisidor y Séquito) — cada nota puede moverse entre ambos.
 */
export function NotasTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId, groupNotes: rawGroupNotes } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [scope, setScope] = useState<Scope>('personal')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [creating, setCreating] = useState(false)

  // notes/groupNotes pueden faltar en estado persistido antes de esta migración
  const personalNotes = char?.notes ?? EMPTY_NOTES
  const groupNotes = rawGroupNotes ?? EMPTY_NOTES
  const activeNotes = scope === 'personal' ? personalNotes : groupNotes

  const sectionSuggestions = useMemo(() => {
    const all = [...personalNotes, ...groupNotes].map(n => n.section).filter(Boolean)
    return [...new Set(all)].sort()
  }, [personalNotes, groupNotes])

  if (!char) return <NoChar />

  function handleSave(data: { title: string; section: string; importance: NoteImportance; content: string }) {
    if (editingNote) {
      const updated: Note = { ...editingNote, ...data }
      if (scope === 'personal') dispatch(updateNote({ charId: char!.id, note: updated }))
      else dispatch(updateGroupNote({ note: updated }))
    } else {
      if (scope === 'personal') dispatch(addNote({ charId: char!.id, note: data }))
      else dispatch(addGroupNote({ note: data }))
    }
    setEditingNote(null)
    setCreating(false)
  }

  function handleDelete(noteId: string) {
    if (scope === 'personal') dispatch(removeNote({ charId: char!.id, noteId }))
    else dispatch(removeGroupNote({ noteId }))
  }

  function handleMove(noteId: string) {
    if (scope === 'personal') dispatch(moveNoteToGroup({ charId: char!.id, noteId }))
    else dispatch(moveNoteToCharacter({ charId: char!.id, noteId }))
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex border border-rim-bright w-fit">
        {(['personal', 'grupo'] as const).map(s => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={[
              'font-display text-[9px] uppercase tracking-[2px] px-3 py-2 transition-colors',
              scope === s ? 'bg-crimson text-white' : 'bg-surface-2 text-parchment-dim hover:text-parchment',
            ].join(' ')}
          >
            {s === 'personal' ? 'Mis Notas' : 'Notas de Grupo'}
          </button>
        ))}
      </div>

      <NotesList
        notes={activeNotes}
        onCreate={() => setCreating(true)}
        onEdit={note => setEditingNote(note)}
        onDelete={handleDelete}
        onMove={handleMove}
        moveLabel={scope === 'personal' ? '→ Mover a Grupo' : '→ Mover a mi ficha'}
        emptyLabel={scope === 'personal' ? 'Sin notas personales' : 'Sin notas de grupo'}
      />

      {(creating || editingNote) && (
        <NoteFormModal
          note={editingNote ?? undefined}
          sectionSuggestions={sectionSuggestions}
          onSave={handleSave}
          onCancel={() => { setCreating(false); setEditingNote(null) }}
        />
      )}
    </div>
  )
}
