// Fuente: Dark Heresy 1ª Edición — Capítulo 4: Habilidades

export interface SkillDefinition {
  key: string
  label: string
  linkedAttribute: string   // WS | BS | S | T | Ag | Int | Per | WP | Fel
  advanced: boolean         // false = básica (uso sin entrenamiento a -20) | true = avanzada (necesita entrenamiento)
  specialisation?: string   // si es una especialización concreta de una habilidad general
}

// ── HABILIDADES BÁSICAS (todo el mundo puede intentar, sin entrenamiento = -20) ──────────────

const BASIC: SkillDefinition[] = [
  { key: 'awareness',        label: 'Awareness',                    linkedAttribute: 'Per', advanced: false },
  { key: 'barter',           label: 'Barter',                       linkedAttribute: 'Fel', advanced: false },
  { key: 'carouse',          label: 'Carouse',                      linkedAttribute: 'T',   advanced: false },
  { key: 'charm',            label: 'Charm',                        linkedAttribute: 'Fel', advanced: false },
  { key: 'climb',            label: 'Climb',                        linkedAttribute: 'S',   advanced: false },
  { key: 'concealment',      label: 'Concealment',                  linkedAttribute: 'Ag',  advanced: false },
  { key: 'contortionist',    label: 'Contortionist',                linkedAttribute: 'Ag',  advanced: false },
  { key: 'deceive',          label: 'Deceive',                      linkedAttribute: 'Fel', advanced: false },
  { key: 'disguise',         label: 'Disguise',                     linkedAttribute: 'Fel', advanced: false },
  { key: 'dodge',            label: 'Dodge',                        linkedAttribute: 'Ag',  advanced: false },
  { key: 'evaluate',         label: 'Evaluate',                     linkedAttribute: 'Int', advanced: false },
  { key: 'gamble',           label: 'Gamble',                       linkedAttribute: 'Int', advanced: false },
  { key: 'inquiry',          label: 'Inquiry',                      linkedAttribute: 'Fel', advanced: false },
  { key: 'intimidate',       label: 'Intimidate',                   linkedAttribute: 'S',   advanced: false },
  { key: 'logic',            label: 'Logic',                        linkedAttribute: 'Int', advanced: false },
  { key: 'scrutiny',         label: 'Scrutiny',                     linkedAttribute: 'Per', advanced: false },
  { key: 'search',           label: 'Search',                       linkedAttribute: 'Per', advanced: false },
  { key: 'silent-move',      label: 'Silent Move',                  linkedAttribute: 'Ag',  advanced: false },
  { key: 'swim',             label: 'Swim',                         linkedAttribute: 'S',   advanced: false },
  // Drive (especializable)
  { key: 'drive-ground',     label: 'Drive (Ground Vehicle)',       linkedAttribute: 'Ag',  advanced: false, specialisation: 'Ground Vehicle'   },
  { key: 'drive-skimmer',    label: 'Drive (Skimmer)',              linkedAttribute: 'Ag',  advanced: false, specialisation: 'Skimmer'          },
  { key: 'drive-walker',     label: 'Drive (Walker)',               linkedAttribute: 'Ag',  advanced: false, specialisation: 'Walker'           },
  // Common Lore (especializable)
  { key: 'cl-administratum', label: 'Common Lore (Administratum)', linkedAttribute: 'Int', advanced: false, specialisation: 'Administratum'    },
  { key: 'cl-ecclesiarchy',  label: 'Common Lore (Ecclesiarchy)',  linkedAttribute: 'Int', advanced: false, specialisation: 'Ecclesiarchy'     },
  { key: 'cl-imperial-creed',label: 'Common Lore (Imperial Creed)',linkedAttribute: 'Int', advanced: false, specialisation: 'Imperial Creed'   },
  { key: 'cl-imperium',      label: 'Common Lore (Imperium)',      linkedAttribute: 'Int', advanced: false, specialisation: 'Imperium'         },
  { key: 'cl-tech',          label: 'Common Lore (Tech)',          linkedAttribute: 'Int', advanced: false, specialisation: 'Tech'             },
  { key: 'cl-underworld',    label: 'Common Lore (Underworld)',    linkedAttribute: 'Int', advanced: false, specialisation: 'Underworld'       },
  { key: 'cl-war',           label: 'Common Lore (War)',           linkedAttribute: 'Int', advanced: false, specialisation: 'War'              },
]

// ── HABILIDADES AVANZADAS (requieren entrenamiento) ───────────────────────────────────────────

const ADVANCED: SkillDefinition[] = [
  { key: 'acrobatics',       label: 'Acrobatics',                   linkedAttribute: 'Ag',  advanced: true },
  { key: 'blather',          label: 'Blather',                      linkedAttribute: 'Fel', advanced: true },
  { key: 'chem-use',         label: 'Chem-Use',                     linkedAttribute: 'Int', advanced: true },
  { key: 'command',          label: 'Command',                      linkedAttribute: 'Fel', advanced: true },
  { key: 'commerce',         label: 'Commerce',                     linkedAttribute: 'Fel', advanced: true },
  { key: 'demolition',       label: 'Demolition',                   linkedAttribute: 'Int', advanced: true },
  { key: 'disguise-adv',     label: 'Disguise (Avanzado)',          linkedAttribute: 'Fel', advanced: true },
  { key: 'heal',             label: 'Heal',                         linkedAttribute: 'Int', advanced: true },
  { key: 'interrogation',    label: 'Interrogation',                linkedAttribute: 'WP',  advanced: true },
  { key: 'invocation',       label: 'Invocation',                   linkedAttribute: 'WP',  advanced: true },
  { key: 'lip-reading',      label: 'Lip Reading',                  linkedAttribute: 'Per', advanced: true },
  { key: 'literacy',         label: 'Literacy',                     linkedAttribute: 'Int', advanced: true },
  { key: 'medicae',          label: 'Medicae',                      linkedAttribute: 'Int', advanced: true },
  { key: 'psyniscience',     label: 'Psyniscience',                 linkedAttribute: 'Per', advanced: true },
  { key: 'security',         label: 'Security',                     linkedAttribute: 'Ag',  advanced: true },
  { key: 'shadowing',        label: 'Shadowing',                    linkedAttribute: 'Ag',  advanced: true },
  { key: 'sleight-of-hand',  label: 'Sleight of Hand',             linkedAttribute: 'Ag',  advanced: true },
  { key: 'survival',         label: 'Survival',                     linkedAttribute: 'Int', advanced: true },
  { key: 'tech-use',         label: 'Tech-Use',                     linkedAttribute: 'Int', advanced: true },
  { key: 'tracking',         label: 'Tracking',                     linkedAttribute: 'Int', advanced: true },
  { key: 'wrangling',        label: 'Wrangling',                    linkedAttribute: 'Int', advanced: true },
  // Ciphers
  { key: 'ciphers-inq',      label: 'Ciphers (Inquisition)',        linkedAttribute: 'Int', advanced: true, specialisation: 'Inquisition'      },
  { key: 'ciphers-und',      label: 'Ciphers (Underworld)',         linkedAttribute: 'Int', advanced: true, specialisation: 'Underworld'       },
  // Forbidden Lore
  { key: 'fl-cults',         label: 'Forbidden Lore (Cults)',       linkedAttribute: 'Int', advanced: true, specialisation: 'Cults'            },
  { key: 'fl-daemonology',   label: 'Forbidden Lore (Daemonology)', linkedAttribute: 'Int', advanced: true, specialisation: 'Daemonology'      },
  { key: 'fl-heresy',        label: 'Forbidden Lore (Heresy)',      linkedAttribute: 'Int', advanced: true, specialisation: 'Heresy'           },
  { key: 'fl-mutants',       label: 'Forbidden Lore (Mutants)',     linkedAttribute: 'Int', advanced: true, specialisation: 'Mutants'          },
  { key: 'fl-psykers',       label: 'Forbidden Lore (Psykers)',     linkedAttribute: 'Int', advanced: true, specialisation: 'Psykers'          },
  { key: 'fl-warp',          label: 'Forbidden Lore (Warp)',        linkedAttribute: 'Int', advanced: true, specialisation: 'Warp'             },
  { key: 'fl-xenos',         label: 'Forbidden Lore (Xenos)',       linkedAttribute: 'Int', advanced: true, specialisation: 'Xenos'            },
  // Navigation
  { key: 'nav-stellar',      label: 'Navigation (Stellar)',         linkedAttribute: 'Int', advanced: true, specialisation: 'Stellar'          },
  { key: 'nav-surface',      label: 'Navigation (Surface)',         linkedAttribute: 'Int', advanced: true, specialisation: 'Surface'          },
  { key: 'nav-warp',         label: 'Navigation (Warp)',            linkedAttribute: 'Int', advanced: true, specialisation: 'Warp'             },
  // Performer
  { key: 'perf-musician',    label: 'Performer (Musician)',         linkedAttribute: 'Fel', advanced: true, specialisation: 'Musician'         },
  { key: 'perf-singer',      label: 'Performer (Singer)',           linkedAttribute: 'Fel', advanced: true, specialisation: 'Singer'           },
  // Pilot
  { key: 'pilot-civilian',   label: 'Pilot (Civilian Craft)',       linkedAttribute: 'Ag',  advanced: true, specialisation: 'Civilian Craft'   },
  { key: 'pilot-military',   label: 'Pilot (Military Craft)',       linkedAttribute: 'Ag',  advanced: true, specialisation: 'Military Craft'   },
  { key: 'pilot-space',      label: 'Pilot (Spacecraft)',           linkedAttribute: 'Ag',  advanced: true, specialisation: 'Spacecraft'       },
  // Scholastic Lore
  { key: 'sl-astromancy',    label: 'Scholastic Lore (Astromancy)', linkedAttribute: 'Int', advanced: true, specialisation: 'Astromancy'       },
  { key: 'sl-chymistry',     label: 'Scholastic Lore (Chymistry)',  linkedAttribute: 'Int', advanced: true, specialisation: 'Chymistry'        },
  { key: 'sl-cryptology',    label: 'Scholastic Lore (Cryptology)', linkedAttribute: 'Int', advanced: true, specialisation: 'Cryptology'       },
  { key: 'sl-heraldry',      label: 'Scholastic Lore (Heraldry)',   linkedAttribute: 'Int', advanced: true, specialisation: 'Heraldry'         },
  { key: 'sl-legend',        label: 'Scholastic Lore (Legend)',     linkedAttribute: 'Int', advanced: true, specialisation: 'Legend'           },
  { key: 'sl-numerology',    label: 'Scholastic Lore (Numerology)', linkedAttribute: 'Int', advanced: true, specialisation: 'Numerology'       },
  { key: 'sl-occult',        label: 'Scholastic Lore (Occult)',     linkedAttribute: 'Int', advanced: true, specialisation: 'Occult'           },
  { key: 'sl-philosophy',    label: 'Scholastic Lore (Philosophy)', linkedAttribute: 'Int', advanced: true, specialisation: 'Philosophy'       },
  // Secret Tongue
  { key: 'st-tech',          label: 'Secret Tongue (Tech)',         linkedAttribute: 'Int', advanced: true, specialisation: 'Tech'             },
  { key: 'st-underworld',    label: 'Secret Tongue (Underworld)',   linkedAttribute: 'Int', advanced: true, specialisation: 'Underworld'       },
  { key: 'st-military',      label: 'Secret Tongue (Military)',     linkedAttribute: 'Int', advanced: true, specialisation: 'Military'         },
  // Speak Language
  { key: 'lang-high-gothic', label: 'Speak Language (High Gothic)', linkedAttribute: 'Int', advanced: true, specialisation: 'High Gothic'      },
  { key: 'lang-low-gothic',  label: 'Speak Language (Low Gothic)',  linkedAttribute: 'Int', advanced: true, specialisation: 'Low Gothic'       },
  { key: 'lang-eldar',       label: 'Speak Language (Eldar)',       linkedAttribute: 'Int', advanced: true, specialisation: 'Eldar'            },
  { key: 'lang-ork',         label: 'Speak Language (Ork)',         linkedAttribute: 'Int', advanced: true, specialisation: 'Ork'              },
  // Trade
  { key: 'trade-armourer',   label: 'Trade (Armourer)',             linkedAttribute: 'Int', advanced: true, specialisation: 'Armourer'         },
  { key: 'trade-chymist',    label: 'Trade (Chymist)',              linkedAttribute: 'Int', advanced: true, specialisation: 'Chymist'          },
  { key: 'trade-cook',       label: 'Trade (Cook)',                 linkedAttribute: 'Int', advanced: true, specialisation: 'Cook'             },
  { key: 'trade-technomat',  label: 'Trade (Technomat)',            linkedAttribute: 'Int', advanced: true, specialisation: 'Technomat'        },
  { key: 'trade-voidfarer',  label: 'Trade (Voidfarer)',            linkedAttribute: 'Int', advanced: true, specialisation: 'Voidfarer'        },
]

export const SKILLS: SkillDefinition[] = [
  ...BASIC,
  ...ADVANCED,
].sort((a, b) => a.label.localeCompare(b.label))
