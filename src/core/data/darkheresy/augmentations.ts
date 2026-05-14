export interface AugmentationDefinition {
  name: string
  loc: string
  desc: string
  bonus: string
}

export const AUGMENTATIONS: AugmentationDefinition[] = [
  {
    name: 'Ojo Biónico',
    loc: 'Ojo/Visión',
    desc: 'Ojo artificial con funciones mejoradas',
    bonus: '+10 Per visual, visión nocturna',
  },
  {
    name: 'Ojo Mecánico con Zoom',
    loc: 'Ojo/Visión',
    desc: 'Ojo telescópico',
    bonus: '+10 BS a larga distancia',
  },
  {
    name: 'Brazo Biónico',
    loc: 'Brazo/Mano',
    desc: 'Brazo artificial resistente',
    bonus: '+10 S para pruebas de fuerza con ese brazo',
  },
  {
    name: 'Mano de Combate',
    loc: 'Brazo/Mano',
    desc: 'Mano reforzada con cuchillas',
    bonus: 'Daño CaC: 1d10+2R, no necesita arma',
  },
  {
    name: 'Pierna Biónica',
    loc: 'Pierna',
    desc: 'Pierna artificial',
    bonus: '+2 a velocidad de movimiento',
  },
  {
    name: 'Pulmón de Filtro',
    loc: 'Torso/Interno',
    desc: 'Pulmón mejorado con filtros',
    bonus: 'Inmune a gases, puede respirar en ambientes tóxicos',
  },
  {
    name: 'Corazón Auxiliar',
    loc: 'Torso/Interno',
    desc: 'Segundo corazón mecánico',
    bonus: '+2 Heridas, puede estabilizarse 1/sesión',
  },
  {
    name: 'Procesador Neural',
    loc: 'Cerebro/Neural',
    desc: 'Implante de procesamiento',
    bonus: '+5 Int, +10 a pruebas de conocimiento',
  },
  {
    name: 'Piel Subdermal',
    loc: 'Piel/Externo',
    desc: 'Placas bajo la piel',
    bonus: '+2 PA en todo el cuerpo',
  },
]
