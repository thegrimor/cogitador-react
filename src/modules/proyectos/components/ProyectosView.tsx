import { useAppSelector } from '@/core/store/hooks'
import { Toast } from '@/shared/components/Toast'
import { StatsBar } from './StatsBar'
import { TimePanel } from './TimePanel'
import { AddProjectForm } from './AddProjectForm'
import { ProjectsGrid } from './ProjectsGrid'

export function ProyectosView() {
  const { globalDay, projects } = useAppSelector(s => s.proyectos)
  const active = projects.filter(p => p.status === 'active').length

  return (
    <div className="flex flex-col flex-1">
      <div className="bg-surface-2 border-b border-crimson-dim px-4 py-3 flex justify-between items-center shrink-0">
        <div>
          <h1 className="font-display text-sm font-black uppercase tracking-[3px] text-crimson-bright">
            Proyectos de Campaña
          </h1>
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-gold mt-0.5">
            // Ministerio de Tecnología — Subsecretaría Operacional
          </p>
        </div>
        <div className="text-right">
          <span className="block font-display text-xl font-bold text-gold-bright">
            DÍA {globalDay}
          </span>
          <span className="block font-mono text-[9px] text-parchment-dim uppercase tracking-[1px] mt-0.5">
            Día de campaña actual
          </span>
          <span className="block font-mono text-[9px] text-parchment-dim uppercase tracking-[1px]">
            {active} PROYECTO{active !== 1 ? 'S' : ''} ACTIVO{active !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-0 px-4 pt-4 pb-20 overflow-y-auto">
        <StatsBar />
        <TimePanel />
        <AddProjectForm />
        <ProjectsGrid />
      </div>

      <Toast />
    </div>
  )
}
