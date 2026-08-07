import { useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { Toast } from '@/shared/components/Toast'
import { addNote, updateNote, removeNote, moveNote } from '../services/notasSlice'
import { NotesList } from './NotesList'
import { NoteFormModal } from './NoteFormModal'
import type { Note, NoteImportance } from '../types/notasTypes'

const GROUP_SCOPE = ''

function characterLabel(info: { name: string; role: string }): string {
  return info.name || (info.role === 'inquisidor' ? '⚔ Inquisidor' : '☠ Séquito')
}

/**
 * Vista de notas temáticas — módulo independiente (bounded context propio,
 * ver notasSlice) con selector de ámbito: Grupo (compartida entre
 * Inquisidor y Séquito) o un personaje concreto de `ficha`.
 */
export function NotasView() {
  const dispatch = useAppDispatch()
  const { notes } = useAppSelector(s => s.notas)
  const { characters } = useAppSelector(s => s.ficha)

  const [scope, setScope] = useState<string>(GROUP_SCOPE)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [creating, setCreating] = useState(false)

  const characterOptions = useMemo(
    () => characters.map(c => ({ id: c.id, label: characterLabel(c.info) })),
    [characters],
  )

  const scopedNotes = useMemo(
    () => notes.filter(n => (scope === GROUP_SCOPE ? !n.characterId : n.characterId === scope)),
    [notes, scope],
  )

  const sectionSuggestions = useMemo(
    () => [...new Set(notes.map(n => n.section).filter(Boolean))].sort(),
    [notes],
  )

  function handleSave(data: { title: string; section: string; importance: NoteImportance; content: string; characterId?: string }) {
    if (editingNote) dispatch(updateNote({ ...editingNote, ...data }))
    else dispatch(addNote(data))
    setEditingNote(null)
    setCreating(false)
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="bg-surface-2 border-b border-crimson-dim px-4 py-3 flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-display text-sm font-black uppercase tracking-[3px] text-crimson-bright">
            Notas
          </h1>
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-gold mt-0.5">
            // Bitácora Temática
          </p>
        </div>
        <div className="text-right">
          <span className="block font-display text-xl font-bold text-gold-bright">{notes.length}</span>
          <span className="block font-mono text-[9px] text-parchment-dim uppercase tracking-[1px] mt-0.5">
            NOTA{notes.length !== 1 ? 'S' : ''} TOTAL{notes.length !== 1 ? 'ES' : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4 pb-20 overflow-y-auto">
        <div className="flex flex-wrap border border-rim-bright w-fit">
          <button
            onClick={() => setScope(GROUP_SCOPE)}
            className={[
              'font-display text-[9px] uppercase tracking-[2px] px-3 py-2 transition-colors',
              scope === GROUP_SCOPE ? 'bg-crimson text-white' : 'bg-surface-2 text-parchment-dim hover:text-parchment',
            ].join(' ')}
          >
            ◇ Grupo
          </button>
          {characterOptions.map(c => (
            <button
              key={c.id}
              onClick={() => setScope(c.id)}
              className={[
                'font-display text-[9px] uppercase tracking-[2px] px-3 py-2 transition-colors',
                scope === c.id ? 'bg-crimson text-white' : 'bg-surface-2 text-parchment-dim hover:text-parchment',
              ].join(' ')}
            >
              {c.label}
            </button>
          ))}
        </div>

        <NotesList
          notes={scopedNotes}
          onCreate={() => setCreating(true)}
          onEdit={note => setEditingNote(note)}
          onDelete={id => dispatch(removeNote(id))}
          onQuickMoveToGroup={scope === GROUP_SCOPE ? undefined : id => dispatch(moveNote({ id, characterId: undefined }))}
          emptyLabel={scope === GROUP_SCOPE ? 'Sin notas de grupo' : 'Sin notas de este personaje'}
        />
      </div>

      {(creating || editingNote) && (
        <NoteFormModal
          note={editingNote ?? undefined}
          defaultCharacterId={scope === GROUP_SCOPE ? undefined : scope}
          characters={characterOptions}
          sectionSuggestions={sectionSuggestions}
          onSave={handleSave}
          onCancel={() => { setCreating(false); setEditingNote(null) }}
        />
      )}

      <Toast />
    </div>
  )
}
