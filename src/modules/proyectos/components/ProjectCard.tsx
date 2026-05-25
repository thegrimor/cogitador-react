import { useAppDispatch } from '@/core/store/hooks'
import {
  setProjectStatus,
  updateElapsedDays,
  updateTotalDays,
} from '@/modules/proyectos/services/proyectosSlice'
import { showToast } from '@/shared/components/Toast'
import type { Project, ProjectStatus } from '@/modules/proyectos/types/proyectosTypes'

interface Props {
  project: Project
  onDeleteRequest: (id: number, name: string) => void
}

function accentClass(status: ProjectStatus): string {
  switch (status) {
    case 'active': return 'bg-crimson animate-pulse-mech'
    case 'completed': return 'bg-neon'
    case 'paused': return 'bg-gold'
    default: return 'bg-parchment-dim'
  }
}

function badgeClass(status: ProjectStatus): string {
  switch (status) {
    case 'active': return 'text-crimson-bright border-crimson bg-crimson/10'
    case 'completed': return 'text-neon border-neon bg-neon/5'
    case 'paused': return 'text-gold border-gold'
    default: return 'text-parchment-dim border-parchment-dim'
  }
}

function badgeLabel(status: ProjectStatus): string {
  switch (status) {
    case 'active': return 'ACTIVO'
    case 'completed': return 'COMPLETADO'
    case 'paused': return 'PAUSADO'
    default: return 'EN ESPERA'
  }
}

function fillClass(status: ProjectStatus): string {
  switch (status) {
    case 'active': return 'bg-gradient-to-r from-crimson-dim to-crimson animate-pulse-mech'
    case 'completed': return 'bg-neon'
    case 'paused': return 'bg-gold'
    default: return 'bg-parchment-dim'
  }
}

function percentColor(status: ProjectStatus): string {
  switch (status) {
    case 'active': return 'text-crimson-bright'
    case 'completed': return 'text-neon'
    default: return 'text-parchment'
  }
}

function cardBorderClass(status: ProjectStatus): string {
  switch (status) {
    case 'active': return 'border-crimson-dim'
    case 'completed': return 'border-[#1a3a1a] opacity-80'
    default: return 'border-rim'
  }
}

const EDIT_INPUT_CLASS =
  'w-[70px] bg-surface border border-rim-bright text-parchment font-mono text-xs text-center px-2 py-1 outline-none focus:border-gold transition-colors'

const BTN_SM = 'font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 transition-colors'

export function ProjectCard({ project, onDeleteRequest }: Props) {
  const dispatch = useAppDispatch()
  const { id, name, category, daysTotal, daysElapsed, status, desc, createdDay } = project

  const pct = daysTotal > 0 ? Math.min(100, Math.round((daysElapsed / daysTotal) * 100)) : 0
  const remaining = Math.max(0, daysTotal - daysElapsed)
  const isComplete = status === 'completed'

  function changeStatus(next: ProjectStatus) {
    dispatch(setProjectStatus({ id, status: next }))
    showToast(`Proyecto actualizado: ${badgeLabel(next)}`)
  }

  function handleElapsedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value)
    if (!isNaN(val)) dispatch(updateElapsedDays({ id, days: val }))
  }

  function handleTotalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val >= 1) dispatch(updateTotalDays({ id, days: val }))
  }

  return (
    <div className={`bg-surface-2 border relative overflow-hidden transition-colors ${cardBorderClass(status)}`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${accentClass(status)}`} />

      <div className="pl-4 pr-4 pt-3 pb-2 flex justify-between items-start border-b border-rim gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-rajdhani font-semibold text-base text-white leading-tight truncate">{name}</p>
          <p className="font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim mt-0.5">
            {category} // DÍA {createdDay}
          </p>
        </div>
        <span className={`font-display text-[8px] tracking-[1px] px-2 py-1 border whitespace-nowrap shrink-0 ${badgeClass(status)}`}>
          {badgeLabel(status)}
        </span>
      </div>

      <div className="pl-4 pr-4 pt-3 pb-3">
        {desc && (
          <p className="font-rajdhani font-light text-[11px] text-parchment-dim leading-relaxed mb-3">
            {desc}
          </p>
        )}

        <div className="mb-3">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[10px] text-parchment-dim uppercase tracking-[1px]">Progreso</span>
            <span className="font-display text-xs text-white">{daysElapsed} / {daysTotal} días</span>
          </div>
          <div className="h-1.5 bg-surface border border-rim relative overflow-hidden">
            <div
              className={`h-full transition-all duration-500 relative ${fillClass(status)}`}
              style={{ width: `${pct}%` }}
            >
              <span className="absolute top-0 right-0 w-[3px] h-full bg-white/40" />
            </div>
          </div>
          <div className="flex justify-between items-end mt-2">
            <span className={`font-display text-xl font-bold ${percentColor(status)}`}>{pct}%</span>
            {isComplete ? (
              <span className="font-mono text-[10px] text-neon">✓ OPERATIVO</span>
            ) : (
              <span className="font-mono text-[10px] text-parchment-dim">{remaining} días restantes</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center pt-2 border-t border-rim">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] text-parchment-dim uppercase tracking-[1px]">Días transcurridos</label>
            <input
              type="number"
              min={0}
              max={daysTotal}
              value={daysElapsed}
              onChange={handleElapsedChange}
              className={EDIT_INPUT_CLASS}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[9px] text-parchment-dim uppercase tracking-[1px]">Días totales</label>
            <input
              type="number"
              min={1}
              value={daysTotal}
              onChange={handleTotalChange}
              className={EDIT_INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center px-4 py-2.5 border-t border-rim bg-black/20">
        {status === 'pending' && (
          <button
            onClick={() => changeStatus('active')}
            className={`${BTN_SM} bg-crimson text-white hover:bg-crimson-bright`}
          >
            ▶ Iniciar
          </button>
        )}
        {status === 'active' && (
          <button
            onClick={() => changeStatus('paused')}
            className={`${BTN_SM} bg-surface-4 border border-rim-bright text-parchment-dim hover:text-parchment`}
          >
            ⏸ Pausar
          </button>
        )}
        {status === 'paused' && (
          <button
            onClick={() => changeStatus('active')}
            className={`${BTN_SM} bg-gold text-black font-bold hover:bg-gold-bright`}
          >
            ▶ Reanudar
          </button>
        )}
        {status !== 'completed' && (
          <button
            onClick={() => changeStatus('completed')}
            className={`${BTN_SM} bg-surface-4 border border-rim-bright text-parchment-dim hover:text-parchment`}
          >
            ✓ Completar
          </button>
        )}
        {status === 'completed' && (
          <button
            onClick={() => changeStatus('pending')}
            className={`${BTN_SM} bg-surface-4 border border-rim-bright text-parchment-dim hover:text-parchment`}
          >
            ↺ Reabrir
          </button>
        )}
        <button
          onClick={() => onDeleteRequest(id, name)}
          className={`${BTN_SM} ml-auto bg-surface-4 border border-rim-bright text-crimson-dim hover:text-crimson`}
        >
          ✕ Purgar
        </button>
      </div>

      {isComplete && (
        <div
          className="absolute top-1/2 right-5 pointer-events-none select-none font-display text-[11px] font-black text-neon border-2 border-neon px-2.5 py-1 opacity-25 tracking-[3px]"
          style={{ transform: 'translateY(-50%) rotate(12deg)' }}
        >
          COMPLETADO
        </div>
      )}
    </div>
  )
}
