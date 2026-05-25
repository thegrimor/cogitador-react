import { useState } from 'react'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppDispatch } from '@/core/store/hooks'
import { renameLayer, deleteLayer } from '../services/sequitoSlice'
import { showToast } from '@/shared/components/Toast'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { useConfirm } from '@/shared/hooks/useConfirm'
import { SequitoCard } from './SequitoCard'
import type { Layer } from '../types/sequitoTypes'

interface Props {
  layer: Layer
  onAddSeq: (layerId: string) => void
  onEditSeq: (seqId: string) => void
  searchQuery: string
  allSequito: Record<string, { name: string; role?: string }>
}

export function LayerRow({ layer, onAddSeq, onEditSeq, searchQuery, allSequito }: Props) {
  const dispatch = useAppDispatch()
  const confirm = useConfirm()
  const [nameVal, setNameVal] = useState(layer.name)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layer.id,
    data: { type: 'layer' },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleNameBlur() {
    const trimmed = nameVal.trim()
    if (trimmed && trimmed !== layer.name) {
      dispatch(renameLayer({ id: layer.id, name: trimmed }))
    } else {
      setNameVal(layer.name)
    }
  }

  function handleDelete() {
    if (layer.seqIds.length > 0) {
      confirm.confirm(
        `¿Eliminar el grupo "${layer.name}" y sus ${layer.seqIds.length} miembros?`,
        () => {
          dispatch(deleteLayer(layer.id))
          showToast('Grupo eliminado')
        }
      )
    } else {
      dispatch(deleteLayer(layer.id))
      showToast('Grupo eliminado')
    }
  }

  const filteredIds = searchQuery
    ? layer.seqIds.filter(id => {
        const m = allSequito[id]
        if (!m) return false
        const q = searchQuery.toLowerCase()
        return m.name.toLowerCase().includes(q) || (m.role ?? '').toLowerCase().includes(q)
      })
    : layer.seqIds

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={[
          'bg-surface-2 border-t border-rim-bright border-b-2 border-b-rim-bright border-l-4 border-l-crimson-dim mb-1.5',
          isDragging ? 'opacity-40' : '',
        ].join(' ')}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-crimson/[0.04] border-b border-rim cursor-grab active:cursor-grabbing">
          <span
            {...attributes}
            {...listeners}
            className="text-rim-bright text-sm flex-shrink-0 touch-none"
          >
            ⠿
          </span>

          <input
            type="text"
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={handleNameBlur}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            className="flex-1 min-w-0 bg-transparent border-none text-gold font-display text-[11px] uppercase tracking-[2px] outline-none focus:border-b focus:border-gold cursor-text"
          />

          <span className="font-mono text-[9px] text-parchment-dim flex-shrink-0">
            {layer.seqIds.length}
          </span>

          <button
            onClick={e => { e.stopPropagation(); onAddSeq(layer.id) }}
            className="font-display text-[8px] uppercase tracking-[2px] bg-crimson text-white px-2 py-1 hover:bg-crimson-bright transition-colors flex-shrink-0"
          >
            + AÑADIR
          </button>

          <button
            onClick={e => { e.stopPropagation(); handleDelete() }}
            className="text-crimson-dim hover:text-crimson-bright transition-colors text-sm flex-shrink-0 leading-none"
          >
            ✕
          </button>
        </div>

        <SortableContext items={filteredIds} strategy={verticalListSortingStrategy}>
          <div className="p-2 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-1.5 min-h-[44px]">
            {filteredIds.length === 0 ? (
              <div className="col-span-full text-center py-2.5 font-mono text-[9px] tracking-[1px] text-rim-bright border border-dashed border-rim">
                {searchQuery ? 'SIN RESULTADOS' : 'SIN MIEMBROS'}
              </div>
            ) : (
              filteredIds.map(id => (
                <SequitoCard key={id} seqId={id} onEdit={onEditSeq} />
              ))
            )}
          </div>
        </SortableContext>
      </div>

      <ConfirmModal
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
        confirmLabel="Eliminar"
      />
    </>
  )
}
