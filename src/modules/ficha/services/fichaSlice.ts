import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  FichaState, Character, FallenCharacter, AttributeValues, XpLogEntry,
  Skill, Talent, Weapon, Armor, GearItem,
  Mechadendrite, Augmentation, PsychicPower, CustomCurrency, InqMejora, PariahMejora,
} from '../types/fichaTypes'
import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { normalizeName } from '@/core/data/darkheresy/careers'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function buildDefaultAttrs() {
  return Object.fromEntries(
    ATTRIBUTES.map(a => [a.key, { base: 0, dots: 0, bonuses: 0, bonusNote: '' }])
  )
}

/**
 * wounds.max = woundsBase + nº de talentos Robusto (cada uno da +1 Herida, sin límite en 1ª ed.).
 * Personajes persistidos antes de `woundsBase` no lo tienen (undefined) — se estima una vez a
 * partir del wounds.max ya guardado, restando los Robustos que ya tuvieran.
 */
function syncWoundsMax(char: Character) {
  const robustos = char.talents.filter(t => normalizeName(t.name) === 'robusto').length
  if (char.woundsBase == null) char.woundsBase = Math.max(0, (char.wounds.max || 0) - robustos)
  char.wounds.max = char.woundsBase + robustos
}

function buildDefaultCharacter(info: Character['info']): Character {
  return {
    id: uid(),
    info: {
      ...info,
      experience: info.experience || '0',
      xpSpent: info.xpSpent || '0',
      role: info.role || 'sequito',
      ordo: info.ordo || '',
      counterpart: info.counterpart || '',
      branch: info.branch || '',
      subclass: info.subclass || '',
    },
    attrs: buildDefaultAttrs(),
    wounds: { current: 0, max: 0 },
    woundsBase: 0,
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
    inqMejoras: [],
    pariahMejoras: [],
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
      const role = action.payload.info.role
      // Modelo de 2 slots fijos: un Inquisidor y un Séquito, nunca dos del mismo rol
      if (role && state.characters.some(c => c.info.role === role)) return
      const newChar = buildDefaultCharacter(action.payload.info)
      state.characters.push(newChar)
      state.activeCharacterId = newChar.id
    },

    /**
     * Modelo de 2 slots fijos (como el HTML legacy: PJ0=Inquisidor, PJ1=Séquito):
     * no hay flujo de "crear personaje", los 2 slots existen siempre. Se invoca al
     * montar la app para rellenar el/los que falten (instalación nueva o estado
     * persistido antes de este modelo) con un personaje en blanco.
     */
    ensureBothSlots(state) {
      const roles: Array<'inquisidor' | 'sequito'> = ['inquisidor', 'sequito']
      for (const role of roles) {
        if (state.characters.some(c => c.info.role === role)) continue
        const blank = buildDefaultCharacter({
          name: '', rank: '1', career: '', homeworld: '',
          experience: '0', xpSpent: '0', role, ordo: '', counterpart: '', branch: '', subclass: '',
        })
        state.characters.push(blank)
      }
      if (!state.activeCharacterId) {
        state.activeCharacterId = state.characters.find(c => c.info.role === 'inquisidor')?.id ?? null
      }
    },

    importCharacter(state, action: PayloadAction<Character>) {
      // Modelo de 2 slots fijos: un personaje importado reemplaza al que ocupe su mismo rol
      const role = action.payload.info.role
      const existingIdx = state.characters.findIndex(c => c.info.role === role)
      if (existingIdx !== -1) state.characters.splice(existingIdx, 1, action.payload)
      else state.characters.push(action.payload)
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

    updateWoundsBase(state, action: PayloadAction<{ id: string; value: number }>) {
      const char = state.characters.find(c => c.id === action.payload.id)
      if (!char) return
      char.woundsBase = Math.max(0, action.payload.value)
      syncWoundsMax(char)
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
      if (!char) return
      char.talents.push({ id: uid(), ...action.payload.talent })
      syncWoundsMax(char)
    },
    removeTalent(state, action: PayloadAction<{ charId: string; talentId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      char.talents = char.talents.filter(t => t.id !== action.payload.talentId)
      syncWoundsMax(char)
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
      // Solo el Séquito puede caer en combate — el Inquisidor no tiene reemplazo
      if (char.info.role !== 'sequito') return
      const xpInherited = parseInt(char.info.experience) || 0
      const fallen: FallenCharacter = {
        ...char,
        diedAt: new Date().toLocaleDateString('es-ES'),
        xpInherited,
      }
      state.fallen.push(fallen)
      state.characters.splice(idx, 1)
      // Nuevo Séquito en blanco que hereda el 100% del PE del caído
      const replacement = buildDefaultCharacter({
        name: '', rank: '1', career: char.info.career, homeworld: '',
        experience: String(xpInherited), xpSpent: '0',
        role: 'sequito', ordo: char.info.ordo, counterpart: char.info.counterpart, branch: '', subclass: '',
      })
      state.characters.push(replacement)
      state.activeCharacterId = replacement.id
    },

    addInqMejora(state, action: PayloadAction<{ charId: string; mejora: Omit<InqMejora, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      if (!char.inqMejoras) char.inqMejoras = [] // personajes persistidos antes de esta migración
      if (char.inqMejoras.some(m => m.name === action.payload.mejora.name)) return
      char.inqMejoras.push({ id: uid(), ...action.payload.mejora })
    },
    removeInqMejora(state, action: PayloadAction<{ charId: string; mejoraId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.inqMejoras = (char.inqMejoras ?? []).filter(m => m.id !== action.payload.mejoraId)
    },
    updateInqMejoraNotes(state, action: PayloadAction<{ charId: string; mejoraId: string; notes: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      const mejora = char?.inqMejoras?.find(m => m.id === action.payload.mejoraId)
      if (mejora) mejora.notes = action.payload.notes
    },

    addPariahMejora(state, action: PayloadAction<{ charId: string; mejora: Omit<PariahMejora, 'id'> }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (!char) return
      if (!char.pariahMejoras) char.pariahMejoras = [] // personajes persistidos antes de esta migración
      if (char.pariahMejoras.some(m => m.name === action.payload.mejora.name)) return
      char.pariahMejoras.push({ id: uid(), ...action.payload.mejora })
    },
    removePariahMejora(state, action: PayloadAction<{ charId: string; mejoraId: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      if (char) char.pariahMejoras = (char.pariahMejoras ?? []).filter(m => m.id !== action.payload.mejoraId)
    },
    updatePariahMejoraNotes(state, action: PayloadAction<{ charId: string; mejoraId: string; notes: string }>) {
      const char = state.characters.find(c => c.id === action.payload.charId)
      const mejora = char?.pariahMejoras?.find(m => m.id === action.payload.mejoraId)
      if (mejora) mejora.notes = action.payload.notes
    },

    // Reemplaza el estado completo — usado por el sync con el backend al hidratar
    // tras login (ver core/sync).
    hydrateFicha(_state, action: PayloadAction<FichaState>) {
      return action.payload
    },

    // Vacía el slice — usado en el borrado total al hacer logout (ver core/store).
    resetFicha() {
      return initialState
    },
  },
})

export const {
  addCharacter, ensureBothSlots, importCharacter, selectCharacter, updateCharInfo,
  updateAttribute, updateWounds, updateWoundsBase, updateFate, updateVital,
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
  deleteCharacter, toggleFilterCareer, killCharacter,
  addInqMejora, removeInqMejora, updateInqMejoraNotes,
  addPariahMejora, removePariahMejora, updatePariahMejoraNotes,
  hydrateFicha, resetFicha,
} = fichaSlice.actions

export default fichaSlice.reducer
