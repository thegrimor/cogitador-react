import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addPower, removePower, updatePsychic } from '../../services/fichaSlice'
import { PSYCHIC_POWERS } from '@/core/data/darkheresy'

const DISCIPLINES = ['menor', 'adivinacion', 'biomancia', 'piromancia', 'telequinesia', 'telepatia']
const ALL_DISC_LABEL = 'Todas'

const DISC_COLORS: Record<string, string> = {
  menor:        'text-gold',
  adivinacion:  'text-parchment',
  biomancia:    'text-neon',
  piromancia:   'text-crimson',
  telequinesia: 'text-blue-400',
  telepatia:    'text-purple-400',
}

const DISC_BG: Record<string, string> = {
  menor:        'bg-gold/20 text-gold',
  adivinacion:  'bg-parchment/10 text-parchment',
  biomancia:    'bg-neon/10 text-neon',
  piromancia:   'bg-crimson/20 text-crimson',
  telequinesia: 'bg-blue-400/10 text-blue-400',
  telepatia:    'bg-purple-400/10 text-purple-400',
}

type ManualForm = {
  name: string
  disc: string
  umbral: number
  conc: string
  mant: string
  alcance: string
  desc: string
}

const EMPTY_MANUAL: ManualForm = {
  name: '',
  disc: 'menor',
  umbral: 3,
  conc: 'Media',
  mant: 'No',
  alcance: 'Personal',
  desc: '',
}

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function PoderesPsiquicosTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  const [discFilter, setDiscFilter] = useState<string>(ALL_DISC_LABEL)
  const [selPower, setSelPower] = useState('')
  const [showManual, setShowManual] = useState(false)
  const [manual, setManual] = useState<ManualForm>(EMPTY_MANUAL)

  if (!char) return <NoChar />

  const availablePowers = discFilter === ALL_DISC_LABEL
    ? PSYCHIC_POWERS
    : PSYCHIC_POWERS.filter(p => p.disc === discFilter)

  const selPowerDef = PSYCHIC_POWERS.find(p => p.name === selPower)

  function handleQuickAdd() {
    if (!selPowerDef) return
    dispatch(addPower({ charId: char!.id, power: { ...selPowerDef } }))
    setSelPower('')
  }

  function handleManualAdd() {
    if (!manual.name.trim()) return
    dispatch(addPower({ charId: char!.id, power: { ...manual } }))
    setManual(EMPTY_MANUAL)
    setShowManual(false)
  }

  const groupedPowers = char.powers.reduce<Record<string, typeof char.powers>>((acc, p) => {
    const disc = p.disc || 'otro'
    acc[disc] = acc[disc] ?? []
    acc[disc].push(p)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Poderes Psíquicos</h3>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
        <div className="border-b border-rim bg-crimson/5 -mx-4 px-4 py-1.5 mb-1">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">Configuración Psíquica</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="font-mono text-[10px] text-parchment-dim uppercase tracking-[1px]">Factor Psíquico</label>
            <input
              type="number"
              min={0}
              max={6}
              value={char.psychFactor}
              onChange={e => dispatch(updatePsychic({ charId: char.id, field: 'psychFactor', value: Number(e.target.value) }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-center"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="font-mono text-[10px] text-parchment-dim uppercase tracking-[1px]">BV Voluntad</label>
            <input
              type="number"
              value={char.psychBV}
              onChange={e => dispatch(updatePsychic({ charId: char.id, field: 'psychBV', value: Number(e.target.value) }))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-center"
            />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="font-mono text-[10px] text-parchment-dim uppercase tracking-[1px]">Disciplina Principal</label>
          <select
            value={char.psychDiscipline}
            onChange={e => dispatch(updatePsychic({ charId: char.id, field: 'psychDiscipline', value: e.target.value }))}
            className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
          >
            <option value="">— Sin disciplina —</option>
            {DISCIPLINES.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="font-mono text-[10px] text-parchment-dim uppercase tracking-[1px]">Notas Psíquicas</label>
          <textarea
            value={char.psychNotes}
            onChange={e => dispatch(updatePsychic({ charId: char.id, field: 'psychNotes', value: e.target.value }))}
            placeholder="Notas de las manifestaciones, fenómenos, etc."
            className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full min-h-[60px] resize-y"
          />
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
        <div className="border-b border-rim bg-crimson/5 -mx-4 px-4 py-1.5 mb-1">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">Añadir Poder</h4>
        </div>

        <div className="flex flex-wrap gap-1">
          {[ALL_DISC_LABEL, ...DISCIPLINES].map(d => (
            <button
              key={d}
              onClick={() => { setDiscFilter(d); setSelPower('') }}
              className={[
                'font-mono text-[10px] px-2 py-0.5 border transition-colors',
                discFilter === d
                  ? 'border-crimson bg-crimson/10 text-crimson'
                  : 'border-rim-bright text-parchment-dim hover:border-parchment hover:text-parchment',
              ].join(' ')}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={selPower}
            onChange={e => setSelPower(e.target.value)}
            className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
          >
            <option value="">— Seleccionar poder —</option>
            {availablePowers.map(p => (
              <option key={p.name} value={p.name}>{p.name} [{p.disc}] Umbral {p.umbral}</option>
            ))}
          </select>
          <button onClick={handleQuickAdd} disabled={!selPowerDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
        </div>

        {selPowerDef && (
          <div className="bg-surface border border-rim px-3 py-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={['font-mono text-[10px] px-2 py-0.5', DISC_BG[selPowerDef.disc] ?? 'bg-gold/20 text-gold'].join(' ')}>{selPowerDef.disc}</span>
              <span className="font-mono text-[10px] text-parchment-dim">Umbral {selPowerDef.umbral}</span>
              <span className="font-mono text-[10px] text-parchment-dim">Conc: {selPowerDef.conc}</span>
              <span className="font-mono text-[10px] text-parchment-dim">Mant: {selPowerDef.mant}</span>
              <span className="font-mono text-[10px] text-parchment-dim">Alc: {selPowerDef.alcance}</span>
            </div>
            <p className="font-mono text-[11px] text-parchment-dim">{selPowerDef.desc}</p>
          </div>
        )}

        <button onClick={() => setShowManual(v => !v)} className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment border border-rim-bright px-3 py-1.5 transition-colors text-left">
          {showManual ? '▲ Ocultar formulario manual' : '▼ Añadir manualmente'}
        </button>
        {showManual && (
          <div className="flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Nombre" value={manual.name} onChange={e => setManual(m => ({ ...m, name: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <select value={manual.disc} onChange={e => setManual(m => ({ ...m, disc: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors">
                {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <input type="number" placeholder="Umbral" value={manual.umbral} onChange={e => setManual(m => ({ ...m, umbral: Number(e.target.value) }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <input placeholder="Concentración" value={manual.conc} onChange={e => setManual(m => ({ ...m, conc: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <select value={manual.mant} onChange={e => setManual(m => ({ ...m, mant: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors">
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
              <input placeholder="Alcance" value={manual.alcance} onChange={e => setManual(m => ({ ...m, alcance: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <textarea placeholder="Descripción" value={manual.desc} onChange={e => setManual(m => ({ ...m, desc: e.target.value }))} rows={2} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors resize-y" />
            </div>
            <button onClick={handleManualAdd} disabled={!manual.name.trim()} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Añadir Manual</button>
          </div>
        )}
      </div>

      {char.powers.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="font-mono text-xs text-parchment-dim">Sin poderes psíquicos registrados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {Object.entries(groupedPowers).map(([disc, powers]) => (
            <div key={disc} className="flex flex-col gap-0">
              <div className="border-b border-rim bg-surface-3 px-4 py-1.5">
                <span className={['font-display text-[9px] uppercase tracking-[2px]', DISC_COLORS[disc] ?? 'text-gold'].join(' ')}>
                  {disc.charAt(0).toUpperCase() + disc.slice(1)}
                </span>
              </div>
              <div className="flex flex-col divide-y divide-rim">
                {powers.map(power => (
                  <div key={power.id} className="flex items-start gap-2 px-4 py-3 bg-surface-2 hover:bg-surface-3 transition-colors">
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-rajdhani font-bold text-parchment text-sm leading-none">{power.name}</span>
                        <span className={['font-mono text-[10px] px-1.5 py-0.5 shrink-0', DISC_BG[power.disc] ?? 'bg-gold/20 text-gold'].join(' ')}>{power.disc}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[10px] text-parchment-dim">
                        <span>Umbral: <span className="text-parchment">{power.umbral}</span></span>
                        <span>Conc: <span className="text-parchment">{power.conc}</span></span>
                        <span>Mant: <span className="text-parchment">{power.mant}</span></span>
                        <span>Alc: <span className="text-parchment">{power.alcance}</span></span>
                      </div>
                      {power.desc && <p className="font-mono text-[11px] text-parchment-dim">{power.desc}</p>}
                    </div>
                    <button onClick={() => dispatch(removePower({ charId: char!.id, powerId: power.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0 mt-0.5" aria-label="Eliminar poder">✕</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
