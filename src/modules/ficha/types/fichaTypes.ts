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

export interface Skill {
  id: string
  name: string
  attr: string        // WS | BS | S | T | Ag | Int | Per | WP | Fel
  level: number       // 0=no entrenado(-20) 1=entrenado(+0) 2=avanzado(+10) 3=maestro(+20)
  bonus: number
  notes: string
}

export interface Talent {
  id: string
  name: string
  type: string        // COMBATE | MECÁNICO | PSÍQUICO | GENERAL | TECH | OTRO
  desc: string
  effect: string
}

export interface Weapon {
  id: string
  name: string
  cls: string         // Básica | Pistola | Pesada | CaC | Lanzadora | Especial
  dmgType: string     // E | I | X | R
  range: string
  rof: string
  dmg: string
  pen: number
  clip: string
  notes: string
}

export interface Armor {
  id: string
  name: string
  notes: string
  head: number
  body: number
  arms: number
  legs: number
}

export interface GearItem {
  id: string
  name: string
  qty: number
  notes: string
}

export interface Mechadendrite {
  id: string
  name: string
  mechaType: string   // MANIPULACIÓN | COMBATE | UTILITAS | MEDICAE | OPTICAL | OTRO
  desc: string
  abilities: string[]
}

export interface Augmentation {
  id: string
  name: string
  loc: string         // Ojo/Visión | Brazo/Mano | Pierna | Torso/Interno | Cerebro/Neural | Piel/Externo | Otro
  desc: string
  bonus: string
}

export interface Character {
  id: string
  info: CharacterInfo
  attrs: AttributesState
  wounds: VitalState
  fate: VitalState
  xpLog: XpLogEntry[]
  skills: Skill[]
  talents: Talent[]
  weapons: Weapon[]
  armors: Armor[]
  gear: GearItem[]
  mechadendrites: Mechadendrite[]
  augmentations: Augmentation[]
}

export interface FichaState {
  characters: Character[]
  activeCharacterId: string | null
}
