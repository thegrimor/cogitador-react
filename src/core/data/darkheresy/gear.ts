export interface GearDefinition {
  name: string
  category: string
  notes: string
}

export const GEAR: GearDefinition[] = [
  { name: 'Venda',                    category: 'Médico',       notes: '' },
  { name: 'Botiquín',                 category: 'Médico',       notes: '' },
  { name: 'Antitoxina',               category: 'Médico',       notes: '' },
  { name: 'Narcosina',                category: 'Médico',       notes: '' },
  { name: 'Mecánica Básica',          category: 'Herramientas', notes: '' },
  { name: 'Mecánica Avanzada',        category: 'Herramientas', notes: '' },
  { name: 'Combiherramienta',         category: 'Herramientas', notes: '' },
  { name: 'Auspex',                   category: 'Equipo',       notes: '' },
  { name: 'Unidad Cogitator',         category: 'Equipo',       notes: '' },
  { name: 'Comunicador',              category: 'Equipo',       notes: '' },
  { name: 'Ganzúas',                  category: 'Equipo',       notes: '' },
  { name: 'Raciones',                 category: 'Consumible',   notes: '' },
  { name: 'Cuerda',                   category: 'Suministros',  notes: '' },
  { name: 'Cinta Adhesiva Reforzada', category: 'Suministros',  notes: '' },
  { name: 'Luz Química',              category: 'Suministros',  notes: '' },
  { name: 'Linterna',                 category: 'Suministros',  notes: '' },
  { name: 'Explosivos Demolición',    category: 'Armas',        notes: '' },
  { name: 'Granada Frag',             category: 'Armas',        notes: '' },
  { name: 'Granada Stun',             category: 'Armas',        notes: '' },
]
