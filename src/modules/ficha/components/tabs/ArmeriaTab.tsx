import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addWeapon, addArmor, addGear } from '../../services/fichaSlice'
import { WeaponCard } from './armeria/WeaponCard'
import { ArmorCard } from './armeria/ArmorCard'
import { GearList } from './armeria/GearList'
import { CATALOG } from '@/core/data/darkheresy/equipment'
import type { CatalogWeapon, CatalogArmor, CatalogGear } from '@/core/data/darkheresy/equipment'

type WeaponFilter = 'todas' | 'pistola' | 'basica' | 'pesada' | 'cac' | 'lanzadora'
type GearFilter   = 'todo' | 'equipo' | 'medicinal'

const WEAPON_FILTERS: { key: WeaponFilter; label: string }[] = [
  { key: 'todas',     label: 'Todas'      },
  { key: 'pistola',   label: 'Pistolas'   },
  { key: 'basica',    label: 'Básicas'    },
  { key: 'pesada',    label: 'Pesadas'    },
  { key: 'cac',       label: 'CaC'        },
  { key: 'lanzadora', label: 'Lanzadoras' },
]

const CATALOG_WEAPONS = CATALOG.filter(i => i.kind === 'weapon') as CatalogWeapon[]
const CATALOG_ARMORS  = CATALOG.filter(i => i.kind === 'armor')  as CatalogArmor[]
const CATALOG_GEAR    = CATALOG.filter(i => i.kind === 'gear')   as CatalogGear[]

export function ArmeriaTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [wpFilter, setWpFilter] = useState<WeaponFilter>('todas')
  const [wpSearch, setWpSearch] = useState('')
  const [wpAdded, setWpAdded]   = useState<Set<string>>(new Set())

  const [arSearch, setArSearch] = useState('')
  const [arAdded, setArAdded]   = useState<Set<string>>(new Set())

  const [grFilter, setGrFilter] = useState<GearFilter>('todo')
  const [grSearch, setGrSearch] = useState('')
  const [grAdded, setGrAdded]   = useState<Set<string>>(new Set())

  if (!char) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          Sin operativo seleccionado
        </p>
      </div>
    )
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  function flashAdded(set: Set<string>, setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) {
    setter(new Set(set).add(id))
    setTimeout(() => setter(prev => { const n = new Set(prev); n.delete(id); return n }), 1500)
  }

  function handleAddWeapon(w: CatalogWeapon) {
    dispatch(addWeapon({
      charId: char!.id,
      weapon: { name: w.name, cls: w.cls, dmgType: w.dmgType, range: w.range, rof: w.rof, dmg: w.dmg, pen: w.pen, clip: w.clip, notes: w.notes },
    }))
    flashAdded(wpAdded, setWpAdded, w.id)
  }

  function handleAddArmor(a: CatalogArmor) {
    dispatch(addArmor({
      charId: char!.id,
      armor: { name: a.name, notes: a.notes, head: a.head, body: a.body, arms: a.arms, legs: a.legs },
    }))
    flashAdded(arAdded, setArAdded, a.id)
  }

  function handleAddGear(g: CatalogGear) {
    dispatch(addGear({ charId: char!.id, item: { name: g.name, qty: 1, notes: g.description } }))
    flashAdded(grAdded, setGrAdded, g.id)
  }

  // ── Filtros ───────────────────────────────────────────────────────────────
  const filteredWeapons = CATALOG_WEAPONS.filter(w =>
    (wpFilter === 'todas' || w.category === wpFilter) &&
    (!wpSearch || w.name.toLowerCase().includes(wpSearch.toLowerCase()))
  )

  const filteredArmors = CATALOG_ARMORS.filter(a =>
    !arSearch || a.name.toLowerCase().includes(arSearch.toLowerCase())
  )

  const filteredGear = CATALOG_GEAR.filter(g =>
    (grFilter === 'todo' || g.category === grFilter) &&
    (!grSearch || g.name.toLowerCase().includes(grSearch.toLowerCase()))
  )

  const inputCls = 'w-full bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors'

  // Reusable catalog row builder
  function CatalogRow({ added, onAdd, children }: { added: boolean; onAdd: () => void; children: React.ReactNode }) {
    return (
      <div className="bg-surface px-3 py-2 flex items-start gap-2">
        <div className="flex-1 min-w-0">{children}</div>
        <button
          onClick={onAdd}
          className={[
            'shrink-0 font-display text-[9px] uppercase tracking-[1px] px-2.5 py-1.5 border transition-all',
            added
              ? 'bg-neon/20 border-neon text-neon'
              : 'border-rim-bright text-parchment-dim hover:border-crimson hover:text-crimson',
          ].join(' ')}
        >
          {added ? '✓' : '+'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">

      {/* ── ARSENAL ───────────────────────────────────────────────────────── */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Arsenal</h3>
        </div>
        <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
          <input type="text" value={wpSearch} onChange={e => setWpSearch(e.target.value)} placeholder="Buscar arma..." className={inputCls} />
          <div className="flex overflow-x-auto gap-px scrollbar-none">
            {WEAPON_FILTERS.map(f => (
              <button key={f.key} onClick={() => setWpFilter(f.key)}
                className={['shrink-0 px-2.5 py-1 font-display text-[8px] uppercase tracking-[1px] border transition-colors',
                  wpFilter === f.key ? 'bg-crimson border-crimson text-white' : 'border-rim-bright text-parchment-dim hover:border-parchment hover:text-parchment',
                ].join(' ')}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-px bg-rim">
          {filteredWeapons.map(w => (
            <CatalogRow key={w.id} added={wpAdded.has(w.id)} onAdd={() => handleAddWeapon(w)}>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-rajdhani text-sm font-semibold text-parchment">{w.name}</span>
                <span className="font-display text-[7px] px-1 py-0.5 border border-crimson text-crimson uppercase tracking-[1px]">{w.cls}</span>
                <span className="font-display text-[7px] px-1 py-0.5 border border-rim-bright text-parchment-dim uppercase tracking-[1px]">{w.dmgType}</span>
              </div>
              <div className="flex flex-wrap gap-x-3">
                {w.range !== '-' && <span className="font-mono text-[9px] text-parchment-dim"><span className="text-gold">RNG</span> {w.range}</span>}
                {w.rof   !== '-' && <span className="font-mono text-[9px] text-parchment-dim"><span className="text-gold">ROF</span> {w.rof}</span>}
                <span className="font-mono text-[9px] text-parchment-dim"><span className="text-gold">DMG</span> {w.dmg}</span>
                <span className="font-mono text-[9px] text-parchment-dim"><span className="text-gold">PEN</span> {w.pen}</span>
                {w.clip !== '-' && <span className="font-mono text-[9px] text-parchment-dim"><span className="text-gold">CAR</span> {w.clip}</span>}
                {w.notes && <span className="font-mono text-[9px] text-parchment-dim/60">{w.notes}</span>}
              </div>
            </CatalogRow>
          ))}
        </div>
        {char.weapons.length > 0 && (
          <div className="border-t border-rim">
            <div className="px-4 py-2 bg-crimson/5">
              <p className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim">Equipadas ({char.weapons.length})</p>
            </div>
            <div className="flex flex-col gap-px bg-rim">
              {char.weapons.map(w => <WeaponCard key={w.id} charId={char.id} weapon={w} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── ARMADURA ──────────────────────────────────────────────────────── */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Armadura</h3>
        </div>
        <div className="px-4 pt-3 pb-2">
          <input type="text" value={arSearch} onChange={e => setArSearch(e.target.value)} placeholder="Buscar armadura..." className={inputCls} />
        </div>
        <div className="flex flex-col gap-px bg-rim">
          {filteredArmors.map(a => (
            <CatalogRow key={a.id} added={arAdded.has(a.id)} onAdd={() => handleAddArmor(a)}>
              <p className="font-rajdhani text-sm font-semibold text-parchment">{a.name}</p>
              <div className="flex gap-x-3 flex-wrap">
                {[['Cab', a.head], ['Cue', a.body], ['Bra', a.arms], ['Pie', a.legs]].map(([l, v]) =>
                  v ? <span key={l as string} className="font-mono text-[9px] text-parchment-dim"><span className="text-neon">{l as string}</span> {v as number}</span> : null
                )}
                {a.notes && <span className="font-mono text-[9px] text-parchment-dim/60">{a.notes}</span>}
              </div>
            </CatalogRow>
          ))}
        </div>
        {char.armors.length > 0 && (
          <div className="border-t border-rim">
            <div className="px-4 py-2 bg-crimson/5">
              <p className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim">Equipada ({char.armors.length})</p>
            </div>
            <div className="flex flex-col gap-px bg-rim">
              {char.armors.map(a => <ArmorCard key={a.id} charId={char.id} armor={a} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── EQUIPO & PERTRECHOS ───────────────────────────────────────────── */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Equipo & Pertrechos</h3>
        </div>
        <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
          <input type="text" value={grSearch} onChange={e => setGrSearch(e.target.value)} placeholder="Buscar equipo..." className={inputCls} />
          <div className="flex gap-px">
            {(['todo', 'equipo', 'medicinal'] as const).map(f => (
              <button key={f} onClick={() => setGrFilter(f)}
                className={['flex-1 py-1 font-display text-[8px] uppercase tracking-[1px] border transition-colors',
                  grFilter === f ? 'bg-crimson border-crimson text-white' : 'border-rim-bright text-parchment-dim hover:border-parchment hover:text-parchment',
                ].join(' ')}
              >{f === 'todo' ? 'Todo' : f === 'equipo' ? 'Equipo' : 'Medicinal'}</button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-px bg-rim">
          {filteredGear.map(g => (
            <CatalogRow key={g.id} added={grAdded.has(g.id)} onAdd={() => handleAddGear(g)}>
              <p className="font-rajdhani text-sm font-semibold text-parchment">{g.name}</p>
              <p className="font-mono text-[9px] text-parchment-dim leading-snug">{g.description}</p>
            </CatalogRow>
          ))}
        </div>
        {char.gear.length > 0 && (
          <div className="border-t border-rim">
            <div className="px-4 py-2 bg-crimson/5">
              <p className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim">En inventario ({char.gear.length})</p>
            </div>
            <GearList charId={char.id} gear={char.gear} />
          </div>
        )}
      </div>

    </div>
  )
}
