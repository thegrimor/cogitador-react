import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addMechadendrite, removeMechadendrite, addAugmentation, removeAugmentation } from '../../services/fichaSlice'
import { MECHADENDRITES, AUGMENTATIONS } from '@/core/data/darkheresy'
import { EmptyState } from '../EmptyState'

type MechForm = {
  name: string
  type: string
  desc: string
  abilities: string
}

type AugForm = {
  name: string
  loc: string
  desc: string
  bonus: string
}

const EMPTY_MECH: MechForm = { name: '', type: 'MANIPULACIÓN', desc: '', abilities: '' }
const EMPTY_AUG: AugForm = { name: '', loc: 'Ojo / Visión', desc: '', bonus: '' }

// Mismos valores que #mchType / #augLoc del HTML legacy
const MECH_TYPES = ['MANIPULACIÓN', 'COMBATE', 'UTILITAS', 'MEDICAE', 'OPTICAL', 'HERRAMIENTAS', 'OTRO']
const AUG_LOCS = ['Ojo / Visión', 'Brazo / Mano', 'Pierna', 'Torso / Interno', 'Cerebro / Neural', 'Piel / Externo', 'Otro']

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function MejorasTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [selMech, setSelMech] = useState('')
  const [showMechForm, setShowMechForm] = useState(false)
  const [mechForm, setMechForm] = useState<MechForm>(EMPTY_MECH)

  const [selAug, setSelAug] = useState('')
  const [showAugForm, setShowAugForm] = useState(false)
  const [augForm, setAugForm] = useState<AugForm>(EMPTY_AUG)

  if (!char) return <NoChar />

  const selMechDef = MECHADENDRITES.find(m => m.name === selMech)
  const selAugDef = AUGMENTATIONS.find(a => a.name === selAug)

  function addQuickMech() {
    if (!selMechDef) return
    dispatch(addMechadendrite({ charId: char!.id, mech: { name: selMechDef.name, type: selMechDef.type, desc: selMechDef.desc, abilities: selMechDef.abilities } }))
    setSelMech('')
  }

  function addManualMech() {
    if (!mechForm.name.trim()) return
    dispatch(addMechadendrite({ charId: char!.id, mech: { ...mechForm } }))
    setMechForm(EMPTY_MECH)
    setShowMechForm(false)
  }

  function addQuickAug() {
    if (!selAugDef) return
    dispatch(addAugmentation({ charId: char!.id, aug: { name: selAugDef.name, loc: selAugDef.loc, desc: selAugDef.desc, bonus: selAugDef.bonus } }))
    setSelAug('')
  }

  function addManualAug() {
    if (!augForm.name.trim()) return
    dispatch(addAugmentation({ charId: char!.id, aug: { ...augForm } }))
    setAugForm(EMPTY_AUG)
    setShowAugForm(false)
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Mejoras Biónicas</h3>
      </div>

      {/* Mecadendrites — apilado con Aumentaciones, igual que el HTML legacy (sin sub-tabs) */}
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5 flex items-center justify-between gap-2">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Mechadendrites</h4>
          <button
            onClick={() => setShowMechForm(v => !v)}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
          >
            + Mechadendrite
          </button>
        </div>
        <div className="flex flex-col gap-0">
          <div className="mx-4 mt-3 bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
            <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Mechadendrites del Libro</h4>
            <div className="flex flex-wrap gap-2 items-end">
              <select
                value={selMech}
                onChange={e => setSelMech(e.target.value)}
                className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Selecciona mechadendrite —</option>
                {MECHADENDRITES.map(m => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
              <button onClick={addQuickMech} disabled={!selMechDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
            </div>
            {selMechDef && (
              <div className="bg-surface border border-rim px-3 py-2">
                <span className="font-mono text-[11px] text-parchment-dim">{selMechDef.desc}</span>
              </div>
            )}
          </div>
          {showMechForm && (
            <div className="mx-4 mt-3 flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Nombre" value={mechForm.name} onChange={e => setMechForm(f => ({ ...f, name: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <select value={mechForm.type} onChange={e => setMechForm(f => ({ ...f, type: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors">
                  {MECH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input placeholder="Descripción" value={mechForm.desc} onChange={e => setMechForm(f => ({ ...f, desc: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <textarea placeholder="Capacidades (una por línea)" value={mechForm.abilities} onChange={e => setMechForm(f => ({ ...f, abilities: e.target.value }))} rows={3} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors resize-y" />
              </div>
              <button onClick={addManualMech} disabled={!mechForm.name.trim()} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Añadir Manual</button>
            </div>
          )}
          {char.mechadendrites.length === 0 ? (
            <div className="p-4"><EmptyState icon="🔩" label="Sin mechadendrites" /></div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              {char.mechadendrites.map(mech => (
                // Réplica de .mech-card: acento dorado, nombre 16px + tipo en
                // línea propia (no badge), descripción siempre visible,
                // capacidades con prefijo ► (el legacy usa ese carácter, no •).
                <div key={mech.id} className="bg-surface border border-rim border-l-[3px] border-l-gold px-4 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-rajdhani font-bold text-base text-gold-bright">{mech.name}</div>
                      <div className="font-mono text-[9px] tracking-[2px] text-parchment-dim mt-0.5">{mech.type}</div>
                    </div>
                    <button onClick={() => dispatch(removeMechadendrite({ charId: char!.id, mechId: mech.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0" aria-label="Eliminar mecadendrite">✕</button>
                  </div>
                  {mech.desc && <p className="font-rajdhani text-xs text-parchment leading-relaxed mt-2">{mech.desc}</p>}
                  {mech.abilities && (
                    <div className="flex flex-col gap-1 mt-2">
                      {mech.abilities.split('\n').filter(Boolean).map((line, i) => (
                        <p key={i} className="font-mono text-[11px] text-neon">► {line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Aumentaciones cibernéticas */}
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-1.5 flex items-center justify-between gap-2">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">// Aumentaciones Cibernéticas</h4>
          <button
            onClick={() => setShowAugForm(v => !v)}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
          >
            + Aumentación
          </button>
        </div>
        <div className="flex flex-col gap-0">
          <div className="mx-4 mt-3 bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
            <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Implantes del Libro</h4>
            <div className="flex flex-wrap gap-2 items-end">
              <select
                value={selAug}
                onChange={e => setSelAug(e.target.value)}
                className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              >
                <option value="">— Selecciona implante —</option>
                {AUGMENTATIONS.map(a => (
                  <option key={a.name} value={a.name}>{a.name} [{a.loc}]</option>
                ))}
              </select>
              <button onClick={addQuickAug} disabled={!selAugDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
            </div>
            {selAugDef && (
              <div className="bg-surface border border-rim px-3 py-2">
                <span className="font-mono text-[11px] text-neon">► {selAugDef.bonus}</span>
              </div>
            )}
          </div>
          {showAugForm && (
            <div className="mx-4 mt-3 flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Nombre" value={augForm.name} onChange={e => setAugForm(f => ({ ...f, name: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <select value={augForm.loc} onChange={e => setAugForm(f => ({ ...f, loc: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors">
                  {AUG_LOCS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <input placeholder="Descripción" value={augForm.desc} onChange={e => setAugForm(f => ({ ...f, desc: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
                <input placeholder="Bonus" value={augForm.bonus} onChange={e => setAugForm(f => ({ ...f, bonus: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              </div>
              <button onClick={addManualAug} disabled={!augForm.name.trim()} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Añadir Manual</button>
            </div>
          )}
          {char.augmentations.length === 0 ? (
            <div className="p-4"><EmptyState icon="🦾" label="Sin aumentaciones" /></div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              {char.augmentations.map(aug => (
                // Réplica de .augment-card: acento azul, nombre 15px + loc en
                // línea propia (no badge), descripción en texto normal (no
                // dim), bonus con prefijo ►.
                <div key={aug.id} className="bg-surface border border-rim border-l-[3px] border-l-blue-400 px-3.5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-rajdhani font-bold text-[15px] text-blue-400">{aug.name}</div>
                      <div className="font-mono text-[9px] tracking-[2px] text-parchment-dim mt-0.5">{aug.loc}</div>
                    </div>
                    <button onClick={() => dispatch(removeAugmentation({ charId: char!.id, augId: aug.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0" aria-label="Eliminar augmentación">✕</button>
                  </div>
                  {aug.desc && <p className="font-rajdhani text-xs text-parchment leading-relaxed mt-2">{aug.desc}</p>}
                  {aug.bonus && <p className="font-mono text-[11px] text-neon mt-1.5">► {aug.bonus}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
