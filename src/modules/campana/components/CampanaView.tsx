import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { clearActiveCampaign, fetchCampaignDetail, fetchMyCampaigns } from '../services/campanaSlice'
import { CampaignList } from './CampaignList'
import { JugadoresTab } from './tabs/JugadoresTab'
import { MiPerfilTab } from './tabs/MiPerfilTab'
import { NotasGrupalesTab } from './tabs/NotasGrupalesTab'

interface Props {
  /** Solo cuando se usa como pantalla independiente (USER, vía "Ver la campaña" del menú de cuenta).
   *  Master/admin la usan embebida como tab "Grupo" — sin onBack, no hay "volver" al nivel de lista. */
  onBack?: () => void
}

type CampanaTab = 'jugadores' | 'perfil' | 'notas'

const TABS: Array<{ id: CampanaTab; label: string }> = [
  { id: 'jugadores', label: 'Jugadores' },
  { id: 'perfil', label: 'Mi perfil' },
  { id: 'notas', label: 'Notas' },
]

export function CampanaView({ onBack }: Props) {
  const dispatch = useAppDispatch()
  const token = useAppSelector(s => s.auth.token)
  const user = useAppSelector(s => s.auth.user)
  const { campaigns, current, status } = useAppSelector(s => s.campana)
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null)
  const [tab, setTab] = useState<CampanaTab>('jugadores')

  useEffect(() => {
    if (token) dispatch(fetchMyCampaigns(token))
  }, [dispatch, token])

  useEffect(() => {
    if (token && activeCampaignId) dispatch(fetchCampaignDetail({ token, id: activeCampaignId }))
  }, [dispatch, token, activeCampaignId])

  function openCampaign(id: string) {
    setActiveCampaignId(id)
    setTab('jugadores')
  }

  function backToList() {
    setActiveCampaignId(null)
    dispatch(clearActiveCampaign())
  }

  const canCreate = user?.role === 'ADMIN' || user?.role === 'MASTER'
  const isManager = !!current && (user?.role === 'ADMIN' || current.master.id === user?.id)

  return (
    <div className="flex flex-1 flex-col">
      {(activeCampaignId || onBack) && (
        <div className="flex items-center gap-3 border-b border-rim-bright bg-surface-2 px-4 py-2.5">
          <button
            onClick={activeCampaignId ? backToList : onBack}
            className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment transition-colors"
          >
            ← {activeCampaignId ? 'Partidas' : 'Volver'}
          </button>
          {activeCampaignId && current && (
            <p className="font-display text-xs text-gold tracking-[1px] truncate">{current.name}</p>
          )}
        </div>
      )}

      {!activeCampaignId ? (
        <CampaignList
          campaigns={campaigns}
          loading={status === 'loading'}
          canCreate={canCreate}
          onOpen={openCampaign}
        />
      ) : (
        <div className="flex flex-1 flex-col">
          <nav className="flex border-b border-rim-bright bg-surface-2">
            {TABS.map(t => {
              const isActive = t.id === tab
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={[
                    'flex-1 py-2.5 font-display text-[9px] uppercase tracking-[2px] border-b-2 transition-colors',
                    isActive
                      ? 'text-crimson-bright border-crimson-bright'
                      : 'text-parchment-dim border-transparent hover:text-parchment',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              )
            })}
          </nav>

          <div className="flex-1 overflow-y-auto p-4">
            {status === 'loading' && !current && (
              <p className="font-mono text-xs text-parchment-dim">Cargando partida...</p>
            )}
            {current && tab === 'jugadores' && <JugadoresTab campaign={current} isManager={isManager} />}
            {tab === 'perfil' && <MiPerfilTab />}
            {tab === 'notas' && <NotasGrupalesTab />}
          </div>
        </div>
      )}
    </div>
  )
}
