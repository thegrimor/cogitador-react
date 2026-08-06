import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addPower, removePower, updatePsychic } from '../../services/fichaSlice'
import { PSYCHIC_POWERS } from '@/core/data/darkheresy'
import { EmptyState } from '../EmptyState'

const DISCIPLINES = ['menor', 'adivinacion', 'biomancia', 'piromancia', 'telequinesia', 'telepatia']
// Disciplina principal: no incluye "menor", igual que el HTML legacy (psychDiscipline)
const MAIN_DISCIPLINES = ['adivinacion', 'biomancia', 'piromancia', 'telequinesia', 'telepatia']
const ALL_DISC_LABEL = ''

const DISC_LABELS: Record<string, string> = {
  menor:        'Poderes Menores',
  adivinacion:  'Adivinación',
  biomancia:    'Biomancia',
  piromancia:   'Piromancia',
  telequinesia: 'Telequinesia',
  telepatia:    'Telepatía',
}

// Igual que .disc-* del legacy: menor=dim, resto con su propio color de acento
const DISC_COLORS: Record<string, string> = {
  menor:        'text-parchment-dim',
  adivinacion:  'text-amber-500',
  biomancia:    'text-green-500',
  piromancia:   'text-orange-500',
  telequinesia: 'text-blue-400',
  telepatia:    'text-purple-400',
}

// Igual que DISC_LABEL del legacy (distinto de DISC_LABELS: en la tarjeta de
// poder registrado "menor" se muestra como "MENOR", no "Poderes Menores")
const DISC_BADGE_LABELS: Record<string, string> = {
  menor:        'MENOR',
  adivinacion:  'ADIVINACIÓN',
  biomancia:    'BIOMANCIA',
  piromancia:   'PIROMANCIA',
  telequinesia: 'TELEQUINESIA',
  telepatia:    'TELEPATÍA',
}

// Igual que .disc-* del legacy (color + border-color del mismo tono)
const DISC_BORDER: Record<string, string> = {
  menor:        'border-parchment-dim',
  adivinacion:  'border-amber-500',
  biomancia:    'border-green-500',
  piromancia:   'border-orange-500',
  telequinesia: 'border-blue-400',
  telepatia:    'border-purple-400',
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

  const availablePowers = (discFilter === ALL_DISC_LABEL
    ? PSYCHIC_POWERS
    : PSYCHIC_POWERS.filter(p => p.disc === discFilter))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))

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

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Factor Psíquico & Poderes</h3>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
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
            <label className="font-mono text-[10px] text-parchment-dim uppercase tracking-[1px]">Bonif. Voluntad (BV)</label>
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
            <option value="">Ninguna</option>
            {MAIN_DISCIPLINES.map(d => (
              <option key={d} value={d}>{DISC_LABELS[d]}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-0.5">
          <label className="font-mono text-[10px] text-parchment-dim uppercase tracking-[1px]">Notas Psíquicas</label>
          <textarea
            value={char.psychNotes}
            onChange={e => dispatch(updatePsychic({ charId: char.id, field: 'psychNotes', value: e.target.value }))}
            className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full min-h-[60px] resize-y"
          />
        </div>
      </div>

      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Poderes Conocidos</h3>
        <button
          onClick={() => setShowManual(v => !v)}
          className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors shrink-0"
        >
          + Añadir Manual
        </button>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
        <div className="bg-surface-3 border border-rim-bright border-t-2 border-t-gold px-3 py-3 flex flex-col gap-2">
          <h4 className="font-display text-[9px] uppercase tracking-[3px] text-gold">⚡ Selector de Poderes del Libro</h4>
          <div className="flex flex-wrap gap-2 items-end">
            <select
              value={discFilter}
              onChange={e => { setDiscFilter(e.target.value); setSelPower('') }}
              className="max-w-[160px] shrink-0 bg-surface border border-rim-bright text-parchment-dim font-mono text-xs px-2 py-2 outline-none focus:border-crimson transition-colors"
            >
              <option value="">Todas las disciplinas</option>
              {DISCIPLINES.map(d => (
                <option key={d} value={d}>{DISC_LABELS[d]}</option>
              ))}
            </select>
            <select
              value={selPower}
              onChange={e => setSelPower(e.target.value)}
              className="flex-1 min-w-[200px] bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            >
              <option value="">— Selecciona poder —</option>
              {availablePowers.map(p => (
                <option key={p.name} value={p.name}>{p.name} (UP: {p.umbral}) — {DISC_BADGE_LABELS[p.disc] ?? p.disc.toUpperCase()}</option>
              ))}
            </select>
            <button onClick={handleQuickAdd} disabled={!selPowerDef} className="font-display text-[9px] uppercase tracking-[2px] px-3 py-2 bg-crimson text-white hover:bg-crimson-bright disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">Añadir</button>
          </div>

          {selPowerDef && (
            <p className="font-mono text-xs leading-relaxed">
              <span className="text-purple-400">UP:{selPowerDef.umbral}</span>
              {'  |  '}
              <span className="text-parchment-dim">{selPowerDef.conc} — {selPowerDef.mant === 'Sí' ? 'Mantenimiento' : 'Sin mantenimiento'} — {selPowerDef.alcance}</span>
              <br />
              <span className="text-parchment">{selPowerDef.desc}</span>
            </p>
          )}
        </div>

        {showManual && (
          <div className="flex flex-col gap-2 border border-rim bg-surface px-3 py-3">
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Nombre" value={manual.name} onChange={e => setManual(m => ({ ...m, name: e.target.value }))} className="col-span-2 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors" />
              <select value={manual.disc} onChange={e => setManual(m => ({ ...m, disc: e.target.value }))} className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors">
                {DISCIPLINES.map(d => <option key={d} value={d}>{DISC_LABELS[d]}</option>)}
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
        <div className="p-4">
          <EmptyState icon="✵" label="Sin poderes psíquicos" />
        </div>
      ) : (
        // Réplica de renderPowers(): lista plana ordenada por disciplina y
        // luego nombre — el legacy NO agrupa en secciones con cabecera, la
        // disciplina es solo una etiqueta dentro de cada tarjeta (.power-card).
        <div className="flex flex-col gap-2 p-2">
          {[...char.powers]
            .sort((a, b) => (a.disc === b.disc ? a.name.localeCompare(b.name) : a.disc.localeCompare(b.disc)))
            .map(power => (
              <div key={power.id} className="bg-surface border border-purple-400 border-l-[3px] px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={['font-display text-[9px] tracking-[1px] px-2 py-0.5 border inline-block mb-1.5', DISC_COLORS[power.disc] ?? 'text-parchment-dim', DISC_BORDER[power.disc] ?? 'border-parchment-dim'].join(' ')}>
                      {DISC_BADGE_LABELS[power.disc] ?? power.disc.toUpperCase()}
                    </span>
                    <div className="font-rajdhani font-bold text-sm text-purple-400">{power.name}</div>
                  </div>
                  <button onClick={() => dispatch(removePower({ charId: char!.id, powerId: power.id }))} className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0" aria-label="Eliminar poder">✕</button>
                </div>
                <div className="flex flex-wrap gap-3 mb-1.5">
                  {[
                    { label: 'UMBRAL', value: power.umbral },
                    { label: 'CONCENTRACIÓN', value: power.conc || '—' },
                    { label: 'MANT.', value: power.mant || 'No' },
                    { label: 'ALCANCE', value: power.alcance || '—' },
                  ].map(s => (
                    <div key={s.label} className="flex flex-col gap-0.5">
                      <span className="font-mono text-[8px] tracking-[1px] text-parchment-dim">{s.label}</span>
                      <span className="font-display text-xs text-parchment-bright">{s.value}</span>
                    </div>
                  ))}
                </div>
                {power.desc && <p className="font-rajdhani text-[11px] text-parchment-dim leading-relaxed">{power.desc}</p>}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
