import type { Weapon, ModelProfile, DamageBreakdown } from '@/types'

export function parseDiceAverage(expr: string): number {
  const s = expr.trim().toUpperCase()
  // Handles: D3, D6, 2D3, D6+1, D3+2, 2, 1, etc.
  const match = s.match(/^(\d*)D(\d+)([+-]\d+)?$/)
  if (match) {
    const coeff = match[1] ? parseInt(match[1]) : 1
    const faces = parseInt(match[2])
    const bonus = match[3] ? parseInt(match[3]) : 0
    return coeff * ((1 + faces) / 2) + bonus
  }
  const fixed = parseFloat(s)
  return isNaN(fixed) ? 1 : fixed
}

export function parseStat(stat: string): number | null {
  const match = stat.trim().match(/^(\d+)\+$/)
  return match ? parseInt(match[1]) : null
}

export function hitProbability(bsWs: string): number {
  if (bsWs.trim() === '*') return 1
  const val = parseStat(bsWs)
  if (val === null) return 0
  if (val >= 7) return 0
  if (val <= 1) return 1
  return (7 - val) / 6
}

// S vs T comparison — order matters: check S*2<=T before S<T
export function woundProbability(S: number, T: number): number {
  if (S >= T * 2) return 5 / 6   // 2+
  if (S > T)      return 4 / 6   // 3+
  if (S === T)    return 3 / 6   // 4+
  if (S * 2 <= T) return 1 / 6   // 6+ — must precede S < T
  return 2 / 6                   // 5+
}

// AP is stored as negative (e.g. -1). effectiveSv = svValue - AP (subtracting negative = raising threshold)
export function saveFailProbability(svRaw: string, invSvRaw: string, AP: number): number {
  const svVal = parseStat(svRaw)
  const invSvVal = invSvRaw ? parseStat(invSvRaw) : null

  const degradedSv = svVal !== null ? svVal - AP : null

  let bestThreshold: number | null = null
  if (degradedSv !== null && degradedSv <= 6) bestThreshold = degradedSv
  if (invSvVal !== null && invSvVal <= 6) {
    if (bestThreshold === null || invSvVal < bestThreshold) bestThreshold = invSvVal
  }

  if (bestThreshold === null || bestThreshold > 6) return 1.0
  // Min 1/6: rolling 1 always fails saves
  return Math.min(1, Math.max(1 / 6, (bestThreshold - 1) / 6))
}

export function calculateDamage(weapon: Weapon, defenderModel: ModelProfile): DamageBreakdown {
  const avgAttacks = parseDiceAverage(weapon.A)
  const pHit = weapon.isTorrent ? 1 : hitProbability(weapon.bsWs)
  const pWound = woundProbability(weapon.S, defenderModel.T)
  const pFailSave = saveFailProbability(defenderModel.Sv, defenderModel.invSv, weapon.AP)
  const avgDmgPerWound = parseDiceAverage(weapon.D)

  const expectedHits = avgAttacks * pHit
  const expectedWounds = expectedHits * pWound
  const expectedFailedSaves = expectedWounds * pFailSave
  const expectedTotalDamage = expectedFailedSaves * avgDmgPerWound

  return {
    weaponName: weapon.name,
    avgAttacks,
    hitProbability: pHit,
    expectedHits,
    woundProbability: pWound,
    expectedWounds,
    saveFailProbability: pFailSave,
    expectedFailedSaves,
    avgDamagePerWound: avgDmgPerWound,
    expectedTotalDamage,
  }
}
