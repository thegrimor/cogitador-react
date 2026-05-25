import { useState } from 'react'
import { useAppDispatch } from '@/core/store/hooks'
import { addProject } from '@/modules/proyectos/services/proyectosSlice'
import { showToast } from '@/shared/components/Toast'
import type { ProjectCategory } from '@/modules/proyectos/types/proyectosTypes'

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'MILITAR', label: 'MILITAR' },
  { value: 'ENERGÍA', label: 'ENERGÍA' },
  { value: 'INDUSTRIA', label: 'INDUSTRIA' },
  { value: 'ESPIONAJE', label: 'ESPIONAJE' },
  { value: 'CIVIL', label: 'CIVIL' },
  { value: 'CULTO', label: 'CULTO [CLASIFICADO]' },
  { value: 'OTRO', label: 'OTRO' },
]

const INPUT_CLASS =
  'bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors w-full'

const SELECT_CLASS =
  'bg-surface-2 border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors w-full'

export function AddProjectForm() {
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ProjectCategory>('MILITAR')
  const [daysTotal, setDaysTotal] = useState(30)
  const [desc, setDesc] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      showToast('ERROR: La denominación del proyecto es obligatoria')
      return
    }
    if (daysTotal < 1) {
      showToast('ERROR: Los días totales deben ser al menos 1')
      return
    }
    dispatch(addProject({ name: trimmed, category, daysTotal, desc: desc.trim() }))
    showToast(`Proyecto "${trimmed}" registrado en el cogitador`)
    setName('')
    setCategory('MILITAR')
    setDaysTotal(30)
    setDesc('')
  }

  return (
    <div className="bg-surface-2 border border-rim-bright border-t-[3px] border-t-crimson px-5 py-5 mb-4">
      <h2 className="font-display text-[11px] uppercase tracking-[4px] text-crimson mb-4 pb-2 border-b border-rim">
        ⚙ Registrar Nuevo Proyecto
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim">
              Denominación del Proyecto
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Academia Nacional de Tecnología"
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim">
              Categoría
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ProjectCategory)}
              className={SELECT_CLASS}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value} className="bg-surface-2">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim">
              Días Totales Requeridos
            </label>
            <input
              type="number"
              min={1}
              value={daysTotal}
              onChange={e => setDaysTotal(Math.max(1, parseInt(e.target.value) || 1))}
              className={INPUT_CLASS}
            />
          </div>
          <button
            type="submit"
            className="bg-crimson text-white font-display text-[10px] uppercase tracking-[2px] px-4 py-2 font-bold transition-colors hover:bg-crimson-bright whitespace-nowrap"
          >
            + Registrar
          </button>
        </div>
        <div className="mt-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[9px] uppercase tracking-[2px] text-parchment-dim">
              Notas / Descripción (opcional)
            </label>
            <input
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Observaciones del Omnissiah..."
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
