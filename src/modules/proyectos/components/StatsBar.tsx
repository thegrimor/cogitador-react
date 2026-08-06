import { useAppSelector } from '@/core/store/hooks'

export function StatsBar() {
  const { projects } = useAppSelector(s => s.proyectos)

  const total = projects.length
  const active = projects.filter(p => p.status === 'active').length
  const completed = projects.filter(p => p.status === 'completed').length
  const pending = projects.filter(p => p.status === 'pending').length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-[25px]">
      <div className="bg-surface-2 border border-rim px-4 py-3 text-center">
        <span className="block font-display text-2xl font-bold text-gold-bright">{total}</span>
        <span className="block font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim mt-1">Total Proyectos</span>
      </div>
      <div className="bg-surface-2 border border-rim px-4 py-3 text-center">
        <span className="block font-display text-2xl font-bold text-crimson-bright">{active}</span>
        <span className="block font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim mt-1">En Progreso</span>
      </div>
      <div className="bg-surface-2 border border-rim px-4 py-3 text-center">
        <span className="block font-display text-2xl font-bold text-neon">{completed}</span>
        <span className="block font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim mt-1">Completados</span>
      </div>
      <div className="bg-surface-2 border border-rim px-4 py-3 text-center">
        <span className="block font-display text-2xl font-bold text-parchment-dim">{pending}</span>
        <span className="block font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim mt-1">En Espera</span>
      </div>
    </div>
  )
}
