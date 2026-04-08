import { useAppSelector } from '@/core/store/hooks'
import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { CharInfoGrid } from './atributos/CharInfoGrid'
import { AttributeCard } from './atributos/AttributeCard'
import { WoundsPanel } from './atributos/WoundsPanel'

export function AtributosTab() {
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
      {/* Info del personaje */}
      <CharInfoGrid char={char} />

      {/* Atributos */}
      <div className="bg-surface-2 border border-rim">
        <div className="flex items-center justify-between border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Características
          </h3>
          <span className="font-mono text-[9px] text-parchment-dim">
            BASE + AVANCES + BONUS = TOTAL
          </span>
        </div>
        <div className="grid grid-cols-1 gap-px bg-rim p-px sm:grid-cols-2">
          {ATTRIBUTES.map(def => (
            <AttributeCard
              key={def.key}
              charId={char.id}
              def={def}
              values={char.attrs[def.key] ?? { base: 0, advances: 0, bonuses: 0, bonusNote: '' }}
            />
          ))}
        </div>
      </div>

      {/* Estado vital */}
      <WoundsPanel char={char} />
    </div>
  )
}
