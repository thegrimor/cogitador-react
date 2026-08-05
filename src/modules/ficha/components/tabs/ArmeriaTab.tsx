import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addWeapon, removeWeapon, addArmor, removeArmor, addGear, removeGear } from '../../services/fichaSlice'
import { WEAPONS, ARMORS, GEAR } from '@/core/data/darkheresy'

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
  name: '', cls: 'Pistola', dmgType: 'I', range: '', rof: '', dmg: '', pen: 0, clip: '', notes: '',
}
const EMPTY_ARMOR: ArmorForm = { name: '', notes: '', head: 0, body: 0, arms: 0, legs: 0 }
const EMPTY_GEAR: GearForm = { name: '', qty: 1, notes: '' }

const WEAPON_CLASSES = ['Pistola', 'Básica', 'Pesada', 'CaC', 'Especial']
const DMG_TYPES = ['E', 'I', 'X', 'R', 'A']

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
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Arsenal</h4>
        </div>
        <div className="flex flex-col gap-0">
          <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
            <select
              value={weaponGroupFilter}
              onChange={e => { setWeaponGroupFilter(e.target.value); setSelWeapon('') }}
              className="bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-3 py-1.5 outline-none focus:border-crimson transition-colors"
            >
              <option value="">— Filtrar por grupo —</option>
              {weaponGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="flex gap-2">
              <select
                value={selWeapon}
                onChange={e => setSelWeapon(e.target.value)}
                className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Seleccionar arma —</option>
                {filteredWeapons.map(w => (
                  <option key={w.name} value={w.name}>{w.name} [{w.cls}]</option>
                ))}
              </select>
              <button
                onClick={addQuickWeapon}
                disabled={!selWeaponDef}
                className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                Añadir
              </button>
            </div>
            {selWeaponDef && (
              <div className="grid grid-cols-4 gap-1 bg-surface border border-rim px-3 py-2 font-mono text-[10px] text-parchment-dim">
                <span>Cls: <span className="text-parchment">{selWeaponDef.cls}</span></span>
                <span>Tipo: <span className="text-parchment">{selWeaponDef.dmgType}</span></span>
                <span>Rng: <span className="text-parchment">{selWeaponDef.range}</span></span>
                <span>RoF: <span className="text-parchment">{selWeaponDef.rof}</span></span>
                <span>Dmg: <span className="text-parchment">{selWeaponDef.dmg}</span></span>
                <span>Pen: <span className="text-parchment">{selWeaponDef.pen}</span></span>
                <span>Carg: <span className="text-parchment">{selWeaponDef.clip}</span></span>
                {selWeaponDef.notes && <span className="col-span-2">Notas: <span className="text-parchment">{selWeaponDef.notes}</span></span>}
              </div>
            )}
            <button
              onClick={() => setShowWeaponForm(v => !v)}
              className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment border border-rim-bright px-3 py-1.5 transition-colors text-left"
            >
              {showWeaponForm ? '▲ Ocultar formulario manual' : '▼ Añadir manualmente'}
            </button>
            {showWeaponForm && (
              <div className="flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
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
          </div>
          {char.weapons.length === 0 ? (
            <div className="px-4 py-10 text-center"><p className="font-mono text-xs text-parchment-dim">Sin armas registradas</p></div>
          ) : (
            <div className="flex flex-col divide-y divide-rim">
              {char.weapons.map(w => (
                <div key={w.id} className="flex items-start gap-2 px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-rajdhani font-bold text-parchment text-sm leading-none">{w.name}</span>
                      <span className="font-mono text-[10px] bg-crimson/20 text-crimson px-1.5 py-0.5">{w.cls}</span>
                      <span className="font-mono text-[10px] bg-surface border border-rim text-parchment-dim px-1.5 py-0.5">{w.dmgType}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-x-3 gap-y-0.5 font-mono text-[10px] text-parchment-dim">
                      <span>Rng: <span className="text-parchment">{w.range}</span></span>
                      <span>RoF: <span className="text-parchment">{w.rof}</span></span>
                      <span>Dmg: <span className="text-parchment">{w.dmg}</span></span>
                      <span>Pen: <span className="text-parchment">{w.pen}</span></span>
                      <span>Carg: <span className="text-parchment">{w.clip}</span></span>
                      {w.notes && <span className="col-span-3">Notas: <span className="text-parchment">{w.notes}</span></span>}
                    </div>
                  </div>
                  <button onClick={() => dispatch(removeWeapon({ charId: char!.id, weaponId: w.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0 mt-0.5" aria-label="Eliminar arma">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Armadura */}
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Armadura</h4>
        </div>
        <div className="flex flex-col gap-0">
          <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
            <select
              value={armorGroupFilter}
              onChange={e => { setArmorGroupFilter(e.target.value); setSelArmor('') }}
              className="bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-3 py-1.5 outline-none focus:border-crimson transition-colors"
            >
              <option value="">— Filtrar por grupo —</option>
              {armorGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="flex gap-2">
              <select
                value={selArmor}
                onChange={e => setSelArmor(e.target.value)}
                className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Seleccionar armadura —</option>
                {filteredArmors.map(a => (
                  <option key={a.name} value={a.name}>{a.name} [{a.type}]</option>
                ))}
              </select>
              <button onClick={addQuickArmor} disabled={!selArmorDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
            </div>
            {selArmorDef && (
              <div className="grid grid-cols-4 gap-1 bg-surface border border-rim px-3 py-2 font-mono text-[10px] text-parchment-dim">
                <span>C: <span className="text-parchment">{selArmorDef.head}</span></span>
                <span>T: <span className="text-parchment">{selArmorDef.body}</span></span>
                <span>B: <span className="text-parchment">{selArmorDef.arms}</span></span>
                <span>P: <span className="text-parchment">{selArmorDef.legs}</span></span>
                {selArmorDef.notes && <span className="col-span-4">Notas: <span className="text-parchment">{selArmorDef.notes}</span></span>}
              </div>
            )}
            <button onClick={() => setShowArmorForm(v => !v)} className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment border border-rim-bright px-3 py-1.5 transition-colors text-left">
              {showArmorForm ? '▲ Ocultar formulario manual' : '▼ Añadir manualmente'}
            </button>
            {showArmorForm && (
              <div className="flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
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
          </div>
          {char.armors.length === 0 ? (
            <div className="px-4 py-10 text-center"><p className="font-mono text-xs text-parchment-dim">Sin armaduras registradas</p></div>
          ) : (
            <div className="flex flex-col divide-y divide-rim">
              {char.armors.map(armor => (
                <div key={armor.id} className="flex items-start gap-2 px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <span className="font-rajdhani font-bold text-parchment text-sm leading-none">{armor.name}</span>
                    <div className="flex gap-4 font-mono text-[10px]">
                      <span className="text-parchment-dim">C: <span className="text-parchment font-bold">{armor.head}</span></span>
                      <span className="text-parchment-dim">T: <span className="text-parchment font-bold">{armor.body}</span></span>
                      <span className="text-parchment-dim">B: <span className="text-parchment font-bold">{armor.arms}</span></span>
                      <span className="text-parchment-dim">P: <span className="text-parchment font-bold">{armor.legs}</span></span>
                    </div>
                    {armor.notes && <p className="font-mono text-[10px] text-parchment-dim italic">{armor.notes}</p>}
                  </div>
                  <button onClick={() => dispatch(removeArmor({ charId: char!.id, armorId: armor.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0 mt-0.5" aria-label="Eliminar armadura">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Equipo & Pertrechos */}
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Equipo & Pertrechos</h4>
        </div>
        <div className="flex flex-col gap-0">
          <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
            <select
              value={gearGroupFilter}
              onChange={e => { setGearGroupFilter(e.target.value); setSelGear('') }}
              className="bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-3 py-1.5 outline-none focus:border-crimson transition-colors"
            >
              <option value="">— Filtrar por grupo —</option>
              {gearGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="flex gap-2">
              <select
                value={selGear}
                onChange={e => setSelGear(e.target.value)}
                className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Seleccionar objeto —</option>
                {filteredGear.map(g => (
                  <option key={g.name} value={g.name}>{g.name} [{g.category}]</option>
                ))}
              </select>
              <button onClick={addQuickGear} disabled={!selGearDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
            </div>
            <button onClick={() => setShowGearForm(v => !v)} className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment border border-rim-bright px-3 py-1.5 transition-colors text-left">
              {showGearForm ? '▲ Ocultar formulario manual' : '▼ Añadir manualmente'}
            </button>
            {showGearForm && (
              <div className="flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="Nombre" value={gearForm.name} onChange={e => setGearForm(f => ({ ...f, name: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                  <input type="number" placeholder="Qty" value={gearForm.qty} onChange={e => setGearForm(f => ({ ...f, qty: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors text-center" />
                </div>
                <input placeholder="Notas" value={gearForm.notes} onChange={e => setGearForm(f => ({ ...f, notes: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <button onClick={addManualGear} disabled={!gearForm.name.trim()} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Añadir Manual</button>
              </div>
            )}
          </div>
          {char.gear.length === 0 ? (
            <div className="px-4 py-10 text-center"><p className="font-mono text-xs text-parchment-dim">Sin objetos registrados</p></div>
          ) : (
            <div className="flex flex-col divide-y divide-rim">
              {char.gear.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
                  <span className="font-mono text-[11px] text-gold min-w-[2rem] text-center">x{item.qty}</span>
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="font-rajdhani font-semibold text-parchment text-sm leading-none">{item.name}</span>
                    {item.notes && <p className="font-mono text-[10px] text-parchment-dim">{item.notes}</p>}
                  </div>
                  <button onClick={() => dispatch(removeGear({ charId: char!.id, itemId: item.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0" aria-label="Eliminar objeto">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
