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
  { name: 'Cuero endurecido', type: 'Primitiva', head: 0, body: 1, arms: 1, legs: 1, notes: 'Ligera, fácil de conseguir · Precio: 10 (Abundante)' },
  { name: 'Cota de malla', type: 'Primitiva', head: 0, body: 2, arms: 2, legs: 2, notes: 'Pesada, +10 sigilo penalización · Precio: 30 (Común)' },
  { name: 'Armadura de escamas', type: 'Primitiva', head: 0, body: 3, arms: 2, legs: 2, notes: 'Precio: 50 (Normal)' },
  { name: 'Armadura de placas', type: 'Primitiva', head: 3, body: 4, arms: 3, legs: 3, notes: 'Pesada, -20 Ag · Precio: 100 (Escasa)' },
  { name: 'Casco Flak', type: 'Flak', head: 2, body: 0, arms: 0, legs: 0, notes: 'Estándar de la Guardia · Precio: 10 (Común)' },
  { name: 'Chaleco Flak', type: 'Flak', head: 0, body: 2, arms: 0, legs: 0, notes: 'Ligero, ocultable · Precio: 20 (Común)' },
  { name: 'Armadura Flak completa', type: 'Flak', head: 2, body: 3, arms: 2, legs: 2, notes: 'Estándar de la Guardia Imperial · Precio: 100 (Común)' },
  { name: 'Casco de malla', type: 'Malla', head: 4, body: 0, arms: 0, legs: 0, notes: 'Precio: 100 (Rara)' },
  { name: 'Armadura de malla', type: 'Malla', head: 4, body: 4, arms: 4, legs: 4, notes: 'Ligera, no penaliza movimiento · Precio: 600 (Rara)' },
  { name: 'Armadura Caparazón ligera', type: 'Caparazón', head: 5, body: 5, arms: 5, legs: 5, notes: '-10 Ag · Precio: 2500 (Muy rara)' },
  { name: 'Armadura Caparazón', type: 'Caparazón', head: 6, body: 6, arms: 6, legs: 6, notes: '-20 Ag · Precio: 5000 (Muy rara)' },
  { name: 'Armadura de asalto Caparazón', type: 'Caparazón', head: 6, body: 7, arms: 6, legs: 6, notes: '-20 Ag, entrenamiento requerido · Precio: 10000 (Extremadamente rara)' },
  { name: 'Armadura de Power', type: 'Power', head: 8, body: 8, arms: 8, legs: 8, notes: 'Requiere entrenamiento específico · Precio: 0 (Extremadamente rara)' },
  { name: 'Traje de vacío', type: 'Especial', head: 2, body: 2, arms: 2, legs: 2, notes: 'Protege en vacío y ambientes hostiles · Precio: 200 (Escasa)' },
  { name: 'Hábito reforzado', type: 'Especial', head: 0, body: 1, arms: 0, legs: 0, notes: 'Oculta armadura subyacente · Precio: 75 (Común)' },
]
