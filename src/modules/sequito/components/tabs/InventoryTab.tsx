import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import {
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  changeInventoryStock,
  unequipAll,
  unequipItem,
} from '../../services/sequitoSlice'
import { showToast } from '@/shared/components/Toast'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { useConfirm } from '@/shared/hooks/useConfirm'
import { getEquippedCount as getEquippedCountShared, equipKeyFor } from '../../services/equipped'
import { BookCatalogModal, type CatalogEntry } from '../BookCatalogModal'
import { ItemFormModal, type ItemFormData } from '../ItemFormModal'
import { ItemDetailModal } from '../ItemDetailModal'
import { AUGMENTATIONS, MECHADENDRITES, GEAR, ARMORS } from '@/core/data/darkheresy'
import type { InvCategory, EquippedItem } from '../../types/sequitoTypes'

interface Props {
  cat: Exclude<InvCategory, 'armory'>
  label: string
  title: string
}

const CATALOG_BY_CAT: Record<Exclude<InvCategory, 'armory'>, CatalogEntry[]> = {
  implants: AUGMENTATIONS.map(a => ({ name: a.name, type: a.loc, notes: `${a.desc} · ${a.bonus}` })),
  mechadendrites: MECHADENDRITES.map(m => ({
    name: m.name, type: m.type, notes: `${m.desc}${m.abilities ? ' · ' + m.abilities.replace(/\n/g, '; ') : ''}`,
  })),
  equipment: GEAR.map(g => ({ name: g.name, type: g.category, notes: g.notes })),
  armor: ARMORS.map(a => ({
    name: a.name, type: a.type, notes: `PA: C${a.head} T${a.body} B${a.arms} P${a.legs}${a.notes ? ' · ' + a.notes : ''}`,
  })),
}

export function InventoryTab({ cat, label, title }: Props) {
  const dispatch = useAppDispatch()
  const confirm = useConfirm()
  const items = useAppSelector(s => s.sequito[cat])
  const allSequito = useAppSelector(s => s.sequito.sequito)

  const [detailItemId, setDetailItemId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showManual, setShowManual] = useState(false)
  const [showBook, setShowBook] = useState(false)

  function getEquippedCount(itemId: string): number {
    return getEquippedCountShared(allSequito, cat, itemId)
  }

  function handleSave(data: ItemFormData) {
    if (editingId) {
      dispatch(updateInventoryItem({ cat, item: { id: editingId, ...data } }))
      showToast('Objeto actualizado')
    } else {
      dispatch(addInventoryItem({ cat, item: data }))
      showToast(`${label.charAt(0) + label.slice(1).toLowerCase()} añadido`)
    }
    setEditingId(null)
    setShowManual(false)
  }

  function openEdit(itemId: string) {
    setDetailItemId(null)
    setEditingId(itemId)
    setShowManual(true)
  }

  function handlePickFromBook(entry: CatalogEntry, qty: number) {
    const existing = items.find(i => i.name === entry.name)
    if (existing) {
      dispatch(changeInventoryStock({ cat, itemId: existing.id, delta: qty }))
      showToast(`+${qty} a ${entry.name}`)
    } else {
      dispatch(addInventoryItem({ cat, item: { name: entry.name, type: entry.type, stock: qty, notes: entry.notes } }))
      showToast(`${entry.name} añadido`)
    }
    setShowBook(false)
  }

  function handleDelete(itemId: string) {
    const item = items.find(i => i.id === itemId)
    if (!item) return
    confirm.confirm(
      `¿Eliminar "${item.name}"? Se retirará de todos los séquito.`,
      () => {
        dispatch(deleteInventoryItem({ cat, itemId }))
        showToast('Objeto eliminado')
        if (detailItemId === itemId) setDetailItemId(null)
      }
    )
  }

  function handleUnequipAll(itemId: string) {
    dispatch(unequipAll({ cat, itemId }))
    showToast('Objeto retirado a todos')
  }

  const detailItem = detailItemId ? items.find(i => i.id === detailItemId) : null
  const editingItem = editingId ? items.find(i => i.id === editingId) : null

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap bg-surface-2 border border-rim-bright px-3 py-2">
        <span className="font-display text-[10px] uppercase tracking-[3px] text-gold">// {title}</span>
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowBook(true)}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 bg-crimson text-white hover:bg-crimson-bright transition-colors"
          >
            + Del Libro
          </button>
          <button
            onClick={() => { setEditingId(null); setShowManual(true) }}
            className="font-display text-[9px] uppercase tracking-[2px] px-3 py-1.5 border border-rim-bright text-parchment-dim hover:text-parchment transition-colors"
          >
            + Manual
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {items.length === 0 ? (
          <div className="text-center py-8 font-mono text-[10px] uppercase tracking-[1px] text-parchment-dim">
            SIN OBJETOS — AÑADE EL PRIMERO
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[label, 'STOCK', 'EQUIPADOS', 'DISPONIBLES', 'ACCIONES'].map(h => (
                  <th
                    key={h}
                    className="font-display text-[8px] uppercase tracking-[2px] text-parchment-dim text-left px-3 py-2 border-b-2 border-crimson-dim bg-surface-2 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const equipped = getEquippedCount(item.id)
                const avail = item.stock - equipped
                const availCls =
                  avail <= 0 ? 'text-crimson-bright' : avail <= 2 ? 'text-gold' : 'text-neon'
                return (
                  <tr key={item.id} className="hover:bg-surface-3 transition-colors">
                    <td className="px-3 py-2 border-b border-rim">
                      <button
                        onClick={() => setDetailItemId(item.id)}
                        className="font-rajdhani font-semibold text-sm text-gold hover:text-gold-bright underline underline-offset-2 decoration-rim-bright text-left"
                      >
                        {item.name}
                      </button>
                      {item.type && (
                        <div className="font-mono text-[9px] text-parchment-dim">{item.type}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 border-b border-rim">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-[13px] text-gold">{item.stock}</span>
                        <button
                          onClick={() => dispatch(changeInventoryStock({ cat, itemId: item.id, delta: -1 }))}
                          className="text-parchment-dim hover:text-crimson-bright transition-colors text-xs w-5 h-5 flex items-center justify-center"
                        >
                          −
                        </button>
                        <button
                          onClick={() => dispatch(changeInventoryStock({ cat, itemId: item.id, delta: 1 }))}
                          className="text-neon hover:text-neon/80 transition-colors text-xs w-5 h-5 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 border-b border-rim">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[13px] text-neon">{equipped}</span>
                        {equipped > 0 && (
                          <button
                            onClick={() => handleUnequipAll(item.id)}
                            className="font-display text-[7px] uppercase tracking-[1px] border border-rim-bright text-parchment-dim px-1.5 py-0.5 hover:text-parchment hover:border-parchment-dim transition-colors"
                          >
                            RETIRAR TODO
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 border-b border-rim">
                      <span className={`font-display text-[13px] ${availCls}`}>{avail}</span>
                    </td>
                    <td className="px-3 py-2 border-b border-rim">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(item.id)}
                          className="text-parchment-dim hover:text-gold transition-colors text-xs px-1"
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-parchment-dim hover:text-crimson-bright transition-colors text-xs px-1"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
        confirmLabel="Eliminar"
      />

      {showBook && (
        <BookCatalogModal
          title={label}
          entries={CATALOG_BY_CAT[cat]}
          onPick={handlePickFromBook}
          onClose={() => setShowBook(false)}
        />
      )}

      {showManual && (
        <ItemFormModal
          title={editingItem ? `Editar ${label}` : `Añadir ${label} Manual`}
          initial={editingItem ? { name: editingItem.name, type: editingItem.type, stock: editingItem.stock, notes: editingItem.notes } : undefined}
          namePlaceholder="Nombre del objeto..."
          typePlaceholder="Tipo o categoría..."
          notesPlaceholder="Descripción, efectos..."
          onSave={handleSave}
          onClose={() => { setShowManual(false); setEditingId(null) }}
        />
      )}

      {detailItem && (
        <ItemDetailModal
          name={detailItem.name}
          notes={detailItem.notes}
          stock={detailItem.stock}
          equipped={getEquippedCount(detailItem.id)}
          carriers={Object.values(allSequito)
            .filter(m => (m[equipKeyFor(cat)] as EquippedItem[]).some(e => e.itemId === detailItem.id))
            .map(m => {
              const e = (m[equipKeyFor(cat)] as EquippedItem[]).find(e => e.itemId === detailItem.id)!
              return {
                id: m.id,
                name: m.name,
                qty: e.qty,
                onUnequip: () => {
                  dispatch(unequipItem({ seqId: m.id, cat, itemId: detailItem.id }))
                },
              }
            })}
          onEdit={() => openEdit(detailItem.id)}
          onClose={() => setDetailItemId(null)}
        />
      )}
    </div>
  )
}
