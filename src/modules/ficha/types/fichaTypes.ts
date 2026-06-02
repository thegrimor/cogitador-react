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
  attr: string
  level: number   // -20 | 0 | 10 | 20 — entrenamiento
  bonus: number
  notes: string
  xp: number
}

export interface Talent {
  id: string
  name: string
  type: string
  req: string
  desc: string
  effect: string
  xp: number
}

export interface Weapon {
  id: string
  name: string
  cls: string
  dmgType: string
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
  type: string
  desc: string
  abilities: string
}

export interface Augmentation {
  id: string
  name: string
  loc: string
  desc: string
  bonus: string
}

export interface PsychicPower {
  id: string
  name: string
  disc: string
  umbral: number
  conc: string
  mant: string
  alcance: string
  desc: string
}

export interface CustomCurrency {
  name: string
  amount: number
}

export type InqTalentType =
  | 'Talento de Influencia'
  | 'Talento de Prestigio'
  | 'Habilidad Maestra'
  | 'Talento de Fe'
  | 'Otros Talentos'
  | 'Talento'
  | 'Habilidad'
  | 'Rasgo'

export interface InquisidorTalent {
  id: string
  name: string
  tipo: InqTalentType
  xp: number
  req: string
  desc: string
}

export interface Character {
  id: string
  info: CharacterInfo
  attrs: AttributesState
  wounds: VitalState
  fate: VitalState
  xpLog: XpLogEntry[]
  filterCareer: boolean
  // Vital extras
  insanity: number
  corruption: number
  // Skills & abilities
  skills: Skill[]
  talents: Talent[]
  // Equipment
  weapons: Weapon[]
  armors: Armor[]
  gear: GearItem[]
  // Mejoras
  mechadendrites: Mechadendrite[]
  augmentations: Augmentation[]
  // Psychic
  powers: PsychicPower[]
  psychFactor: number
  psychBV: number
  psychDiscipline: string
  psychNotes: string
  // Resources
  moneyThrones: number
  currencies: CustomCurrency[]
  quickNotes: string
  influenceGeneral: string
  influencePlanetary: string
  inqTalents: InquisidorTalent[]
}

export interface FallenCharacter extends Character {
  diedAt: string
  xpInherited: number
}

export interface FichaState {
  characters: Character[]
  activeCharacterId: string | null
  fallen: FallenCharacter[]
}
