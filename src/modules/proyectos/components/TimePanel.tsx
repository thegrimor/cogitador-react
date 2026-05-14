import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { advanceTime } from '@/modules/proyectos/services/proyectosSlice'
import { showToast } from '@/shared/components/Toast'

export function TimePanel() {
  const dispatch = useAppDispatch()
  const { globalDay, projects } = useAppSelector(s => s.proyectos)
  const [days, setDays] = useState(1)
  const importRef = useRef<HTMLInputElement>(null)

  function handleAdvance() {
    if (days <= 0) {
      showToast('ERROR: Introduce un número de días válido')
      return
    }
    dispatch(advanceTime(days))
    showToast(`Tiempo avanzado ${days} día${days !== 1 ? 's' : ''}`)
  }

  function handleExport() {
    const data = { globalDay, projects }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proyectos_dia${globalDay}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Datos exportados al archivo local')
  }

  function handleImportClick() {
    importRef.current?.click()
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const raw = event.target?.result
        if (typeof raw !== 'string') return
        const data = JSON.parse(raw) as { globalDay?: unknown; projects?: unknown }
        if (data.projects === undefined || data.globalDay === undefined) {
          showToast('ERROR: Formato de archivo inválido')
          return
        }
        try {
          const existing = localStorage.getItem('persist:cogitador-root')
          const root = existing ? (JSON.parse(existing) as Record<string, string>) : {}
          root['proyectos'] = JSON.stringify(data)
          localStorage.setItem('persist:cogitador-root', JSON.stringify(root))
          showToast('Datos importados. Recargando...')
          setTimeout(() => window.location.reload(), 800)
        } catch {
          showToast('ERROR: No se pudo importar al cogitador local')
        }
      } catch {
        showToast('ERROR: No se pudo parsear el archivo')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="bg-surface-2 border border-gold border-l-4 border-l-gold-bright px-4 py-4 mb-4 flex flex-wrap items-center gap-4">
      <label className="font-display text-[10px] uppercase tracking-[3px] text-gold whitespace-nowrap">
        ⚡ Avanzar Tiempo
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={days}
          onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-[100px] bg-surface border border-gold text-gold-bright font-display text-lg text-center px-3 py-2 outline-none focus:border-gold-bright focus:shadow-[0_0_10px_rgba(240,184,64,0.2)] transition-colors"
        />
        <span className="font-mono text-[11px] text-parchment-dim">DÍAS</span>
      </div>
      <button
        onClick={handleAdvance}
        className="bg-gold text-black font-display text-[11px] uppercase tracking-[2px] px-5 py-2 font-bold transition-colors hover:bg-gold-bright"
      >
        Avanzar
      </button>
      <div className="ml-auto flex gap-2">
        <button
          onClick={handleExport}
          className="bg-surface-4 border border-rim-bright text-parchment-dim font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 transition-colors hover:text-parchment hover:border-parchment-dim"
        >
          ⬇ Exportar JSON
        </button>
        <button
          onClick={handleImportClick}
          className="bg-surface-4 border border-rim-bright text-parchment-dim font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 transition-colors hover:text-parchment hover:border-parchment-dim"
        >
          ⬆ Importar JSON
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImportFile}
        />
      </div>
    </div>
  )
}
