import { useState } from 'react'
import { Modal } from '@/shared/components/Modal'
import type { Note, NoteImportance } from '../types/notasTypes'
import { IMPORTANCE_OPTIONS } from './noteImportance'

const GROUP_VALUE = ''

interface CharacterOption {
  id: string
  label: string
}

interface Props {
  note?: Note
  /** Personaje preseleccionado según el ámbito activo en NotasView; '' = Grupo. */
  defaultCharacterId?: string
  characters: CharacterOption[]
  sectionSuggestions: string[]
  onSave: (data: { title: string; section: string; importance: NoteImportance; content: string; characterId?: string }) => void
  onCancel: () => void
}

/** Formulario de creación/edición de nota — mismo modal para ambos casos según venga o no `note`. */
export function NoteFormModal({ note, defaultCharacterId, characters, sectionSuggestions, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [section, setSection] = useState(note?.section ?? '')
  const [importance, setImportance] = useState<NoteImportance>(note?.importance ?? 'media')
  const [content, setContent] = useState(note?.content ?? '')
  const [characterId, setCharacterId] = useState(note?.characterId ?? defaultCharacterId ?? GROUP_VALUE)

  function handleSave() {
    if (!title.trim()) return
    onSave({
      title: title.trim(), section: section.trim(), importance, content,
      characterId: characterId === GROUP_VALUE ? undefined : characterId,
    })
  }

  return (
    <Modal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-5"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        onClick={onCancel}
      >
        <div
          className="w-full max-w-[420px] p-5 font-mono bg-surface-2 border border-rim-bright flex flex-col gap-3"
          onClick={e => e.stopPropagation()}
        >
          <h3 className="font-display text-[11px] uppercase tracking-[2px] text-crimson">
            {note ? '// Editar Nota' : '// Nueva Nota'}
          </h3>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título de la nota"
            className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
          />

          <div className="flex gap-2 flex-wrap">
            <input
              value={section}
              onChange={e => setSection(e.target.value)}
              placeholder="Sección (ej. Ciudad Inevitable)"
              list="note-section-suggestions"
              className="flex-1 min-w-[140px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
            <select
              value={importance}
              onChange={e => setImportance(e.target.value as NoteImportance)}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-2 py-2 outline-none focus:border-crimson transition-colors"
            >
              {IMPORTANCE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <datalist id="note-section-suggestions">
            {sectionSuggestions.map(s => <option key={s} value={s} />)}
          </datalist>

          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[9px] uppercase tracking-[1px] text-parchment-dim">Asignar a</span>
            <select
              value={characterId}
              onChange={e => setCharacterId(e.target.value)}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-2 py-2 outline-none focus:border-crimson transition-colors"
            >
              <option value={GROUP_VALUE}>◇ Grupo (compartida)</option>
              {characters.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Contenido de la nota..."
            rows={6}
            className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors resize-y"
          />

          <div className="flex gap-2.5 justify-end pt-1">
            <button
              onClick={onCancel}
              className="font-display text-[9px] tracking-[2px] px-4 py-2.5 bg-surface-4 text-parchment-dim border border-rim"
            >
              CANCELAR
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="font-display text-[9px] tracking-[2px] px-4 py-2.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              GUARDAR
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
