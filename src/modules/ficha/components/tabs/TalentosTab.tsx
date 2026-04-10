import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addTalent, removeTalent } from '../../services/fichaSlice'
import { TALENTS } from '@/core/data/darkheresy/talents'
import type { TalentType } from '@/core/data/darkheresy/talents'

const ALL_TYPES: (TalentType | 'TODOS')[] = [
  'TODOS', 'COMBATE', 'GENERAL', 'TECH', 'PSÍQUICO', 'BENEDICTION', 'MECÁNICO', 'OTRO',
]

const TYPE_COLORS: Record<string, string> = {
  COMBATE:     'text-crimson border-crimson',
  MECÁNICO:    'text-gold border-gold',
  PSÍQUICO:    'text-blue border-blue',
  GENERAL:     'text-parchment-dim border-rim-bright',
  BENEDICTION: 'text-neon border-neon',
  TECH:        'text-gold border-gold',
  OTRO:        'text-parchment-dim border-rim-bright',
}

export function TalentosTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<TalentType | 'TODOS'>('TODOS')
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!char) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          Sin operativo seleccionado
        </p>
      </div>
    )
  }

  // index de talentos en ficha por nombre
  const talentKeys = new Set(char.talents.map(t => t.name))

  const filtered = TALENTS.filter(def => {
    const matchSearch = !search || def.label.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'TODOS' || def.type === filter
    return matchSearch && matchFilter
  })

  function handleToggle(def: typeof TALENTS[number]) {
    if (talentKeys.has(def.label)) {
      const t = char!.talents.find(t => t.name === def.label)
      if (t) dispatch(removeTalent({ charId: char!.id, talentId: t.id }))
    } else {
      dispatch(addTalent({
        charId: char!.id,
        talent: {
          name: def.label,
          type: def.type,
          desc: def.description,
          effect: def.effect ?? '',
        },
      }))
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Talentos
          </h3>
          <p className="font-mono text-[9px] text-parchment-dim mt-1">
            {char.talents.length} talento{char.talents.length !== 1 ? 's' : ''} adquirido{char.talents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Búsqueda */}
        <div className="px-4 pt-3 pb-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar talento..."
            className="w-full bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Filtro por tipo */}
        <div className="flex overflow-x-auto gap-px px-4 pb-3 scrollbar-none">
          {ALL_TYPES.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'shrink-0 px-2.5 py-1 font-display text-[8px] uppercase tracking-[1px] border transition-colors whitespace-nowrap',
                filter === f
                  ? 'bg-crimson border-crimson text-white'
                  : 'border-rim-bright text-parchment-dim hover:border-parchment hover:text-parchment',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-px bg-rim">
          {filtered.map(def => {
            const owned = talentKeys.has(def.label)
            const isOpen = expanded === def.key
            const typeColor = TYPE_COLORS[def.type] ?? TYPE_COLORS['OTRO']

            return (
              <div
                key={def.key}
                className={[
                  'transition-colors',
                  owned ? 'bg-surface border-l-2 border-l-crimson-dim' : 'bg-surface-2',
                ].join(' ')}
              >
                <div className="px-3 py-2 flex items-center gap-2">
                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : def.key)}
                    className="flex-1 flex items-center gap-2 text-left min-w-0"
                  >
                    <span className={[
                      'font-rajdhani text-sm font-semibold truncate',
                      owned ? 'text-parchment' : 'text-parchment-dim',
                    ].join(' ')}>
                      {def.label}
                    </span>
                    <span className={`shrink-0 font-display text-[7px] uppercase tracking-[1px] px-1.5 py-0.5 border ${typeColor}`}>
                      {def.type}
                    </span>
                    {def.prerequisites && (
                      <span className="shrink-0 font-mono text-[8px] text-parchment-dim/50 hidden sm:block truncate">
                        Req: {def.prerequisites}
                      </span>
                    )}
                  </button>

                  {/* Añadir / Quitar */}
                  <button
                    onClick={() => handleToggle(def)}
                    className={[
                      'shrink-0 font-display text-[9px] uppercase tracking-[1px] px-2.5 py-1.5 border transition-all',
                      owned
                        ? 'bg-crimson/20 border-crimson text-crimson hover:bg-crimson/40'
                        : 'border-rim-bright text-parchment-dim hover:border-crimson hover:text-crimson',
                    ].join(' ')}
                  >
                    {owned ? '✓' : '+'}
                  </button>
                </div>

                {/* Detalle expandido */}
                {isOpen && (
                  <div className="px-4 pb-3 flex flex-col gap-1 border-t border-rim">
                    {def.prerequisites && (
                      <p className="font-mono text-[9px] text-gold mt-2">
                        Requisitos: {def.prerequisites}
                      </p>
                    )}
                    <p className="font-rajdhani text-sm text-parchment-dim leading-snug mt-1">
                      {def.description}
                    </p>
                    {def.effect && (
                      <p className="font-mono text-[10px] text-neon">► {def.effect}</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
