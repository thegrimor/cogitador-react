// Fuente: Dark Heresy 2ª Edición — Capítulo 5: Talentos y Rasgos
// Rellenar con la lista completa cuando se implemente

export interface TalentDefinition {
  key: string
  label: string
  prerequisites?: string
  description?: string
}

export const TALENTS: TalentDefinition[] = []
