export interface CareerRank {
  rank: string
  pe: string
}

export const CAREERS: string[] = [
  'Tecnosacerdote', 'Adepto', 'Arbitrador', 'Asesino',
  'Clérigo', 'Granuja', 'Guardia Imperial', 'Psíquico Imperial', 'Adepta Sororitas',
]

export const CAREERS_DATA: Record<string, CareerRank[]> = {
  'Tecnosacerdote': [
    { rank: 'Tecnógrafo',               pe: '0-499'         },
    { rank: 'Mecartesano',              pe: '500-999'        },
    { rank: 'Electrosacerdote',         pe: '1.000-1.999'   },
    { rank: 'Visioingeniero',           pe: '2.000-2.999'   },
    { rank: 'Tecnosacerdote',           pe: '3.000-5.999'   },
    { rank: 'Tecnomante',               pe: '6.000-7.999'   },
    { rank: 'Mecadiácono',              pe: '6.000-7.999'   },
    { rank: 'Cibervidente',             pe: '8.000-9.999'   },
    { rank: 'Omniprofeta',              pe: '8.000-9.999'   },
    { rank: 'Magos',                    pe: '10.000-14.999' },
    { rank: 'Magos Errante',            pe: '10.000-14.999' },
    { rank: 'Tecnosacerdote Maestro',   pe: '10.000-14.999' },
    { rank: 'Tecnosacerdote Heroico',   pe: '10.000-14.999' },
  ],
  'Adepto': [
    { rank: 'Archivista',         pe: '0-499'         },
    { rank: 'Amanuense',          pe: '500-999'        },
    { rank: 'Escriba',            pe: '1.000-1.999'   },
    { rank: 'Dictante',           pe: '2.000-2.999'   },
    { rank: 'Quirurgo',           pe: '2.000-2.999'   },
    { rank: 'Erudito',            pe: '3.000-5.999'   },
    { rank: 'Lexógrafo',          pe: '6.000-7.999'   },
    { rank: 'Auditor',            pe: '6.000-7.999'   },
    { rank: 'Maestro del Saber',  pe: '8.000-9.999'   },
    { rank: 'Logista',            pe: '8.000-9.999'   },
    { rank: 'Magister',           pe: '10.000-14.999' },
    { rank: 'Sabio',              pe: '10.000-14.999' },
    { rank: 'Adepto Maestro',     pe: '10.000-14.999' },
    { rank: 'Adepto Heroico',     pe: '10.000-14.999' },
  ],
  'Arbitrador': [
    { rank: 'Cadete',                 pe: '0-499'         },
    { rank: 'Agente',                 pe: '500-999'        },
    { rank: 'Regulador',              pe: '1.000-1.999'   },
    { rank: 'Investigador',           pe: '2.000-2.999'   },
    { rank: 'Arbitrador',             pe: '3.000-5.999'   },
    { rank: 'Procurador',             pe: '6.000-7.999'   },
    { rank: 'Inteligidor',            pe: '6.000-7.999'   },
    { rank: 'Alguacil',               pe: '8.000-9.999'   },
    { rank: 'Magistrado',             pe: '8.000-9.999'   },
    { rank: 'Alguacil Mayor',         pe: '10.000-14.999' },
    { rank: 'Justicia Mayor',         pe: '10.000-14.999' },
    { rank: 'Arbitrador Maestro',     pe: '10.000-14.999' },
    { rank: 'Arbitrador Heroico',     pe: '10.000-14.999' },
  ],
  'Asesino': [
    { rank: 'Acero de alquiler',    pe: '0-499'         },
    { rank: 'Sombra furtiva',       pe: '500-999'        },
    { rank: 'Halcón nocturno',      pe: '1.000-1.999'   },
    { rank: 'Acechador invisible',  pe: '2.000-2.999'   },
    { rank: 'Asesino',              pe: '3.000-5.999'   },
    { rank: 'Adepto de la muerte',  pe: '6.000-7.999'   },
    { rank: 'Asesino fantasma',     pe: '6.000-7.999'   },
    { rank: 'Aniquilador',          pe: '8.000-9.999'   },
    { rank: 'Magnicida',            pe: '8.000-9.999'   },
    { rank: 'Imperator-Mortis',     pe: '10.000-14.999' },
    { rank: 'Asesino palatino',     pe: '10.000-14.999' },
    { rank: 'Asesino Maestro',      pe: '10.000-14.999' },
    { rank: 'Asesino Heroico',      pe: '10.000-14.999' },
  ],
  'Clérigo': [
    { rank: 'Novicio',          pe: '0-499'         },
    { rank: 'Iniciado',         pe: '500-999'        },
    { rank: 'Sacerdote',        pe: '1.000-1.999'   },
    { rank: 'Predicador',       pe: '2.000-2.999'   },
    { rank: 'Clérigo',          pe: '3.000-5.999'   },
    { rank: 'Confesor',         pe: '6.000-7.999'   },
    { rank: 'Exorcista',        pe: '6.000-7.999'   },
    { rank: 'Obispo',           pe: '8.000-9.999'   },
    { rank: 'Fanático',         pe: '8.000-9.999'   },
    { rank: 'Hierofante',       pe: '10.000-14.999' },
    { rank: 'Redencionista',    pe: '10.000-14.999' },
    { rank: 'Clérigo Maestro',  pe: '10.000-14.999' },
    { rank: 'Clérigo Heroico',  pe: '10.000-14.999' },
  ],
  'Granuja': [
    { rank: 'Forajido',          pe: '0-499'         },
    { rank: 'Renegado',          pe: '500-999'        },
    { rank: 'Bribón',            pe: '1.000-1.999'   },
    { rank: 'Sicario',           pe: '2.000-2.999'   },
    { rank: 'Asaltante',         pe: '2.000-2.999'   },
    { rank: 'Mente criminal',    pe: '3.000-5.999'   },
    { rank: 'Arreglador',        pe: '6.000-7.999'   },
    { rank: 'Truhán',            pe: '6.000-7.999'   },
    { rank: 'Charlatán',         pe: '8.000-9.999'   },
    { rank: 'Granuja Maestro',   pe: '8.000-9.999'   },
    { rank: 'Granuja Heroico',   pe: '8.000-9.999'   },
  ],
  'Guardia Imperial': [
    { rank: 'Recluta',                    pe: '0-499'         },
    { rank: 'Guardia',                    pe: '500-999'        },
    { rank: 'Hombre de armas',            pe: '1.000-1.999'   },
    { rank: 'Sargento',                   pe: '2.000-2.999'   },
    { rank: 'Veterano',                   pe: '3.000-5.999'   },
    { rank: 'Veterano de asalto',         pe: '6.000-7.999'   },
    { rank: 'Teniente',                   pe: '6.000-7.999'   },
    { rank: 'Explorador',                 pe: '6.000-7.999'   },
    { rank: 'Soldado de choque',          pe: '8.000-9.999'   },
    { rank: 'Capitán',                    pe: '8.000-9.999'   },
    { rank: 'Tirador de élite',           pe: '8.000-9.999'   },
    { rank: 'Soldado de asalto',          pe: '10.000-14.999' },
    { rank: 'Comandante',                 pe: '10.000-14.999' },
    { rank: 'Francotirador',              pe: '10.000-14.999' },
    { rank: 'Guardia Imperial Maestro',   pe: '10.000-14.999' },
    { rank: 'Guardia Imperial Heroico',   pe: '10.000-14.999' },
  ],
  'Psíquico Imperial': [
    { rank: 'Sancionado',                   pe: '0-499'         },
    { rank: 'Neonato',                      pe: '500-999'        },
    { rank: 'Aspirante',                    pe: '1.000-1.999'   },
    { rank: 'Sabio militante',              pe: '2.000-2.999'   },
    { rank: 'Erudito Materium',             pe: '2.000-2.999'   },
    { rank: 'Suboficial sabio',             pe: '3.000-5.999'   },
    { rank: 'Erudito Medicae',              pe: '3.000-5.999'   },
    { rank: 'Teniente sabio',               pe: '6.000-7.999'   },
    { rank: 'Erudito Arcanum',              pe: '6.000-7.999'   },
    { rank: 'Sabio adjunto',                pe: '8.000-9.999'   },
    { rank: 'Erudito Obscurus',             pe: '8.000-9.999'   },
    { rank: 'Sabio preceptor',              pe: '10.000-14.999' },
    { rank: 'Erudito empíreo',              pe: '10.000-14.999' },
    { rank: 'Psíquico Imperial Maestro',    pe: '10.000-14.999' },
    { rank: 'Psíquico Imperial Heroico',    pe: '10.000-14.999' },
  ],
  'Adepta Sororitas': [
    { rank: 'Novicia',                    pe: '0-499'         },
    { rank: 'Cantus',                     pe: '500-999'        },
    { rank: 'Constantia',                 pe: '1.000-1.999'   },
    { rank: 'Dialogante',                 pe: '2.000-2.999'   },
    { rank: 'Hospitalaria',               pe: '2.000-2.999'   },
    { rank: 'Militante',                  pe: '2.000-2.999'   },
    { rank: 'Famulata',                   pe: '3.000-5.999'   },
    { rank: 'Curial',                     pe: '3.000-5.999'   },
    { rank: 'Elohim',                     pe: '3.000-5.999'   },
    { rank: 'Nuncia',                     pe: '6.000-7.999'   },
    { rank: 'Limosnera',                  pe: '6.000-7.999'   },
    { rank: 'Celeste',                    pe: '6.000-7.999'   },
    { rank: 'Superiora',                  pe: '8.000-9.999'   },
    { rank: 'Legada',                     pe: '10.000-14.999' },
    { rank: 'Adepta Sororitas Maestro',   pe: '10.000-14.999' },
    { rank: 'Adepta Sororitas Heroico',   pe: '10.000-14.999' },
  ],
}

export const XP_TIER_MIN: number[] = [0, 500, 1000, 2000, 3000, 6000, 8000, 10000]

export const ATTR_ADVANCE_COSTS: Record<string, Record<string, Array<number | null>>> = {
  'Tecnosacerdote':    { WS: [250,500,750,1000,1500,2000], BS: [250,500,750,1000,1500,2000], S: [500,750,1000,2500,3000,3500], T: [100,250,500,750,3000,3500], Ag: [500,750,1000,2500,1500,2000], Int: [100,250,500,750,1000,1500], Per: [250,500,750,1000,1000,1500], WP: [100,250,500,750,1000,1500], Fel: [null,null,null,null,1000,1500] },
  'Adepto':            { WS: [500,750,1000,2500,null,null], BS: [250,500,750,1000,null,null], S: [500,750,1000,2500,null,null], T: [500,750,1000,2500,null,null], Ag: [250,500,750,1000,null,null], Int: [100,250,500,500,null,null], Per: [100,250,500,750,null,null], WP: [100,250,500,750,null,null], Fel: [250,500,750,1000,null,null] },
  'Arbitrador':        { WS: [250,500,750,1000,null,null], BS: [100,250,500,750,null,null], S: [500,750,1000,2500,null,null], T: [100,250,500,500,null,null], Ag: [500,750,1000,2500,null,null], Int: [100,250,500,750,null,null], Per: [250,500,750,1000,null,null], WP: [250,500,750,1000,null,null], Fel: [250,500,750,1000,null,null] },
  'Asesino':           { WS: [100,250,500,750,null,null], BS: [100,250,500,750,null,null], S: [500,750,1000,2500,null,null], T: [250,500,750,1000,null,null], Ag: [100,250,500,500,null,null], Int: [250,500,750,1000,null,null], Per: [250,500,750,1000,null,null], WP: [250,500,750,1000,null,null], Fel: [500,750,1000,2500,null,null] },
  'Clérigo':           { WS: [250,500,750,1000,null,null], BS: [500,750,1000,2500,null,null], S: [250,500,750,1000,null,null], T: [250,500,750,1000,null,null], Ag: [250,500,750,1000,null,null], Int: [500,750,1000,2500,null,null], Per: [250,500,750,1000,null,null], WP: [100,250,500,750,null,null], Fel: [100,250,500,750,null,null] },
  'Granuja':           { WS: [250,500,750,1000,null,null], BS: [100,250,500,750,null,null], S: [500,750,1000,2500,null,null], T: [250,500,750,1000,null,null], Ag: [100,250,500,750,null,null], Int: [250,500,750,1000,null,null], Per: [250,500,750,1000,null,null], WP: [500,750,1000,2500,null,null], Fel: [100,250,500,750,null,null] },
  'Guardia Imperial':  { WS: [100,250,500,750,null,null], BS: [100,250,500,750,null,null], S: [100,250,500,500,null,null], T: [250,500,750,1000,null,null], Ag: [250,500,750,1000,null,null], Int: [500,750,1000,2500,null,null], Per: [250,500,750,1000,null,null], WP: [500,750,1000,2500,null,null], Fel: [500,750,1000,2500,null,null] },
  'Psíquico Imperial': { WS: [500,750,1000,2500,null,null], BS: [250,500,750,1000,null,null], S: [250,500,750,1000,null,null], T: [250,500,750,1000,null,null], Ag: [500,750,1000,2500,null,null], Int: [100,250,500,750,null,null], Per: [100,250,500,750,null,null], WP: [100,250,500,750,null,null], Fel: [500,750,1000,2500,null,null] },
  'Adepta Sororitas':  { WS: [250,500,750,1000,null,null], BS: [100,250,500,750,null,null], S: [250,500,750,1000,null,null], T: [250,500,750,1000,null,null], Ag: [250,500,750,1000,null,null], Int: [250,500,750,1000,null,null], Per: [100,250,500,750,null,null], WP: [100,250,500,750,null,null], Fel: [250,500,750,1000,null,null] },
}

export const CAREER_RANKS_DATA: Record<string, Record<string, string[]>> = {
  'Tecnosacerdote': {
    'Tecnógrafo': ['Competencia tecnológica','Conducir (Vehículo terrestre)','Leer/escribir','Lengua secreta (Tecnología)','Lógica','Oficio (Copista)','Oficio (Tallador)','Pilotar (Aeronave civil)','Saber popular (Culto a la máquina)','Saber popular (Tecnologías)','Tasar','Eunuco','Parloteo binario','Realimentación estridente','Recarga rápida','Robusto','Sueño ligero','Toque mecánico','Uso de electroinjerto','Entrenamiento con armas básicas (Láser)','Entrenamiento con armas básicas (Primitivas)','Entrenamiento con armas básicas (PS)','Entrenamiento con armas c/c (Primitivas)','Entrenamiento con pistolas (Láser)','Entrenamiento con pistolas (Primitivas)','Entrenamiento con pistolas (PS)','Entrenamiento con armas arrojadizas (Primitivas)'],
    'Mecartesano': ['Código (Acólito)','Competencia tecnológica','Conducir (Bípode)','Conducir (Vehículo terrestre)','Demolición','Medicae','Oficio (Armero)','Oficio (Herrero)','Oficio (Minero)','Oficio (Tecnómata)','Saber académico (Quimia)','Saber popular (Tecnologías)','Seguridad','Desenfundado rápido','Imitador','Maestro de armas','Mandíbula de hierro','Protocolo (Adeptus Mechanicus)','Recarga de lumen','Robusto','Sentido desarrollado (Vista)','Tiro certero','Descarga de lumen','Lucha a ciegas'],
    'Electrosacerdote': ['Conducir (Aerodeslizador)','Conducir (Bípode)','Conducir (Vehículo terrestre)','Hablar idioma (Gótico clásico)','Leer/escribir','Lengua secreta (Tecnología)','Lógica','Oficio (Constructor)','Saber académico (Numerología)','Saber popular (Credo imperial)','Saber popular (Culto a la máquina)','Saber popular (Imperio)','Saber prohibido (Adeptus Mechanicus)','Auxilio eléctrico','Nervios de acero','Resorte','Robusto','Sentido desarrollado (Oído)','Sentido desarrollado (Tacto)','Tirador excepcional','Uso de mecadendrita (Herramientas)','Entrenamiento con armas básicas (Bólter)','Entrenamiento con armas básicas (Lanzadores)','Entrenamiento con armas c/c (Conmoción)','Entrenamiento con pistolas (Bólter)','Implante lógico','Rayo de lumen','Uso de mecadendrita (Medicae)'],
    'Visioingeniero': ['Competencia química','Conducir (Aerodeslizador)','Conducir (Bípode)','Demolición','Navegación (Estelar)','Navegación (Superficie)','Oficio (Armero)','Oficio (Constructor)','Oficio (Tecnómata)','Pilotar (Aeronave militar)','Saber académico (Astromancia)','Saber académico (Numerología)','Saber académico (Quimia)','Saber popular (Culto a la máquina)','Saber popular (Guerra)','Seguridad','Tasar','Lengua secreta (Acólito)','Perspicacia','Saber popular (Guardia Imperial)','Ambidiestro','Ataque lacerante','Atracción férrica','Cavidad oculta','Combate con dos armas (CaC)','Combate con dos armas (Proyectiles)','Entrenamiento con armas básicas (Lanzallamas)','Entrenamiento con armas pesadas (PS)','Entrenamiento con pistolas (Lanzallamas)','Memoria fotográfica','Resistencia a venenos','Sentido desarrollado (Olfato)','Uso de mecadendrita (Manipulador)','Uso de mecadendrita (Óptica)','Entrenamiento con armas c/c (Sierra)','Resistencia al miedo','Robusto'],
    'Tecnosacerdote': ['Competencia tecnológica','Conducir (Aerodeslizador)','Hablar idioma (Gótico clásico)','Lengua secreta (Tecnología)','Lógica','Oficio (Armero)','Oficio (Constructor)','Oficio (Tecnómata)','Saber académico (Arcaico)','Saber académico (Credo imperial)','Saber académico (Quimia)','Saber popular (Adeptus Mechanicus)','Saber popular (Credo imperial)','Saber popular (Imperio)','Saber popular (Tecnologías)','Saber prohibido (Adeptus Mechanicus)','Saber prohibido (Arcanotecnología)','Seguridad','Ataque veloz','Disparos independientes','Maestría en combate','Maestro de esgrima','Reserva de energía','Rito de pavor','Robusto','Suspensión magnética','Uso de mecadendrita (Arma)','Voz inquietante','Mando','Intimidar','Indagar','Esquivar','Entrenamiento con armas básicas (Fusión)','Entrenamiento con armas básicas (Plasma)','Entrenamiento con armas c/c (Energía)','Entrenamiento con pistolas (Fusión)'],
    'Tecnomante': ['Buscar','Código (Sociedad secreta)','Hablar idioma (Gótico clásico)','Interrogar','Medicae','Saber académico (Burocracia)','Saber académico (Juicio)','Saber popular (Adeptus Arbites)','Saber popular (Credo imperial)','Saber popular (Eclesiarquía)','Saber popular (Imperio)','Tasar','Armadura de desprecio','Bendecir armas','Coraje','Estabilizadores sanguíneos','Impávido','Ortopraxis','Quirurgo experto','Engañar','Entrenamiento con arma exótica (Pistola de agujas)','Entrenamiento con armas arrojadizas (Conmoción)','Robusto'],
    'Mecadiácono': ['Buscar','Demolición','Lengua secreta (Ejército)','Oficio (Apotecario)','Oficio (Cantero)','Oficio (Curtidor)','Oficio (Embalsamador)','Saber académico (Arcaico)','Saber popular (Bajos fondos)','Tasar','Trucos de manos','Bendecir armas','Blanco difícil','Brazos fuertes','Disparo doble','Estabilizadores sanguíneos','Fuego purificador','Golpe doble','Mandíbula de hierro','Disciplina férrea','Engañar','Escrutinio','Indagar','Medicae','Entrenamiento con armas pesadas (Lanzadores)','Entrenamiento con armas pesadas (Láser)','Entrenamiento con armas pesadas (Primitivas)','Robusto'],
    'Cibervidente': ['Buscar','Saber académico (Burocracia)','Saber académico (Juicio)','Saber académico (Leyendas)','Saber académico (Ocultismo)','Saber popular (Adeptus Arbites)','Saber popular (Eclesiarquía)','Saber prohibido (Arcanotecnología)','Saber prohibido (Disformidad)','Engañar','Interrogar','Alma oscura','Disparo doble','Evasivo','Fortaleza mental','Imperturbable','Invocación férrica','Levitación magnética','Potenciadores sanguíneos','Predicción','Protocolo (Administratum)','Reacción rápida','Reflejos rápidos','Resistencia a poderes psíquicos','Tirador de élite','Entrenamiento con armas c/c (Energía)','Robusto'],
    'Omniprofeta': ['Código (Jerga bélica)','Lengua secreta (Administratum)','Lengua secreta (Eclesiarquía)','Negociar','Oficio (Prospector)','Rastrear','Saber académico (Heráldica)','Saber académico (Tactica Imperialis)','Saber popular (Eclesiarquía)','Trucos de manos','Armadura de desprecio','Asalto rabioso','Decadencia','Evasivo','Impávido','Tirador de élite','Engañar','Oficio (Mercader)','Entrenamiento con armas pesadas (Fusión)','Entrenamiento con armas pesadas (Plasma)','Invocación férrica','Levitación magnética','Protocolo (Armada Imperial)','Robusto'],
    'Magos': ['Saber académico (Burocracia)','Saber académico (Filosofía)','Saber académico (Juicio)','Saber académico (Leyendas)','Saber académico (Ocultismo)','Saber prohibido (Arcanotecnología)','Saber prohibido (Demonología)','Saber prohibido (Disformidad)','Saber prohibido (Herejía)','Saber prohibido (Inquisición)','Saber prohibido (Psíquicos)','Ataque relámpago','Blanco difícil','Disciplina férrea','Golpe doble','Buscar','Interrogar','Medicae','Protocolo (Eclesiarquía)','Protocolo (Inquisición)','Rito de pureza mental','Robusto','Entrenamiento con pistolas (Fusión)','Entrenamiento con armas arrojadizas (Energía)'],
    'Magos Errante': ['Código (Bajos fondos)','Interrogar','Jugar','Saber académico (Arcaico)','Saber académico (Bestias)','Saber académico (Leyendas)','Saber académico (Ocultismo)','Saber popular (Adeptus Arbites)','Saber prohibido (Alienígenas)','Saber prohibido (Arcanotecnología)','Coraje','Desviar proyectil','Difícil de matar','Imperturbable','Ortopraxis','Quirurgo experto','Resistencia a poderes psíquicos','Oficio (Adivino)','En las puertas del infierno','Potenciadores sanguíneos','Protocolo (Bajos fondos)','Rito de miedo','Robusto','Actuar (Músico)','Engañar','Negociar'],
  },
  'Adepto': {
    'Archivista': ['Conducir (Aerodeslizador)','Conducir (Vehículo terrestre)','Leer/escribir','Oficio (Copista)','Pilotar (Aeronave civil)','Saber académico (Leyendas)','Saber popular (Imperio)','Anodino','Resistencia al frío','Robusto','Sueño ligero','Veloz','Nadar','Entrenamiento con armas arrojadizas (Primitivas)','Entrenamiento con armas c/c (Primitivas)','Entrenamiento con pistolas (Láser)','Entrenamiento con pistolas (Primitivas)','Entrenamiento con pistolas (PS)'],
    'Amanuense': ['Código (Acólito)','Conducir (Aerodeslizador)','Conducir (Vehículo terrestre)','Hablar idioma (Gótico clásico)','Indagar','Leer/escribir','Lógica','Perspicacia','Pilotar (Aeronave civil)','Saber académico (Leyendas)','Saber popular (Administratum)','Saber popular (Imperio)','Saber prohibido (Sectas)','Entrenamiento con armas básicas (Primitivas)','Charlatanería','Protocolo (Administratum)'],
    'Escriba': ['Código (Acólito)','Leer/escribir','Lengua secreta (Acólito)','Lengua secreta (Administratum)','Perspicacia','Saber académico (Burocracia)','Saber académico (Leyendas)','Saber académico (Ocultismo)','Saber popular (Administratum)','Saber popular (Eclesiarquía)','Saber popular (Imperio)','Saber prohibido (Herejía)','Saber prohibido (Sectas)','Entrenamiento con armas básicas (Láser)','Entrenamiento con armas básicas (PS)','Flagelante','Resistencia a venenos','Charlatanería','Robusto','Uso de electroinjerto','Ambidiestro'],
    'Dictante': ['Competencia tecnológica','Indagar','Lengua secreta (Acólito)','Lengua secreta (Administratum)','Lógica','Perspicacia','Saber académico (Numerología)','Saber académico (Ocultismo)','Saber popular (Culto a la máquina)','Saber popular (Tecnologías)','Saber prohibido (Inquisición)','Saber prohibido (Mutantes)','Tasar','Ataque veloz','Memoria fotográfica','Charlatanería','Navegación (Estelar)','Negociar','Entrenamiento con armas c/c (Conmoción)','Maestro de armas','Tirador de élite'],
    'Quirurgo': ['Engañar','Indagar','Lengua secreta (Acólito)','Medicae','Perspicacia','Saber popular (Credo imperial)','Saber prohibido (Inquisición)','Saber prohibido (Mutantes)','Protocolo (Dementes)','Quirurgo experto','Aguante','Decadencia','Sentido desarrollado (Olfato)','Sentido desarrollado (Tacto)','Sentido desarrollado (Vista)','Carisma','Trucos de manos'],
    'Erudito': ['Conducir (Bípode)','Engañar','Escrutinio','Esquivar','Hablar idioma (Gótico clásico)','Saber académico (Astromancia)','Saber académico (Burocracia)','Saber académico (Credo imperial)','Saber académico (Heráldica)','Saber popular (Adeptus Arbites)','Saber popular (Administratum)','Saber popular (Eclesiarquía)','Saber popular (Tecnologías)','Saber prohibido (Herejía)','Saber prohibido (Inquisición)','Saber prohibido (Mutantes)','Armadura de desprecio','Parloteo binario','Navegación (Estelar)','Difícil de matar','Entrenamiento con armas básicas (Bólter)','Entrenamiento con pistolas (Bólter)','Evasivo','Robusto'],
    'Lexógrafo': ['Código (Acólito)','Hablar idioma (Gótico clásico)','Lengua secreta (Acólito)','Saber prohibido (Herejía)','Saber prohibido (Inquisición)','Saber prohibido (Mutantes)','Saber prohibido (Sectas)','Paranoia','Resistencia al miedo','Desenfundado rápido','Entrenamiento con pistolas (Lanzallamas)','Lucha a ciegas','Leer labios'],
    'Auditor': ['Buscar','Engañar','Indagar','Lengua secreta (Acólito)','Lengua secreta (Administratum)','Mando','Saber académico (Astromancia)','Saber académico (Burocracia)','Saber académico (Credo imperial)','Saber académico (Criptología)','Saber académico (Heráldica)','Saber académico (Juicio)','Saber académico (Numerología)','Saber académico (Quimia)','Saber académico (Tactica Imperialis)','Saber popular (Culto a la máquina)','Tasar','Eunuco','Resistencia a poderes psíquicos','Voz inquietante','Competencia tecnológica','Interrogar','Lucha a ciegas','Tiro certero','Impávido'],
    'Maestro del Saber': ['Saber académico (Ocultismo)','Leer labios','Protocolo (Astrópatas)','Recarga rápida','Robusto','Psinisciencia','Entrenamiento con arma exótica (Pistola de agujas)','Fe inquebrantable','Entrenamiento con pistolas (Plasma)','Protocolo (Inquisición)'],
    'Logista': ['Buscar','Lógica','Saber académico (Credo imperial)','Saber académico (Criptología)','Saber académico (Juicio)','Saber académico (Tactica Imperialis)','Saber popular (Adeptus Arbites)','Saber popular (Eclesiarquía)','Autoritario','Dotado (Lógica)','Entrenamiento con pistolas (Lanzallamas)','Imperturbable','Ortopraxis','Protocolo (Gobierno)','Resistencia al miedo','Competencia tecnológica','Interrogar','Mando','Protocolo (Inquisición)','Saber prohibido (Arcanotecnología)','Nervios de acero','Protocolo (Adeptus Mechanicus)','Protocolo (Eclesiarquía)','Robusto'],
    'Magister': ['Caer de pie','Competencia tecnológica','Interrogar','Psinisciencia','Entrenamiento con arma exótica (Rifle de agujas)','Robusto','Entrenamiento con armas c/c (Energía)','Entrenamiento con pistolas (Fusión)'],
    'Sabio': ['Saber académico (Tactica Imperialis)','Saber popular (Adeptus Arbites)','Saber prohibido (Herejía)','Saber prohibido (Inquisición)','Saber prohibido (Mutantes)','Saber prohibido (Sectas)','Fortaleza mental','Protocolo (Nobleza)','Mando','Desenfundado rápido','Dotado (Mando)','Entrenamiento con arma exótica (Pistola lanzarredes)','Recarga rápida','Esconderse','Saber prohibido (Arcanotecnología)','Protocolo (Adeptus Arbites)','Robusto'],
  },
  'Clérigo': {
    'Novicio': ['Conducir (Vehículo terrestre)','Indagar','Leer/escribir','Nadar','Oficio (Copista)','Perspicacia','Pilotar (Aeronave civil)','Saber popular (Credo imperial)','Saber popular (Eclesiarquía)','Entrenamiento con armas básicas (Primitivas)','Entrenamiento con armas c/c (Primitivas)','Entrenamiento con pistolas (Láser)','Entrenamiento con pistolas (Primitivas)','Entrenamiento con pistolas (PS)','Resistencia al calor','Resistencia al frío','Robusto','Actuar (Cantar)','Entrenamiento con armas arrojadizas (Primitivas)'],
    'Iniciado': ['Actuar (Cantar)','Engañar','Leer/escribir','Nadar','Negociar','Saber popular (Eclesiarquía)','Saber popular (Imperio)','Trepar','Difícil de matar','Entrenamiento con armas básicas (Láser)','Entrenamiento con armas básicas (PS)','Flagelante','Odio (Mutantes)','Protocolo (Eclesiarquía)','Robusto','Actuar (Músico)','Código (Acólito)','Recarga rápida','Sentido desarrollado (Oído)'],
    'Sacerdote': ['Actuar (Cantar)','Actuar (Músico)','Carisma','Charlatanería','Conducir (Vehículo terrestre)','Escrutinio','Esquivar','Indagar','Lengua secreta (Acólito)','Lengua secreta (Eclesiarquía)','Nadar','Perspicacia','Saber académico (Credo imperial)','Saber académico (Leyendas)','Saber popular (Credo imperial)','Saber popular (Imperio)','Saber prohibido (Herejía)','Desarmar','Odio (Criminales)','Protocolo (Clase obrera)','Robusto','Veloz','Competencia tecnológica','Blanco difícil','Desenfundado rápido','Sentido desarrollado (Vista)','Entrenamiento con armas c/c (Conmoción)'],
    'Predicador': ['Actuar (Narrador)','Aguante','Charlatanería','Engañar','Hablar idioma (Gótico clásico)','Lengua secreta (Acólito)','Mando','Negociar','Pilotar (Aeronave civil)','Saber académico (Leyendas)','Saber académico (Ocultismo)','Saber popular (Credo imperial)','Saber prohibido (Sectas)','Decadencia','Entrenamiento con armas básicas (Bólter)','Entrenamiento con armas básicas (Lanzadores)','Entrenamiento con armas básicas (Lanzallamas)','Entrenamiento con armas c/c (Sierra)','Fe inquebrantable','Maestro de esgrima','Odio (Alienígena)','Orador experto','Robusto','Entrenamiento con pistolas (Bólter)','Entrenamiento con pistolas (Lanzallamas)','Disfraz','Jugar'],
    'Clérigo': ['Carisma','Conducir (Vehículo terrestre)','Indagar','Interrogar','Lengua secreta (Eclesiarquía)','Mando','Saber académico (Filosofía)','Saber popular (Eclesiarquía)','Saber prohibido (Herejía)','Saber prohibido (Psíquicos)','Autoritario','Disciplina férrea','Duro de pelar','Mandíbula de hierro','Nervios de acero','Odio (Psíquicos)','Competencia tecnológica','Escrutinio','Navegación (Superficie)','Combate con dos armas (CaC)','Entrenamiento con armas pesadas (Lanzallamas)','Entrenamiento con armas pesadas (PS)','Golpe mortífero','Robusto','Lengua secreta (Germanía)','Medicae','Ataque veloz'],
    'Confesor': ['Leer/escribir','Lógica','Negociar','Perspicacia','Pilotar (Aeronave civil)','Saber académico (Credo imperial)','Saber académico (Leyendas)','Saber académico (Tactica Imperialis)','Saber popular (Imperio)','Imperturbable','Protocolo (Administratum)','Reacción rápida','Resorte','Buscar','Código (Acólito)','Competencia tecnológica','Leer labios','Movimiento silencioso','Navegación (Superficie)','Saber académico (Burocracia)','Saber popular (Administratum)','Combate con dos armas (Proyectiles)','Entrenamiento con armas c/c (Energía)','Golpe infalible','Memoria fotográfica','Robusto','Sometimiento','Resistencia a poderes psíquicos'],
    'Exorcista': ['Esquivar','Hablar idioma (Gótico clásico)','Interrogar','Saber académico (Credo imperial)','Saber académico (Ocultismo)','Saber prohibido (Psíquicos)','Entrenamiento con armas c/c (Energía)','Fuego purificador','Odio (Demonios)','Ortopraxis','Resistencia a poderes psíquicos','Intimidar','Saber prohibido (Demonología)','Saber prohibido (Mutantes)','Entrenamiento con armas básicas (Plasma)','Entrenamiento con pistolas (Plasma)','Resistencia al miedo','Robusto','Saber popular (Guerra)','Entrenamiento con armas pesadas (Lanzadores)','Entrenamiento con armas pesadas (Primitivas)'],
    'Obispo': ['Aguante','Carisma','Charlatanería','Engañar','Hablar idioma (Gótico clásico)','Interrogar','Lengua secreta (Eclesiarquía)','Lógica','Mando','Saber académico (Burocracia)','Saber académico (Tactica Imperialis)','Buena reputación (Eclesiarquía)','Protocolo (Adeptus Arbites)','Protocolo (Nobleza)','Resistencia a venenos','Sueño ligero','Seguridad','Entrenamiento con pistolas (Plasma)','Protocolo (Inquisición)','Tirador de primera','Tiro certero','Esconderse','Lengua secreta (Administratum)','Saber prohibido (Mutantes)','Trucos de manos','Ambidiestro','Robusto'],
    'Fanático': ['Saber académico (Leyendas)','Saber académico (Ocultismo)','Saber académico (Tactica Imperialis)','Coraje','Imperturbable','Odio (Secta)','Protocolo (Ejército)','Protocolo (Inquisición)','Intimidar','Saber prohibido (Disformidad)','Saber prohibido (Mutantes)','Buena reputación (Eclesiarquía)','Devoción demencial','Entrenamiento con armas básicas (Fusión)','Robusto','Código (Jerga bélica)','Competencia química','Ataque relámpago','Brazos fuertes','Furia asesina','Furia de combate','Tirador excepcional'],
    'Hierofante': ['Aguante','Hablar idioma (Gótico clásico)','Interrogar','Lógica','Saber académico (Filosofía)','Saber académico (Tactica Imperialis)','Saber popular (Culto a la máquina)','Trato animal','Ataque lacerante','Maestría en combate','Protocolo (Astrópatas)','Protocolo (Gobierno)','Leer labios','Disparo doble','Disparos independientes','Entrenamiento con pistolas (Fusión)','Saber prohibido (Demonología)','Saber prohibido (Disformidad)','Saber prohibido (Psíquicos)','Tasar','Robusto'],
    'Redencionista': ['Carisma','Hablar idioma (Gótico clásico)','Interrogar','Lengua secreta (Eclesiarquía)','Mando','Perspicacia','Saber prohibido (Demonología)','Saber prohibido (Herejía)','Saber prohibido (Psíquicos)','Disparos independientes','En las puertas del infierno','Letanía de odio','Maestría en combate','Saber prohibido (Disformidad)','Lengua secreta (Ejército)','Saber prohibido (Alienígenas)','Saber prohibido (Inquisición)','Entrenamiento con pistolas (Fusión)','Robusto'],
  },
  'Guardia Imperial': {
    'Recluta': ['Conducir (Vehículo terrestre)','Nadar','Perspicacia','Entrenamiento con armas arrojadizas (Primitivas)','Entrenamiento con armas básicas (Láser)','Entrenamiento con armas básicas (Primitivas)','Entrenamiento con armas básicas (PS)','Entrenamiento con armas c/c (Primitivas)','Entrenamiento con pistolas (Láser)','Entrenamiento con pistolas (Primitivas)','Entrenamiento con pistolas (PS)','Robusto','Conducir (Bípode)'],
    'Guardia': ['Código (Acólito)','Código (Jerga bélica)','Conducir (Vehículo terrestre)','Esquivar','Nadar','Saber popular (Guardia Imperial)','Supervivencia','Desenfundado rápido','Entrenamiento con armas básicas (Lanzadores)','Robusto','Conducir (Bípode)','Indagar','Saber popular (Guerra)','Combate con dos armas (Proyectiles)','Entrenamiento con armas pesadas (PS)'],
    'Hombre de armas': ['Conducir (Vehículo terrestre)','Intimidar','Lengua secreta (Acólito)','Nadar','Navegación (Superficie)','Pilotar (Aeronave militar)','Ataque lacerante','Entrenamiento con armas básicas (Lanzallamas)','Entrenamiento con pistolas (Lanzallamas)','Recarga rápida','Robusto','Conducir (Bípode)','Indagar','Jugar','Saber popular (Imperio)','Ambidiestro','Ataque veloz','Entrenamiento con armas c/c (Conmoción)','Leer/escribir'],
    'Sargento': ['Código (Jerga bélica)','Demolición','Intimidar','Lengua secreta (Ejército)','Navegación (Superficie)','Pilotar (Aeronave militar)','Saber popular (Credo imperial)','Saber popular (Guardia Imperial)','Entrenamiento con armas básicas (Bólter)','Entrenamiento con armas c/c (Sierra)','Entrenamiento con pistolas (Bólter)','Golpe doble','Resistencia al miedo','Robusto','Sometimiento','Aguante','Competencia tecnológica','Interrogar','Combate con dos armas (CaC)','Disparo doble','Disparo en movimiento','Entrenamiento con armas básicas (Lanzallamas)','Entrenamiento con armas pesadas (Lanzallamas)','Entrenamiento con armas pesadas (Primitivas)','Golpe infalible','Golpe mortífero','Negociar'],
    'Veterano': ['Código (Acólito)','Código (Jerga bélica)','Demolición','Esquivar','Lengua secreta (Acólito)','Lengua secreta (Ejército)','Mando','Pilotar (Aeronave militar)','Supervivencia','Blanco difícil','Brazos fuertes','Difícil de matar','Duro de pelar','Entrenamiento con armas básicas (Fusión)','Entrenamiento con armas básicas (Plasma)','Entrenamiento con armas pesadas (Bólter)','Entrenamiento con armas pesadas (Lanzadores)','Entrenamiento con armas pesadas (Láser)','Evasivo','Lucha a ciegas','Maestro de armas','Buscar','Jugar','Medicae','Trepar','Mandíbula de hierro','Odio (Alienígena)','Robusto'],
    'Veterano de asalto': ['Demolición','Saber popular (Credo imperial)','Supervivencia','Asalto rabioso','Ataque combinado','Entrenamiento con armas c/c (Energía)','Furia asesina','Golpe certero','Maestría en combate','Maestro de esgrima','Resorte','Competencia química','Esquivar','Contraataque','Robusto','Ataque relámpago'],
    'Teniente': ['Interrogar','Mando','Navegación (Superficie)','Saber académico (Tactica Imperialis)','Saber popular (Credo imperial)','Saber popular (Eclesiarquía)','Entrenamiento con armas c/c (Energía)','Odio (Mutantes)','Competencia química','Escrutinio','Leer/escribir','Medicae','Saber popular (Guerra)','Entrenamiento con pistolas (Plasma)','Robusto','Carisma','Charlatanería','Engañar','Tasar'],
    'Explorador': ['Navegación (Superficie)','Perspicacia','Tiro certero','Esconderse','Movimiento silencioso','Seguridad','Trepar','Entrenamiento con armas c/c (Energía)','Resorte','Robusto','Sentido desarrollado (Oído)','Sentido desarrollado (Olfato)','Sentido desarrollado (Vista)'],
    'Soldado de choque': ['Aguante','Competencia química','Esconderse','Entrenamiento con armas pesadas (Fusión)','Entrenamiento con armas pesadas (Plasma)','Fuego purificador','Robusto'],
    'Capitán': ['Interrogar','Lengua secreta (Ejército)','Saber académico (Tactica Imperialis)','Saber popular (Credo imperial)','Saber popular (Guardia Imperial)','Autoritario','Entrenamiento con pistolas (Fusión)','Imperturbable','Odio (Psíquicos)','Protocolo (Ejército)','Disciplina férrea','Nervios de acero','Robusto','Lógica','Ataque relámpago','Resistencia a poderes psíquicos'],
    'Tirador de élite': ['Supervivencia','Disparo infalible','Competencia química','Esconderse','Seguridad','Reflejos rápidos','Robusto','Tirador de primera','Disfraz','Seguimiento'],
    'Soldado de asalto': ['Intimidar','Carga frenética','Furia de combate','Coraje','Desviar proyectil','Devoción demencial','Entrenamiento con pistolas (Fusión)','Entrenamiento con pistolas (Lanzadores)','Entrenamiento con pistolas (Plasma)','Robusto'],
    'Comandante': ['Interrogar','Mando','Saber académico (Tactica Imperialis)','Buena reputación (Guardia Imperial)','Fe inquebrantable','Furia asesina','Memoria fotográfica','Odio (Secta)','Aguante','Esconderse','Saber popular (Guerra)','En las puertas del infierno','Letanía de odio','Orador experto','Protocolo (Inquisición)','Resorte','Robusto'],
    'Francotirador': ['Perspicacia','Competencia química','Esconderse','Movimiento silencioso','Entrenamiento con pistolas (Fusión)','Entrenamiento con pistolas (Plasma)','Rastrear','Ataque relámpago','Entrenamiento con arma exótica (Rifle de agujas)','Robusto','Tirador excepcional'],
  },
  'Adepta Sororitas': {
    'Novicia':      ['Actuar (Cantar)','Hablar idioma (Gótico vulgar)','Leer/escribir','Oficio (Copista)','Saber popular (Credo imperial)','Conducir (Vehículo terrestre)','Esquivar','Nadar','Perspicacia','Saber popular (Eclesiarquía)','Saber prohibido (Disformidad)','Entrenamiento con armas básicas (Primitivas)','Entrenamiento con armas básicas (Láser)','Entrenamiento con armas básicas (PS)','Entrenamiento con armas c/c (Primitivas)','Entrenamiento con pistolas (Láser)','Entrenamiento con pistolas (Primitivas)','Entrenamiento con pistolas (PS)','Robusto','Fe pura'],
    'Cantus':       ['Actuar (Cantar)','Carisma','Escrutinio','Hablar idioma (Gótico clásico)','Lógica','Nadar','Oficio (Apotecaria)','Oficio (Copista)','Saber académico (Credo imperial)','Saber popular (Credo imperial)','Saber popular (Eclesiarquía)','Saber popular (Imperio)','Trepar','Flagelante','Meditación','Resistencia al miedo','Supervivencia','Robusto','Odio (Mutantes)','Odio (Psíquicos)'],
    'Constantia':   ['Buscar','Engañar','Esconderse','Esquivar','Hablar idioma (Gótico clásico)','Leer/escribir','Nadar','Navegación (Superficie)','Perspicacia','Saber académico (Heráldica)','Saber académico (Leyendas)','Saber popular (Administratum)','Entrenamiento con armas básicas (Bólter)','Entrenamiento con pistolas (Bólter)','Indagar','Saber académico (Arcaico)','Robusto','Fe inquebrantable','Resistencia a poderes psíquicos','Armadura de desprecio'],
    'Dialogante':   ['Carisma','Código (Acólito)','Engañar','Hablar idioma (Gótico clásico)','Indagar','Intimidar','Leer labios','Leer/escribir','Lengua secreta (Acólito)','Lengua secreta (Eclesiarquía)','Lógica','Perspicacia','Saber académico (Burocracia)','Saber académico (Credo imperial)','Saber académico (Filosofía)','Saber académico (Ocultismo)','Saber popular (Administratum)','Saber popular (Eclesiarquía)','Saber popular (Imperio)','Tasar','Protocolo (Eclesiarquía)','Purgar al impuro','Saber académico (Criptología)','Robusto','Voz inquietante'],
    'Hospitalaria': ['Carisma','Competencia química','Medicae','Oficio (Apotecaria)','Perspicacia','Saber popular (Guardia imperial)','Auxilio divino','Difícil de matar','Protocolo (Ejército)','Resistencia al calor','Resistencia al frío','Robusto','Nervios de acero'],
    'Militante':    ['Intimidar','Perspicacia','Saber popular (Guerra)','Trepar','Ataque combinado','Desenfundado rápido','Entrenamiento con armas básicas (Lanzallamas)','Fuego purificador','La cólera de los justos','Nervios de acero','Reacción rápida','Recarga rápida','Robusto','Entrenamiento con armas básicas (Fusión)','Entrenamiento con armas pesadas (Bólter)','Entrenamiento con armas pesadas (Fusión)','Entrenamiento con armas pesadas (Lanzallamas)','Maestra de armas','Odio (Herejes)'],
    'Famulata':     ['Carisma','Disfraz','Engañar','Indagar','Leer labios','Lengua secreta (Administratum)','Lengua secreta (Eclesiarquía)','Saber académico (Burocracia)','Saber académico (Filosofía)','Saber académico (Heráldica)','Saber académico (Leyendas)','Saber popular (Imperio)','Saber académico (Arcaico)','Saber académico (Criptología)','Saber prohibido (Herejía)','Saber prohibido (Sectas)','Protocolo (Nobleza)','Cavidad oculta','Predicción','Protocolo (Administratum)','Robusto'],
    'Curial':       ['Carisma','Competencia química','Engañar','Indagar','Medicae','Oficio (Apotecaria)','Saber académico (Quimia)','Saber popular (Guerra)','Resistencia a venenos','Robusto','Sentido desarrollado (Olfato)','Sentido desarrollado (Tacto)','Competencia tecnológica','Interrogar','Lengua secreta (Eclesiarquía)','Estabilizadores sanguíneos','Sentido desarrollado (Vista)','Uso de electroinjerto'],
    'Elohim':       ['Acrobacia','Esconderse','Esquivar','Intimidar','Movimiento silencioso','Saber popular (Guerra)','Trepar','Ambidiestra','Combate con dos armas (C/C)','Combate con dos armas (Proyectiles)','Entrenamiento con armas c/c (Sierra)','Lucha a ciegas','Robusto','Pilotar (Retrorreactor)','Rastrear','Asalto rabioso','Ataque veloz','Golpe mortífero','Reflejos rápidos'],
    'Nuncia':       ['Código (Acólito)','Código (Ocultismo)','Intimidar','Leer labios','Lengua secreta (Acólito)','Lengua secreta (Administratum)','Lengua secreta (Eclesiarquía)','Lógica','Mando','Saber académico (Arcaico)','Saber académico (Burocracia)','Saber académico (Credo imperial)','Saber académico (Criptología)','Saber académico (Filosofía)','Saber académico (Leyendas)','Saber académico (Ocultismo)','Saber prohibido (Alienígenas)','Saber prohibido (Inquisición)','Memoria fotográfica','Robusto'],
    'Limosnera':    ['Competencia química','Engañar','Indagar','Mando','Medicae','Saber académico (Quimia)','Impávida','Protocolo (Dementes)','Protocolo (Eclesiarquía)','Robusto','Competencia tecnológica','Interrogar','Saber prohibido (Inquisición)','Buena reputación (Armada Imperial)','Buena reputación (Guardia Imperial)','Quirurga experta','Saber prohibido (Herejía)','Saber prohibido (Mutantes)','Saber prohibido (Sectas)','Potenciadores sanguíneos'],
    'Celeste':      ['Acrobacia','Intimidar','Lengua secreta (Ejército)','Mando','Pilotar (Aeronave militar)','Saber académico (Tactica Imperialis)','Saber prohibido (Herejía)','Saber prohibido (Inquisición)','Saber prohibido (Sectas)','Disparo en movimiento','Disparo infalible','Entrenamiento con armas c/c (Energía)','Entrenamiento con pistolas (Lanzallamas)','Entrenamiento con pistolas (Plasma)','Impávida','Mandíbula de hierro','Protocolo (Eclesiarquía)','Disparo doble','Golpe doble','Robusto','Tiradora excepcional','Ataque relámpago'],
    'Superiora':    ['Interrogar','Mando','Armadura de desprecio','Autoritaria','Desarmar','Disciplina férrea','Entrenamiento con armas c/c (Conmoción)','Evasiva','Imperturbable','Saber prohibido (Herejía)','Saber prohibido (Inquisición)','Saber prohibido (Ordo Hereticus)','Saber prohibido (Sectas)','Saber prohibido (Demonología)','Letanía de odio','Protocolo (Inquisición)','Buena reputación (Eclesiarquía)','Robusto'],
    'Legada':       ['Mando','Entrenamiento con pistolas (Fusión)','Maestra de esgrima','Maestría en combate','Interrogar','Saber prohibido (Herejía)','Saber prohibido (Inquisición)','Saber prohibido (Ordo Hereticus)','Saber prohibido (Sectas)','Ataque lacerante','En las puertas del infierno','Fortaleza mental','Odio (Demonios)','Buena reputación (Inquisición)','Robusto'],
  },
  'Asesino': {},
  'Arbitrador': {},
  'Granuja': {},
  'Psíquico Imperial': {},
}

export function getRankForXP(profession: string, xpSpent: number): CareerRank | null {
  const ranks = CAREERS_DATA[profession]
  if (!ranks) return null
  let best = ranks[0]
  for (const r of ranks) {
    const peStart = parseInt(r.pe.replace(/\./g, '').split('-')[0]) || 0
    if (xpSpent >= peStart) best = r
    else break
  }
  return best
}

export function getAttrCostsForCareer(profession: string): Record<string, Array<number | null>> {
  return ATTR_ADVANCE_COSTS[profession] ?? {}
}

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\+\d+\s*/g, '')
    .replace(/\brobusta\b/, 'robusto')
    .trim()
}

// Returns null when no career data exists (show all), or the set of available item names
export function getAvailableItemsForRank(profession: string, currentRankName: string): Set<string> | null {
  const careerData = CAREER_RANKS_DATA[profession]
  if (!careerData || Object.keys(careerData).length === 0) return null
  const ranks = CAREERS_DATA[profession] ?? []
  const currentIdx = ranks.findIndex(r => r.rank === currentRankName)
  if (currentIdx === -1) return null
  const available = new Set<string>()
  for (let i = 0; i <= currentIdx; i++) {
    const rankName = ranks[i].rank
    ;(careerData[rankName] ?? []).forEach(name => available.add(normalizeName(name)))
  }
  return available
}
