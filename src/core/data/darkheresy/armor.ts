export interface ArmorDefinition {
  name: string
  type: string
  head: number
  body: number
  arms: number
  legs: number
  notes: string
}

export const ARMORS: ArmorDefinition[] = [
  {
    name: 'Ropa Común',
    type: 'Primitiva',
    head: 0,
    body: 0,
    arms: 0,
    legs: 0,
    notes: '',
  },
  {
    name: 'Chaleco Ligero',
    type: 'Ligera',
    head: 0,
    body: 2,
    arms: 0,
    legs: 0,
    notes: '',
  },
  {
    name: 'Casco de Combate',
    type: 'Armadura de Placas',
    head: 3,
    body: 0,
    arms: 0,
    legs: 0,
    notes: '',
  },
  {
    name: 'Armadura de Cuero',
    type: 'Ligera',
    head: 0,
    body: 2,
    arms: 1,
    legs: 1,
    notes: '',
  },
  {
    name: 'Armadura de Malla',
    type: 'Malla',
    head: 3,
    body: 4,
    arms: 3,
    legs: 3,
    notes: '',
  },
  {
    name: 'Armadura de Carapace Ligera',
    type: 'Carapace',
    head: 4,
    body: 5,
    arms: 3,
    legs: 3,
    notes: '',
  },
  {
    name: 'Armadura de Carapace Pesada',
    type: 'Carapace',
    head: 6,
    body: 7,
    arms: 5,
    legs: 5,
    notes: 'Bulto',
  },
  {
    name: 'Armadura Potenciada',
    type: 'Potenciada',
    head: 8,
    body: 10,
    arms: 8,
    legs: 8,
    notes: '+20S, Sistema de respiración',
  },
]
