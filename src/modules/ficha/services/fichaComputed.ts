import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { ATTR_ADVANCE_COSTS } from '@/core/data/darkheresy/careers'
import type { Character, AttributeValues } from '../types/fichaTypes'

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

/** Total de una característica: BASE + dots×10 + BONUS EXT — fórmula de attrTotal() del HTML legacy. */
export function getAttrTotal(values: (Partial<AttributeValues> & { advances?: number }) | undefined): number {
  if (!values) return 0
  return (values.base || 0) + getAttrDots(values) * 10 + (values.bonuses || 0)
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
  const agTotal = getAttrTotal(char.attrs['Ag'])
  const br = Math.floor(agTotal / 10)
  return { br, step: br, move: br * 2, full: br * 3, charge: br * 4 }
}
