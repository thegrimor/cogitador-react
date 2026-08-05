// Fuente: Dark Heresy 1ª Edición — Capítulo de Características

export interface AttributeDefinition {
  key: string
  label: string
  abbr: string
}

export const ATTRIBUTES: AttributeDefinition[] = [
  { key: 'WS',  label: 'Habilidad de Armas',       abbr: 'HA'  },
  { key: 'BS',  label: 'Habilidad de Proyectiles', abbr: 'HP'  },
  { key: 'S',   label: 'Fuerza',                   abbr: 'F'   },
  { key: 'T',   label: 'Resistencia',              abbr: 'R'   },
  { key: 'Ag',  label: 'Agilidad',                 abbr: 'Ag'  },
  { key: 'Int', label: 'Inteligencia',             abbr: 'Int' },
  { key: 'Per', label: 'Percepción',               abbr: 'Per' },
  { key: 'WP',  label: 'Voluntad',                 abbr: 'Vol' },
  { key: 'Fel', label: 'Empatía',                  abbr: 'Em'  },
]
