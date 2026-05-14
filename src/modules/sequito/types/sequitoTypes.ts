export type InvCategory = 'armory' | 'implants' | 'mechadendrites' | 'equipment' | 'armor'

export interface EquippedItem {
  itemId: string
  qty: number
}

export interface SequitoMember {
  id: string
  name: string
  role: string
  alive: boolean
  layerId: string
  stats: Record<string, number>
  equipment: EquippedItem[]
  eq_implants: EquippedItem[]
  eq_mechadendrites: EquippedItem[]
  eq_equipment: EquippedItem[]
  eq_armor: EquippedItem[]
}

export interface Layer {
  id: string
  name: string
  seqIds: string[]
}

export interface InventoryItem {
  id: string
  name: string
  type: string
  stock: number
  notes: string
}

export interface SequitoState {
  layers: Layer[]
  sequito: Record<string, SequitoMember>
  armory: InventoryItem[]
  implants: InventoryItem[]
  mechadendrites: InventoryItem[]
  equipment: InventoryItem[]
  armor: InventoryItem[]
}
