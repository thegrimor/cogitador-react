import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  FichaState, Character, AttributeValues, XpLogEntry,
  Skill, Talent, Weapon, Armor, GearItem, Mechadendrite, Augmentation,
} from '../types/fichaTypes'
import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'

function buildDefaultAttrs() {
  return Object.fromEntries(
    ATTRIBUTES.map(a => [a.key, { base: 0, advances: 0, bonuses: 0, bonusNote: '' }])
  )
}

function buildDefaultCharacter(id: string, name: string): Character {
  return {
    id,
    info: { name, rank: '1', career: '', homeworld: '', experience: '0', xpSpent: '0' },
    attrs: buildDefaultAttrs(),
    wounds: { current: 0, max: 0 },
    fate:   { current: 0, max: 0 },
    xpLog:  [],
    skills: [],
    talents: [],
    weapons: [],
    armors: [],
    gear: [],
    mechadendrites: [],
    augmentations: [],
  }
}

const initialState: FichaState = {
  characters: [
    buildDefaultCharacter('inquisidor', 'Inquisidor'),
    buildDefaultCharacter('sequito',    'Séquito'),
  ],
  activeCharacterId: 'inquisidor',
}

export const fichaSlice = createSlice({
  name: 'ficha',
  initialState,
  reducers: {
    addCharacter(state, action: PayloadAction<Pick<Character, 'info'>>) {
      const newChar: Character = {
        id: Date.now().toString(),
        info: { experience: '0', xpSpent: '0', ...action.payload.info },
        attrs: buildDefaultAttrs(),
        wounds: { current: 0, max: 0 },
        fate:   { current: 0, max: 0 },
        xpLog:  [],
        skills: [],
        talents: [],
        weapons: [],
        armors: [],
        gear: [],
        mechadendrites: [],
        augmentations: [],
      }
      state.characters.push(newChar)
      if (!state.activeCharacterId) state.activeCharacterId = newChar.id
    },

    selectCharacter(state, action: PayloadAction<string>) {
      state.activeCharacterId = action.payload
    },

    updateCharInfo(
      state,
      action: PayloadAction<{ id: string; field: keyof Character['info']; value: string }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.info[action.payload.field] = action.payload.value
    },

    updateAttribute(
      state,
      action: PayloadAction<{ id: string; key: string; field: keyof AttributeValues; value: number | string }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char && char.attrs[action.payload.key]) {
        (char.attrs[action.payload.key] as Record<string, number | string>)[action.payload.field] =
          action.payload.value
      }
    },

    // DH1 costs per advance dot: dot1=100, dot2=250, dot3=500, dot4=750, dot5=1000
    advanceAttribute(
      state,
      action: PayloadAction<{ id: string; key: string; oldDots: number; newDots: number }>
    ) {
      const DOT_COSTS = [100, 250, 500, 750, 1000]
      const char = state.characters.find(c => c.id === action.payload.id)
      if (!char || !char.attrs[action.payload.key]) return

      const { oldDots, newDots } = action.payload
      let xpDelta = 0
      if (newDots > oldDots) {
        for (let i = oldDots; i < newDots; i++) xpDelta += DOT_COSTS[i] ?? 0
      } else {
        for (let i = newDots; i < oldDots; i++) xpDelta -= DOT_COSTS[i] ?? 0
      }

      const currentSpent = parseInt(char.info.xpSpent) || 0
      char.info.xpSpent = Math.max(0, currentSpent + xpDelta).toString()
      char.attrs[action.payload.key].advances = newDots * 10
    },

    updateWounds(
      state,
      action: PayloadAction<{ id: string; field: 'current' | 'max'; value: number }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.wounds[action.payload.field] = action.payload.value
    },

    updateFate(
      state,
      action: PayloadAction<{ id: string; field: 'current' | 'max'; value: number }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.fate[action.payload.field] = action.payload.value
    },

    addXpEntry(
      state,
      action: PayloadAction<{ id: string; entry: Omit<XpLogEntry, 'id' | 'date'> }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (!char) return
      const entry: XpLogEntry = {
        id:   Date.now().toString(),
        date: new Date().toLocaleDateString('es-ES'),
        ...action.payload.entry,
      }
      char.xpLog.unshift(entry)
      const current = parseInt(char.info.experience) || 0
      char.info.experience = (current + entry.amount).toString()
    },

    removeXpEntry(state, action: PayloadAction<{ charId: string; entryId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      const entry = char.xpLog.find(e => e.id === action.payload.entryId)
      if (!entry) return
      char.xpLog = char.xpLog.filter(e => e.id !== action.payload.entryId)
      const current = parseInt(char.info.experience) || 0
      char.info.experience = Math.max(0, current - entry.amount).toString()
    },

    // ── SKILLS ────────────────────────────────────────────────────────────────
    addSkill(state, action: PayloadAction<{ charId: string; skill: Omit<Skill, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.skills.push({ id: Date.now().toString(), ...action.payload.skill })
    },

    removeSkill(state, action: PayloadAction<{ charId: string; skillId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.skills = char.skills.filter(s => s.id !== action.payload.skillId)
    },

    setSkillLevel(state, action: PayloadAction<{ charId: string; skillId: string; level: number }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      const skill = char?.skills.find(s => s.id === action.payload.skillId)
      if (skill) skill.level = Math.min(3, Math.max(0, action.payload.level))
    },

    // ── TALENTS ───────────────────────────────────────────────────────────────
    addTalent(state, action: PayloadAction<{ charId: string; talent: Omit<Talent, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.talents.push({ id: Date.now().toString(), ...action.payload.talent })
    },

    removeTalent(state, action: PayloadAction<{ charId: string; talentId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.talents = char.talents.filter(t => t.id !== action.payload.talentId)
    },

    // ── WEAPONS ───────────────────────────────────────────────────────────────
    addWeapon(state, action: PayloadAction<{ charId: string; weapon: Omit<Weapon, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.weapons.push({ id: Date.now().toString(), ...action.payload.weapon })
    },

    removeWeapon(state, action: PayloadAction<{ charId: string; weaponId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.weapons = char.weapons.filter(w => w.id !== action.payload.weaponId)
    },

    // ── ARMOR ─────────────────────────────────────────────────────────────────
    addArmor(state, action: PayloadAction<{ charId: string; armor: Omit<Armor, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.armors.push({ id: Date.now().toString(), ...action.payload.armor })
    },

    removeArmor(state, action: PayloadAction<{ charId: string; armorId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.armors = char.armors.filter(a => a.id !== action.payload.armorId)
    },

    // ── GEAR ──────────────────────────────────────────────────────────────────
    addGear(state, action: PayloadAction<{ charId: string; item: Omit<GearItem, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.gear.push({ id: Date.now().toString(), ...action.payload.item })
    },

    removeGear(state, action: PayloadAction<{ charId: string; itemId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.gear = char.gear.filter(g => g.id !== action.payload.itemId)
    },

    updateGearQty(state, action: PayloadAction<{ charId: string; itemId: string; qty: number }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      const item = char?.gear.find(g => g.id === action.payload.itemId)
      if (item) item.qty = Math.max(1, action.payload.qty)
    },

    // ── MECHADENDRITES ────────────────────────────────────────────────────────
    addMechadendrite(state, action: PayloadAction<{ charId: string; mecha: Omit<Mechadendrite, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.mechadendrites.push({ id: Date.now().toString(), ...action.payload.mecha })
    },

    removeMechadendrite(state, action: PayloadAction<{ charId: string; mechaId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.mechadendrites = char.mechadendrites.filter(m => m.id !== action.payload.mechaId)
    },

    // ── AUGMENTATIONS ─────────────────────────────────────────────────────────
    addAugmentation(state, action: PayloadAction<{ charId: string; aug: Omit<Augmentation, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.augmentations.push({ id: Date.now().toString(), ...action.payload.aug })
    },

    removeAugmentation(state, action: PayloadAction<{ charId: string; augId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.augmentations = char.augmentations.filter(a => a.id !== action.payload.augId)
    },
  },
})

export const {
  addCharacter,
  selectCharacter,
  updateCharInfo,
  updateAttribute,
  advanceAttribute,
  updateWounds,
  updateFate,
  addXpEntry,
  removeXpEntry,
  addSkill,
  removeSkill,
  setSkillLevel,
  addTalent,
  removeTalent,
  addWeapon,
  removeWeapon,
  addArmor,
  removeArmor,
  addGear,
  removeGear,
  updateGearQty,
  addMechadendrite,
  removeMechadendrite,
  addAugmentation,
  removeAugmentation,
} = fichaSlice.actions

export default fichaSlice.reducer
