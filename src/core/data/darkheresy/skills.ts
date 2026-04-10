// Fuente: Dark Heresy 2ª Edición — Capítulo 4: Habilidades
// Rellenar con la lista completa cuando se implemente

export interface SkillDefinition {
  key: string
  label: string
  linkedAttribute: string
  specialisations?: string[]
}

export const SKILLS: SkillDefinition[] = []
