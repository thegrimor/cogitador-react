import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppSelector } from '@/core/store/hooks'

interface Props {
  seqId: string
  onEdit: (id: string) => void
}

export function SequitoCard({ seqId, onEdit }: Props) {
  const member = useAppSelector(s => s.sequito.sequito[seqId])

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: seqId,
    data: { type: 'seq', layerId: member?.layerId },
  })

  if (!member) return null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const equipCount =
    member.equipment.reduce((a, e) => a + e.qty, 0) +
    member.eq_implants.reduce((a, e) => a + e.qty, 0) +
    member.eq_mechadendrites.reduce((a, e) => a + e.qty, 0) +
    member.eq_equipment.reduce((a, e) => a + e.qty, 0) +
    member.eq_armor.reduce((a, e) => a + e.qty, 0)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'flex items-center gap-2 bg-surface-3 border border-rim border-l-[3px] px-2.5 py-2',
        'cursor-pointer transition-all duration-150 select-none',
        member.alive
          ? 'border-l-rim-bright hover:border-l-gold hover:bg-surface-4 hover:border-rim-bright'
          : 'border-l-crimson-dim opacity-50',
        isDragging ? 'opacity-30' : '',
      ].join(' ')}
      onClick={() => onEdit(seqId)}
    >
      <span
        {...attributes}
        {...listeners}
        className="text-rim-bright text-xs cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
        onClick={e => e.stopPropagation()}
      >
        ⠿
      </span>

      <span
        className={[
          'w-2 h-2 rounded-full flex-shrink-0',
          member.alive
            ? 'bg-neon'
            : 'bg-transparent border border-crimson-dim',
        ].join(' ')}
        style={member.alive ? { boxShadow: '0 0 6px rgba(42,255,106,0.4)' } : undefined}
      />

      <div className="flex-1 min-w-0">
        <div
          className={[
            'font-rajdhani font-semibold text-sm leading-tight truncate',
            member.alive ? 'text-white' : 'line-through text-parchment-dim',
          ].join(' ')}
        >
          {member.name}
        </div>
        {member.role && (
          <div className="font-mono text-[9px] tracking-[1px] text-parchment-dim truncate">
            {member.role}
          </div>
        )}
      </div>

      {equipCount > 0 && (
        <span className="font-mono text-[8px] text-gold flex-shrink-0">⚔{equipCount}</span>
      )}
    </div>
  )
}
