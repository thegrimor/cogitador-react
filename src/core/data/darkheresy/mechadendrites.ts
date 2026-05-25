export interface MechadendriteDefinition {
  name: string
  type: string
  desc: string
  abilities: string
}

export const MECHADENDRITES: MechadendriteDefinition[] = [
  {
    name: 'Mecadendrite de Herramientas',
    type: 'HERRAMIENTAS',
    desc: 'Brazo mecánico con herramientas integradas',
    abilities: '+10 a pruebas de Mecánica\nPermite trabajar en espacios pequeños',
  },
  {
    name: 'Mecadendrite Medicae',
    type: 'MEDICAE',
    desc: 'Brazo con instrumental médico',
    abilities: '+10 a pruebas de Medicae\nPuede aplicar primeros auxilios sin botiquín',
  },
  {
    name: 'Mecadendrite de Combate',
    type: 'COMBATE',
    desc: 'Apéndice de combate con punta afilada',
    abilities: 'Ataque: 1d10+3R\nNo requiere mano libre',
  },
  {
    name: 'Mecadendrite Utilitario',
    type: 'UTILITAS',
    desc: 'Apéndice polivalente con múltiples funciones',
    abilities: '+10 Tecnología\nPuede manipular objetos pequeños a distancia',
  },
  {
    name: 'Mecadendrite Óptico',
    type: 'OPTICAL',
    desc: 'Ojo auxiliar en apéndice extensible',
    abilities: '+10 Per para observar\nVisión nocturna a 30m',
  },
]
