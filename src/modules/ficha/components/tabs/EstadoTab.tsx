import { useAppSelector } from '@/core/store/hooks'
import { WoundsPanel } from './atributos/WoundsPanel'

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

/** // ESTADO del HTML legacy (panel-vital) — antes fusionado dentro de "Atributos". */
export function EstadoTab() {
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  if (!char) return <NoChar />

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <WoundsPanel char={char} />
    </div>
  )
}
