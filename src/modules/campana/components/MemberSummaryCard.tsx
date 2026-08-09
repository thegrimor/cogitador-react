import { ProfileSections } from './ProfileSections'
import type { CampaignMember } from '../types/campanaTypes'

interface Props {
  member: CampaignMember
  onRemove?: () => void
}

/** Tarjeta de solo lectura: ficha + séquito + proyectos + notas de un jugador de la partida. */
export function MemberSummaryCard({ member, onRemove }: Props) {
  return (
    <div className="border border-rim-bright bg-surface-2">
      <div className="flex items-center justify-between border-b border-rim bg-crimson/5 px-4 py-2">
        <h3 className="font-display text-[11px] uppercase tracking-[2px] text-crimson-bright">{member.username}</h3>
        {onRemove && (
          <button
            onClick={onRemove}
            className="font-display text-[8px] uppercase tracking-[1px] border border-crimson-dim text-crimson-dim px-2 py-1 hover:bg-surface-3 transition-colors"
          >
            Quitar
          </button>
        )}
      </div>

      <div className="px-4 py-3">
        <ProfileSections
          characters={member.ficha?.characters ?? []}
          sequitoEntries={member.sequito ? Object.values(member.sequito.sequito) : []}
          projects={member.proyectos?.projects ?? []}
          notes={member.notas?.notes ?? []}
        />
      </div>
    </div>
  )
}
