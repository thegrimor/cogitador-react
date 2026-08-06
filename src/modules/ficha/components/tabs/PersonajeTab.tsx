import { useAppSelector } from '@/core/store/hooks'
import { CharInfoGrid } from './atributos/CharInfoGrid'

/** // PERSONAJE del HTML legacy (panel-charinfo) — antes fusionado dentro de "Atributos". */
export function PersonajeTab() {
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  if (!char) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          Sin operativo seleccionado
        </p>
        <p className="font-mono text-xs text-parchment-dim/50 text-center">
          Selecciona o crea un personaje desde el selector superior
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <CharInfoGrid char={char} />
    </div>
  )
}
