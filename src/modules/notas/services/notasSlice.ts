import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { NotasState, Note } from '../types/notasTypes'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const initialState: NotasState = {
  notes: [],
}

export const notasSlice = createSlice({
  name: 'notas',
  initialState,
  reducers: {
    addNote(state, action: PayloadAction<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) {
      const now = new Date().toISOString()
      state.notes.push({ id: uid(), createdAt: now, updatedAt: now, ...action.payload })
    },

    updateNote(state, action: PayloadAction<Note>) {
      const idx = state.notes.findIndex(n => n.id === action.payload.id)
      if (idx !== -1) state.notes[idx] = { ...action.payload, updatedAt: new Date().toISOString() }
    },

    removeNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter(n => n.id !== action.payload)
    },

    // Mover entre grupo y un personaje (o entre personajes) es solo reasignar
    // characterId — undefined = grupo. Acción propia para el botón rápido de
    // "mover" en la card, sin pasar por el modal completo de edición.
    moveNote(state, action: PayloadAction<{ id: string; characterId: string | undefined }>) {
      const note = state.notes.find(n => n.id === action.payload.id)
      if (!note) return
      note.characterId = action.payload.characterId
      note.updatedAt = new Date().toISOString()
    },

    // Reemplaza el estado completo — usado por el sync con el backend al hidratar
    // tras login (ver core/sync).
    hydrateNotas(_state, action: PayloadAction<NotasState>) {
      return action.payload
    },

    // Vacía el slice — usado en el borrado total al hacer logout (ver core/store).
    resetNotas() {
      return initialState
    },
  },
})

export const { addNote, updateNote, removeNote, moveNote, hydrateNotas, resetNotas } = notasSlice.actions

export default notasSlice.reducer
