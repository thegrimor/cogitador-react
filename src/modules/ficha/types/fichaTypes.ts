export interface AttributeValues {
  base: number
  advances: number
  bonuses: number
  bonusNote: string
}

export type AttributesState = Record<string, AttributeValues>

export interface CharacterInfo {
  name: string
  rank: string
  career: string
  homeworld: string
  experience: string
  xpSpent: string
}

export interface VitalState {
  current: number
  max: number
}

export interface XpLogEntry {
  id: string
  amount: number
  reason: string
  date: string
}

export interface Character {
  id: string
  info: CharacterInfo
  attrs: AttributesState
  wounds: VitalState
  fate: VitalState
  xpLog: XpLogEntry[]
}

export interface FichaState {
  characters: Character[]
  activeCharacterId: string | null
}
