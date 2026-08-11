export interface PariahTraitDefinition {
  name: string   // 'Intocable' | 'Nulo' | 'Paria'
  cost: number   // xp
  req: string    // '—' | nombre del rasgo previo
  desc: string
}

// Rasgo Nulo — progresión de subclase Paria, comprada con PE en orden (cada uno requiere el anterior).
export const PARIAH_TRAITS: PariahTraitDefinition[] = [
  {
    name: 'Intocable', cost: 100, req: '—',
    desc: 'Características: Em/Fel se reduce en 10 al crearlo (mínimo 1; después sube con normalidad). ' +
      'Presencia inquietante: -10 a todas las pruebas de Em/Fel. ' +
      'Vacío psíquico: nunca obtiene Poderes Psíquicos, Fe Pura (los 10 no explotan), Hechicería ni talentos relacionados. ' +
      'Inmune Psíquico: inmune a poderes psíquicos, energía psíquica y efectos dirigidos contra él (disformidad, posesión, ' +
      'brujería, corrupción por choque de disformidad...); no detectable por Psicencia/Presencia Sensorial. ' +
      'Disrupción Psíquica: poderes/habilidades psíquicas en un radio igual a su Bono de Voluntad (metros) sufren ' +
      'umbral +10 y dificultad -20; entidades con Inestabilidad del Warp en esa área sufren el doble de daño.',
  },
  {
    name: 'Nulo', cost: 400, req: 'Intocable',
    desc: 'Salvo que el psíquico supere una prueba umbral de 25, el Nulo no puede ser contactado, percibido, ' +
      'influenciado ni controlado psíquicamente; los Poderes Psíquicos y habilidades de distorsión dirigidos ' +
      'directamente a él fallan como si la Prueba Psíquica se hubiera fallado. Poderes/habilidades de teletransporte ' +
      'dirigidos a un área dentro de Voluntad/2 en metros de él aumentan su umbral en 10. ' +
      '-10 en pruebas de Comunidad con no psíquicos, -30 con psíquicos (odio irracional instintivo). ' +
      'Cualquier psíquico en contacto físico con él sufre un nivel de fatiga.',
  },
  {
    name: 'Paria', cost: 1000, req: 'Nulo',
    desc: 'Salvo prueba umbral 50, no puede ser objetivo de ningún poder psíquico (dañino o beneficioso) ni ser ' +
      'afectado por poderes psíquicos, fenómenos psíquicos o Peligros de la Disformidad en su área. Proyecta un área ' +
      'de quietud psíquica de radio igual a su Voluntad (metros) que protege también a otros dentro de ella. ' +
      'Causa Miedo 2 en psíquicos y es detectado automáticamente por Psicencia; un psíquico que se acerque a ' +
      'Bono de Voluntad en metros gana un nivel de fatiga; si le toca, pierde 1d10 de F/R/Voluntad. Los no psíquicos ' +
      'requieren una prueba de Voluntad a -20% para detectarle. ' +
      'Arrancar el Alma (acción completa, 1×combate): daño en área de radio = Voluntad/10 en metros, tirada ' +
      '2d10+BV; los afectados tiran Voluntad vs. ese resultado — éxito: aturdido 1 asalto; fallo: 1d10+BV daño ' +
      '(ignora armadura); fallo por 2+ grados: 2d10+BV daño (ignora armadura) e Inutilizado psíquicamente 1d5 asaltos ' +
      '(no puede usar poderes psíquicos, canalizar ni activar talentos psíquicos).',
  },
]
