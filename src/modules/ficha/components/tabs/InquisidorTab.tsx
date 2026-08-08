import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { addInqMejora, removeInqMejora, updateInqMejoraNotes } from '../../services/fichaSlice'
import { INQUISIDOR_RANKS, type InquisidorMejora } from '@/core/data/darkheresy'
import { getInquisidorRank } from '@/core/data/darkheresy/careers'
import { computeXpSpent } from '../../services/fichaComputed'
import { EmptyState } from '../EmptyState'
import { InqMejoraPickerModal, type InqMejoraSection } from './inquisidor/InqMejoraPickerModal'

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function InquisidorTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)
  const [showPicker, setShowPicker] = useState(false)

  if (!char) return <NoChar />

  const xpSpent = computeXpSpent(char)
  const inqRank = getInquisidorRank(char.info.career, xpSpent, char.info.branch)

  if (inqRank === null) {
    return (
      <div className="flex flex-col gap-0">
        <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
          <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Talentos de Inquisidor</h3>
          <span className="font-display text-[12px] text-parchment-dim">Sin rango</span>
        </div>

        <div className="mx-4 mt-3 bg-surface border border-gold border-l-4 border-l-gold-bright px-3.5 py-3">
          <p className="font-mono text-xs text-parchment leading-relaxed">
            El rango de Inquisidor se desbloquea en el 6º rango de acólito.
          </p>
        </div>
      </div>
    )
  }

  const inqMejoras = char.inqMejoras ?? [] // personajes persistidos antes de esta migración
  const owned = new Set(inqMejoras.map(m => m.name))

  function buildSections(): InqMejoraSection[] {
    const sections: InqMejoraSection[] = []
    for (let r = 9; r <= inqRank!; r++) {
      const rankData = INQUISIDOR_RANKS.find(x => x.rank === r)
      if (!rankData) continue
      const mejoras = rankData.mejoras.filter(m => !owned.has(m.name))
      if (mejoras.length || rankData.note) sections.push({ rank: r, note: rankData.note, mejoras })
    }
    return sections
  }

  function handlePickerAdd(mejora: InquisidorMejora) {
    dispatch(addInqMejora({
      charId: char!.id,
      mejora: { name: mejora.name, type: mejora.type, cost: mejora.cost, req: mejora.req, desc: mejora.desc ?? '', notes: '' },
    }))
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2 flex items-center justify-between">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Talentos de Inquisidor</h3>
        <span className="font-display text-[12px] text-gold-bright">Rango {inqRank}</span>
      </div>

      <div className="mx-4 mt-3">
        <button
          onClick={() => setShowPicker(true)}
          className="w-full font-display text-[10px] uppercase tracking-[2px] px-3 py-2.5 bg-surface-3 border border-rim-bright border-t-2 border-t-gold text-gold hover:bg-surface-4 transition-colors"
        >
          ⚡ Añadir Mejora de Inquisidor
        </button>
      </div>

      {showPicker && (
        <InqMejoraPickerModal
          sections={buildSections()}
          onAdd={handlePickerAdd}
          onClose={() => setShowPicker(false)}
        />
      )}

      {inqMejoras.length === 0 ? (
        <div className="p-4">
          <EmptyState icon="⚜" label="Sin talentos de Inquisidor" />
        </div>
      ) : (
        <div className="flex flex-col px-4 py-2">
          {inqMejoras.map(m => (
            <div key={m.id} className="flex flex-col items-stretch gap-1 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-rajdhani text-[15px] font-bold text-gold-bright mb-1">{m.name}</div>
                  <div className="font-mono text-[9px] tracking-[2px] text-gold mb-1.5">
                    {m.type}{m.req && m.req !== '—' ? ` · Req: ${m.req}` : ''}
                  </div>
                  {m.desc && <div className="font-mono text-[11px] text-parchment mt-1 leading-relaxed">{m.desc}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className={['font-display text-[10px]', m.cost < 0 ? 'text-crimson-bright' : 'text-parchment-dim'].join(' ')}>
                    {m.cost > 0 ? '+' : ''}{m.cost} PE
                  </span>
                  <button
                    onClick={() => dispatch(removeInqMejora({ charId: char!.id, mejoraId: m.id }))}
                    className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors"
                    aria-label="Eliminar mejora"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <textarea
                placeholder="Notas personales..."
                value={m.notes ?? ''}
                onChange={e => dispatch(updateInqMejoraNotes({ charId: char!.id, mejoraId: m.id, notes: e.target.value }))}
                className="bg-surface border border-rim text-parchment font-mono text-[11px] px-2 py-1.5 outline-none focus:border-crimson transition-colors resize-y min-h-9 w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
