// Fuente: Dark Heresy 1ª Edición — Capítulo 5: Talentos y Rasgos

export type TalentType = 'COMBATE' | 'MECÁNICO' | 'PSÍQUICO' | 'GENERAL' | 'BENEDICTION' | 'TECH' | 'OTRO'

export interface TalentDefinition {
  key: string
  label: string
  type: string          // TalentType en runtime; string aquí para evitar widening en arrays literales
  prerequisites?: string
  description: string
  effect?: string
}

export const TALENTS: TalentDefinition[] = [
  // ── COMBATE ──────────────────────────────────────────────────────────────
  {
    key: 'ambidextrous', label: 'Ambidextrous', type: 'COMBATE',
    description: 'Puedes usar ambas manos con igual habilidad.',
    effect: 'Sin penalizador por mano no dominante.',
  },
  {
    key: 'arms-master', label: 'Arms Master', type: 'COMBATE',
    prerequisites: 'Basic Weapon Training (any)',
    description: 'Entrenado en el uso de todo tipo de armas.',
    effect: 'Sin penalizador por usar armas de tipo básico no entrenadas.',
  },
  {
    key: 'blade-master', label: 'Blade Master', type: 'COMBATE',
    prerequisites: 'WS 30, Melee Weapon Training (any)',
    description: 'Maestría suprema con armas de filo.',
    effect: 'Re-roll un dado de ataque CaC por asalto.',
  },
  {
    key: 'combat-master', label: 'Combat Master', type: 'COMBATE',
    prerequisites: 'WS 30',
    description: 'Dominas el combate cuerpo a cuerpo múltiple.',
    effect: 'Los enemigos adicionales en combate CaC no dan flanqueo.',
  },
  {
    key: 'crack-shot', label: 'Crack Shot', type: 'COMBATE',
    prerequisites: 'BS 40',
    description: 'Tirador de precisión excepcional.',
    effect: '+2 al daño crítico con armas de fuego.',
  },
  {
    key: 'crushing-blow', label: 'Crushing Blow', type: 'COMBATE',
    prerequisites: 'WS 40',
    description: 'Golpes devastadores que arrollan al enemigo.',
    effect: '+2 al daño crítico en CaC.',
  },
  {
    key: 'deadeye-shot', label: 'Deadeye Shot', type: 'COMBATE',
    prerequisites: 'BS 30',
    description: 'Puntería quirúrgica para disparos a zonas específicas.',
    effect: 'Reduce la penalización por apuntar a zona específica en 10.',
  },
  {
    key: 'deflect-shot', label: 'Deflect Shot', type: 'COMBATE',
    prerequisites: 'Ag 50',
    description: 'Reflejos sobrenaturales para esquivar proyectiles.',
    effect: 'Puede usar reacción para desviar un impacto de arma de fuego.',
  },
  {
    key: 'die-hard', label: 'Die Hard', type: 'COMBATE',
    prerequisites: 'WP 40',
    description: 'Voluntad de hierro que te mantiene en pie.',
    effect: 'Re-roll una tirada de aturdimiento por asalto.',
  },
  {
    key: 'disarm', label: 'Disarm', type: 'COMBATE',
    prerequisites: 'Ag 30',
    description: 'Técnica para desarmar al oponente en combate.',
    effect: 'Acción estándar: prueba de WS vs WS para desarmar.',
  },
  {
    key: 'dual-shot', label: 'Dual Shot', type: 'COMBATE',
    prerequisites: 'Ag 40, Gunslinger',
    description: 'Dispara con ambas pistolas al mismo blanco.',
    effect: 'Dispara con ambas pistolas en una acción; +0 a la tirada.',
  },
  {
    key: 'dual-strike', label: 'Dual Strike', type: 'COMBATE',
    prerequisites: 'Ag 40, Ambidextrous, Two-Weapon Wielder',
    description: 'Ataca con dos armas en un único movimiento fluido.',
    effect: 'Ataca con ambas armas CaC en una acción.',
  },
  {
    key: 'fast-attack', label: 'Fast Attack', type: 'COMBATE',
    prerequisites: 'Ag 40',
    description: 'Velocidad de ataque fulminante.',
    effect: 'Usa Full Action para realizar dos ataques estándar.',
  },
  {
    key: 'fearless', label: 'Fearless', type: 'COMBATE',
    description: 'Inmune al miedo y al pánico en combate.',
    effect: 'Inmune a efectos de Terror y Miedo.',
  },
  {
    key: 'frenzy', label: 'Frenzy', type: 'COMBATE',
    description: 'Te sumerges en un frenesí de violencia.',
    effect: '+10 WS, +10 S, +10 T, -20 BS, -10 Int durante el frenzy.',
  },
  {
    key: 'gunslinger', label: 'Gunslinger', type: 'COMBATE',
    prerequisites: 'BS 40, Pistol Training (any)',
    description: 'Artista del revólver que maneja pistolas con maestría.',
    effect: 'Sin penalizador por disparar con pistola en mano no dominante.',
  },
  {
    key: 'hip-shooting', label: 'Hip Shooting', type: 'COMBATE',
    prerequisites: 'BS 40, Ag 40',
    description: 'Dispara en movimiento sin perder precisión.',
    effect: 'Puede Full Move y disparar en el mismo asalto.',
  },
  {
    key: 'leap-up', label: 'Leap Up', type: 'COMBATE',
    prerequisites: 'Ag 30',
    description: 'Se incorpora con un salto ágil.',
    effect: 'Levantarse del suelo es una Acción Libre.',
  },
  {
    key: 'lightning-attack', label: 'Lightning Attack', type: 'COMBATE',
    prerequisites: 'Swift Attack',
    description: 'Serie de ataques relámpago casi imposibles de seguir.',
    effect: 'Full Action: realiza tres ataques CaC.',
  },
  {
    key: 'marksman', label: 'Marksman', type: 'COMBATE',
    prerequisites: 'BS 35',
    description: 'Tirador metódico que saca el máximo a cada disparo.',
    effect: 'Sin penalizador por disparo a larga distancia.',
  },
  {
    key: 'mighty-shot', label: 'Mighty Shot', type: 'COMBATE',
    prerequisites: 'BS 40',
    description: 'Disparo con una potencia que traspasa cualquier objetivo.',
    effect: '+2 al daño con armas de fuego.',
  },
  {
    key: 'nerves-of-steel', label: 'Nerves of Steel', type: 'COMBATE',
    description: 'Sangre fría bajo el fuego enemigo.',
    effect: 'Re-roll una tirada de Pinned por asalto.',
  },
  {
    key: 'precise-blow', label: 'Precise Blow', type: 'COMBATE',
    prerequisites: 'WS 40, Sure Strike',
    description: 'Ataques quirúrgicos a las zonas más vulnerables.',
    effect: 'Puede elegir la zona de impacto en CaC.',
  },
  {
    key: 'quick-draw', label: 'Quick Draw', type: 'COMBATE',
    description: 'Desenfunda en un abrir y cerrar de ojos.',
    effect: 'Sacar un arma es una Acción Libre.',
  },
  {
    key: 'rapid-reaction', label: 'Rapid Reaction', type: 'COMBATE',
    prerequisites: 'Ag 40',
    description: 'Reacciones instantáneas ante el peligro.',
    effect: '+10 a tiradas de Iniciativa; no queda Surprised si pasa Ag.',
  },
  {
    key: 'rapid-reload', label: 'Rapid Reload', type: 'COMBATE',
    description: 'Recarga sus armas en la mitad de tiempo.',
    effect: 'Reduce el tiempo de recarga en una Acción Libre.',
  },
  {
    key: 'sprint', label: 'Sprint', type: 'COMBATE',
    description: 'Ráfagas de velocidad explosiva.',
    effect: 'Puede mover el doble en su turno, una vez por encuentro.',
  },
  {
    key: 'step-aside', label: 'Step Aside', type: 'COMBATE',
    prerequisites: 'Ag 40, Dodge',
    description: 'Esquiva ataques con un elegante paso lateral.',
    effect: 'Una esquiva adicional por asalto.',
  },
  {
    key: 'sure-strike', label: 'Sure Strike', type: 'COMBATE',
    prerequisites: 'WS 30',
    description: 'Golpes controlados que siempre dan donde deben.',
    effect: '+10 a tiradas de ataque CaC cuando se elige la zona.',
  },
  {
    key: 'swift-attack', label: 'Swift Attack', type: 'COMBATE',
    prerequisites: 'WS 35',
    description: 'Velocidad de combate superior a la humana normal.',
    effect: 'Full Action: realiza dos ataques CaC.',
  },
  {
    key: 'takedown', label: 'Takedown', type: 'COMBATE',
    description: 'Derriba al enemigo sin matarlo.',
    effect: 'Ataque especial para aturdir en lugar de herir.',
  },
  {
    key: 'two-weapon-wielder-melee', label: 'Two-Weapon Wielder (CaC)', type: 'COMBATE',
    prerequisites: 'Ag 35, Ambidextrous',
    description: 'Combate con dos armas CaC simultáneamente.',
    effect: 'Puede atacar con ambas armas CaC, penalizador reducido.',
  },
  {
    key: 'two-weapon-wielder-ranged', label: 'Two-Weapon Wielder (Distancia)', type: 'COMBATE',
    prerequisites: 'Ag 35, Ambidextrous',
    description: 'Dispara con dos armas a la vez.',
    effect: 'Puede disparar con ambas pistolas, penalizador reducido.',
  },
  {
    key: 'wall-of-steel', label: 'Wall of Steel', type: 'COMBATE',
    prerequisites: 'Ag 35, Swift Attack',
    description: 'Torbellino de acero que rechaza a todos los asaltantes.',
    effect: 'Una parada adicional por asalto.',
  },

  // ── GENERAL ───────────────────────────────────────────────────────────────
  {
    key: 'die-hard-gen', label: 'Die Hard', type: 'GENERAL',
    prerequisites: 'WP 40',
    description: 'Resistes heridas que matarían a cualquier otro.',
    effect: 'Re-roll tiradas de muerte por heridas críticas.',
  },
  {
    key: 'duty-unto-death', label: 'Duty Unto Death', type: 'GENERAL',
    description: 'Sigues combatiendo cuando cualquiera huiría.',
    effect: 'Puede continuar combatiendo con 0 heridas antes de caer.',
  },
  {
    key: 'hardy', label: 'Hardy', type: 'GENERAL',
    prerequisites: 'T 40',
    description: 'Constitución excepcional que acelera la curación.',
    effect: 'Recupera puntos de herida a ritmo doble.',
  },
  {
    key: 'heightened-senses-sight', label: 'Heightened Senses (Vista)', type: 'GENERAL',
    description: 'Sentidos superiores a la media humana.',
    effect: '+10 a tiradas de Awareness (Vista).',
  },
  {
    key: 'heightened-senses-hearing', label: 'Heightened Senses (Oído)', type: 'GENERAL',
    description: 'Oído capaz de captar el más leve susurro.',
    effect: '+10 a tiradas de Awareness (Oído).',
  },
  {
    key: 'iron-discipline', label: 'Iron Discipline', type: 'GENERAL',
    prerequisites: 'WP 30, Command',
    description: 'Liderazgo férreo que inspira a los bajo tu mando.',
    effect: 'Aliados bajo tu mando re-roll una tirada de moral por asalto.',
  },
  {
    key: 'iron-jaw', label: 'Iron Jaw', type: 'GENERAL',
    prerequisites: 'T 40',
    description: 'Mandíbula y temple que encajan golpes brutales.',
    effect: '+20 a tiradas de Resistencia contra aturdimiento.',
  },
  {
    key: 'jaded', label: 'Jaded', type: 'GENERAL',
    description: 'Has visto tanto horror que ya nada te perturba.',
    effect: 'Inmune a los efectos de la violencia mundana y escenas macabras.',
  },
  {
    key: 'light-sleeper', label: 'Light Sleeper', type: 'GENERAL',
    description: 'Se despierta ante el menor estímulo.',
    effect: 'Siempre se considera consciente cuando duerme.',
  },
  {
    key: 'linguist', label: 'Linguist', type: 'GENERAL',
    description: 'Don innato para los idiomas.',
    effect: '+10 a tiradas de aprender/usar idiomas; aprende uno extra.',
  },
  {
    key: 'meditation', label: 'Meditation', type: 'GENERAL',
    description: 'Control mental y corporal a través de la meditación.',
    effect: 'Recupera Puntos de Foco adicionales tras descanso.',
  },
  {
    key: 'peer', label: 'Peer (Inquisición)', type: 'GENERAL',
    description: 'Contactos y respeto en la Inquisición.',
    effect: '+10 a tiradas sociales con miembros de la Inquisición.',
  },
  {
    key: 'resistance-cold', label: 'Resistance (Frío)', type: 'GENERAL',
    description: 'Resistencia al frío extremo.',
    effect: '+10 a tiradas de Resistencia contra frío y efectos de hielo.',
  },
  {
    key: 'resistance-heat', label: 'Resistance (Calor)', type: 'GENERAL',
    description: 'Resistencia al calor extremo.',
    effect: '+10 a tiradas de Resistencia contra calor y fuego.',
  },
  {
    key: 'resistance-poison', label: 'Resistance (Veneno)', type: 'GENERAL',
    description: 'Sistema inmune reforzado contra toxinas.',
    effect: '+10 a tiradas de Resistencia contra venenos.',
  },
  {
    key: 'sound-constitution', label: 'Sound Constitution', type: 'GENERAL',
    description: 'Salud robusta que aumenta tu capacidad de aguante.',
    effect: '+1 punto de herida máximo.',
  },
  {
    key: 'strong-minded', label: 'Strong Minded', type: 'GENERAL',
    prerequisites: 'WP 30, Resistance (Psíquico)',
    description: 'Mente blindada contra la influencia psíquica.',
    effect: '+10 a tiradas de WP contra poderes psíquicos.',
  },
  {
    key: 'total-recall', label: 'Total Recall', type: 'GENERAL',
    description: 'Memoria eidética perfecta.',
    effect: 'Recuerda cualquier dato que haya visto u oído.',
  },
  {
    key: 'touched-by-fates', label: 'Touched by the Fates', type: 'GENERAL',
    description: 'El destino parece protegerte.',
    effect: '+1 Punto de Destino máximo.',
  },
  {
    key: 'true-grit', label: 'True Grit', type: 'GENERAL',
    prerequisites: 'T 40',
    description: 'Aguante sobrehumano ante las heridas.',
    effect: 'Reduce el daño crítico recibido en 2 (mínimo 1).',
  },
  {
    key: 'unshakeable-faith', label: 'Unshakeable Faith', type: 'GENERAL',
    prerequisites: 'WP 40',
    description: 'Fe inquebrantable en el Dios-Emperador.',
    effect: 'Re-roll tiradas de Miedo y Corrupción.',
  },

  // ── TECH ─────────────────────────────────────────────────────────────────
  {
    key: 'mechadendrite-use-mani', label: 'Mechadendrite Use (Manipulación)', type: 'TECH',
    description: 'Entrenado en el uso de mechadendrites de manipulación.',
    effect: 'Puede usar Mechadendrites de Manipulación sin penalizador.',
  },
  {
    key: 'mechadendrite-use-combat', label: 'Mechadendrite Use (Combate)', type: 'TECH',
    description: 'Entrenado en el combate con mechadendrites.',
    effect: 'Puede usar Mechadendrites de Combate sin penalizador.',
  },
  {
    key: 'mechadendrite-use-util', label: 'Mechadendrite Use (Utilitas)', type: 'TECH',
    description: 'Entrenado en el uso de mechadendrites utilitarios.',
    effect: 'Puede usar Mechadendrites Utilitas sin penalizador.',
  },
  {
    key: 'mechadendrite-use-medicae', label: 'Mechadendrite Use (Medicae)', type: 'TECH',
    description: 'Entrenado en el uso de mechadendrites medicae.',
    effect: 'Puede usar Mechadendrites Medicae sin penalizador.',
  },
  {
    key: 'rites-of-machine', label: 'Rites of the Machine', type: 'TECH',
    description: 'Conocimiento de los rituales del Omnissiah.',
    effect: '+10 a Tech-Use; puede hablar con máquinas simples.',
  },
  {
    key: 'technical-knock', label: 'Technical Knock', type: 'TECH',
    prerequisites: 'Int 30',
    description: 'Reactiva armas encasquilladas con un golpe preciso.',
    effect: 'Libera arma encasquillada como Acción Libre una vez por asalto.',
  },
  {
    key: 'logis-implant', label: 'Logis Implant', type: 'TECH',
    description: 'Implante de procesamiento de datos del Mechanicus.',
    effect: '+10 a Logic e Int para cálculos complejos.',
  },

  // ── PSÍQUICO ──────────────────────────────────────────────────────────────
  {
    key: 'psy-rating-1', label: 'Psy Rating 1', type: 'PSÍQUICO',
    description: 'Primera manifestación del poder psíquico.',
    effect: 'Psy Rating 1. Puede usar poderes psíquicos básicos.',
  },
  {
    key: 'psy-rating-2', label: 'Psy Rating 2', type: 'PSÍQUICO',
    prerequisites: 'Psy Rating 1',
    description: 'Creciente dominio del poder psíquico.',
    effect: 'Psy Rating 2.',
  },
  {
    key: 'psy-rating-3', label: 'Psy Rating 3', type: 'PSÍQUICO',
    prerequisites: 'Psy Rating 2',
    description: 'Poder psíquico considerable.',
    effect: 'Psy Rating 3.',
  },
  {
    key: 'mental-fortress', label: 'Mental Fortress', type: 'PSÍQUICO',
    prerequisites: 'WP 50, Strong Minded, Psy Rating 3',
    description: 'Fortaleza mental impenetrable.',
    effect: 'Inmune a poderes psíquicos de Psy Rating menor al propio.',
  },
  {
    key: 'warp-sense', label: 'Warp Sense', type: 'PSÍQUICO',
    prerequisites: 'Psyniscience, Psy Rating 1',
    description: 'Percibe las corrientes del Warp.',
    effect: 'Detecta presencia psíquica pasivamente con tirada de Per.',
  },

  // ── BENEDICTION ───────────────────────────────────────────────────────────
  {
    key: 'litany-of-hate', label: 'Litany of Hate', type: 'BENEDICTION',
    description: 'Letanía sagrada que inflama el odio hacia el enemigo.',
    effect: '+10 a WS y BS de aliados a 10m durante 1d5 asaltos.',
  },
  {
    key: 'divine-protection', label: 'Divine Protection', type: 'BENEDICTION',
    description: 'El Dios-Emperador te ampara con su luz divina.',
    effect: 'Reduce daño recibido en 1d5 una vez por encuentro.',
  },
  {
    key: 'smite-the-unclean', label: 'Smite the Unclean', type: 'BENEDICTION',
    description: 'Castigo divino contra los enemigos del Emperador.',
    effect: '+10 al daño contra enemigos del Caos y no-muertos.',
  },

  // ── WEAPON TRAINING ───────────────────────────────────────────────────────
  {
    key: 'basic-las', label: 'Basic Weapon Training (Las)', type: 'COMBATE',
    description: 'Entrenado en el uso de armas láser básicas.',
    effect: 'Sin penalizador al usar armas Las básicas.',
  },
  {
    key: 'basic-auto', label: 'Basic Weapon Training (Auto)', type: 'COMBATE',
    description: 'Entrenado en el uso de armas automáticas básicas.',
    effect: 'Sin penalizador al usar armas Auto básicas.',
  },
  {
    key: 'basic-bolt', label: 'Basic Weapon Training (Bolt)', type: 'COMBATE',
    description: 'Entrenado en el uso de armas bólter básicas.',
    effect: 'Sin penalizador al usar armas Bolt básicas.',
  },
  {
    key: 'basic-flame', label: 'Basic Weapon Training (Flame)', type: 'COMBATE',
    description: 'Entrenado en el uso de lanzallamas.',
    effect: 'Sin penalizador al usar armas de fuego básicas.',
  },
  {
    key: 'basic-launcher', label: 'Basic Weapon Training (Launcher)', type: 'COMBATE',
    description: 'Entrenado en el uso de lanzadores.',
    effect: 'Sin penalizador al usar lanzadores básicos.',
  },
  {
    key: 'pistol-las', label: 'Pistol Training (Las)', type: 'COMBATE',
    description: 'Entrenado en el uso de pistolas láser.',
    effect: 'Sin penalizador al usar pistolas Las.',
  },
  {
    key: 'pistol-auto', label: 'Pistol Training (Auto)', type: 'COMBATE',
    description: 'Entrenado en el uso de pistolas automáticas.',
    effect: 'Sin penalizador al usar pistolas Auto.',
  },
  {
    key: 'pistol-bolt', label: 'Pistol Training (Bolt)', type: 'COMBATE',
    description: 'Entrenado en el uso de pistolas bólter.',
    effect: 'Sin penalizador al usar pistolas Bolt.',
  },
  {
    key: 'melee-prim', label: 'Melee Weapon Training (Primitive)', type: 'COMBATE',
    description: 'Entrenado en armas CaC primitivas.',
    effect: 'Sin penalizador al usar armas CaC primitivas.',
  },
  {
    key: 'melee-power', label: 'Melee Weapon Training (Power)', type: 'COMBATE',
    prerequisites: 'WS 30',
    description: 'Entrenado en el uso de armas de poder.',
    effect: 'Sin penalizador al usar armas de Poder CaC.',
  },
  {
    key: 'heavy-las', label: 'Heavy Weapon Training (Las)', type: 'COMBATE',
    description: 'Entrenado en el uso de armas pesadas láser.',
    effect: 'Sin penalizador al usar armas pesadas Las.',
  },
  {
    key: 'heavy-auto', label: 'Heavy Weapon Training (Auto)', type: 'COMBATE',
    description: 'Entrenado en el uso de armas pesadas automáticas.',
    effect: 'Sin penalizador al usar armas pesadas Auto.',
  },
  {
    key: 'heavy-bolt', label: 'Heavy Weapon Training (Bolt)', type: 'COMBATE',
    description: 'Entrenado en el uso de Heavy Bolter.',
    effect: 'Sin penalizador al usar armas pesadas Bolt.',
  },
].sort((a, b) => a.label.localeCompare(b.label))
