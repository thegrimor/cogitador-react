import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addWeapon, addArmor, addGear } from '../../services/fichaSlice'
import { CATALOG, CATEGORY_LABELS } from '@/core/data/darkheresy/equipment'
import type { EquipmentCategory, CatalogWeapon, CatalogArmor, CatalogGear } from '@/core/data/darkheresy/equipment'

const FILTER_TABS: { key: EquipmentCategory | 'todo'; label: string }[] = [
  { key: 'todo',     label: 'Todo'     },
  { key: 'pistola',  label: 'Pistolas' },
  { key: 'basica',   label: 'Básicas'  },
  { key: 'pesada',   label: 'Pesadas'  },
  { key: 'cac',      label: 'CaC'      },
  { key: 'armadura', label: 'Armadura' },
  { key: 'equipo',   label: 'Equipo'   },
  { key: 'medicinal',label: 'Medicinal'},
]

export function EquipoTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [filter, setFilter] = useState<EquipmentCategory | 'todo'>('todo')
  const [search, setSearch] = useState('')
  const [added, setAdded]   = useState<Set<string>>(new Set())

  if (!char) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          Sin operativo seleccionado
        </p>
      </div>
    )
  }

  const filtered = CATALOG.filter(item => {
    const matchesFilter = filter === 'todo' || item.category === filter
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function handleAdd(item: typeof CATALOG[number]) {
    if (!char) return

    if (item.kind === 'weapon') {
      const w = item as CatalogWeapon
      dispatch(addWeapon({
        charId: char.id,
        weapon: { name: w.name, cls: w.cls, dmgType: w.dmgType, range: w.range, rof: w.rof, dmg: w.dmg, pen: w.pen, clip: w.clip, notes: w.notes },
      }))
    } else if (item.kind === 'armor') {
      const a = item as CatalogArmor
      dispatch(addArmor({
        charId: char.id,
        armor: { name: a.name, notes: a.notes, head: a.head, body: a.body, arms: a.arms, legs: a.legs },
      }))
    } else {
      const g = item as CatalogGear
      dispatch(addGear({ charId: char.id, item: { name: g.name, qty: 1, notes: g.description } }))
    }

    // Visual feedback: mark as added briefly
    setAdded(prev => new Set(prev).add(item.id))
    setTimeout(() => setAdded(prev => { const next = new Set(prev); next.delete(item.id); return next }), 1500)
  }

  function categoryColor(cat: EquipmentCategory) {
    const map: Record<EquipmentCategory, string> = {
      pistola:   'text-crimson border-crimson',
      basica:    'text-crimson border-crimson',
      pesada:    'text-crimson border-crimson',
      cac:       'text-crimson border-crimson',
      lanzadora: 'text-crimson border-crimson',
      armadura:  'text-neon border-neon',
      equipo:    'text-gold border-gold',
      medicinal: 'text-gold border-gold',
    }
    return map[cat] ?? 'text-parchment-dim border-rim-bright'
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Catálogo de Equipo — DH1
          </h3>
          <p className="font-mono text-[9px] text-parchment-dim mt-1">
            Añade items al operativo activo. Las armas van a Armería, el equipo a Pertrechos.
          </p>
        </div>

        {/* Búsqueda */}
        <div className="px-4 pt-3 pb-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Filtros de categoría */}
        <div className="flex overflow-x-auto gap-px px-4 pb-3 scrollbar-none">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={[
                'shrink-0 px-2.5 py-1 font-display text-[8px] uppercase tracking-[1px] border transition-colors whitespace-nowrap',
                filter === tab.key
                  ? 'bg-crimson border-crimson text-white'
                  : 'border-rim-bright text-parchment-dim hover:border-parchment hover:text-parchment',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista del catálogo */}
        <div className="flex flex-col gap-px bg-rim">
          {filtered.length === 0 ? (
            <div className="bg-surface-2 px-4 py-8 text-center">
              <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim">
                Sin resultados
              </p>
            </div>
          ) : (
            filtered.map(item => {
              const isAdded = added.has(item.id)
              return (
                <div key={item.id} className="bg-surface px-3 py-2.5 flex items-start gap-3">
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-rajdhani text-sm font-semibold text-parchment">{item.name}</span>
                      <span className={`font-display text-[7px] uppercase tracking-[1px] px-1 py-0.5 border ${categoryColor(item.category as EquipmentCategory)}`}>
                        {CATEGORY_LABELS[item.category as EquipmentCategory] ?? item.category}
                      </span>
                    </div>

                    {/* Stats para armas */}
                    {item.kind === 'weapon' && (
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {(item as CatalogWeapon).range !== '-' && (
                          <span className="font-mono text-[9px] text-parchment-dim">
                            <span className="text-gold">RNG</span> {(item as CatalogWeapon).range}
                          </span>
                        )}
                        {(item as CatalogWeapon).rof !== '-' && (
                          <span className="font-mono text-[9px] text-parchment-dim">
                            <span className="text-gold">ROF</span> {(item as CatalogWeapon).rof}
                          </span>
                        )}
                        <span className="font-mono text-[9px] text-parchment-dim">
                          <span className="text-gold">DMG</span> {(item as CatalogWeapon).dmg}
                        </span>
                        <span className="font-mono text-[9px] text-parchment-dim">
                          <span className="text-gold">PEN</span> {(item as CatalogWeapon).pen}
                        </span>
                        {(item as CatalogWeapon).notes && (
                          <span className="font-mono text-[9px] text-parchment-dim">
                            {(item as CatalogWeapon).notes}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats para armadura */}
                    {item.kind === 'armor' && (
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        {[
                          ['Cab', (item as CatalogArmor).head],
                          ['Cue', (item as CatalogArmor).body],
                          ['Bra', (item as CatalogArmor).arms],
                          ['Pie', (item as CatalogArmor).legs],
                        ].map(([label, val]) => (
                          val ? (
                            <span key={label as string} className="font-mono text-[9px] text-parchment-dim">
                              <span className="text-neon">{label as string}</span> {val as number}
                            </span>
                          ) : null
                        ))}
                        {(item as CatalogArmor).notes && (
                          <span className="font-mono text-[9px] text-parchment-dim">
                            {(item as CatalogArmor).notes}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Descripción para gear */}
                    {item.kind === 'gear' && (
                      <p className="font-mono text-[9px] text-parchment-dim leading-snug">
                        {(item as CatalogGear).description}
                      </p>
                    )}
                  </div>

                  {/* Botón añadir */}
                  <button
                    onClick={() => handleAdd(item)}
                    className={[
                      'shrink-0 font-display text-[9px] uppercase tracking-[2px] px-2.5 py-1.5 border transition-all',
                      isAdded
                        ? 'bg-neon/20 border-neon text-neon'
                        : 'border-rim-bright text-parchment-dim hover:border-crimson hover:text-crimson',
                    ].join(' ')}
                  >
                    {isAdded ? '✓' : '+'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
