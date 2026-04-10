import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FichaState, Character, AttributeValues, XpLogEntry } from '../types/fichaTypes'
import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'

function buildDefaultAttrs() {
  return Object.fromEntries(
    ATTRIBUTES.map(a => [a.key, { base: 0, advances: 0, bonuses: 0, bonusNote: '' }])
  )
}

function buildDefaultCharacter(id: string, name: string): Character {
  return {
    id,
    info: { name, rank: '1', career: '', homeworld: '', experience: '0', xpSpent: '0' },
    attrs: buildDefaultAttrs(),
    wounds: { current: 0, max: 0 },
    fate:   { current: 0, max: 0 },
    xpLog:  [],
  }
}

const initialState: FichaState = {
  characters: [
    buildDefaultCharacter('inquisidor', 'Inquisidor'),
    buildDefaultCharacter('sequito',    'Séquito'),
  ],
  activeCharacterId: 'inquisidor',
}

export const fichaSlice = createSlice({
  name: 'ficha',
  initialState,
  reducers: {
    addCharacter(state, action: PayloadAction<Pick<Character, 'info'>>) {
      const newChar: Character = {
        id: Date.now().toString(),
        info: { experience: '0', xpSpent: '0', ...action.payload.info },
        attrs: buildDefaultAttrs(),
        wounds: { current: 0, max: 0 },
        fate:   { current: 0, max: 0 },
        xpLog:  [],
      }
      state.characters.push(newChar)
      if (!state.activeCharacterId) {
        state.activeCharacterId = newChar.id
      }
    },

    selectCharacter(state, action: PayloadAction<string>) {
      state.activeCharacterId = action.payload
    },

    updateCharInfo(
      state,
      action: PayloadAction<{ id: string; field: keyof Character['info']; value: string }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.info[action.payload.field] = action.payload.value
    },

    updateAttribute(
      state,
      action: PayloadAction<{
        id: string
        key: string
        field: keyof AttributeValues
        value: number | string
      }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char && char.attrs[action.payload.key]) {
        (char.attrs[action.payload.key] as Record<string, number | string>)[action.payload.field] =
          action.payload.value
      }
    },

    updateWounds(
      state,
      action: PayloadAction<{ id: string; field: 'current' | 'max'; value: number }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.wounds[action.payload.field] = action.payload.value
    },

    updateFate(
      state,
      action: PayloadAction<{ id: string; field: 'current' | 'max'; value: number }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.fate[action.payload.field] = action.payload.value
    },

    addXpEntry(
      state,
      action: PayloadAction<{ id: string; entry: Omit<XpLogEntry, 'id' | 'date'> }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (!char) return
      const entry: XpLogEntry = {
        id:     Date.now().toString(),
        date:   new Date().toLocaleDateString('es-ES'),
        ...action.payload.entry,
      }
      char.xpLog.unshift(entry)
      const current = parseInt(char.info.experience) || 0
      char.info.experience = (current + entry.amount).toString()
    },

    removeXpEntry(state, action: PayloadAction<{ charId: string; entryId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      const entry = char.xpLog.find(e => e.id === action.payload.entryId)
      if (!entry) return
      char.xpLog = char.xpLog.filter(e => e.id !== action.payload.entryId)
      const current = parseInt(char.info.experience) || 0
      char.info.experience = Math.max(0, current - entry.amount).toString()
    },

    // DH1 costs per advance dot: dot1=100, dot2=250, dot3=500, dot4=750, dot5=1000
    advanceAttribute(
      state,
      action: PayloadAction<{ id: string; key: string; oldDots: number; newDots: number }>
    ) {
      const DOT_COSTS = [100, 250, 500, 750, 1000]
      const char = state.characters.find(c => c.id === action.payload.id)
      if (!char || !char.attrs[action.payload.key]) return

      const { oldDots, newDots } = action.payload
      let xpDelta = 0
      if (newDots > oldDots) {
        // spending: sum costs of dots being added
        for (let i = oldDots; i < newDots; i++) xpDelta += DOT_COSTS[i] ?? 0
      } else {
        // refunding: sum costs of dots being removed
        for (let i = newDots; i < oldDots; i++) xpDelta -= DOT_COSTS[i] ?? 0
      }

      const currentSpent = parseInt(char.info.xpSpent) || 0
      char.info.xpSpent = Math.max(0, currentSpent + xpDelta).toString()
      char.attrs[action.payload.key].advances = newDots * 10
    },
  },
})

export const {
  addCharacter,
  selectCharacter,
  updateCharInfo,
  updateAttribute,
  updateWounds,
  updateFate,
  addXpEntry,
  removeXpEntry,
  advanceAttribute,
} = fichaSlice.actions

export default fichaSlice.reducer
