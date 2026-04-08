// Fuente: Dark Heresy 1ª Edición — Capítulo de Características

export interface AttributeDefinition {
  key: string
  label: string
  abbr: string
}

export const ATTRIBUTES: AttributeDefinition[] = [
  { key: 'WS',  label: 'Weapon Skill',    abbr: 'WS'  },
  { key: 'BS',  label: 'Ballistic Skill', abbr: 'BS'  },
  { key: 'S',   label: 'Strength',        abbr: 'S'   },
  { key: 'T',   label: 'Toughness',       abbr: 'T'   },
  { key: 'Ag',  label: 'Agility',         abbr: 'Ag'  },
  { key: 'Int', label: 'Intelligence',    abbr: 'Int' },
  { key: 'Per', label: 'Perception',      abbr: 'Per' },
  { key: 'WP',  label: 'Willpower',       abbr: 'WP'  },
  { key: 'Fel', label: 'Fellowship',      abbr: 'Fel' },
]
