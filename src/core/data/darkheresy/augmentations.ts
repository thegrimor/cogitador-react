export interface AugmentationDefinition {
  name: string
  loc: string
  desc: string
  bonus: string
}

export const AUGMENTATIONS: AugmentationDefinition[] = [
  { name: 'Brazo biónico', loc: 'Brazo / Mano', desc: 'Reemplaza un brazo y mano humanos, conservando fuerza, destreza y sentido del tacto.', bonus: '+10 Ag para manipulaciones delicadas; +10 F con este brazo (calidad normal)' },
  { name: 'Sistema locomotor biónico', loc: 'Pierna', desc: 'Reemplaza piernas y cadera. Se integra en espina dorsal y sistema nervioso.', bonus: '+20 Ag para saltos; talento Veloz (buena calidad)' },
  { name: 'Sistema respiratorio biónico', loc: 'Torso / Interno', desc: 'Pulmones biónicos con suministro constante de oxígeno.', bonus: '+20 R para resistir toxinas aéreas y gases (calidad normal)' },
  { name: 'Cibersentidos', loc: 'Ojo / Visión', desc: 'Vista, oído, tacto, gusto y otros sentidos artificiales. Pueden incluir sensores especiales.', bonus: 'Talento Sentido desarrollado; +20 a tiradas de ese sentido (buena calidad)' },
  { name: 'Implantes corticales', loc: 'Cerebro / Neural', desc: 'Reparación o mejora cerebral. Versión normal restaura funciones perdidas.', bonus: 'Inteligencia antinatural ×2; funciona como cogitador (buena calidad, muy rara)' },
  { name: 'Módulo sensorial', loc: 'Piel / Externo', desc: 'Duplica efectos de sensores especiales. Funciona como áuspex estándar.', bonus: 'Funciona como áuspex estándar; repetir tirada fallida de Percepción (buena calidad)' },
  { name: 'Unidad de impulsos mentales', loc: 'Cerebro / Neural', desc: 'Enlace sensorial para comunicarse directamente con máquinas y dispositivos tecnológicos.', bonus: '+10 Competencia tecnológica, Conducir, HP y Lógica al manipular dispositivos con soporte (buena calidad)' },
  { name: 'Ojo biónico', loc: 'Ojo / Visión', desc: 'Ojo artificial con capacidades mejoradas. Puede incluir mira telescópica, fotovisor o microcomunicador.', bonus: 'Sin penalización por oscuridad; mira telescópica integrada; fotovisor completo (avanzado)' },
]
