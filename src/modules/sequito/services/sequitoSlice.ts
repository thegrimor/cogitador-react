import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { SequitoState, SequitoMember, Layer, InventoryItem, InvCategory } from '../types/sequitoTypes'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const DEFAULT_STATS: Record<string, number> = {
  WS: 15, BS: 15, S: 15, T: 15, Ag: 15, Int: 15, Per: 15, WP: 15, Fel: 15,
}

const initialState: SequitoState = {
  layers: [],
  sequito: {},
  armory: [],
  implants: [],
  mechadendrites: [],
  equipment: [],
  armor: [],
}

export const sequitoSlice = createSlice({
  name: 'sequito',
  initialState,
  reducers: {
    // — Layers —
    addLayer(state) {
      const layer: Layer = { id: uid(), name: `Grupo ${state.layers.length + 1}`, seqIds: [] }
      state.layers.push(layer)
    },

    deleteLayer(state, action: PayloadAction<string>) {
      const layer = state.layers.find(l => l.id === action.payload)
      if (!layer) return
      layer.seqIds.forEach(id => { delete state.sequito[id] })
      state.layers = state.layers.filter(l => l.id !== action.payload)
    },

    renameLayer(state, action: PayloadAction<{ id: string; name: string }>) {
      const layer = state.layers.find(l => l.id === action.payload.id)
      if (layer) layer.name = action.payload.name
    },

    reorderLayers(state, action: PayloadAction<{ fromIdx: number; toIdx: number }>) {
      const { fromIdx, toIdx } = action.payload
      const [removed] = state.layers.splice(fromIdx, 1)
      state.layers.splice(toIdx, 0, removed)
    },

    // — Séquito members —
    addSequito(state, action: PayloadAction<{ layerId: string; name: string; role: string }>) {
      const { layerId, name, role } = action.payload
      const layer = state.layers.find(l => l.id === layerId)
      if (!layer) return
      const member: SequitoMember = {
        id: uid(), name, role, alive: true, layerId,
        stats: { ...DEFAULT_STATS },
        equipment: [], eq_implants: [], eq_mechadendrites: [], eq_equipment: [], eq_armor: [],
      }
      state.sequito[member.id] = member
      layer.seqIds.push(member.id)
    },

    addSequitoBulk(state, action: PayloadAction<{ layerId: string; baseName: string; role: string; qty: number; start: number }>) {
      const { layerId, baseName, role, qty, start } = action.payload
      const layer = state.layers.find(l => l.id === layerId)
      if (!layer) return
      for (let i = 0; i < qty; i++) {
        const member: SequitoMember = {
          id: uid(), name: `${baseName} ${start + i}`, role, alive: true, layerId,
          stats: { ...DEFAULT_STATS },
          equipment: [], eq_implants: [], eq_mechadendrites: [], eq_equipment: [], eq_armor: [],
        }
        state.sequito[member.id] = member
        layer.seqIds.push(member.id)
      }
    },

    editSequito(state, action: PayloadAction<Partial<SequitoMember> & { id: string }>) {
      const { id, ...updates } = action.payload
      if (state.sequito[id]) Object.assign(state.sequito[id], updates)
    },

    deleteSequito(state, action: PayloadAction<string>) {
      const member = state.sequito[action.payload]
      if (!member) return
      const layer = state.layers.find(l => l.id === member.layerId)
      if (layer) layer.seqIds = layer.seqIds.filter(id => id !== action.payload)
      delete state.sequito[action.payload]
    },

    moveSequitoToLayer(state, action: PayloadAction<{ seqId: string; targetLayerId: string }>) {
      const { seqId, targetLayerId } = action.payload
      const member = state.sequito[seqId]
      if (!member) return
      const sourceLayer = state.layers.find(l => l.id === member.layerId)
      const targetLayer = state.layers.find(l => l.id === targetLayerId)
      if (!sourceLayer || !targetLayer) return
      sourceLayer.seqIds = sourceLayer.seqIds.filter(id => id !== seqId)
      targetLayer.seqIds.push(seqId)
      member.layerId = targetLayerId
    },

    // — Equipment —
    equipItem(state, action: PayloadAction<{ seqId: string; cat: InvCategory; itemId: string; qty: number }>) {
      const { seqId, cat, itemId, qty } = action.payload
      const member = state.sequito[seqId]
      if (!member) return
      const key = cat === 'armory' ? 'equipment' : `eq_${cat}` as keyof SequitoMember
      const arr = member[key] as Array<{ itemId: string; qty: number }>
      const existing = arr.find(e => e.itemId === itemId)
      if (existing) existing.qty += qty
      else arr.push({ itemId, qty })
    },

    unequipItem(state, action: PayloadAction<{ seqId: string; cat: InvCategory; itemId: string }>) {
      const { seqId, cat, itemId } = action.payload
      const member = state.sequito[seqId]
      if (!member) return
      const key = cat === 'armory' ? 'equipment' : `eq_${cat}` as keyof SequitoMember
      ;(member[key] as Array<{ itemId: string; qty: number }>) =
        (member[key] as Array<{ itemId: string; qty: number }>).filter(e => e.itemId !== itemId)
    },

    unequipAll(state, action: PayloadAction<{ cat: InvCategory; itemId: string }>) {
      const { cat, itemId } = action.payload
      const key = cat === 'armory' ? 'equipment' : `eq_${cat}`
      Object.values(state.sequito).forEach(m => {
        ;(m as Record<string, unknown>)[key] =
          ((m as Record<string, unknown>)[key] as Array<{ itemId: string }>).filter(e => e.itemId !== itemId)
      })
    },

    // — Inventory CRUD (generic) —
    addInventoryItem(state, action: PayloadAction<{ cat: InvCategory; item: Omit<InventoryItem, 'id'> }>) {
      const { cat, item } = action.payload
      state[cat].push({ id: uid(), ...item })
    },

    updateInventoryItem(state, action: PayloadAction<{ cat: InvCategory; item: InventoryItem }>) {
      const { cat, item } = action.payload
      const idx = state[cat].findIndex(x => x.id === item.id)
      if (idx !== -1) state[cat][idx] = item
    },

    deleteInventoryItem(state, action: PayloadAction<{ cat: InvCategory; itemId: string }>) {
      const { cat, itemId } = action.payload
      // unequip first
      const key = cat === 'armory' ? 'equipment' : `eq_${cat}`
      Object.values(state.sequito).forEach(m => {
        ;(m as Record<string, unknown>)[key] =
          ((m as Record<string, unknown>)[key] as Array<{ itemId: string }>).filter(e => e.itemId !== itemId)
      })
      state[cat] = state[cat].filter(x => x.id !== itemId)
    },

    changeInventoryStock(state, action: PayloadAction<{ cat: InvCategory; itemId: string; delta: number }>) {
      const { cat, itemId, delta } = action.payload
      const item = state[cat].find(x => x.id === itemId)
      if (!item) return
      const key = cat === 'armory' ? 'equipment' : `eq_${cat}`
      const equipped = Object.values(state.sequito).reduce((sum, m) => {
        return sum + ((m as Record<string, unknown>)[key] as Array<{ itemId: string; qty: number }>)
          .filter(e => e.itemId === itemId)
          .reduce((s, e) => s + e.qty, 0)
      }, 0)
      item.stock = Math.max(equipped, item.stock + delta)
    },

    importState(_state, action: PayloadAction<SequitoState>) {
      return action.payload
    },
  },
})

export const {
  addLayer, deleteLayer, renameLayer, reorderLayers,
  addSequito, addSequitoBulk, editSequito, deleteSequito, moveSequitoToLayer,
  equipItem, unequipItem, unequipAll,
  addInventoryItem, updateInventoryItem, deleteInventoryItem, changeInventoryStock,
  importState,
} = sequitoSlice.actions

export default sequitoSlice.reducer
