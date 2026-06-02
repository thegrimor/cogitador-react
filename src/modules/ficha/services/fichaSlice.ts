import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  FichaState, Character, FallenCharacter, AttributeValues, XpLogEntry,
  Skill, Talent, Weapon, Armor, GearItem,
  Mechadendrite, Augmentation, PsychicPower, CustomCurrency, InquisidorTalent,
} from '../types/fichaTypes'
import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function buildDefaultAttrs() {
  return Object.fromEntries(
    ATTRIBUTES.map(a => [a.key, { base: 0, advances: 0, bonuses: 0, bonusNote: '' }])
  )
}

function buildDefaultCharacter(info: Character['info']): Character {
  return {
    id: uid(),
    info: { ...info, experience: info.experience || '0', xpSpent: info.xpSpent || '0' },
    attrs: buildDefaultAttrs(),
    wounds: { current: 0, max: 0 },
    fate:   { current: 0, max: 0 },
    xpLog:  [],
    filterCareer: false,
    insanity: 0,
    corruption: 0,
    skills: [],
    talents: [],
    weapons: [],
    armors: [],
    gear: [],
    mechadendrites: [],
    augmentations: [],
    powers: [],
    psychFactor: 0,
    psychBV: 0,
    psychDiscipline: '',
    psychNotes: '',
    moneyThrones: 0,
    currencies: [],
    quickNotes: '',
    influenceGeneral: '',
    influencePlanetary: '',
    inqTalents: [],
  }
}

const initialState: FichaState = {
  characters: [],
  activeCharacterId: null,
  fallen: [],
}

export const fichaSlice = createSlice({
  name: 'ficha',
  initialState,
  reducers: {
    addCharacter(state, action: PayloadAction<Pick<Character, 'info'>>) {
      const newChar = buildDefaultCharacter(action.payload.info)
      state.characters.push(newChar)
      if (!state.activeCharacterId) state.activeCharacterId = newChar.id
    },

    importCharacter(state, action: PayloadAction<Character>) {
      state.characters.push(action.payload)
      state.activeCharacterId = action.payload.id
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

    updateWounds(state, action: PayloadAction<{ id: string; field: 'current' | 'max'; value: number }>) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.wounds[action.payload.field] = action.payload.value
    },

    updateFate(state, action: PayloadAction<{ id: string; field: 'current' | 'max'; value: number }>) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char.fate[action.payload.field] = action.payload.value
    },

    updateVital(
      state,
      action: PayloadAction<{ id: string; field: 'insanity' | 'corruption'; value: number }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (char) char[action.payload.field] = Math.min(100, Math.max(0, action.payload.value))
    },

    addXpEntry(state, action: PayloadAction<{ id: string; entry: Omit<XpLogEntry, 'id' | 'date'> }>) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (!char) return
      const entry: XpLogEntry = {
        id: uid(), date: new Date().toLocaleDateString('es-ES'), ...action.payload.entry,
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

    // — Skills —
    addSkill(state, action: PayloadAction<{ charId: string; skill: Omit<Skill, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.skills.push({ id: uid(), ...action.payload.skill })
    },
    updateSkill(state, action: PayloadAction<{ charId: string; skill: Skill }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      const idx = char.skills.findIndex(s => s.id === action.payload.skill.id)
      if (idx !== -1) char.skills[idx] = action.payload.skill
    },
    removeSkill(state, action: PayloadAction<{ charId: string; skillId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.skills = char.skills.filter(s => s.id !== action.payload.skillId)
    },

    // — Talents —
    addTalent(state, action: PayloadAction<{ charId: string; talent: Omit<Talent, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.talents.push({ id: uid(), ...action.payload.talent })
    },
    removeTalent(state, action: PayloadAction<{ charId: string; talentId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.talents = char.talents.filter(t => t.id !== action.payload.talentId)
    },

    // — Weapons —
    addWeapon(state, action: PayloadAction<{ charId: string; weapon: Omit<Weapon, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.weapons.push({ id: uid(), ...action.payload.weapon })
    },
    removeWeapon(state, action: PayloadAction<{ charId: string; weaponId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.weapons = char.weapons.filter(w => w.id !== action.payload.weaponId)
    },

    // — Armor —
    addArmor(state, action: PayloadAction<{ charId: string; armor: Omit<Armor, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.armors.push({ id: uid(), ...action.payload.armor })
    },
    removeArmor(state, action: PayloadAction<{ charId: string; armorId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.armors = char.armors.filter(a => a.id !== action.payload.armorId)
    },

    // — Gear —
    addGear(state, action: PayloadAction<{ charId: string; item: Omit<GearItem, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.gear.push({ id: uid(), ...action.payload.item })
    },
    removeGear(state, action: PayloadAction<{ charId: string; itemId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.gear = char.gear.filter(g => g.id !== action.payload.itemId)
    },

    // — Mechadendrites —
    addMechadendrite(state, action: PayloadAction<{ charId: string; mech: Omit<Mechadendrite, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.mechadendrites.push({ id: uid(), ...action.payload.mech })
    },
    removeMechadendrite(state, action: PayloadAction<{ charId: string; mechId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.mechadendrites = char.mechadendrites.filter(m => m.id !== action.payload.mechId)
    },

    // — Augmentations —
    addAugmentation(state, action: PayloadAction<{ charId: string; aug: Omit<Augmentation, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.augmentations.push({ id: uid(), ...action.payload.aug })
    },
    removeAugmentation(state, action: PayloadAction<{ charId: string; augId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.augmentations = char.augmentations.filter(a => a.id !== action.payload.augId)
    },

    // — Psychic Powers —
    addPower(state, action: PayloadAction<{ charId: string; power: Omit<PsychicPower, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.powers.push({ id: uid(), ...action.payload.power })
    },
    removePower(state, action: PayloadAction<{ charId: string; powerId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.powers = char.powers.filter(p => p.id !== action.payload.powerId)
    },

    updatePsychic(
      state,
      action: PayloadAction<{ charId: string; field: 'psychFactor' | 'psychBV' | 'psychDiscipline' | 'psychNotes'; value: string | number }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) (char as Record<string, unknown>)[action.payload.field] = action.payload.value
    },

    // — Resources —
    updateMoney(state, action: PayloadAction<{ charId: string; thrones: number }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.moneyThrones = action.payload.thrones
    },
    addCurrency(state, action: PayloadAction<{ charId: string; currency: CustomCurrency }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.currencies.push(action.payload.currency)
    },
    updateCurrency(state, action: PayloadAction<{ charId: string; idx: number; currency: CustomCurrency }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.currencies[action.payload.idx] = action.payload.currency
    },
    removeCurrency(state, action: PayloadAction<{ charId: string; idx: number }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.currencies.splice(action.payload.idx, 1)
    },

    updateNotes(
      state,
      action: PayloadAction<{ charId: string; field: 'quickNotes' | 'influenceGeneral' | 'influencePlanetary'; value: string }>
    ) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char[action.payload.field] = action.payload.value
    },

    // — Inquisidor —
    addInqTalent(state, action: PayloadAction<{ charId: string; talent: Omit<InquisidorTalent, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.inqTalents.push({ id: uid(), ...action.payload.talent })
    },
    removeInqTalent(state, action: PayloadAction<{ charId: string; talentId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.inqTalents = char.inqTalents.filter(t => t.id !== action.payload.talentId)
    },

    deleteCharacter(state, action: PayloadAction<string>) {
      state.characters = state.characters.filter(c => c.id !== action.payload)
      if (state.activeCharacterId === action.payload) {
        state.activeCharacterId = state.characters[0]?.id ?? null
      }
    },

    toggleFilterCareer(state, action: PayloadAction<string>) {
      const char = state.characters.find(c => c.id === action.payload)
      if (char) char.filterCareer = !char.filterCareer
    },

    killCharacter(state, action: PayloadAction<string>) {
      const idx = state.characters.findIndex(c => c.id === action.payload)
      if (idx === -1) return
      const char = state.characters[idx]
      const fallen: FallenCharacter = {
        ...char,
        diedAt: new Date().toLocaleDateString('es-ES'),
        xpInherited: Math.floor((parseInt(char.info.experience) || 0) * 0.5),
      }
      state.fallen.push(fallen)
      state.characters.splice(idx, 1)
      if (state.activeCharacterId === action.payload) {
        state.activeCharacterId = state.characters[0]?.id ?? null
      }
    },
  },
})

export const {
  addCharacter, importCharacter, selectCharacter, updateCharInfo,
  updateAttribute, updateWounds, updateFate, updateVital,
  addXpEntry, removeXpEntry,
  addSkill, updateSkill, removeSkill,
  addTalent, removeTalent,
  addWeapon, removeWeapon,
  addArmor, removeArmor,
  addGear, removeGear,
  addMechadendrite, removeMechadendrite,
  addAugmentation, removeAugmentation,
  addPower, removePower, updatePsychic,
  updateMoney, addCurrency, updateCurrency, removeCurrency,
  updateNotes,
  addInqTalent, removeInqTalent,
  deleteCharacter, toggleFilterCareer, killCharacter,
} = fichaSlice.actions

export default fichaSlice.reducer
