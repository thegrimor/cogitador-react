// Fuente: Dark Heresy 2ª Edición — Capítulo 7: Poderes Psíquicos
// Rellenar con la lista completa cuando se implemente

export interface PsychicPowerDefinition {
  key: string
  label: string
  discipline: string
  cost: number
  description?: string
}

export const PSYCHIC_POWERS: PsychicPowerDefinition[] = []
