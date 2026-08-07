import { useAppSelector } from '@/core/store/hooks'

/** Resumen de solo lectura de mis propios personajes — así los ve el resto de la partida. */
export function MiPerfilTab() {
  const { characters } = useAppSelector(s => s.ficha)

  if (characters.length === 0) {
    return (
      <div className="text-center py-10 px-4 border border-dashed border-rim">
        <div className="text-4xl opacity-30 mb-3">✦</div>
        <p className="font-mono text-[11px] tracking-[1px] text-parchment-dim uppercase">Sin personajes todavía</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {characters.map(c => (
        <div
          key={c.id}
          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border border-rim-bright bg-surface-2 px-4 py-3"
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-display text-sm text-white truncate">{c.info.name || 'Sin designación'}</span>
            <span className="font-mono text-[10px] text-parchment-dim">
              {c.info.career || '—'} // Rango {c.info.rank || '—'}
            </span>
          </div>
          <div className="flex gap-3 shrink-0">
            <span className="font-mono text-[11px] text-crimson-bright">♥ {c.wounds.current}/{c.wounds.max}</span>
            <span className="font-mono text-[11px] text-gold-bright">⚙ {c.fate.current}/{c.fate.max}</span>
          </div>
        </div>
      ))}
      <p className="font-mono text-[9px] text-parchment-dim mt-2">
        Esto es lo que ven de ti los demás miembros de la partida.
      </p>
    </div>
  )
}
