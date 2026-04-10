import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addMechadendrite, addAugmentation } from '../../services/fichaSlice'
import { MechadendriteCard } from './mejoras/MechadendriteCard'
import { AugmentationCard } from './mejoras/AugmentationCard'

const MECHA_TYPES = ['MANIPULACIÓN', 'COMBATE', 'UTILITAS', 'MEDICAE', 'OPTICAL', 'OTRO']
const AUG_LOCS   = ['Ojo / Visión', 'Brazo / Mano', 'Pierna', 'Torso / Interno', 'Cerebro / Neural', 'Piel / Externo', 'Otro']

type Section = 'mecha' | 'aug' | null

export function MejorasTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [openForm, setOpenForm] = useState<Section>(null)

  // Mechadendrite form
  const [mchName, setMchName]           = useState('')
  const [mchType, setMchType]           = useState('MANIPULACIÓN')
  const [mchDesc, setMchDesc]           = useState('')
  const [mchAbilities, setMchAbilities] = useState('')

  // Augmentation form
  const [augName, setAugName]   = useState('')
  const [augLoc, setAugLoc]     = useState('Ojo / Visión')
  const [augDesc, setAugDesc]   = useState('')
  const [augBonus, setAugBonus] = useState('')

  if (!char) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
          Sin operativo seleccionado
        </p>
      </div>
    )
  }

  function toggleForm(section: Section) {
    setOpenForm(prev => prev === section ? null : section)
  }

  function handleAddMecha() {
    if (!mchName.trim()) return
    const abilities = mchAbilities
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
    dispatch(addMechadendrite({
      charId: char!.id,
      mecha: { name: mchName.trim(), mechaType: mchType, desc: mchDesc.trim(), abilities },
    }))
    setMchName(''); setMchDesc(''); setMchAbilities('')
    setOpenForm(null)
  }

  function handleAddAug() {
    if (!augName.trim()) return
    dispatch(addAugmentation({
      charId: char!.id,
      aug: { name: augName.trim(), loc: augLoc, desc: augDesc.trim(), bonus: augBonus.trim() },
    }))
    setAugName(''); setAugDesc(''); setAugBonus('')
    setOpenForm(null)
  }

  const inputCls = 'bg-surface border border-rim-bright text-parchment font-mono text-sm px-2 py-1.5 outline-none focus:border-gold transition-colors'
  const labelCls = 'font-display text-[8px] uppercase tracking-[2px] text-parchment-dim'

  return (
    <div className="flex flex-col gap-4 px-4 py-4">

      {/* ── MECHADENDRITES ───────────────────────────────────────────────── */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Mechadendrites</h3>
          <button
            onClick={() => toggleForm('mecha')}
            className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-3 py-1 hover:bg-crimson-bright transition-colors"
          >
            {openForm === 'mecha' ? 'Cancelar' : '+ Mechadendrite'}
          </button>
        </div>

        {openForm === 'mecha' && (
          <div className="border-b border-rim px-4 py-3 flex flex-col gap-3 bg-surface">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className={labelCls}>Nombre</label>
                <input type="text" value={mchName} onChange={e => setMchName(e.target.value)} placeholder="Ej: Mechadendrite de Manipulación" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1 w-36">
                <label className={labelCls}>Tipo</label>
                <select value={mchType} onChange={e => setMchType(e.target.value)} className={inputCls}>
                  {MECHA_TYPES.map(t => (
                    <option key={t} value={t} className="bg-surface-2">{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Descripción</label>
              <textarea value={mchDesc} onChange={e => setMchDesc(e.target.value)} placeholder="Descripción del mechadendrite..." rows={2} className={`${inputCls} resize-none`} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Capacidades (una por línea)</label>
              <textarea value={mchAbilities} onChange={e => setMchAbilities(e.target.value)} placeholder={"Puede reparar equipamiento básico\nBonus +10 a Tech-Use\nAlcance 1.5m"} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddMecha} disabled={!mchName.trim()} className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-4 py-2 hover:bg-crimson-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Registrar
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-px bg-rim">
          {char.mechadendrites.length === 0 ? (
            <div className="bg-surface-2 px-4 py-8 text-center">
              <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim">Sin mechadendrites registrados</p>
            </div>
          ) : (
            char.mechadendrites.map(m => <MechadendriteCard key={m.id} charId={char.id} mecha={m} />)
          )}
        </div>
      </div>

      {/* ── AUMENTACIONES CIBERNÉTICAS ───────────────────────────────────── */}
      <div className="bg-surface-2 border border-rim">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Aumentaciones Cibernéticas</h3>
          <button
            onClick={() => toggleForm('aug')}
            className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-3 py-1 hover:bg-crimson-bright transition-colors"
          >
            {openForm === 'aug' ? 'Cancelar' : '+ Aumentación'}
          </button>
        </div>

        {openForm === 'aug' && (
          <div className="border-b border-rim px-4 py-3 flex flex-col gap-3 bg-surface">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className={labelCls}>Nombre</label>
                <input type="text" value={augName} onChange={e => setAugName(e.target.value)} placeholder="Ej: Bionic Eye" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1 w-36">
                <label className={labelCls}>Localización</label>
                <select value={augLoc} onChange={e => setAugLoc(e.target.value)} className={inputCls}>
                  {AUG_LOCS.map(l => (
                    <option key={l} value={l} className="bg-surface-2">{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Descripción</label>
              <textarea value={augDesc} onChange={e => setAugDesc(e.target.value)} placeholder="Descripción de la aumentación..." rows={2} className={`${inputCls} resize-none`} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelCls}>Bonus / Efecto en juego</label>
              <input type="text" value={augBonus} onChange={e => setAugBonus(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddAug()} placeholder="Ej: +10 Percepción, visión nocturna..." className={inputCls} />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddAug} disabled={!augName.trim()} className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-4 py-2 hover:bg-crimson-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Registrar
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-px bg-rim">
          {char.augmentations.length === 0 ? (
            <div className="bg-surface-2 px-4 py-8 text-center">
              <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim">Sin aumentaciones registradas</p>
            </div>
          ) : (
            char.augmentations.map(a => <AugmentationCard key={a.id} charId={char.id} aug={a} />)
          )}
        </div>
      </div>

    </div>
  )
}
