import type {
  Character,
  AttributeValues,
  Skill,
  Talent,
  Weapon,
  Armor,
  GearItem,
  Mechadendrite,
  Augmentation,
  PsychicPower,
  CustomCurrency,
} from '../types/fichaTypes'
import { ATTRIBUTES } from '@/core/data/darkheresy'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function asString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  return fallback
}

function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    return isNaN(n) ? fallback : n
  }
  return fallback
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

function buildDefaultAttrs(): Record<string, AttributeValues> {
  return Object.fromEntries(
    ATTRIBUTES.map(a => [a.key, { base: 0, advances: 0, bonuses: 0, bonusNote: '' }])
  )
}

export function isLegacyExport(raw: unknown): boolean {
  if (typeof raw !== 'object' || raw === null) return false
  const r = raw as Record<string, unknown>
  const attrs = r['attrs']
  if (typeof attrs !== 'object' || attrs === null) return false
  const ws = (attrs as Record<string, unknown>)['WS']
  if (typeof ws !== 'object' || ws === null) return false
  return 'dots' in (ws as object)
}

export function mapLegacyHtmlToCharacter(raw: unknown): Character {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid import: not an object')
  }

  const r = raw as Record<string, unknown>

  const charInfo = (typeof r['char'] === 'object' && r['char'] !== null)
    ? (r['char'] as Record<string, unknown>)
    : {}

  const rawCareer = asString(r['career'])
  const careerParts = rawCareer.split('|')
  const rank = careerParts.length > 0 ? careerParts[0].trim() : ''
  const career = asString(charInfo['acolito'] ?? r['profession'])

  const attrs: Record<string, AttributeValues> = buildDefaultAttrs()
  const rawAttrs = (typeof r['attrs'] === 'object' && r['attrs'] !== null)
    ? (r['attrs'] as Record<string, unknown>)
    : {}

  for (const key of ATTRIBUTES.map(a => a.key)) {
    const raw = rawAttrs[key]
    if (typeof raw === 'object' && raw !== null) {
      const attrRaw = raw as Record<string, unknown>
      attrs[key] = {
        base: asNumber(attrRaw['base']),
        advances: asNumber(attrRaw['dots'] ?? attrRaw['advances']),
        bonuses: asNumber(attrRaw['bonuses']),
        bonusNote: asString(attrRaw['bonusNote']),
      }
    }
  }

  const wounds = (typeof r['wounds'] === 'object' && r['wounds'] !== null)
    ? (r['wounds'] as Record<string, unknown>)
    : {}

  const fate = (typeof r['fate'] === 'object' && r['fate'] !== null)
    ? (r['fate'] as Record<string, unknown>)
    : {}

  const rawSkills = asArray<Record<string, unknown>>(r['skills'])
  const skills: Skill[] = rawSkills.map(s => ({
    id: asString(s['id']) || uid(),
    name: asString(s['name']),
    attr: asString(s['attr'], 'Int'),
    level: asNumber(s['level']),
    bonus: asNumber(s['bonus']),
    notes: asString(s['notes']),
    xp: asNumber(s['xp']),
  }))

  const rawTalents = asArray<Record<string, unknown>>(r['talents'])
  const talents: Talent[] = rawTalents.map(t => ({
    id: asString(t['id']) || uid(),
    name: asString(t['name']),
    type: asString(t['type'], 'Combat'),
    req: asString(t['req']),
    desc: asString(t['desc']),
    effect: asString(t['effect']),
    xp: asNumber(t['xp']),
  }))

  const rawWeapons = asArray<Record<string, unknown>>(r['weapons'])
  const weapons: Weapon[] = rawWeapons.map(w => ({
    id: asString(w['id']) || uid(),
    name: asString(w['name']),
    cls: asString(w['cls'], 'Básica'),
    dmgType: asString(w['dmgType'], 'I'),
    range: asString(w['range']),
    rof: asString(w['rof']),
    dmg: asString(w['dmg']),
    pen: asNumber(w['pen']),
    clip: asString(w['clip']),
    notes: asString(w['notes']),
  }))

  const rawArmors = asArray<Record<string, unknown>>(r['armors'])
  const armors: Armor[] = rawArmors.map(a => ({
    id: asString(a['id']) || uid(),
    name: asString(a['name']),
    notes: asString(a['notes']),
    head: asNumber(a['head']),
    body: asNumber(a['body']),
    arms: asNumber(a['arms']),
    legs: asNumber(a['legs']),
  }))

  const rawGear = asArray<Record<string, unknown>>(r['gear'])
  const gear: GearItem[] = rawGear.map(g => ({
    id: asString(g['id']) || uid(),
    name: asString(g['name']),
    qty: asNumber(g['qty'], 1),
    notes: asString(g['notes']),
  }))

  const rawMechs = asArray<Record<string, unknown>>(r['mechadendrites'])
  const mechadendrites: Mechadendrite[] = rawMechs.map(m => ({
    id: asString(m['id']) || uid(),
    name: asString(m['name']),
    type: asString(m['type']),
    desc: asString(m['desc']),
    abilities: asString(m['abilities']),
  }))

  const rawAugs = asArray<Record<string, unknown>>(r['augmentations'])
  const augmentations: Augmentation[] = rawAugs.map(a => ({
    id: asString(a['id']) || uid(),
    name: asString(a['name']),
    loc: asString(a['loc']),
    desc: asString(a['desc']),
    bonus: asString(a['bonus']),
  }))

  const rawPowers = asArray<Record<string, unknown>>(r['powers'])
  const powers: PsychicPower[] = rawPowers.map(p => ({
    id: asString(p['id']) || uid(),
    name: asString(p['name']),
    disc: asString(p['disc'], 'menor'),
    umbral: asNumber(p['umbral']),
    conc: asString(p['conc']),
    mant: asString(p['mant'], 'No'),
    alcance: asString(p['alcance']),
    desc: asString(p['desc']),
  }))

  const rawCurrencies = asArray<Record<string, unknown>>(r['currencies'])
  const currencies: CustomCurrency[] = rawCurrencies.map(c => ({
    name: asString(c['name']),
    amount: asNumber(c['amount']),
  }))

  const xpTotal = asNumber(r['xpTotal'])

  return {
    id: uid(),
    info: {
      name: asString(charInfo['name']),
      rank,
      career,
      homeworld: asString(charInfo['homeworld']),
      experience: xpTotal > 0 ? String(xpTotal) : '0',
      xpSpent: '0',
    },
    attrs,
    wounds: {
      current: asNumber((wounds as Record<string, unknown>)['current']),
      max: asNumber((wounds as Record<string, unknown>)['max']),
    },
    fate: {
      current: asNumber((fate as Record<string, unknown>)['current']),
      max: asNumber((fate as Record<string, unknown>)['max']),
    },
    xpLog: [],
    filterCareer: false,
    insanity: asNumber(r['insanity']),
    corruption: asNumber(r['corruption']),
    skills,
    talents,
    weapons,
    armors,
    gear,
    mechadendrites,
    augmentations,
    powers,
    psychFactor: asNumber(r['psychFactor']),
    psychBV: asNumber(r['psychBV']),
    psychDiscipline: asString(r['psychDiscipline']),
    psychNotes: asString(r['psychNotes']),
    moneyThrones: asNumber(r['moneyThrones']),
    currencies,
    quickNotes: asString(r['quickNotes']),
    influenceGeneral: asString(r['influenceGeneral']),
    influencePlanetary: asString(r['influencePlanetary']),
  }
}
