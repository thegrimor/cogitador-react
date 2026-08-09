import { SKILLS, type SkillDefinition } from './skills'

export interface MasterSkillDef {
  name: string
  /**
   * Prefijos (en minúsculas) de nombres de habilidad que sustituye esta Habilidad Maestra
   * (Ascension, Tabla 4-1 — ver docs/fuentes-manual.md). Un prefijo terminado en "(" cubre
   * cualquier especialidad de ese grupo (p.ej. 'saber académico (' cubre todos los Saber
   * académico); el resto son nombres exactos de habilidad.
   */
  covers: string[]
}

export const MASTER_SKILLS: MasterSkillDef[] = [
  { name: 'Maestría Académica', covers: ['lógica', 'saber académico ('] },
  { name: 'Maestría Actuando en las Sombras', covers: ['disfraz', 'engañar', 'seguridad', 'trucos de manos'] },
  { name: 'Maestría Atlética', covers: ['acrobacia', 'contorsionismo', 'esquivar', 'nadar', 'trepar'] },
  { name: 'Maestría en Carisma', covers: ['carisma', 'charlatanería', 'mando'] },
  { name: 'Maestría en Comercio', covers: ['negociar', 'oficio (mercader)', 'tasar'] },
  { name: 'Maestría en Conducir', covers: ['conducir ('] },
  { name: 'Maestría en Conocimiento de la Disformidad', covers: ['invocación', 'psinisciencia', 'saber prohibido (disformidad)'] },
  { name: 'Maestría en Conocimiento Tecnológico', covers: ['competencia química', 'competencia tecnológica', 'demolición', 'medicae'] },
  { name: 'Maestría Criptológica', covers: ['código (', 'lengua secreta ('] },
  { name: 'Maestría en Decadencia', covers: ['actuar', 'actuar (', 'aguante', 'jugar'] },
  { name: 'Maestría en Investigación', covers: ['indagar', 'interrogar', 'intimidar'] },
  {
    name: 'Maestría Lingüística',
    covers: [
      'hablar idioma (dialecto tribal)', 'hablar idioma (gótico clásico)',
      'hablar idioma (gótico vulgar)', 'hablar idioma (dialecto nave)',
      'leer/escribir', 'leer labios',
    ],
  },
  { name: 'Maestría en Maniobras', covers: ['navegación (superficie)', 'rastrear', 'supervivencia', 'trato animal'] },
  { name: 'Maestría en Observación', covers: ['buscar', 'escrutinio', 'perspicacia'] },
  { name: 'Maestría en Pilotar', covers: ['navegación (estelar)', 'pilotar ('] },
  { name: 'Maestría en Saber Popular', covers: ['saber popular ('] },
  { name: 'Maestría en Saber Prohibido', covers: ['saber prohibido ('] },
  { name: 'Maestría en Sigilo', covers: ['esconderse', 'movimiento silencioso', 'seguimiento'] },
]

function matches(skillName: string, cover: string): boolean {
  return cover.endsWith('(') ? skillName.startsWith(cover) : skillName === cover
}

/** Habilidad Maestra ya adquirida (por nombre en inqMejoras) que cubre esta habilidad, si alguna. */
export function findCoveringMasterSkill(skillName: string, ownedMejoraNames: Set<string>): MasterSkillDef | undefined {
  const normalized = skillName.toLowerCase().trim()
  return MASTER_SKILLS.find(m => ownedMejoraNames.has(m.name) && m.covers.some(c => matches(normalized, c)))
}

/** Definiciones del libro (`SKILLS`) que sustituye esta Habilidad Maestra — para darlas de alta a Maestro al comprarla. */
export function getCoveredSkills(master: MasterSkillDef): SkillDefinition[] {
  return SKILLS.filter(s => master.covers.some(c => matches(s.name.toLowerCase(), c)))
}
