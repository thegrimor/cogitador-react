import type { NoteImportance } from '../types/notasTypes'

export const IMPORTANCE_OPTIONS: { value: NoteImportance; label: string }[] = [
  { value: 'baja',    label: 'Baja'    },
  { value: 'media',   label: 'Media'   },
  { value: 'alta',    label: 'Alta'    },
  { value: 'critica', label: 'Crítica' },
]

export const IMPORTANCE_STYLE: Record<NoteImportance, string> = {
  baja:    'text-parchment-dim border-rim',
  media:   'text-gold border-gold/60',
  alta:    'text-crimson border-crimson',
  critica: 'text-crimson-bright border-crimson-bright animate-pulse-mech',
}
