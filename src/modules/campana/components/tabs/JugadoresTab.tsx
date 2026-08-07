import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { addPlayer, fetchCampaignDetail, removePlayer } from '../../services/campanaSlice'
import { useConfirm } from '@/shared/hooks/useConfirm'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { showToast } from '@/shared/components/Toast'
import { MemberSummaryCard } from '../MemberSummaryCard'
import type { CampaignDetail } from '../../types/campanaTypes'

interface Props {
  campaign: CampaignDetail
  isManager: boolean
}

export function JugadoresTab({ campaign, isManager }: Props) {
  const dispatch = useAppDispatch()
  const token = useAppSelector(s => s.auth.token)
  const [identifier, setIdentifier] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const confirm = useConfirm()

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!token || !identifier.trim()) return
    setSubmitting(true)
    const result = await dispatch(addPlayer({ token, campaignId: campaign.id, identifier: identifier.trim() }))
    setSubmitting(false)
    if (addPlayer.fulfilled.match(result)) {
      setIdentifier('')
      showToast('Jugador añadido a la partida')
      dispatch(fetchCampaignDetail({ token, id: campaign.id }))
    } else {
      showToast(typeof result.payload === 'string' ? result.payload : 'No se pudo añadir al jugador')
    }
  }

  function handleRemove(userId: string, username: string) {
    confirm.confirm(`¿Quitar a ${username} de la partida?`, () => {
      if (!token) return
      dispatch(removePlayer({ token, campaignId: campaign.id, userId })).then(result => {
        if (removePlayer.fulfilled.match(result)) {
          showToast('Jugador eliminado de la partida')
          dispatch(fetchCampaignDetail({ token, id: campaign.id }))
        }
      })
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {isManager && (
        <form onSubmit={handleAdd} className="flex gap-2 border border-rim-bright bg-surface-2 p-3">
          <input
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="Usuario o email a añadir"
            className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-sm px-3 py-2 outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            disabled={submitting || !identifier.trim()}
            className="font-display text-[9px] uppercase tracking-[2px] bg-crimson px-3 py-2 text-white hover:bg-crimson-bright transition-colors disabled:opacity-40"
          >
            Añadir
          </button>
        </form>
      )}

      {campaign.members.length === 0 && (
        <div className="text-center py-10 px-4 border border-dashed border-rim">
          <div className="text-4xl opacity-30 mb-3">☩</div>
          <p className="font-mono text-[11px] tracking-[1px] text-parchment-dim uppercase">Sin jugadores todavía</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {campaign.members.map(m => (
          <MemberSummaryCard
            key={m.id}
            member={m}
            onRemove={isManager ? () => handleRemove(m.id, m.username) : undefined}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
        confirmLabel="Quitar"
      />
    </div>
  )
}
