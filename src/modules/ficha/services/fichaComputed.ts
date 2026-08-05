import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { ATTR_ADVANCE_COSTS } from '@/core/data/darkheresy/careers'
import type { Character } from '../types/fichaTypes'

export function computeXpSpent(char: Character): number {
  let total = 0

  char.skills.forEach(s => { total += s.xp || 0 })
  char.talents.forEach(t => { total += t.xp || 0 })
  // ?? [] — personajes persistidos antes de esta migración no tienen inqMejoras
  ;(char.inqMejoras ?? []).forEach(m => { if (m.cost > 0) total += m.cost })

  const costs = ATTR_ADVANCE_COSTS[char.info.career]
  if (costs) {
    ATTRIBUTES.forEach(def => {
      const advances = char.attrs[def.key]?.advances || 0
      // El input es libre (no "dots" del HTML): cada 5 puntos de avance equivale a un dot
      // comprado, igual que la migración del propio HTML legacy (Math.round(advances/5)).
      const dots = Math.min(4, Math.round(advances / 5))
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
  const ag = char.attrs['Ag']
  const agTotal = ag ? ag.base + ag.advances + ag.bonuses : 0
  const br = Math.floor(agTotal / 10)
  return { br, step: br, move: br * 2, full: br * 3, charge: br * 4 }
}
