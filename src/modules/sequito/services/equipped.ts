import type { EquippedItem, InvCategory, SequitoMember } from '../types/sequitoTypes'

/** Clave del array de equipo de un séquito para una categoría de inventario dada. */
export function equipKeyFor(cat: InvCategory): keyof SequitoMember {
  return cat === 'armory' ? 'equipment' : (`eq_${cat}` as keyof SequitoMember)
}

/** Total de unidades de un item equipadas entre todos los séquito (usado por Armería e Inventario). */
export function getEquippedCount(
  allSequito: Record<string, SequitoMember>,
  cat: InvCategory,
  itemId: string
): number {
  const key = equipKeyFor(cat)
  return Object.values(allSequito).reduce((sum, m) => {
    return sum + (m[key] as EquippedItem[]).filter(e => e.itemId === itemId).reduce((s, e) => s + e.qty, 0)
  }, 0)
}
