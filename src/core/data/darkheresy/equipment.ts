// Fuente: Dark Heresy 1ª Edición — Capítulo de Equipamiento

export type EquipmentCategory =
  | 'pistola'
  | 'basica'
  | 'pesada'
  | 'cac'
  | 'lanzadora'
  | 'armadura'
  | 'equipo'
  | 'medicinal'

export interface CatalogWeapon {
  kind: 'weapon'
  id: string
  name: string
  category: Exclude<EquipmentCategory, 'armadura' | 'equipo' | 'medicinal'>
  cls: string
  dmgType: string
  range: string
  rof: string
  dmg: string
  pen: number
  clip: string
  notes: string
}

export interface CatalogArmor {
  kind: 'armor'
  id: string
  name: string
  category: 'armadura'
  notes: string
  head: number
  body: number
  arms: number
  legs: number
}

export interface CatalogGear {
  kind: 'gear'
  id: string
  name: string
  category: 'equipo' | 'medicinal'
  description: string
}

export type CatalogItem = CatalogWeapon | CatalogArmor | CatalogGear

export const CATALOG: CatalogItem[] = [
  // ── PISTOLAS ──────────────────────────────────────────────────────────────
  {
    kind: 'weapon', id: 'laspistol', name: 'Las Pistol', category: 'pistola',
    cls: 'Pistola', dmgType: 'E', range: '30m', rof: 'S/2/-', dmg: '1d10+2 E',
    pen: 0, clip: '30', notes: 'Recargable',
  },
  {
    kind: 'weapon', id: 'autopistol', name: 'Autopistol', category: 'pistola',
    cls: 'Pistola', dmgType: 'I', range: '30m', rof: 'S/-/6', dmg: '1d10+2 I',
    pen: 0, clip: '18', notes: '',
  },
  {
    kind: 'weapon', id: 'stub-auto', name: 'Stub Automatic', category: 'pistola',
    cls: 'Pistola', dmgType: 'I', range: '30m', rof: 'S/3/-', dmg: '1d10+3 I',
    pen: 0, clip: '9', notes: '',
  },
  {
    kind: 'weapon', id: 'bolt-pistol', name: 'Bolt Pistol', category: 'pistola',
    cls: 'Pistola', dmgType: 'X', range: '30m', rof: 'S/2/-', dmg: '1d10+5 X',
    pen: 4, clip: '8', notes: 'Tearing',
  },
  {
    kind: 'weapon', id: 'hand-cannon', name: 'Hand Cannon', category: 'pistola',
    cls: 'Pistola', dmgType: 'I', range: '35m', rof: 'S/-/-', dmg: '1d10+4 I',
    pen: 2, clip: '5', notes: '',
  },
  {
    kind: 'weapon', id: 'inferno-pistol', name: 'Inferno Pistol', category: 'pistola',
    cls: 'Pistola', dmgType: 'E', range: '10m', rof: 'S/-/-', dmg: '2d10+4 E',
    pen: 12, clip: '3', notes: 'Melta',
  },

  // ── BÁSICAS ───────────────────────────────────────────────────────────────
  {
    kind: 'weapon', id: 'lasgun', name: 'Lasgun', category: 'basica',
    cls: 'Básica', dmgType: 'E', range: '100m', rof: 'S/3/-', dmg: '1d10+3 E',
    pen: 0, clip: '60', notes: 'Recargable',
  },
  {
    kind: 'weapon', id: 'autogun', name: 'Autogun', category: 'basica',
    cls: 'Básica', dmgType: 'I', range: '90m', rof: 'S/3/10', dmg: '1d10+3 I',
    pen: 0, clip: '30', notes: '',
  },
  {
    kind: 'weapon', id: 'shotgun', name: 'Shotgun', category: 'basica',
    cls: 'Básica', dmgType: 'I', range: '30m', rof: 'S/-/-', dmg: '1d10+4 I',
    pen: 0, clip: '2', notes: 'Scatter',
  },
  {
    kind: 'weapon', id: 'boltgun', name: 'Boltgun', category: 'basica',
    cls: 'Básica', dmgType: 'X', range: '90m', rof: 'S/3/-', dmg: '1d10+5 X',
    pen: 4, clip: '24', notes: 'Tearing',
  },
  {
    kind: 'weapon', id: 'hellgun', name: 'Hellgun', category: 'basica',
    cls: 'Básica', dmgType: 'E', range: '110m', rof: 'S/3/-', dmg: '1d10+4 E',
    pen: 7, clip: '30', notes: '',
  },
  {
    kind: 'weapon', id: 'flamer', name: 'Flamer', category: 'lanzadora',
    cls: 'Básica', dmgType: 'E', range: '20m', rof: 'S/-/-', dmg: '1d10+4 E',
    pen: 2, clip: '6', notes: 'Flame, Spray',
  },

  // ── PESADAS ───────────────────────────────────────────────────────────────
  {
    kind: 'weapon', id: 'heavy-bolter', name: 'Heavy Bolter', category: 'pesada',
    cls: 'Pesada', dmgType: 'X', range: '150m', rof: '-/2/10', dmg: '2d10+5 X',
    pen: 4, clip: '60', notes: 'Tearing',
  },
  {
    kind: 'weapon', id: 'lascannon', name: 'Lascannon', category: 'pesada',
    cls: 'Pesada', dmgType: 'E', range: '300m', rof: 'S/-/-', dmg: '5d10+10 E',
    pen: 10, clip: '5', notes: '',
  },
  {
    kind: 'weapon', id: 'multi-laser', name: 'Multi-Laser', category: 'pesada',
    cls: 'Pesada', dmgType: 'E', range: '150m', rof: '-/3/10', dmg: '2d10+3 E',
    pen: 2, clip: '100', notes: 'Recargable',
  },

  // ── CaC ───────────────────────────────────────────────────────────────────
  {
    kind: 'weapon', id: 'knife', name: 'Knife', category: 'cac',
    cls: 'CaC', dmgType: 'R', range: '-', rof: '-', dmg: '1d5+SB R',
    pen: 0, clip: '-', notes: '',
  },
  {
    kind: 'weapon', id: 'sword', name: 'Sword', category: 'cac',
    cls: 'CaC', dmgType: 'R', range: '-', rof: '-', dmg: '1d10+SB R',
    pen: 0, clip: '-', notes: '',
  },
  {
    kind: 'weapon', id: 'club', name: 'Club', category: 'cac',
    cls: 'CaC', dmgType: 'I', range: '-', rof: '-', dmg: '1d10+SB I',
    pen: 0, clip: '-', notes: '',
  },
  {
    kind: 'weapon', id: 'mono-sword', name: 'Mono Sword', category: 'cac',
    cls: 'CaC', dmgType: 'R', range: '-', rof: '-', dmg: '1d10+SB R',
    pen: 2, clip: '-', notes: '',
  },
  {
    kind: 'weapon', id: 'chainsword', name: 'Chainsword', category: 'cac',
    cls: 'CaC', dmgType: 'R', range: '-', rof: '-', dmg: '1d10+2+SB R',
    pen: 2, clip: '-', notes: 'Tearing',
  },
  {
    kind: 'weapon', id: 'power-sword', name: 'Power Sword', category: 'cac',
    cls: 'CaC', dmgType: 'E', range: '-', rof: '-', dmg: '1d10+5 E',
    pen: 5, clip: '-', notes: 'Power Field',
  },
  {
    kind: 'weapon', id: 'axe', name: 'Axe', category: 'cac',
    cls: 'CaC', dmgType: 'R', range: '-', rof: '-', dmg: '1d10+1+SB R',
    pen: 0, clip: '-', notes: '',
  },

  // ── ARMADURAS ─────────────────────────────────────────────────────────────
  {
    kind: 'armor', id: 'piel', name: 'Piel Endurecida',
    category: 'armadura', notes: 'Armadura básica improvisada',
    head: 1, body: 1, arms: 1, legs: 1,
  },
  {
    kind: 'armor', id: 'flak', name: 'Flak Jacket',
    category: 'armadura', notes: 'Armadura estándar de la Guardia Imperial',
    head: 2, body: 3, arms: 2, legs: 2,
  },
  {
    kind: 'armor', id: 'guard-flak', name: 'Guard Flak Armour',
    category: 'armadura', notes: 'Armadura completa de la Guardia Imperial',
    head: 3, body: 4, arms: 3, legs: 3,
  },
  {
    kind: 'armor', id: 'mesh', name: 'Mesh Armour',
    category: 'armadura', notes: 'Tejido de malla submolecular',
    head: 4, body: 4, arms: 4, legs: 4,
  },
  {
    kind: 'armor', id: 'carapace-light', name: 'Carapace (Ligera)',
    category: 'armadura', notes: 'Placas de caparazón parciales',
    head: 0, body: 5, arms: 4, legs: 4,
  },
  {
    kind: 'armor', id: 'carapace', name: 'Carapace Armour',
    category: 'armadura', notes: 'Armadura de caparazón completa',
    head: 6, body: 6, arms: 6, legs: 6,
  },
  {
    kind: 'armor', id: 'power-armor', name: 'Power Armour',
    category: 'armadura', notes: 'Armadura potenciada del Adeptus Astartes',
    head: 8, body: 10, arms: 8, legs: 8,
  },

  // ── EQUIPO GENERAL ────────────────────────────────────────────────────────
  {
    kind: 'gear', id: 'auspex', name: 'Auspex / Scanner',
    category: 'equipo', description: '+20 a tiradas de Búsqueda. Detecta formas de vida y fuentes de calor a 50m.',
  },
  {
    kind: 'gear', id: 'comm-bead', name: 'Comm-bead',
    category: 'equipo', description: 'Dispositivo de comunicaciones de corto alcance (1km en zonas abiertas).',
  },
  {
    kind: 'gear', id: 'data-slate', name: 'Data-slate',
    category: 'equipo', description: 'Tableta electrónica para almacenar y consultar información.',
  },
  {
    kind: 'gear', id: 'photo-visor', name: 'Photo-visor',
    category: 'equipo', description: 'Visor de amplificación de luz. Ignora penalizadores por oscuridad.',
  },
  {
    kind: 'gear', id: 'respirator', name: 'Rebreather',
    category: 'equipo', description: 'Filtro respiratorio. Inmune a gases y atmósferas tóxicas moderadas.',
  },
  {
    kind: 'gear', id: 'grapnel', name: 'Grapnel',
    category: 'equipo', description: 'Garfio con cable. Facilita la escalada y el movimiento vertical.',
  },
  {
    kind: 'gear', id: 'rope', name: 'Cuerda (15m)',
    category: 'equipo', description: 'Cuerda estándar de 15 metros.',
  },
  {
    kind: 'gear', id: 'torch', name: 'Luminador',
    category: 'equipo', description: 'Linterna reglamentaria. Ilumina un área de 30m.',
  },
  {
    kind: 'gear', id: 'chrono', name: 'Chrono',
    category: 'equipo', description: 'Reloj Imperial estándar.',
  },
  {
    kind: 'gear', id: 'pict-recorder', name: 'Pict-captor',
    category: 'equipo', description: 'Cámara Imperial para capturar imágenes y vídeo.',
  },
  {
    kind: 'gear', id: 'stummer', name: 'Stummer',
    category: 'equipo', description: '+30 a tiradas de Sigilo cuando está activo.',
  },
  {
    kind: 'gear', id: 'clip-harness', name: 'Arnés de Escalada',
    category: 'equipo', description: 'Arnés de seguridad para trabajos en altura.',
  },
  {
    kind: 'gear', id: 'rations', name: 'Raciones (1 semana)',
    category: 'equipo', description: 'Raciones de campaña de la Guardia Imperial para una semana.',
  },
  {
    kind: 'gear', id: 'lho-sticks', name: 'Lho-sticks',
    category: 'equipo', description: 'Cigarrillos narcóticos imperiales. Calman los nervios.',
  },
  {
    kind: 'gear', id: 'sacred-unguents', name: 'Ungüentos Sagrados',
    category: 'equipo', description: 'Aceites rituales del Mechanicus. +10 a Uso de Tecnología en una tirada.',
  },
  {
    kind: 'gear', id: 'seal', name: 'Sello Imperial',
    category: 'equipo', description: 'Sello de autoridad del Inquisidor. Otorga acceso a zonas restringidas.',
  },

  // ── MEDICINAL ─────────────────────────────────────────────────────────────
  {
    kind: 'gear', id: 'medicae-kit', name: 'Botiquín Medicae',
    category: 'medicinal', description: '+30 a tiradas de Medicina. Permite curación en campo.',
  },
  {
    kind: 'gear', id: 'stimm', name: 'Estimulantes',
    category: 'medicinal', description: 'Ignora penalizadores de heridas 1 asalto. Riesgo de adicción.',
  },
  {
    kind: 'gear', id: 'de-tox', name: 'De-tox',
    category: 'medicinal', description: 'Purga venenos y toxinas del sistema. Uso único.',
  },
  {
    kind: 'gear', id: 'frenzon', name: 'Frenzon',
    category: 'medicinal', description: '+20 Fuerza, +10 Resistencia. Frenzied 1d10 asaltos. Riesgo de adicción.',
  },
]

export const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  pistola:  'Pistolas',
  basica:   'Básicas',
  pesada:   'Pesadas',
  cac:      'CaC',
  lanzadora: 'Lanzadoras',
  armadura: 'Armadura',
  equipo:   'Equipo',
  medicinal: 'Medicinal',
}
