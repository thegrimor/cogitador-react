import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { createCampaign, fetchMyCampaigns } from '../services/campanaSlice'
import type { CampaignSummary } from '../types/campanaTypes'

interface Props {
  campaigns: CampaignSummary[]
  loading: boolean
  canCreate: boolean
  onOpen: (id: string) => void
}

export function CampaignList({ campaigns, loading, canCreate, onOpen }: Props) {
  const dispatch = useAppDispatch()
  const token = useAppSelector(s => s.auth.token)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !name.trim()) return
    setSubmitting(true)
    const result = await dispatch(createCampaign({ token, name: name.trim() }))
    setSubmitting(false)
    if (createCampaign.fulfilled.match(result)) {
      setName('')
      setShowForm(false)
      dispatch(fetchMyCampaigns(token))
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {canCreate && (
        <div>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="font-display text-[9px] uppercase tracking-[2px] bg-crimson px-3 py-2 text-white hover:bg-crimson-bright transition-colors"
            >
              + Nueva partida
            </button>
          ) : (
            <form onSubmit={handleCreate} className="flex gap-2 border border-rim-bright bg-surface-2 p-3">
              <input
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre de la partida"
                className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="font-display text-[9px] uppercase tracking-[2px] bg-crimson px-3 py-2 text-white hover:bg-crimson-bright transition-colors disabled:opacity-40"
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setName('') }}
                className="font-display text-[9px] uppercase tracking-[2px] bg-surface-4 border border-rim-bright text-parchment-dim px-3 py-2 hover:text-parchment transition-colors"
              >
                Cancelar
              </button>
            </form>
          )}
        </div>
      )}

      {loading && campaigns.length === 0 && (
        <p className="font-mono text-xs text-parchment-dim">Cargando partidas...</p>
      )}

      {!loading && campaigns.length === 0 && (
        <div className="text-center py-10 px-4 border border-dashed border-rim">
          <div className="text-4xl opacity-30 mb-3">⚙</div>
          <p className="font-mono text-[11px] tracking-[1px] text-parchment-dim uppercase">
            Sin partidas todavía
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {campaigns.map(c => (
          <button
            key={c.id}
            onClick={() => onOpen(c.id)}
            className="flex items-center justify-between border border-rim-bright bg-surface-2 px-4 py-3 text-left hover:border-gold transition-colors"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-display text-sm text-white tracking-[1px] truncate">{c.name}</span>
              <span className="font-mono text-[10px] text-parchment-dim">
                Master: {c.masterUsername} // {c.memberCount} jugador{c.memberCount === 1 ? '' : 'es'}
              </span>
            </div>
            <span className="text-parchment-dim shrink-0 ml-2">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
