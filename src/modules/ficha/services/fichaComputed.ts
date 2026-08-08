import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { ATTR_ADVANCE_COSTS, normalizeName } from '@/core/data/darkheresy/careers'
import type { Character, AttributeValues } from '../types/fichaTypes'

/**
 * Heridas base + bono de talentos Robusto (cada uno da +1 Herida, sin límite en 1ª ed.) = total.
 * Migración in-place: personajes persistidos antes de `woundsBase` no tienen ese campo — se
 * estima la base a partir del `wounds.max` ya guardado, restando los Robustos que ya tuvieran.
 */
export function computeWounds(char: Character): { base: number; robustos: number; total: number } {
  const robustos = char.talents.filter(t => normalizeName(t.name) === 'robusto').length
  const base = char.woundsBase ?? Math.max(0, (char.wounds?.max || 0) - robustos)
  return { base, robustos, total: base + robustos }
}

/**
 * Dots comprados de una característica, con migración de personajes persistidos
 * antes del sistema de dots (tenían un input libre de "avances"): 5 puntos de
 * avance equivalían a 1 dot, igual que la propia migración del HTML legacy.
 */
export function getAttrDots(values: (Partial<AttributeValues> & { advances?: number }) | undefined): number {
  if (!values) return 0
  if (typeof values.dots === 'number') return values.dots
  return Math.min(4, Math.round((values.advances || 0) / 5))
}

/**
 * Dots que realmente cuentan para el total: si se pasa la tabla de costes
 * de la carrera actual, los dots que caen en un tramo N/A (heredados de una
 * carrera anterior donde sí eran comprables) no se suman al bono — a
 * diferencia del HTML legacy, que los sumaba igual aunque no tuvieran
 * "globito" comprable. Sin tabla de costes (p.ej. sin carrera elegida),
 * se cuentan todos los dots tal cual.
 */
export function getCountedAttrDots(values: (Partial<AttributeValues> & { advances?: number }) | undefined, costs?: Array<number | null>): number {
  const dots = getAttrDots(values)
  if (!costs) return dots
  let counted = 0
  for (let i = 0; i < dots; i++) {
    if (costs[i] != null) counted++
  }
  return counted
}

/** Total de una característica: BASE + dots×10 + BONUS EXT — fórmula de attrTotal() del HTML legacy. */
export function getAttrTotal(
  values: (Partial<AttributeValues> & { advances?: number }) | undefined,
  costs?: Array<number | null>,
): number {
  if (!values) return 0
  return (values.base || 0) + getCountedAttrDots(values, costs) * 10 + (values.bonuses || 0)
}

export function computeXpSpent(char: Character): number {
  let total = 0

  char.skills.forEach(s => { total += s.xp || 0 })
  char.talents.forEach(t => { total += t.xp || 0 })
  // ?? [] — personajes persistidos antes de esta migración no tienen inqMejoras
  ;(char.inqMejoras ?? []).forEach(m => { if (m.cost > 0) total += m.cost })

  const costs = ATTR_ADVANCE_COSTS[char.info.career]
  if (costs) {
    ATTRIBUTES.forEach(def => {
      const dots = getAttrDots(char.attrs[def.key])
      const attrCosts = costs[def.key] ?? []
      for (let i = 0; i < dots; i++) {
        const c = attrCosts[i]
        if (c != null) total += c
      }
    })
  }

  return total
}

export function computeMovement(char: Character): {
  br: number; step: number; move: number; full: number; charge: number
} {
  const costs = ATTR_ADVANCE_COSTS[char.info.career]?.['Ag']
  const agTotal = getAttrTotal(char.attrs['Ag'], costs)
  const br = Math.floor(agTotal / 10)
  return { br, step: br, move: br * 2, full: br * 3, charge: br * 4 }
}
