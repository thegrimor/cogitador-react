export type NoteImportance = 'baja' | 'media' | 'alta' | 'critica'

/**
 * Nota temática libre (título + sección + importancia + contenido).
 * `characterId` ausente = nota de grupo, compartida entre Inquisidor y
 * Séquito; presente = nota personal de ese personaje (ver `modules/ficha`).
 */
export interface Note {
  id: string
  title: string
  section: string
  importance: NoteImportance
  content: string
  characterId?: string
  createdAt: string
  updatedAt: string
}

export interface NotasState {
  notes: Note[]
}
