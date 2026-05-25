import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { addLayer, reorderLayers, moveSequitoToLayer } from '../services/sequitoSlice'
import { LayerRow } from './LayerRow'

interface Props {
  searchQuery: string
  onAddSeq: (layerId: string) => void
  onEditSeq: (seqId: string) => void
}

type DragData = { type: 'layer' } | { type: 'seq'; layerId: string }

export function LayerBoard({ searchQuery, onAddSeq, onEditSeq }: Props) {
  const dispatch = useAppDispatch()
  const layers = useAppSelector(s => s.sequito.layers)
  const allSequito = useAppSelector(s => s.sequito.sequito)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'layer' | 'seq' | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as DragData | undefined
    setActiveId(String(event.active.id))
    setActiveType(data?.type ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    setActiveType(null)

    if (!over || active.id === over.id) return

    const activeData = active.data.current as DragData | undefined
    const overData = over.data.current as DragData | undefined

    if (activeData?.type === 'layer') {
      const fromIdx = layers.findIndex(l => l.id === active.id)
      const toIdx = layers.findIndex(l => l.id === over.id)
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        dispatch(reorderLayers({ fromIdx, toIdx }))
      }
      return
    }

    if (activeData?.type === 'seq') {
      const seqId = String(active.id)
      const sourceLayerId = (activeData as { type: 'seq'; layerId: string }).layerId

      let targetLayerId: string | undefined

      if (overData?.type === 'layer') {
        targetLayerId = String(over.id)
      } else if (overData?.type === 'seq') {
        targetLayerId = (overData as { type: 'seq'; layerId: string }).layerId
      }

      if (!targetLayerId || !sourceLayerId) return

      if (targetLayerId !== sourceLayerId) {
        dispatch(moveSequitoToLayer({ seqId, targetLayerId }))
      }
    }
  }

  const layerIds = layers.map(l => l.id)
  const activeSeqMember = activeType === 'seq' && activeId ? allSequito[activeId] : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={layerIds} strategy={verticalListSortingStrategy}>
        <div>
          {layers.map(layer => (
            <LayerRow
              key={layer.id}
              layer={layer}
              onAddSeq={onAddSeq}
              onEditSeq={onEditSeq}
              searchQuery={searchQuery}
              allSequito={allSequito}
            />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={() => dispatch(addLayer())}
        className="w-full h-11 border-t-2 border-dashed border-rim-bright bg-transparent text-parchment-dim font-display text-[9px] uppercase tracking-[2px] cursor-pointer hover:border-crimson-dim hover:text-crimson transition-all mt-1"
      >
        + AÑADIR GRUPO
      </button>

      <DragOverlay>
        {activeType === 'seq' && activeSeqMember ? (
          <div className="flex items-center gap-2 bg-surface-3 border border-rim-bright border-l-[3px] border-l-gold px-2.5 py-2 opacity-90 shadow-lg">
            <span className="text-rim-bright text-xs">⠿</span>
            <div className="flex-1 min-w-0">
              <div className="font-rajdhani font-semibold text-sm text-white truncate">
                {activeSeqMember.name}
              </div>
              {activeSeqMember.role && (
                <div className="font-mono text-[9px] text-parchment-dim truncate">
                  {activeSeqMember.role}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
