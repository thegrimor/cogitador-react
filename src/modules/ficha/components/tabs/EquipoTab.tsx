import { useAppSelector, useAppDispatch } from '@/core/store/hooks'
import { updateMoney, addCurrency, updateCurrency, removeCurrency, updateNotes } from '../../services/fichaSlice'

function NoChar() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-12">
      <p className="font-display text-[9px] uppercase tracking-[3px] text-parchment-dim text-center">
        Sin operativo seleccionado
      </p>
    </div>
  )
}

export function EquipoTab() {
  const dispatch = useAppDispatch()
  const { characters, activeCharacterId } = useAppSelector(s => s.ficha)
  const char = characters.find(c => c.id === activeCharacterId)

  if (!char) return <NoChar />

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[10px] uppercase tracking-[3px] text-crimson">// Recursos</h3>
      </div>

      <div className="px-4 py-3 flex flex-col gap-3 border-b border-rim bg-surface-2">
        <div className="border-b border-rim bg-crimson/5 -mx-4 px-4 py-1.5 mb-1">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">Dinero</h4>
        </div>
        <div className="flex items-center gap-3">
          <label className="font-mono text-[11px] text-parchment-dim uppercase tracking-[1px] shrink-0">Tronos</label>
          <input
            type="number"
            value={char.moneyThrones}
            onChange={e => dispatch(updateMoney({ charId: char.id, thrones: Number(e.target.value) }))}
            className="w-28 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-center"
          />
        </div>

        {char.currencies.map((cur, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              value={cur.name}
              onChange={e => dispatch(updateCurrency({ charId: char.id, idx, currency: { name: e.target.value, amount: cur.amount } }))}
              placeholder="Divisa"
              className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
            />
            <input
              type="number"
              value={cur.amount}
              onChange={e => dispatch(updateCurrency({ charId: char.id, idx, currency: { name: cur.name, amount: Number(e.target.value) } }))}
              className="w-24 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors text-center"
            />
            <button
              onClick={() => dispatch(removeCurrency({ charId: char.id, idx }))}
              className="font-mono text-xs text-parchment-dim hover:text-crimson-bright transition-colors shrink-0"
              aria-label="Eliminar divisa"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          onClick={() => dispatch(addCurrency({ charId: char.id, currency: { name: 'NUEVA DIVISA', amount: 0 } }))}
          className="font-display text-[9px] uppercase tracking-[2px] border border-rim-bright text-parchment-dim px-3 py-1.5 hover:border-gold hover:text-gold transition-colors text-left"
        >
          + Añadir Divisa
        </button>
      </div>

      <div className="px-4 py-3 flex flex-col gap-2 border-b border-rim bg-surface-2">
        <div className="border-b border-rim bg-crimson/5 -mx-4 px-4 py-1.5 mb-1">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">Notas Rápidas</h4>
        </div>
        <textarea
          value={char.quickNotes}
          onChange={e => dispatch(updateNotes({ charId: char.id, field: 'quickNotes', value: e.target.value }))}
          placeholder="Notas de sesión, recordatorios..."
          className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full min-h-[80px] resize-y"
        />
      </div>

      <div className="px-4 py-3 flex flex-col gap-2 border-b border-rim bg-surface-2">
        <div className="border-b border-rim bg-crimson/5 -mx-4 px-4 py-1.5 mb-1">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">Influencia — General</h4>
        </div>
        <textarea
          value={char.influenceGeneral}
          onChange={e => dispatch(updateNotes({ charId: char.id, field: 'influenceGeneral', value: e.target.value }))}
          placeholder="Contactos, favores, influencias generales..."
          className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full min-h-[80px] resize-y"
        />
      </div>

      <div className="px-4 py-3 flex flex-col gap-2 bg-surface-2">
        <div className="border-b border-rim bg-crimson/5 -mx-4 px-4 py-1.5 mb-1">
          <h4 className="font-display text-[9px] uppercase tracking-[2px] text-gold">Influencia — Planetaria</h4>
        </div>
        <textarea
          value={char.influencePlanetary}
          onChange={e => dispatch(updateNotes({ charId: char.id, field: 'influencePlanetary', value: e.target.value }))}
          placeholder="Influencias en el planeta actual..."
          className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors w-full min-h-[80px] resize-y"
        />
      </div>
    </div>
  )
}
