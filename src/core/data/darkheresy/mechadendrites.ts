export interface MechadendriteDefinition {
  name: string
  type: string
  desc: string
  abilities: string
}

export const MECHADENDRITES: MechadendriteDefinition[] = [
  { name: 'Mecadendrita con Arma', type: 'COMBATE', desc: 'Miembro de 2m con pistola láser compacta integrada. Funciona como pistola láser con modificación Compacta.', abilities: 'Pistola láser compacta (acción de reacción o media acción de ataque)\nUn disparo por asalto (tirada HP sin modificadores)\nRequiere talento: Uso de mecadendrita (Arma)' },
  { name: 'Mecadendrita con Herramientas', type: 'UTILITAS', desc: '2m de longitud con herramientas y accesorios. 6 pistones inyectores, incensario eléctrico, hoja de corte.', abilities: '+10 a todas las tiradas de Competencia tecnológica\nIncensario: -5 HA a criaturas en radio 2m, +10 Per basadas en olfato\nHoja: arma improvisada con propiedad Defensiva\nRequiere talento: Uso de mecadendrita (Herramientas)' },
  { name: 'Mecadendrita con Manipulador', type: 'MANIPULACIÓN', desc: 'Montada sobre el hombro, diseñada para levantar pesos y manipular maquinaria. Cerámica y acero templado, alcance 1,5m.', abilities: '+20 Fuerza siempre que uses este miembro\nPinzas para aferrar objetos o puntos de anclaje (acción libre)\nÚsala como garrote: arma Primitiva, 1d5+2 daño de impacto\nNo sirve para manipulaciones delicadas\nRequiere talento: Uso de mecadendrita (Manipulador)' },
  { name: 'Mecadendrita Medicae', type: 'MEDICAE', desc: '2m de longitud para asistencia médica y quirúrgica de campo. 6 pistones inyectores, grapas hemostáticas, escalpelo sierra.', abilities: '+10 a tiradas de Medicae\n+10 a tiradas de Interrogar\nGrapas: media acción para detener hemorragias\nEscalpelo sierra: amputación Moderada (+0)\nComo arma improvisada: 1d5 acerado por impacto\nRequiere talento: Uso de mecadendrita (Medicae)' },
  { name: 'Mecadendrita Óptica', type: 'OPTICAL', desc: 'Flexible con múltiples videocámaras, extiéndese hasta 3m, puede reducirse al grosor de un lápiz.', abilities: '+10 a todas las tiradas de Percepción\nVisión microscópica o mira telescópica\nFoco de infrarrojos: no sufre penalizaciones por oscuridad\n+20 Per basadas en visión nocturna\nFoco de luz de distintos colores a voluntad\nRequiere talento: Uso de mecadendrita (Óptica)' },
]
