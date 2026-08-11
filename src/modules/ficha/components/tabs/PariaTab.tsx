import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addPariahMejora, removePariahMejora, updatePariahMejoraNotes } from '../../services/fichaSlice'
import { PARIAH_TRAITS } from '@/core/data/darkheresy'
import { EmptyState } from '../EmptyState'

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function PariaTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  if (!char) return <NoChar />

  if (char.info.career === 'Psíquico Imperial') {
    return (
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Rasgo Nulo / Paria</h3>
        </div>

        <div className="mx-4 mt-3 bg-surface border border-gold border-l-4 border-l-gold-bright px-3.5 py-3">
          <p className="font-mono text-xs text-parchment leading-relaxed">
            Los Nulos no pueden ser psíquicos: la subclase Paria es incompatible con la carrera Psíquico Imperial.
          </p>
        </div>
      </div>
    )
  }

  const pariahMejoras = char.pariahMejoras ?? [] // personajes persistidos antes de esta migración
  const ownedNames = new Set(pariahMejoras.map(m => m.name))
  const available = PARIAH_TRAITS.filter(t => !ownedNames.has(t.name) && (t.req === '—' || ownedNames.has(t.req)))

  function handleBuy(trait: (typeof PARIAH_TRAITS)[number]) {
    dispatch(addPariahMejora({
      charId: char!.id,
      mejora: { name: trait.name, cost: trait.cost, req: trait.req, desc: trait.desc, notes: '' },
    }))
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Rasgo Nulo / Paria</h3>
      </div>

      <div className="mx-4 mt-3 bg-surface border border-gold border-l-4 border-l-gold-bright px-3.5 py-3">
        <p className="font-mono text-xs text-parchment leading-relaxed">
          Ajustes de creación (aplicar manualmente en Características/Estado): 1 Punto de Destino
          menos del sacado, y Empatía/Carisma base reducida a la mitad de forma permanente.
        </p>
      </div>

      {available.length > 0 && (
        <div className="flex flex-col gap-2 px-4 py-3">
          {available.map(trait => (
            <div key={trait.name} className="bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-rajdhani text-[15px] font-bold text-gold-bright mb-1">{trait.name}</div>
                  <div className="font-mono text-[9px] tracking-[2px] text-gold mb-1.5">
                    {trait.cost} XP{trait.req !== '—' ? ` · Req: ${trait.req}` : ''}
                  </div>
                  <div className="font-mono text-[11px] text-parchment leading-relaxed">{trait.desc}</div>
                </div>
                <button
                  onClick={() => handleBuy(trait)}
                  className="shrink-0 font-display text-[9px] uppercase tracking-[1px] px-2.5 py-1.5 bg-surface-2 border border-gold text-gold hover:bg-gold/10 transition-colors"
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pariahMejoras.length === 0 ? (
        <div className="p-4">
          <EmptyState icon="◈" label="Sin rasgos Nulo/Paria" />
        </div>
      ) : (
        <div className="flex flex-col px-4 py-2">
          {pariahMejoras.map(m => (
            <div key={m.id} className="flex flex-col items-stretch gap-1 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-rajdhani text-[15px] font-bold text-gold-bright mb-1">{m.name}</div>
                  <div className="font-mono text-[9px] tracking-[2px] text-gold mb-1.5">
                    {m.req !== '—' ? `Req: ${m.req}` : ''}
                  </div>
                  {m.desc && <div className="font-mono text-[11px] text-parchment mt-1 leading-relaxed">{m.desc}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="font-display text-[10px] text-parchment-dim">{m.cost} XP</span>
                  <button
                    onClick={() => dispatch(removePariahMejora({ charId: char!.id, mejoraId: m.id }))}
                    className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors"
                    aria-label="Eliminar rasgo"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <textarea
                placeholder="Notas personales..."
                value={m.notes ?? ''}
                onChange={e => dispatch(updatePariahMejoraNotes({ charId: char!.id, mejoraId: m.id, notes: e.target.value }))}
                className="bg-surface border border-rim text-parchment font-mono text-[11px] px-2 py-1.5 outline-none focus:border-crimson transition-colors resize-y min-h-9 w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
