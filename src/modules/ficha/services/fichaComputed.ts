import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { ATTR_ADVANCE_COSTS } from '@/core/data/darkheresy/careers'
import type { Character } from '../types/fichaTypes'

export function computeXpSpent(char: Character): number {
  let total = 0

  char.skills.forEach(s => { total += s.xp || 0 })
  char.talents.forEach(t => { total += t.xp || 0 })

  const costs = ATTR_ADVANCE_COSTS[char.info.career]
  if (costs) {
    ATTRIBUTES.forEach(def => {
      const advances = char.attrs[def.key]?.advances || 0
      const attrCosts = costs[def.key] ?? []
      for (let i = 0; i < advances; i++) {
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
