// Fuente: Dark Heresy 1ª Edición — Capítulo 2: Carreras

export interface CareerRank {
  name: string
  minXp: number
  maxXp: number
}

export interface CareerDefinition {
  key: string
  label: string
  ranks: CareerRank[]
}

export const CAREERS: CareerDefinition[] = [
  {
    key: 'adept',
    label: 'Adepto',
    ranks: [
      { name: 'Novicio',              minXp: 0,     maxXp: 499  },
      { name: 'Archivista',           minXp: 500,   maxXp: 999  },
      { name: 'Savant',               minXp: 1000,  maxXp: 1999 },
      { name: 'Lexmecánico',          minXp: 2000,  maxXp: 2999 },
      { name: 'Senior Savant',        minXp: 3000,  maxXp: 4999 },
      { name: 'Scholar Primus',       minXp: 5000,  maxXp: 7499 },
      { name: 'Archivista Mayor',     minXp: 7500,  maxXp: 9999 },
      { name: 'Magister Scholae',     minXp: 10000, maxXp: Infinity },
    ],
  },
  {
    key: 'arbitrator',
    label: 'Arbitrador',
    ranks: [
      { name: 'Probador',             minXp: 0,     maxXp: 499  },
      { name: 'Arbitrador',           minXp: 500,   maxXp: 999  },
      { name: 'Investigador',         minXp: 1000,  maxXp: 1999 },
      { name: 'Proctor',              minXp: 2000,  maxXp: 2999 },
      { name: 'Justicar',             minXp: 3000,  maxXp: 4999 },
      { name: 'Marshal',              minXp: 5000,  maxXp: 7499 },
      { name: 'Provost Marshal',      minXp: 7500,  maxXp: 9999 },
      { name: 'Quaesitor',            minXp: 10000, maxXp: Infinity },
    ],
  },
  {
    key: 'assassin',
    label: 'Asesino',
    ranks: [
      { name: 'Aprendiz',             minXp: 0,     maxXp: 499  },
      { name: 'Cazador',              minXp: 500,   maxXp: 999  },
      { name: 'Sicario',              minXp: 1000,  maxXp: 1999 },
      { name: 'Vindicador',           minXp: 2000,  maxXp: 2999 },
      { name: 'Ejecutor',             minXp: 3000,  maxXp: 4999 },
      { name: 'Predador',             minXp: 5000,  maxXp: 7499 },
      { name: 'Cazador de Sombras',   minXp: 7500,  maxXp: 9999 },
      { name: 'Muerte Fantasmal',     minXp: 10000, maxXp: Infinity },
    ],
  },
  {
    key: 'cleric',
    label: 'Clérigo',
    ranks: [
      { name: 'Acólito',              minXp: 0,     maxXp: 499  },
      { name: 'Confesor',             minXp: 500,   maxXp: 999  },
      { name: 'Misionero',            minXp: 1000,  maxXp: 1999 },
      { name: 'Predicador',           minXp: 2000,  maxXp: 2999 },
      { name: 'Paladín',              minXp: 3000,  maxXp: 4999 },
      { name: 'Arcoflagelante',       minXp: 5000,  maxXp: 7499 },
      { name: 'Exorcista',            minXp: 7500,  maxXp: 9999 },
      { name: 'Prelado',              minXp: 10000, maxXp: Infinity },
    ],
  },
  {
    key: 'guardsman',
    label: 'Guardia Imperial',
    ranks: [
      { name: 'Recluta',              minXp: 0,     maxXp: 499  },
      { name: 'Soldado',              minXp: 500,   maxXp: 999  },
      { name: 'Veterano',             minXp: 1000,  maxXp: 1999 },
      { name: 'Especialista',         minXp: 2000,  maxXp: 2999 },
      { name: 'Sargento',             minXp: 3000,  maxXp: 4999 },
      { name: 'Sargento de Hierro',   minXp: 5000,  maxXp: 7499 },
      { name: 'Capitán de Guerra',    minXp: 7500,  maxXp: 9999 },
      { name: 'Lord Militante',       minXp: 10000, maxXp: Infinity },
    ],
  },
  {
    key: 'psyker',
    label: 'Psyker Imperial',
    ranks: [
      { name: 'Psyker Sancionado',    minXp: 0,     maxXp: 499  },
      { name: 'Adivinador',           minXp: 500,   maxXp: 999  },
      { name: 'Vidente',              minXp: 1000,  maxXp: 1999 },
      { name: 'Telepata',             minXp: 2000,  maxXp: 2999 },
      { name: 'Clarívidente',         minXp: 3000,  maxXp: 4999 },
      { name: 'Maestro Psyker',       minXp: 5000,  maxXp: 7499 },
      { name: 'Oráculo',              minXp: 7500,  maxXp: 9999 },
      { name: 'Primaris Psyker',      minXp: 10000, maxXp: Infinity },
    ],
  },
  {
    key: 'scum',
    label: 'Escoria',
    ranks: [
      { name: 'Raterillo',            minXp: 0,     maxXp: 499  },
      { name: 'Bribón',               minXp: 500,   maxXp: 999  },
      { name: 'Contrabandista',       minXp: 1000,  maxXp: 1999 },
      { name: 'Pícaro',               minXp: 2000,  maxXp: 2999 },
      { name: 'Gánster',              minXp: 3000,  maxXp: 4999 },
      { name: 'Señor del Crimen',     minXp: 5000,  maxXp: 7499 },
      { name: 'Leyenda Urbana',       minXp: 7500,  maxXp: 9999 },
      { name: 'Maestro del Hampa',    minXp: 10000, maxXp: Infinity },
    ],
  },
  {
    key: 'techpriest',
    label: 'Tech-Priest',
    ranks: [
      { name: 'Tecnógrafo',           minXp: 0,     maxXp: 499  },
      { name: 'Electro-Sacerdote',    minXp: 500,   maxXp: 999  },
      { name: 'Mago',                 minXp: 1000,  maxXp: 1999 },
      { name: 'Enginseer',            minXp: 2000,  maxXp: 2999 },
      { name: 'Mago Senior',          minXp: 3000,  maxXp: 4999 },
      { name: 'Archimago',            minXp: 5000,  maxXp: 7499 },
      { name: 'Magos Dominus',        minXp: 7500,  maxXp: 9999 },
      { name: 'Fabricador',           minXp: 10000, maxXp: Infinity },
    ],
  },
]

export function getCareerRank(career: CareerDefinition, xpSpent: number): CareerRank {
  return career.ranks.find(r => xpSpent >= r.minXp && xpSpent <= r.maxXp) ?? career.ranks[0]
}
