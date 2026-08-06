import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addWeapon, removeWeapon, addArmor, removeArmor, addGear, removeGear } from '../../services/fichaSlice'
import { WEAPONS, ARMORS, GEAR } from '@/core/data/darkheresy'
import { EmptyState } from '../EmptyState'

type WeaponForm = {
  name: string
  cls: string
  dmgType: string
  range: string
  rof: string
  dmg: string
  pen: number
  clip: string
  notes: string
}

type ArmorForm = {
  name: string
  notes: string
  head: number
  body: number
  arms: number
  legs: number
}

type GearForm = {
  name: string
  qty: number
  notes: string
}

const EMPTY_WEAPON: WeaponForm = {
  name: '', cls: 'Básica', dmgType: 'E (Energía)', range: '', rof: '', dmg: '', pen: 0, clip: '', notes: '',
}
const EMPTY_ARMOR: ArmorForm = { name: '', notes: '', head: 0, body: 0, arms: 0, legs: 0 }
const EMPTY_GEAR: GearForm = { name: '', qty: 1, notes: '' }

// Mismos valores que #wpClass / #wpDmgType del HTML legacy
const WEAPON_CLASSES = ['Básica', 'Pesada', 'Pistola', 'CaC', 'Lanzadora', 'Especial']
const DMG_TYPES = ['E (Energía)', 'I (Impacto)', 'X (Explosivo)', 'R (Rending)', 'A (Acerado)']

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function ArmeriaTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [selWeapon, setSelWeapon] = useState('')
  const [weaponGroupFilter, setWeaponGroupFilter] = useState('')
  const [showWeaponForm, setShowWeaponForm] = useState(false)
  const [weaponForm, setWeaponForm] = useState<WeaponForm>(EMPTY_WEAPON)

  const [selArmor, setSelArmor] = useState('')
  const [armorGroupFilter, setArmorGroupFilter] = useState('')
  const [showArmorForm, setShowArmorForm] = useState(false)
  const [armorForm, setArmorForm] = useState<ArmorForm>(EMPTY_ARMOR)

  const [selGear, setSelGear] = useState('')
  const [gearGroupFilter, setGearGroupFilter] = useState('')
  const [showGearForm, setShowGearForm] = useState(false)
  const [gearForm, setGearForm] = useState<GearForm>(EMPTY_GEAR)

  if (!char) return <NoChar />

  const selWeaponDef = WEAPONS.find(w => w.name === selWeapon)
  const selArmorDef = ARMORS.find(a => a.name === selArmor)
  const selGearDef = GEAR.find(g => g.name === selGear)

  const weaponGroups = Array.from(new Set(WEAPONS.map(w => w.group))).sort()
  const armorGroups = Array.from(new Set(ARMORS.map(a => a.type))).sort()
  const gearGroups = Array.from(new Set(GEAR.map(g => g.category))).sort()

  const filteredWeapons = weaponGroupFilter ? WEAPONS.filter(w => w.group === weaponGroupFilter) : WEAPONS
  const filteredArmors = armorGroupFilter ? ARMORS.filter(a => a.type === armorGroupFilter) : ARMORS
  const filteredGear = gearGroupFilter ? GEAR.filter(g => g.category === gearGroupFilter) : GEAR

  function addQuickWeapon() {
    if (!selWeaponDef) return
    dispatch(addWeapon({ charId: char!.id, weapon: { ...selWeaponDef } }))
    setSelWeapon('')
  }

  function addManualWeapon() {
    if (!weaponForm.name.trim()) return
    dispatch(addWeapon({ charId: char!.id, weapon: { ...weaponForm } }))
    setWeaponForm(EMPTY_WEAPON)
    setShowWeaponForm(false)
  }

  function addQuickArmor() {
    if (!selArmorDef) return
    dispatch(addArmor({ charId: char!.id, armor: { name: selArmorDef.name, notes: selArmorDef.notes, head: selArmorDef.head, body: selArmorDef.body, arms: selArmorDef.arms, legs: selArmorDef.legs } }))
    setSelArmor('')
  }

  function addManualArmor() {
    if (!armorForm.name.trim()) return
    dispatch(addArmor({ charId: char!.id, armor: { ...armorForm } }))
    setArmorForm(EMPTY_ARMOR)
    setShowArmorForm(false)
  }

  function addQuickGear() {
    if (!selGearDef) return
    dispatch(addGear({ charId: char!.id, item: { name: selGearDef.name, qty: 1, notes: selGearDef.notes } }))
    setSelGear('')
  }

  function addManualGear() {
    if (!gearForm.name.trim()) return
    dispatch(addGear({ charId: char!.id, item: { ...gearForm } }))
    setGearForm(EMPTY_GEAR)
    setShowGearForm(false)
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Armería</h3>
      </div>

      {/* Arsenal — apilado con Armadura y Equipo, igual que el HTML legacy (sin sub-tabs) */}
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5 flex items-center justify-between gap-2">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Arsenal</h4>
          <button
            onClick={() => setShowWeaponForm(v => !v)}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
          >
            + Manual
          </button>
        </div>
        <div className="flex flex-col gap-0">
          <div className="mx-4 mt-3 bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
            <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Armas del Libro</h4>
            <div className="flex flex-wrap gap-2 items-end">
              <select
                value={weaponGroupFilter}
                onChange={e => { setWeaponGroupFilter(e.target.value); setSelWeapon('') }}
                className="max-w-[140px] shrink-0 bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-2 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">Todos los grupos</option>
                {weaponGroups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select
                value={selWeapon}
                onChange={e => setSelWeapon(e.target.value)}
                className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Selecciona arma —</option>
                {filteredWeapons.map(w => (
                  <option key={w.name} value={w.name}>{w.name} [{w.cls}]</option>
                ))}
              </select>
              <button
                onClick={addQuickWeapon}
                disabled={!selWeaponDef}
                className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Añadir
              </button>
            </div>
            {selWeaponDef && (
              <div className="bg-surface border border-rim px-3 py-2 font-mono text-[11px] text-parchment-dim leading-relaxed">
                <span className="text-gold">{selWeaponDef.cls}</span> &nbsp;|&nbsp; Alcance: <b className="text-parchment font-normal">{selWeaponDef.range}</b> &nbsp;|&nbsp; CDD: <b className="text-parchment font-normal">{selWeaponDef.rof}</b> &nbsp;|&nbsp; Daño: <span className="text-crimson-bright">{selWeaponDef.dmg} {selWeaponDef.dmgType.split(' ')[0]}</span> &nbsp;|&nbsp; Pen: <b className="text-parchment font-normal">{selWeaponDef.pen}</b> &nbsp;|&nbsp; Car: <b className="text-parchment font-normal">{selWeaponDef.clip}</b>
                {selWeaponDef.notes && <> &nbsp;|&nbsp; <span className="text-neon">{selWeaponDef.notes}</span></>}
              </div>
            )}
          </div>
          {showWeaponForm && (
            <div className="mx-4 mt-3 flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Nombre"
                  value={weaponForm.name}
                  onChange={e => setWeaponForm(f => ({ ...f, name: e.target.value }))}
                  className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
                />
                <select
                  value={weaponForm.cls}
                  onChange={e => setWeaponForm(f => ({ ...f, cls: e.target.value }))}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
                >
                  {WEAPON_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={weaponForm.dmgType}
                  onChange={e => setWeaponForm(f => ({ ...f, dmgType: e.target.value }))}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
                >
                  {DMG_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input placeholder="Alcance" value={weaponForm.range} onChange={e => setWeaponForm(f => ({ ...f, range: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <input placeholder="RoF" value={weaponForm.rof} onChange={e => setWeaponForm(f => ({ ...f, rof: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <input placeholder="Daño" value={weaponForm.dmg} onChange={e => setWeaponForm(f => ({ ...f, dmg: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <input type="number" placeholder="Pen" value={weaponForm.pen} onChange={e => setWeaponForm(f => ({ ...f, pen: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <input placeholder="Cargador" value={weaponForm.clip} onChange={e => setWeaponForm(f => ({ ...f, clip: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <input placeholder="Notas" value={weaponForm.notes} onChange={e => setWeaponForm(f => ({ ...f, notes: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              </div>
              <button onClick={addManualWeapon} disabled={!weaponForm.name.trim()} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Añadir Manual</button>
            </div>
          )}
          {char.weapons.length === 0 ? (
            <div className="p-4"><EmptyState icon="⚔" label="Sin armas" /></div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              {char.weapons.map(w => (
                // Réplica de .weapon-card: acento izquierdo, nombre 16px + tags
                // de clase/daño, stats como bloques label+valor (PEN siempre
                // visible, el resto solo si tienen dato), notas al final.
                <div key={w.id} className="bg-surface border border-rim border-l-[3px] border-l-crimson-dim px-3.5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-rajdhani font-bold text-base text-parchment-bright flex items-center gap-1.5 flex-wrap">
                      {w.name}
                      <span className="font-mono text-[8px] tracking-[1px] text-crimson border border-crimson px-1.5 py-0.5">{w.cls}</span>
                      <span className="font-mono text-[8px] tracking-[1px] text-parchment-dim border border-rim-bright px-1.5 py-0.5">{w.dmgType}</span>
                    </div>
                    <button onClick={() => dispatch(removeWeapon({ charId: char!.id, weaponId: w.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0" aria-label="Eliminar arma">✕</button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 mb-2">
                    {w.range && (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[8px] tracking-[1px] text-parchment-dim">ALCANCE</span>
                        <span className="font-display text-[13px] text-gold-bright">{w.range}</span>
                      </div>
                    )}
                    {w.rof && (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[8px] tracking-[1px] text-parchment-dim">ROF</span>
                        <span className="font-display text-[13px] text-gold-bright">{w.rof}</span>
                      </div>
                    )}
                    {w.dmg && (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[8px] tracking-[1px] text-parchment-dim">DAÑO</span>
                        <span className="font-display text-[13px] text-gold-bright">{w.dmg}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[8px] tracking-[1px] text-parchment-dim">PEN</span>
                      <span className="font-display text-[13px] text-gold-bright">{w.pen}</span>
                    </div>
                    {w.clip && (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[8px] tracking-[1px] text-parchment-dim">CARGADOR</span>
                        <span className="font-display text-[13px] text-gold-bright">{w.clip}</span>
                      </div>
                    )}
                  </div>
                  {w.notes && <p className="font-rajdhani text-[11px] text-parchment-dim">{w.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Armadura */}
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5 flex items-center justify-between gap-2">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Armadura</h4>
          <button
            onClick={() => setShowArmorForm(v => !v)}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
          >
            + Manual
          </button>
        </div>
        <div className="flex flex-col gap-0">
          <div className="mx-4 mt-3 bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
            <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Armaduras del Libro</h4>
            <div className="flex flex-wrap gap-2 items-end">
              <select
                value={armorGroupFilter}
                onChange={e => { setArmorGroupFilter(e.target.value); setSelArmor('') }}
                className="max-w-[140px] shrink-0 bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-2 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">Todos los grupos</option>
                {armorGroups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select
                value={selArmor}
                onChange={e => setSelArmor(e.target.value)}
                className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Seleccionar armadura —</option>
                {filteredArmors.map(a => (
                  <option key={a.name} value={a.name}>{a.name} [{a.type}]</option>
                ))}
              </select>
              <button onClick={addQuickArmor} disabled={!selArmorDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
            </div>
            {selArmorDef && (
              <div className="bg-surface border border-rim px-3 py-2 font-mono text-[11px] text-parchment-dim leading-relaxed">
                PA: Cabeza <b className="text-parchment font-normal">{selArmorDef.head}</b> | Cuerpo <b className="text-parchment font-normal">{selArmorDef.body}</b> | Brazos <b className="text-parchment font-normal">{selArmorDef.arms}</b> | Piernas <b className="text-parchment font-normal">{selArmorDef.legs}</b>
                {selArmorDef.notes && <> &nbsp;|&nbsp; <span className="text-parchment-dim">{selArmorDef.notes}</span></>}
              </div>
            )}
          </div>
          {showArmorForm && (
            <div className="mx-4 mt-3 flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
              <input placeholder="Nombre" value={armorForm.name} onChange={e => setArmorForm(f => ({ ...f, name: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <div className="grid grid-cols-4 gap-2">
                <div className="flex flex-col gap-0.5"><label className="font-mono text-[10px] text-parchment-dim">Cab.</label><input type="number" value={armorForm.head} onChange={e => setArmorForm(f => ({ ...f, head: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-2 py-1.5 outline-none focus:border-crimson transition-colors text-center" /></div>
                <div className="flex flex-col gap-0.5"><label className="font-mono text-[10px] text-parchment-dim">Tors.</label><input type="number" value={armorForm.body} onChange={e => setArmorForm(f => ({ ...f, body: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-2 py-1.5 outline-none focus:border-crimson transition-colors text-center" /></div>
                <div className="flex flex-col gap-0.5"><label className="font-mono text-[10px] text-parchment-dim">Braz.</label><input type="number" value={armorForm.arms} onChange={e => setArmorForm(f => ({ ...f, arms: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-2 py-1.5 outline-none focus:border-crimson transition-colors text-center" /></div>
                <div className="flex flex-col gap-0.5"><label className="font-mono text-[10px] text-parchment-dim">Pier.</label><input type="number" value={armorForm.legs} onChange={e => setArmorForm(f => ({ ...f, legs: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-2 py-1.5 outline-none focus:border-crimson transition-colors text-center" /></div>
              </div>
              <input placeholder="Notas" value={armorForm.notes} onChange={e => setArmorForm(f => ({ ...f, notes: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <button onClick={addManualArmor} disabled={!armorForm.name.trim()} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Añadir Manual</button>
            </div>
          )}
          {char.armors.length === 0 ? (
            <div className="p-4"><EmptyState icon="🛡" label="Sin armadura" /></div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              {char.armors.map(armor => (
                // Réplica de .armor-card: nombre 16px + notas, luego grid de
                // 4 localizaciones con nombre completo (no abreviado).
                <div key={armor.id} className="bg-surface border border-rim px-3.5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-rajdhani font-bold text-base text-parchment-bright">{armor.name}</span>
                    <button onClick={() => dispatch(removeArmor({ charId: char!.id, armorId: armor.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0" aria-label="Eliminar armadura">✕</button>
                  </div>
                  {armor.notes && <p className="font-mono text-[11px] text-parchment-dim my-1">{armor.notes}</p>}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5">
                    {[
                      { label: 'CABEZA', value: armor.head },
                      { label: 'CUERPO', value: armor.body },
                      { label: 'BRAZOS', value: armor.arms },
                      { label: 'PIERNAS', value: armor.legs },
                    ].map(loc => (
                      <div key={loc.label} className="bg-surface-2 border border-rim-bright px-2.5 py-1.5 text-center">
                        <div className="font-mono text-[9px] tracking-[1px] text-parchment-dim">{loc.label}</div>
                        <div className="font-display text-lg font-bold text-blue-400">{loc.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Equipo & Pertrechos */}
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5 flex items-center justify-between gap-2">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Equipo & Pertrechos</h4>
          <button
            onClick={() => setShowGearForm(v => !v)}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
          >
            + Manual
          </button>
        </div>
        <div className="flex flex-col gap-0">
          <div className="mx-4 mt-3 bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
            <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Equipo del Libro</h4>
            <div className="flex flex-wrap gap-2 items-end">
              <select
                value={gearGroupFilter}
                onChange={e => { setGearGroupFilter(e.target.value); setSelGear('') }}
                className="max-w-[140px] shrink-0 bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-2 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">Todos los grupos</option>
                {gearGroups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select
                value={selGear}
                onChange={e => setSelGear(e.target.value)}
                className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Seleccionar objeto —</option>
                {filteredGear.map(g => (
                  <option key={g.name} value={g.name}>{g.name} [{g.category}]</option>
                ))}
              </select>
              <button onClick={addQuickGear} disabled={!selGearDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
            </div>
          </div>
          {showGearForm && (
            <div className="mx-4 mt-3 flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="Nombre" value={gearForm.name} onChange={e => setGearForm(f => ({ ...f, name: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <input type="number" placeholder="Qty" value={gearForm.qty} onChange={e => setGearForm(f => ({ ...f, qty: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors text-center" />
              </div>
              <input placeholder="Notas" value={gearForm.notes} onChange={e => setGearForm(f => ({ ...f, notes: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <button onClick={addManualGear} disabled={!gearForm.name.trim()} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Añadir Manual</button>
            </div>
          )}
          {char.gear.length === 0 ? (
            <div className="p-4"><EmptyState icon="🎒" label="Sin equipo" /></div>
          ) : (
            <div className="flex flex-col gap-1.5 p-2">
              {char.gear.map(item => (
                // Réplica de .gear-item: nombre+notas a la izquierda, ×cantidad
                // y eliminar a la derecha (el legacy no muestra la cantidad
                // primero).
                <div key={item.id} className="bg-surface border border-rim px-3 py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-rajdhani font-semibold text-sm text-parchment">{item.name}</span>
                    {item.notes && <p className="font-mono text-[10px] text-parchment-dim">{item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-display text-[11px] text-gold">×{item.qty}</span>
                    <button onClick={() => dispatch(removeGear({ charId: char!.id, itemId: item.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors" aria-label="Eliminar objeto">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
