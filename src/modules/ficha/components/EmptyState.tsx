interface Props {
  icon: string
  label: string
  /** Ocupa toda la fila en grids (grid-column:1/-1 del legacy) */
  fullRow?: boolean
}

/** Réplica de .empty del HTML legacy: caja de borde punteado, icono a 36px/30% opacidad, texto 11px. */
export function EmptyState({ icon, label, fullRow }: Props) {
  return (
    <div className={['text-center py-10 px-4 border border-dashed border-rim', fullRow ? 'col-span-full' : ''].join(' ')}>
      <div className="text-4xl opacity-30 mb-3">{icon}</div>
      <p className="font-mono text-[11px] tracking-[1px] text-parchment-dim uppercase">{label}</p>
    </div>
  )
}
