import type { Weapon, ModelProfile, DamageBreakdown, CombatModifiers } from '@/types'
import { MODIFIER_RULES, UNIVERSAL_ATTACKER_RULES, UNIVERSAL_DEFENDER_RULES } from '@/data/modifiers'

export const DEFAULT_MODS: CombatModifiers = {
  hitMod: 0,
  rerollHitsOf1: false,
  rerollAllHits: false,
  critThreshold: 6,
  sustainedHitsBonus: 0,
  lethalHitsBonus: false,
  strengthMod: 0,
  rerollWoundsOf1: false,
  rerollAllWounds: false,
  woundMod: 0,
  apMod: 0,
  saveMod: 0,
  feelNoPainThreshold: null,
}

export function parseDiceAverage(expr: string): number {
  const s = expr.trim().toUpperCase()
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

// CSV stores BS_WS and inv_sv as plain numbers ("3") or "3+" — accept both
export function parseStat(stat: string): number | null {
  if (!stat || stat.trim() === '' || stat.trim() === '-') return null
  const match = stat.trim().match(/^(\d+)\+?$/)
  return match ? parseInt(match[1]) : null
}

export function hitProbabilityWithMods(bsWs: string, mods: CombatModifiers): number {
  if (bsWs.trim() === '*') return 1
  const val = parseStat(bsWs)
  if (val === null) return 0

  const effectiveBs = val - mods.hitMod
  const baseP = Math.min(5 / 6, Math.max(1 / 6, (7 - effectiveBs) / 6))

  if (mods.rerollAllHits)  return baseP + (1 - baseP) * baseP
  if (mods.rerollHitsOf1)  return baseP + (1 / 6) * baseP
  return baseP
}

// S vs T comparison — order matters: check S*2<=T before S<T
export function woundProbability(S: number, T: number): number {
  if (S >= T * 2) return 5 / 6   // 2+
  if (S > T)      return 4 / 6   // 3+
  if (S === T)    return 3 / 6   // 4+
  if (S * 2 <= T) return 1 / 6   // 6+
  return 2 / 6                   // 5+
}

function woundProbabilityWithMods(S: number, T: number, mods: CombatModifiers): number {
  const effectiveS = S + mods.strengthMod
  const baseP = woundProbability(effectiveS, T)
  if (mods.woundMod === 0) return baseP
  // Convert probability to threshold, shift by woundMod, re-clamp
  const baseThreshold = baseP * 6 + 1
  const adjustedThreshold = baseThreshold - mods.woundMod
  return Math.min(5 / 6, Math.max(1 / 6, (adjustedThreshold - 1) / 6))
}

// AP is stored as negative (e.g. -1). effectiveSv = svValue - AP
export function saveFailProbability(
  svRaw: string,
  invSvRaw: string,
  AP: number,
  saveMod = 0,
): number {
  const svVal = parseStat(svRaw)
  const invSvVal = invSvRaw ? parseStat(invSvRaw) : null

  const degradedSv = svVal !== null ? svVal - AP - saveMod : null

  let bestThreshold: number | null = null
  if (degradedSv !== null && degradedSv <= 6) bestThreshold = degradedSv
  if (invSvVal !== null && invSvVal <= 6) {
    if (bestThreshold === null || invSvVal < bestThreshold) bestThreshold = invSvVal
  }

  if (bestThreshold === null || bestThreshold > 6) return 1.0
  return Math.min(1, Math.max(1 / 6, (bestThreshold - 1) / 6))
}

export function calculateDamage(
  weapon: Weapon,
  defenderModel: ModelProfile,
  attackerMods: CombatModifiers = DEFAULT_MODS,
  defenderMods: CombatModifiers = DEFAULT_MODS,
): DamageBreakdown {
  const avgAttacks      = parseDiceAverage(weapon.A)
  const pHit            = weapon.isTorrent ? 1 : hitProbabilityWithMods(weapon.bsWs, attackerMods)

  const effectiveAP     = weapon.AP + attackerMods.apMod
  const combinedSaveMod = attackerMods.saveMod + defenderMods.saveMod
  const pFailSave       = saveFailProbability(defenderModel.Sv, defenderModel.invSv, effectiveAP, combinedSaveMod)
  const avgDmgPerWound  = parseDiceAverage(weapon.D)

  const CRIT_PROB  = Math.min(5 / 6, (7 - attackerMods.critThreshold) / 6)
  const sustainedX = weapon.sustainedHitsValue + attackerMods.sustainedHitsBonus
  const isLethal   = weapon.isLethalHits || attackerMods.lethalHitsBonus

  const sustainedExtraHits = sustainedX > 0 ? avgAttacks * CRIT_PROB * sustainedX : 0

  const pWound = woundProbabilityWithMods(weapon.S, defenderModel.T, attackerMods)

  let expectedHits: number
  let expectedWounds: number
  let autoWoundsFromCrits: number

  if (isLethal) {
    autoWoundsFromCrits = avgAttacks * CRIT_PROB
    const normalHits = avgAttacks * Math.max(0, pHit - CRIT_PROB) + sustainedExtraHits
    let normalWounds = normalHits * pWound
    if (attackerMods.rerollAllWounds)      normalWounds = normalHits * (pWound + (1 - pWound) * pWound)
    else if (attackerMods.rerollWoundsOf1) normalWounds = normalHits * (pWound + (1 / 6) * pWound)
    expectedHits   = avgAttacks * pHit + sustainedExtraHits
    expectedWounds = autoWoundsFromCrits + normalWounds
  } else {
    autoWoundsFromCrits = 0
    expectedHits   = avgAttacks * pHit + sustainedExtraHits
    let adjPWound  = pWound
    if (attackerMods.rerollAllWounds)      adjPWound = pWound + (1 - pWound) * pWound
    else if (attackerMods.rerollWoundsOf1) adjPWound = pWound + (1 / 6) * pWound
    expectedWounds = expectedHits * adjPWound
  }

  const expectedFailedSaves = expectedWounds * pFailSave
  const rawDamage           = expectedFailedSaves * avgDmgPerWound

  const fnpT = defenderMods.feelNoPainThreshold
  const pFnp = fnpT !== null ? Math.min(5 / 6, (7 - fnpT) / 6) : 0
  const feelNoPainReduction = rawDamage * pFnp
  const expectedTotalDamage = rawDamage * (1 - pFnp)

  return {
    weaponName: weapon.name,
    avgAttacks,
    hitProbability: pHit,
    expectedHits,
    sustainedExtraHits,
    woundProbability: pWound,
    expectedWounds,
    autoWoundsFromCrits,
    saveFailProbability: pFailSave,
    expectedFailedSaves,
    avgDamagePerWound: avgDmgPerWound,
    feelNoPainReduction,
    expectedTotalDamage,
  }
}

// Returns all applicable rules for a given context (used by ModifierPanel)
export function getApplicableRules(
  weapon: Weapon | null,
  factionId: string | null,
  detachmentId: string | null,
  side: 'attacker' | 'defender',
  combatType: 'ranged' | 'melee',
) {
  const isMelee = weapon ? weapon.range === 'Melee' : combatType === 'melee'
  const result: Array<{ id: string; label: string }> = []

  type RuleEntry = { id: string; label: string; appliesTo: 'ranged' | 'melee' | 'all'; side: string }
  function collect(rules: RuleEntry[]) {
    for (const rule of rules) {
      if (rule.side !== side && rule.side !== 'both') continue
      if (rule.appliesTo === 'ranged' && isMelee) continue
      if (rule.appliesTo === 'melee' && !isMelee) continue
      result.push({ id: rule.id, label: rule.label })
    }
  }

  const universalRules = side === 'attacker' ? UNIVERSAL_ATTACKER_RULES : UNIVERSAL_DEFENDER_RULES
  // Heavy toggle: show only when weapon has isHeavy, or no weapon and combatType=ranged
  const filteredUniversal = universalRules.filter(r =>
    r.id !== 'weapon_heavy' || (weapon ? weapon.isHeavy : !isMelee),
  )
  collect(filteredUniversal as RuleEntry[])

  if (factionId) collect((MODIFIER_RULES.factions[factionId] ?? []) as RuleEntry[])
  if (detachmentId) collect((MODIFIER_RULES.detachments[detachmentId] ?? []) as RuleEntry[])

  return result
}

// Resolves active IDs into a CombatModifiers object
export function resolveModifiers(
  activeIds: Set<string>,
  weapon: Weapon | null,
  factionId: string | null,
  detachmentId: string | null,
  side: 'attacker' | 'defender',
  combatType: 'ranged' | 'melee',
): CombatModifiers {
  const mods: CombatModifiers = { ...DEFAULT_MODS }
  const applicableRules = getApplicableRules(weapon, factionId, detachmentId, side, combatType)

  const allRulesMap = new Map<string, Partial<CombatModifiers>>()

  const allRuleSources = [
    ...(side === 'attacker' ? UNIVERSAL_ATTACKER_RULES : UNIVERSAL_DEFENDER_RULES),
    ...(factionId ? (MODIFIER_RULES.factions[factionId] ?? []) : []),
    ...(detachmentId ? (MODIFIER_RULES.detachments[detachmentId] ?? []) : []),
  ]
  allRuleSources.forEach(r => allRulesMap.set(r.id, r.effect))

  for (const { id } of applicableRules) {
    if (!activeIds.has(id)) continue
    const e = allRulesMap.get(id)
    if (!e) continue

    if (e.hitMod)              mods.hitMod              += e.hitMod
    if (e.rerollHitsOf1)       mods.rerollHitsOf1        = true
    if (e.rerollAllHits)       mods.rerollAllHits         = true
    if (e.critThreshold !== undefined) mods.critThreshold = Math.min(mods.critThreshold, e.critThreshold)
    if (e.sustainedHitsBonus)  mods.sustainedHitsBonus  += e.sustainedHitsBonus
    if (e.lethalHitsBonus)     mods.lethalHitsBonus      = true
    if (e.strengthMod)         mods.strengthMod         += e.strengthMod
    if (e.rerollWoundsOf1)     mods.rerollWoundsOf1      = true
    if (e.rerollAllWounds)     mods.rerollAllWounds      = true
    if (e.woundMod)            mods.woundMod            += e.woundMod
    if (e.apMod)               mods.apMod               += e.apMod
    if (e.saveMod)             mods.saveMod             += e.saveMod
    if (e.feelNoPainThreshold !== undefined && e.feelNoPainThreshold !== null) {
      mods.feelNoPainThreshold = mods.feelNoPainThreshold === null
        ? e.feelNoPainThreshold
        : Math.min(mods.feelNoPainThreshold, e.feelNoPainThreshold)
    }
  }

  return mods
}
