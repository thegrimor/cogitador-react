import { useAppSelector } from '@/core/store/hooks'
import { ATTRIBUTES } from '@/core/data/darkheresy/attributes'
import { AttributeCard } from './atributos/AttributeCard'
import { AttrCostTable } from './atributos/AttrCostTable'

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

/** // CARACTERÍSTICAS del HTML legacy (panel-attrs) — antes fusionado dentro de "Atributos". */
export function CaracteristicasTab() {
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  if (!char) return <NoChar />

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="bg-surface-2 border border-rim">
        <div className="flex items-center justify-between border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Características
          </h3>
          <span className="font-mono text-[9px] text-parchment-dim">
            BASE + AVANCES = TOTAL
          </span>
        </div>
        <div className="flex flex-col gap-1.5 p-4">
          {ATTRIBUTES.map(def => (
            <AttributeCard
              key={def.key}
              charId={char.id}
              career={char.info.career}
              def={def}
              values={char.attrs[def.key] ?? { base: 0, dots: 0, bonuses: 0, bonusNote: '' }}
            />
          ))}
        </div>
      </div>

      <AttrCostTable char={char} />
    </div>
  )
}
