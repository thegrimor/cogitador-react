import { useState } from 'react'
import { useAppDispatch } from '@/core/store/hooks'
import { addCharacter } from '../services/fichaSlice'

interface Props {
  onClose: () => void
}

export function CharacterCreateModal({ onClose }: Props) {
  const dispatch = useAppDispatch()
  const [form, setForm] = useState({
    name: '',
    rank: '1',
    career: '',
    homeworld: '',
    experience: '0',
    xpSpent: '0',
  })

  function handleCreate() {
    if (!form.name.trim()) return
    dispatch(addCharacter({ info: { ...form, name: form.name.trim() } }))
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/85"
      onClick={onClose}
    >
      <div
        className="w-full border-t-2 border-crimson bg-surface-2"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b border-rim-bright px-4 py-3">
          <p className="font-display text-[10px] uppercase tracking-[3px] text-crimson">
            // Registrar Nuevo Operativo
          </p>
        </div>

        <div className="flex flex-col gap-3 px-4 py-4">
          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim">
              Designación / Nombre
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Brother Corvus"
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Rango */}
            <div className="flex flex-col gap-1">
              <label className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim">
                Rango
              </label>
              <input
                type="text"
                value={form.rank}
                onChange={e => setForm(f => ({ ...f, rank: e.target.value }))}
                placeholder="1"
                className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              />
            </div>

            {/* Carrera */}
            <div className="flex flex-col gap-1">
              <label className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim">
                Carrera
              </label>
              <input
                type="text"
                value={form.career}
                onChange={e => setForm(f => ({ ...f, career: e.target.value }))}
                placeholder="Tech-Priest"
                className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
              />
            </div>
          </div>

          {/* Mundo de origen */}
          <div className="flex flex-col gap-1">
            <label className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim">
              Mundo de Origen
            </label>
            <input
              type="text"
              value={form.homeworld}
              onChange={e => setForm(f => ({ ...f, homeworld: e.target.value }))}
              placeholder="Ej: Scintilla"
              className="bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-crimson transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-rim-bright px-4 py-3">
          <button
            onClick={onClose}
            className="flex-1 font-display text-[9px] uppercase tracking-[2px] border border-rim-bright text-parchment-dim py-2 hover:border-parchment-dim hover:text-parchment transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!form.name.trim()}
            className="flex-1 font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white py-2 hover:bg-crimson-bright transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  )
}
