import type { ModifierRule, ModifierRules } from '@/types'

// Universal rules — injected by ModifierPanel regardless of faction/detachment
export const UNIVERSAL_ATTACKER_RULES: ModifierRule[] = [
  {
    id: 'weapon_heavy',
    label: 'Heavy — sin mover esta ronda (+1 BS)',
    appliesTo: 'ranged',
    side: 'attacker',
    effect: { hitMod: 1 },
  },
]

export const UNIVERSAL_DEFENDER_RULES: ModifierRule[] = [
  {
    id: 'universal_cover',
    label: 'En cobertura (+1 Sv)',
    appliesTo: 'ranged',
    side: 'defender',
    effect: { saveMod: 1 },
  },
]

// Rules verified from Abilities.csv and Detachment_abilities.csv
export const MODIFIER_RULES: ModifierRules = {
  factions: {

    // ── Space Marines ─────────────────────────────────────────────────────────
    'SM': [
      {
        id: 'sm_oath_hits',
        label: 'Oath of Moment — relanzar impactos',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllHits: true },
      },
      {
        // Some SM Codex detachments add +1 to wound via Oath
        id: 'sm_oath_wounds',
        label: 'Oath of Moment — +1 a herir (destacamento Codex)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],

    // ── Adeptus Mechanicus ────────────────────────────────────────────────────
    // Doctrina Imperatives: each round choose Protector (ranged) or Conqueror (melee)
    // Protector: +1 BS + all ranged weapons gain [HEAVY] (so stationary = another +1 BS)
    // Conqueror: +1 WS + if BATTLELINE nearby, +1 AP on all attacks
    'AdM': [
      {
        id: 'adm_protector',
        label: 'Protector Imperative — +1 BS (disparo)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'adm_protector_heavy',
        label: 'Protector — sin mover (+1 BS extra, Heavy)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'adm_conqueror',
        label: 'Conqueror Imperative — +1 WS (CàC)',
        appliesTo: 'melee', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'adm_conqueror_ap',
        label: 'Conqueror — +1 AP (si hay BATTLELINE cercana)',
        appliesTo: 'all', side: 'attacker',
        effect: { apMod: 1 },
      },
    ],

    // ── Adeptus Custodes ──────────────────────────────────────────────────────
    // Martial Ka'tah: choose one stance each time the unit is selected to fight
    'AC': [
      {
        id: 'ac_katah_dacatarai',
        label: "Ka'tah Dacatarai — Sustained Hits 1 (CàC)",
        appliesTo: 'melee', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
      {
        id: 'ac_katah_rendax',
        label: "Ka'tah Rendax — Lethal Hits (CàC)",
        appliesTo: 'melee', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
    ],

    // ── Tyranids ──────────────────────────────────────────────────────────────
    // Synapse: while within 6" of a Synapse model, +1 S to melee attacks
    'TYR': [
      {
        id: 'tyr_synapse',
        label: 'Sinapsis — +1 F en CàC (en rango de sinapsis)',
        appliesTo: 'melee', side: 'attacker',
        effect: { strengthMod: 1 },
      },
    ],

    // ── Death Guard ───────────────────────────────────────────────────────────
    // Nurgle's Gift (aura): enemies within Contagion Range are Afflicted: -1 T
    // + choose one plague: Rattlejoint Ague = worsen enemy Save by 1
    'DG': [
      {
        id: 'dg_contagion_t',
        label: "Nurgle's Gift — -1 T enemigo (en rango de contagio)",
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
      {
        id: 'dg_contagion_sv',
        label: "Nurgle's Gift — Rattlejoint Ague (salv. enemiga -1)",
        appliesTo: 'all', side: 'attacker',
        effect: { saveMod: -1 },
      },
    ],

    // ── Chaos Space Marines ───────────────────────────────────────────────────
    // Dark Pacts: units can make a Dark Pact → choose [LETHAL HITS] or [SUSTAINED HITS 1]
    'CSM': [
      {
        id: 'csm_dark_pact_lethal',
        label: 'Dark Pacts — Lethal Hits (pacto oscuro)',
        appliesTo: 'all', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
      {
        id: 'csm_dark_pact_sustained',
        label: 'Dark Pacts — Sustained Hits 1 (pacto oscuro)',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],

    // ── World Eaters ──────────────────────────────────────────────────────────
    // Blessings of Khorne: Martial Excellence = Sustained Hits 1, Warp Blades = Lethal Hits
    'WE': [
      {
        id: 'we_blessings_sustained',
        label: 'Blessings of Khorne — Martial Excellence (Sustained Hits 1)',
        appliesTo: 'melee', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
      {
        id: 'we_blessings_lethal',
        label: 'Blessings of Khorne — Warp Blades (Lethal Hits)',
        appliesTo: 'melee', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
    ],

    // ── Thousand Sons ─────────────────────────────────────────────────────────
    // Cabal of Sorcerers: re-roll Hit roll of 1; on 10+ Leadership also available
    'TS': [
      {
        id: 'ts_cabal_hits',
        label: 'Cabal of Sorcerers — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],

    // ── T'au Empire ───────────────────────────────────────────────────────────
    // No universal faction combat modifier; buffs come from detachments
    'TAU': [],

    // ── Necrons ───────────────────────────────────────────────────────────────
    // No universal faction combat modifier; buffs come from detachments
    'NEC': [],

    // ── Orks ──────────────────────────────────────────────────────────────────
    // No universal faction rule that cleanly maps; WAAAGH! is declared per-battle-round
    // and covered per-detachment
    'ORK': [],

    // ── Aeldari ───────────────────────────────────────────────────────────────
    // Battle Focus: Advance+shoot, not a hit/wound modifier
    'AE': [],

    // ── Astra Militarum ───────────────────────────────────────────────────────
    // Orders system — too complex for a simple toggle; handled per-detachment
    'AM': [],

    // ── Adepta Sororitas ──────────────────────────────────────────────────────
    'AS': [],

    // ── Genestealer Cults ─────────────────────────────────────────────────────
    // Synapse shared with TYR
    'GC': [
      {
        id: 'gc_synapse',
        label: 'Sinapsis — +1 F en CàC (en rango de sinapsis)',
        appliesTo: 'melee', side: 'attacker',
        effect: { strengthMod: 1 },
      },
    ],

    // ── Grey Knights ──────────────────────────────────────────────────────────
    'GK': [],

    // ── Drukhari ─────────────────────────────────────────────────────────────
    // Power from Pain is phase-based; covered by detachments
    'DRU': [],

    // ── Leagues of Votann ─────────────────────────────────────────────────────
    // Prioritised Efficiency / Judgement tokens — +1 Hit possible
    'LoV': [
      {
        id: 'lov_judgement_hit',
        label: 'Judgement Token — +1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],

    // ── Chaos Daemons ─────────────────────────────────────────────────────────
    'CD': [],

    // ── Emperor's Children ────────────────────────────────────────────────────
    // No universal faction rule — Kakophoni abilities are unit-specific
    'EC': [],

    // ── Imperial Knights ──────────────────────────────────────────────────────
    // Code Chivalric: re-roll one Hit and one Wound roll
    'QI': [
      {
        id: 'qi_chivalric_hit',
        label: 'Code Chivalric — relanzar un dado a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
      {
        id: 'qi_chivalric_wound',
        label: 'Code Chivalric — relanzar un dado a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
    ],

    // ── Chaos Knights ─────────────────────────────────────────────────────────
    // Harbingers of Dread: +1 Wound vs Battle-shocked
    'QT': [
      {
        id: 'qt_dread_wound',
        label: 'Harbingers of Dread — +1 a herir (enemigo Battle-shocked)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],

    // ── Agents of the Imperium ────────────────────────────────────────────────
    'AoI': [],
  },

  detachments: {

    // ── Adeptus Mechanicus ─────────────────────────────────────────────────────
    '000001143': [ // Eradication Cohort
      // Murderous Imperative: conditional on active Doctrina
      {
        id: 'eradication_prot_hits',
        label: 'Eradication Cohort (con Protector) — relanzar 1 a impactar',
        appliesTo: 'ranged', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
      {
        id: 'eradication_conq_wounds',
        label: 'Eradication Cohort (con Conqueror) — relanzar 1 a herir',
        appliesTo: 'melee', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
    ],
    '000000913': [ // Response Clade
      // Procedural Elimination: each round choose ranged or melee; SKITARII re-roll Hit 1
      {
        id: 'response_hits_ranged',
        label: 'Response Clade — relanzar 1 a impactar (disparo)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
      {
        id: 'response_hits_melee',
        label: 'Response Clade — relanzar 1 a impactar (CàC)',
        appliesTo: 'melee', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000000822': [ // Explorator Maniple
      {
        id: 'explorator_wounds',
        label: 'Explorator Maniple — relanzar 1 a herir (cerca del objetivo)',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
    ],
    '000000984': [ // Haloscreed Battle Clade
      // Noospheric Transference gives HALO OVERRIDE; one override option is Predation Protocols
      // The crit-5+ for Haloscreed is via a specific stratagem/ability; no direct detachment crit-5+ found in CSV
      // Leaving empty pending further verification
    ],

    // ── Adeptus Custodes ──────────────────────────────────────────────────────
    '000000765': [ // Shield Host
      // Martial Mastery: choose each round — crit on 5+ OR +1 AP for melee
      {
        id: 'shield_crit5',
        label: 'Shield Host — crítico en 5+ (CàC)',
        appliesTo: 'melee', side: 'attacker',
        effect: { critThreshold: 5 },
      },
      {
        id: 'shield_ap1',
        label: 'Shield Host — +1 AP (CàC)',
        appliesTo: 'melee', side: 'attacker',
        effect: { apMod: 1 },
      },
    ],
    '000001029': [ // Lions of the Emperor
      // Against All Odds: +1 Hit AND +1 Wound if no friendly units within 6"
      {
        id: 'lions_hit1',
        label: 'Lions of the Emperor — +1 a impactar (sin aliados cercanos)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'lions_wound1',
        label: 'Lions of the Emperor — +1 a herir (sin aliados cercanos)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000000863': [ // Auric Champions
      {
        id: 'auric_wound1',
        label: 'Auric Champions — +1 a herir (CHARACTER, vs unidad objetivo)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000000910': [ // Black Ship Guardians
      {
        id: 'blackship_reroll1',
        label: 'Black Ship Guardians — relanzar 1 a impactar (vs quarries)',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],

    // ── Space Marines ─────────────────────────────────────────────────────────
    '000000793': [ // Anvil Siege Force
      // Shield of the Imperium: INFANTRY/BIKER ranged weapons get [HEAVY]
      // + if Remained Stationary: add 1 to Wound roll
      {
        id: 'anvil_stationary_wound',
        label: 'Anvil Siege Force — +1 a herir (sin mover, disparo)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { woundMod: 1 },
      },
      {
        id: 'anvil_stationary_heavy',
        label: 'Anvil Siege Force — Heavy a disparo (sin mover, +1 BS)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],
    '000000907': [ // Terminator Assault
      {
        id: 'terminator_reroll_wounds',
        label: 'Terminator Assault — relanzar tiradas de herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllWounds: true },
      },
    ],
    '000000834': [ // Unforgiven Task Force
      {
        id: 'unforgiven_wound1',
        label: 'Unforgiven — +1 a herir (Inner Circle)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000001093': [ // Godhammer Assault Force
      {
        id: 'godhammer_hit1',
        label: 'Godhammer — +1 a impactar (desembarcado de transporte)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],
    '000001130': [ // Bastion Task Force
      {
        id: 'bastion_reroll_hits1',
        label: 'Bastion — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000001118': [ // Hammer of Avernii
      {
        id: 'hammer_reroll_wounds1',
        label: 'Hammer of Avernii — relanzar 1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
    ],
    '000000808': [ // Black Spear Task Force
      {
        id: 'blackspear_lethal',
        label: 'Black Spear — Lethal Hits',
        appliesTo: 'all', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
    ],
    '000000798': [ // 1st Company Task Force
      {
        id: 'first_company_reroll_wounds',
        label: '1st Company — relanzar tiradas de herir (vs objetivo jurado)',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllWounds: true },
      },
    ],

    // ── Tyranids ──────────────────────────────────────────────────────────────
    '000000769': [ // Crusher Stampede
      // Enraged Behemoths: +1 Hit and +1 Wound for MONSTER units
      {
        id: 'crusher_hit1',
        label: 'Crusher Stampede — +1 a impactar (MONSTRUO)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'crusher_wound1',
        label: 'Crusher Stampede — +1 a herir (MONSTRUO)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000000773': [ // Synaptic Nexus
      // Synaptic Imperatives: Add 1 to Hit roll (melee)
      {
        id: 'synaptic_nexus_hit',
        label: 'Synaptic Nexus — +1 a impactar (CàC, imperativo sináptico)',
        appliesTo: 'melee', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],

    // ── Chaos Space Marines ───────────────────────────────────────────────────
    '000000867': [ // Veterans of the Long War
      // Focus of Hatred: re-roll Hit roll
      {
        id: 'veterans_reroll_hits',
        label: 'Veterans of the Long War — relanzar impactos',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllHits: true },
      },
    ],
    '000000751': [ // Pactbound Zealots
      // Marks of Chaos: re-roll Hit 1; various marks give lethal/sustained on unmodified 5+
      {
        id: 'pactbound_reroll_hits1',
        label: 'Pactbound Zealots — relanzar 1 a impactar (Marcas del Caos)',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
      {
        id: 'pactbound_lethal5',
        label: 'Pactbound Zealots — crítico en 5+ (Lethal Hits, según marca)',
        appliesTo: 'all', side: 'attacker',
        effect: { critThreshold: 5 },
      },
      {
        id: 'pactbound_sustained',
        label: 'Pactbound Zealots — Sustained Hits 1 (según marca)',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000000869': [ // Renegade Raiders
      {
        id: 'raiders_ap1',
        label: 'Renegade Raiders — +1 AP',
        appliesTo: 'all', side: 'attacker',
        effect: { apMod: 1 },
      },
    ],
    '000000873': [ // Soulforged Warpack
      {
        id: 'soulforged_wound1_ranged',
        label: 'Soulforged Warpack — +1 a herir (disparo)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],

    // ── World Eaters ──────────────────────────────────────────────────────────
    '000001042': [ // Cult of Blood
      // Idols of Khorne: +1 Hit and +1 Wound
      {
        id: 'cult_blood_hit1',
        label: 'Cult of Blood — +1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'cult_blood_wound1',
        label: 'Cult of Blood — +1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],

    // ── Aeldari ───────────────────────────────────────────────────────────────
    '000001020': [ // Guardian Battlehost
      // Defend at All Costs: +1 to Hit if unit/target near objective
      {
        id: 'guardian_hit1',
        label: 'Guardian Battlehost — +1 a impactar (cerca de objetivo)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],
    '000001024': [ // Aspect Host
      // Path of the Warrior: re-roll Hit 1 OR Wound 1 (choose per unit)
      {
        id: 'aspect_reroll_hits1',
        label: 'Aspect Host — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
      {
        id: 'aspect_reroll_wounds1',
        label: 'Aspect Host — relanzar 1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
    ],
    '000001019': [ // Spirit Conclave
      // Shepherds of the Dead: +1 Hit and +1 Wound vs enemy with Vengeful Dead tokens
      {
        id: 'spirit_conclave_hit1',
        label: 'Spirit Conclave — +1 a impactar (WRAITH vs Vengeful Dead)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'spirit_conclave_wound1',
        label: 'Spirit Conclave — +1 a herir (WRAITH vs Vengeful Dead)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000001124': [ // Serpent's Brood
      // Boons of the Brood: [SUSTAINED HITS 1]
      {
        id: 'serpent_sustained1',
        label: "Serpent's Brood — Sustained Hits 1",
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],

    // ── Necrons ───────────────────────────────────────────────────────────────
    '000000756': [ // Awakened Dynasty
      // Command Protocols: add 1 to Hit roll
      {
        id: 'awakened_hit1',
        label: 'Awakened Dynasty — +1 a impactar (Command Protocols)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],
    '000000815': [ // Annihilation Legion
      // Annihilation Protocol: improve AP by 1 for ranged attack vs closest target
      {
        id: 'annihilation_ap1',
        label: 'Annihilation Legion — +1 AP (disparo, vs objetivo más cercano)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { apMod: 1 },
      },
    ],
    '000000816': [ // Canoptek Court
      // Power Matrix: re-roll Hit roll of 1
      {
        id: 'canoptek_reroll_hits1',
        label: 'Canoptek Court — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000000817': [ // Obeisance Phalanx
      // Worthy Foes: add 1 to Wound roll
      {
        id: 'obeisance_wound1',
        label: 'Obeisance Phalanx — +1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000000961': [ // Canoptek Harvesters
      // Retribution Protocols: re-roll Hit roll
      {
        id: 'canoptek_harvesters_reroll_hits',
        label: 'Canoptek Harvesters — relanzar impactos (Retribution Protocols)',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllHits: true },
      },
    ],
    '000000985': [ // Starshatter Arsenal
      // Relentless Onslaught: add 1 to Hit roll
      {
        id: 'starshatter_hit1',
        label: 'Starshatter Arsenal — +1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],

    // ── T'au Empire ───────────────────────────────────────────────────────────
    '000000781': [ // Kauyon
      // Patient Hunter: [SUSTAINED HITS 1]
      {
        id: 'kauyon_sustained1',
        label: 'Kauyon — Sustained Hits 1 (Patient Hunter)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000000845': [ // Mont'ka
      // Killing Blow: [LETHAL HITS]
      {
        id: 'montka_lethal',
        label: "Mont'ka — Lethal Hits (Killing Blow)",
        appliesTo: 'ranged', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
    ],
    '000000847': [ // Kroot Hunting Pack
      // Hunter's Instincts: +1 Hit and +1 Wound
      {
        id: 'kroot_hit1',
        label: 'Kroot Hunting Pack — +1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'kroot_wound1',
        label: 'Kroot Hunting Pack — +1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000000966': [ // Starfire Cadre
      // Markerlight Precision: improve BS by 1 + Sustained Hits 1
      {
        id: 'starfire_bs1',
        label: 'Starfire Cadre — +1 BS (Markerlight Precision)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'starfire_sustained1',
        label: 'Starfire Cadre — Sustained Hits 1',
        appliesTo: 'ranged', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],

    // ── Grey Knights ──────────────────────────────────────────────────────────
    '000000992': [ // Warpbane Task Force
      {
        id: 'warpbane_reroll_hits1',
        label: 'Warpbane Task Force — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000001081': [ // Brotherhood Strike
      {
        id: 'brotherhood_reroll_hits1',
        label: 'Brotherhood Strike — relanzar 1 a impactar y herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true, rerollWoundsOf1: true },
      },
    ],
    '000001083': [ // Banishers
      // Channelled Force: [LETHAL HITS] and [SUSTAINED HITS 1]
      {
        id: 'banishers_lethal',
        label: 'Banishers — Lethal Hits (Channelled Force)',
        appliesTo: 'all', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
      {
        id: 'banishers_sustained1',
        label: 'Banishers — Sustained Hits 1 (Channelled Force)',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],

    // ── Orks ──────────────────────────────────────────────────────────────────
    '000000852': [ // War Horde
      // Get Stuck In: [SUSTAINED HITS 1]
      {
        id: 'war_horde_sustained1',
        label: 'War Horde — Sustained Hits 1 (Get Stuck In, CàC)',
        appliesTo: 'melee', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000001030': [ // More Dakka!
      // Dakka! Dakka! Dakka!: [SUSTAINED HITS 1]
      {
        id: 'more_dakka_sustained1',
        label: 'More Dakka! — Sustained Hits 1',
        appliesTo: 'ranged', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000000853': [ // Da Big Hunt
      // Da Hunt Is On: improve AP by 1
      {
        id: 'big_hunt_ap1',
        label: 'Da Big Hunt — +1 AP',
        appliesTo: 'all', side: 'attacker',
        effect: { apMod: 1 },
      },
    ],

    // ── Astra Militarum ───────────────────────────────────────────────────────
    '000000996': [ // Bridgehead Strike
      // Only the Best: re-roll Hit roll of 1
      {
        id: 'bridgehead_reroll_hits1',
        label: 'Bridgehead Strike — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000001121': [ // Grizzled Company
      {
        id: 'grizzled_reroll_hits1',
        label: 'Grizzled Company — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000001011': [ // Siege Regiment
      {
        id: 'siege_hit1',
        label: 'Siege Regiment — +1 a impactar (desembarcado)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
      {
        id: 'siege_wound1',
        label: 'Siege Regiment — +1 a herir (desembarcado)',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],

    // ── Leagues of Votann ─────────────────────────────────────────────────────
    '000001001': [ // Hearthband
      // Methodical Annihilation: re-roll 1 to wound + improve AP by 1
      {
        id: 'hearthband_reroll_wounds1',
        label: 'Hearthband — relanzar 1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
      {
        id: 'hearthband_ap1',
        label: 'Hearthband — +1 AP',
        appliesTo: 'all', side: 'attacker',
        effect: { apMod: 1 },
      },
    ],
    '000001100': [ // Hearthfyre Arsenal
      {
        id: 'hearthfyre_reroll_hits1',
        label: 'Hearthfyre Arsenal — relanzar 1 a impactar',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000001099': [ // Brandfast Oathband
      // Mobile Sensor Relays: [SUSTAINED HITS 1]
      {
        id: 'brandfast_sustained1',
        label: 'Brandfast Oathband — Sustained Hits 1',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],

    // ── Drukhari ─────────────────────────────────────────────────────────────
    '000000993': [ // Reaper's Wager
      // Callous Competition: re-roll Hit 1 (and additionally when losing: Hit 1 + Wound 1)
      {
        id: 'reapers_reroll_hits1',
        label: "Reaper's Wager — relanzar 1 a impactar",
        appliesTo: 'all', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
    ],
    '000001115': [ // Kabalite Cartel
      // Murderous Agenda: LETHAL HITS vs MONSTER/VEHICLE; SUSTAINED HITS 1 vs INFANTRY/MOUNTED
      {
        id: 'kabalite_lethal',
        label: 'Kabalite Cartel — Lethal Hits (vs MONSTRUO/VEHÍCULO)',
        appliesTo: 'all', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
      {
        id: 'kabalite_sustained1',
        label: 'Kabalite Cartel — Sustained Hits 1 (vs INFANTERÍA/MONTADO)',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000000937': [ // Painbringers
      // Regenerative Agony: Feel No Pain
      {
        id: 'painbringers_fnp',
        label: 'Painbringers — Feel No Pain 6+ (defensor)',
        appliesTo: 'all', side: 'defender',
        effect: { feelNoPainThreshold: 6 },
      },
    ],

    // ── Emperor's Children ────────────────────────────────────────────────────
    '000001034': [ // Peerless Bladesmen
      // Exquisite Swordsmanship: [LETHAL HITS] and [SUSTAINED HITS 1]
      {
        id: 'peerless_lethal',
        label: 'Peerless Bladesmen — Lethal Hits (CàC)',
        appliesTo: 'melee', side: 'attacker',
        effect: { lethalHitsBonus: true },
      },
      {
        id: 'peerless_sustained1',
        label: 'Peerless Bladesmen — Sustained Hits 1 (CàC)',
        appliesTo: 'melee', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000001036': [ // Carnival of Excess
      // Daemonic Empowerment: [SUSTAINED HITS 1] + unmodified Hit 5+ = Critical Hit
      {
        id: 'carnival_sustained1',
        label: 'Carnival of Excess — Sustained Hits 1',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
      {
        id: 'carnival_crit5',
        label: 'Carnival of Excess — crítico en 5+',
        appliesTo: 'all', side: 'attacker',
        effect: { critThreshold: 5 },
      },
    ],
    '000001038': [ // Coterie of the Conceited
      // Internal Rivalries: re-roll Wound roll
      {
        id: 'coterie_reroll_wounds',
        label: 'Coterie of the Conceited — relanzar tiradas de herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllWounds: true },
      },
    ],

    // ── Thousand Sons ─────────────────────────────────────────────────────────
    '000000970': [ // Devoted Thralls
      // Fervent Devotees: [SUSTAINED HITS 1]
      {
        id: 'devoted_sustained1',
        label: 'Devoted Thralls — Sustained Hits 1',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000000983': [ // Hexwarp Thrallband
      // Flow of Magic: re-roll Wound 1 + add 1 to Wound roll
      {
        id: 'hexwarp_reroll_wounds1',
        label: 'Hexwarp Thrallband — relanzar 1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
      {
        id: 'hexwarp_wound1',
        label: 'Hexwarp Thrallband — +1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { woundMod: 1 },
      },
    ],
    '000001065': [ // Warpforged Cabal
      // Warpfire Infusion: re-roll Hit, Wound, Damage
      {
        id: 'warpforged_reroll_hits',
        label: 'Warpforged Cabal — relanzar impactos',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllHits: true },
      },
      {
        id: 'warpforged_reroll_wounds',
        label: 'Warpforged Cabal — relanzar heridas',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllWounds: true },
      },
    ],

    // ── Chaos Daemons ─────────────────────────────────────────────────────────
    '000000997': [ // Legion of Excess
      // Seductive Gambit: re-roll Hit + re-roll Wound 1
      {
        id: 'legion_excess_hits',
        label: 'Legion of Excess — relanzar impactos',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllHits: true },
      },
      {
        id: 'legion_excess_wounds1',
        label: 'Legion of Excess — relanzar 1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
    ],
    '000000998': [ // Scintillating Legion
      // Fates in Flux: re-roll Hit, Wound, or Damage (choose)
      {
        id: 'scintillating_hits',
        label: 'Scintillating Legion — relanzar impactos',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllHits: true },
      },
      {
        id: 'scintillating_wounds',
        label: 'Scintillating Legion — relanzar heridas',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollAllWounds: true },
      },
    ],
    '000000956': [ // Dread Carnival
      // Living Flame: [SUSTAINED HITS 1]
      {
        id: 'dread_carnival_sustained1',
        label: 'Dread Carnival — Sustained Hits 1 (Living Flame)',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],

    // ── Imperial Knights ──────────────────────────────────────────────────────
    '000000988': [ // Questor Forgepact
      // Cogbound Alliance: re-roll Hit 1 (ranged) + re-roll Wound 1
      {
        id: 'forgepact_reroll_hits1',
        label: 'Questor Forgepact — relanzar 1 a impactar (disparo)',
        appliesTo: 'ranged', side: 'attacker',
        effect: { rerollHitsOf1: true },
      },
      {
        id: 'forgepact_reroll_wounds1',
        label: 'Questor Forgepact — relanzar 1 a herir',
        appliesTo: 'all', side: 'attacker',
        effect: { rerollWoundsOf1: true },
      },
    ],
    '000001107': [ // Gate Warden Lance
      // Dauntless Defenders: [SUSTAINED HITS 1]
      {
        id: 'gate_warden_sustained1',
        label: 'Gate Warden Lance — Sustained Hits 1',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000001145': [ // Freeblade Company
      // Knights of Legend: Feel No Pain 6+
      {
        id: 'freeblade_fnp6',
        label: 'Freeblade Company — Feel No Pain 6+ (defensor)',
        appliesTo: 'all', side: 'defender',
        effect: { feelNoPainThreshold: 6 },
      },
    ],

    // ── Genestealer Cults ─────────────────────────────────────────────────────
    '000000884': [ // Host of Ascension
      // A Perfect Ambush: [SUSTAINED HITS 1]
      {
        id: 'host_ascension_sustained1',
        label: 'Host of Ascension — Sustained Hits 1 (A Perfect Ambush)',
        appliesTo: 'all', side: 'attacker',
        effect: { sustainedHitsBonus: 1 },
      },
    ],
    '000000885': [ // Xenocreed Congregation
      // Unquestioning Fanaticism: Feel No Pain 3+
      {
        id: 'xenocreed_fnp3',
        label: 'Xenocreed Congregation — Feel No Pain 3+ (defensor)',
        appliesTo: 'all', side: 'defender',
        effect: { feelNoPainThreshold: 3 },
      },
    ],
    '000001002': [ // Final Day
      // Psionic Parasitism: +1 Hit roll
      {
        id: 'final_day_hit1',
        label: 'Final Day — +1 a impactar (Psionic Parasitism)',
        appliesTo: 'all', side: 'attacker',
        effect: { hitMod: 1 },
      },
    ],
  },
}
