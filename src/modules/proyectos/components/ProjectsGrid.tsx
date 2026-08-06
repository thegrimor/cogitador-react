import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { deleteProject } from '@/modules/proyectos/services/proyectosSlice'
import { showToast } from '@/shared/components/Toast'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { useConfirm } from '@/shared/hooks/useConfirm'
import { ProjectCard } from './ProjectCard'
import type { ProjectStatus } from '@/modules/proyectos/types/proyectosTypes'

type FilterValue = 'all' | ProjectStatus

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'TODOS' },
  { value: 'active', label: 'ACTIVOS' },
  { value: 'pending', label: 'EN ESPERA' },
  { value: 'completed', label: 'COMPLETADOS' },
  { value: 'paused', label: 'PAUSADOS' },
]

export function ProjectsGrid() {
  const dispatch = useAppDispatch()
  const { projects } = useAppSelector(s => s.proyectos)
  const [filter, setFilter] = useState<FilterValue>('all')
  const { isOpen, message, confirm, onConfirm, onCancel } = useConfirm()

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  function handleDeleteRequest(id: number, name: string) {
    confirm(
      `¿Purgar el proyecto "${name}" del registro? Esta acción es irreversible.`,
      () => {
        dispatch(deleteProject(id))
        showToast(`Proyecto "${name}" eliminado del cogitador`)
      }
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-[15px]">
        <h2 className="font-display text-[11px] uppercase tracking-[4px] text-parchment-dim">
          // Registro de Proyectos Activos
        </h2>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as FilterValue)}
          className="bg-surface-2 border border-rim-bright text-parchment font-mono text-[11px] px-[10px] py-1.5 outline-none focus:border-crimson transition-colors"
        >
          {FILTER_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-surface-2">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-rim px-5 py-[60px] text-center">
          <p className="text-5xl mb-4 opacity-30">⚙</p>
          <h3 className="font-display text-xs uppercase tracking-[3px] text-parchment-dim mb-2">
            Sin Proyectos Registrados
          </h3>
          <p className="font-mono text-xs text-parchment-dim">
            El cogitador no contiene datos de proyectos{filter !== 'all' ? ' con ese estado' : ''}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
          {filtered.map(p => (
            <ProjectCard key={p.id} project={p} onDeleteRequest={handleDeleteRequest} />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isOpen}
        message={message}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </>
  )
}
