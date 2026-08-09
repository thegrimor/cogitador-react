import type { Note } from '../types/notasTypes'
import { IMPORTANCE_OPTIONS, IMPORTANCE_STYLE } from './noteImportance'

interface Props {
  note: Note
  onEdit: () => void
  onDelete: () => void
  /** Botón rápido de mover a Grupo — solo se pasa cuando la nota tiene characterId (vista de un personaje). */
  onQuickMoveToGroup?: () => void
}

/** Card de nota individual: título (clic = editar), badge de importancia, preview de contenido, acciones. */
export function NoteCard({ note, onEdit, onDelete, onQuickMoveToGroup }: Props) {
  const importanceLabel = IMPORTANCE_OPTIONS.find(o => o.value === note.importance)?.label ?? note.importance

  return (
    <div className="bg-surface-2 border border-rim px-3 py-2.5 flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={onEdit}
          className="font-rajdhani font-semibold text-sm text-parchment text-left hover:text-white transition-colors truncate"
        >
          {note.title || 'Sin título'}
        </button>
        <span className={['font-display text-[8px] uppercase tracking-[1px] border px-1.5 py-0.5 shrink-0', IMPORTANCE_STYLE[note.importance]].join(' ')}>
          {importanceLabel}
        </span>
      </div>
      {note.content && (
        <p className="font-mono text-[11px] text-parchment-dim line-clamp-2 whitespace-pre-wrap">{note.content}</p>
      )}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-rim">
        {onQuickMoveToGroup ? (
          <button
            onClick={onQuickMoveToGroup}
            className="font-display text-[8px] uppercase tracking-[1px] text-parchment-dim hover:text-gold transition-colors"
          >
            → Mover a Grupo
          </button>
        ) : <span />}
        <button
          onClick={onDelete}
          className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors"
          aria-label="Eliminar nota"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
