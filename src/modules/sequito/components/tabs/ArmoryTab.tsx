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
import { getEquippedCount as getEquippedCountShared } from '../../services/equipped'
import { BookCatalogModal, type CatalogEntry } from '../BookCatalogModal'
import { ItemFormModal, type ItemFormData } from '../ItemFormModal'
import { ItemDetailModal } from '../ItemDetailModal'
import { WEAPONS } from '@/core/data/darkheresy'

const WEAPON_ENTRIES: CatalogEntry[] = WEAPONS.map(w => ({
  name: w.name,
  type: w.group,
  notes: `${w.cls} · ${w.dmg} ${w.dmgType} · Alcance ${w.range} · RoF ${w.rof} · Pen ${w.pen}${w.notes ? ' · ' + w.notes : ''}`,
}))

export function ArmoryTab() {
  const dispatch = useAppDispatch()
  const confirm = useConfirm()
  const armory = useAppSelector(s => s.sequito.armory)
  const allSequito = useAppSelector(s => s.sequito.sequito)

  const [detailItemId, setDetailItemId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showManual, setShowManual] = useState(false)
  const [showBook, setShowBook] = useState(false)

  function getEquippedCount(itemId: string): number {
    return getEquippedCountShared(allSequito, 'armory', itemId)
  }

  function handleSave(data: ItemFormData) {
    if (editingId) {
      dispatch(updateInventoryItem({ cat: 'armory', item: { id: editingId, ...data } }))
      showToast('Arma actualizada')
    } else {
      dispatch(addInventoryItem({ cat: 'armory', item: data }))
      showToast('Arma añadida')
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
    const existing = armory.find(i => i.name === entry.name)
    if (existing) {
      dispatch(changeInventoryStock({ cat: 'armory', itemId: existing.id, delta: qty }))
      showToast(`+${qty} a ${entry.name}`)
    } else {
      dispatch(addInventoryItem({ cat: 'armory', item: { name: entry.name, type: entry.type, stock: qty, notes: entry.notes } }))
      showToast(`${entry.name} añadida`)
    }
    setShowBook(false)
  }

  function handleDelete(itemId: string) {
    const item = armory.find(i => i.id === itemId)
    if (!item) return
    confirm.confirm(
      `¿Eliminar "${item.name}" del arsenal? Se retirará de todos los séquito.`,
      () => {
        dispatch(deleteInventoryItem({ cat: 'armory', itemId }))
        showToast('Arma eliminada')
        if (detailItemId === itemId) setDetailItemId(null)
      }
    )
  }

  function handleUnequipAll(itemId: string) {
    dispatch(unequipAll({ cat: 'armory', itemId }))
    showToast('Objeto retirado a todos')
  }

  const detailItem = detailItemId ? armory.find(i => i.id === detailItemId) : null
  const editingItem = editingId ? armory.find(i => i.id === editingId) : null

  return (
    <div className="p-5">
      <div className="flex items-center gap-2.5 flex-wrap mb-4">
        <span className="font-display text-[10px] uppercase tracking-[3px] text-gold">// Arsenal</span>
        <button
          onClick={() => setShowBook(true)}
          className="font-display text-[7px] uppercase tracking-[2px] px-[9px] py-1 bg-crimson text-white hover:bg-crimson-bright transition-colors"
        >
          + Del Libro
        </button>
        <button
          onClick={() => { setEditingId(null); setShowManual(true) }}
          className="font-display text-[7px] uppercase tracking-[2px] px-[9px] py-1 bg-surface-3 border border-rim-bright text-parchment-dim hover:text-parchment hover:border-parchment-dim transition-colors"
        >
          + Manual
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['OBJETO', 'STOCK', 'EQUIPADOS', 'DISPONIBLES', 'ACCIONES'].map(h => (
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
            {armory.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-[30px] font-mono text-[10px] tracking-[1px] text-parchment-dim">
                  SIN OBJETOS — AÑADE EL PRIMERO
                </td>
              </tr>
            ) : (
              armory.map(item => {
                const equipped = getEquippedCount(item.id)
                const avail = item.stock - equipped
                const availCls =
                  avail <= 0 ? 'text-crimson-bright' : avail <= 2 ? 'text-gold' : 'text-neon'
                return (
                  <tr key={item.id} className="hover:bg-surface-3 transition-colors">
                    <td className="px-3 py-[9px] border-b border-rim">
                      <button
                        onClick={() => setDetailItemId(item.id)}
                        className="font-rajdhani font-semibold text-sm text-gold hover:text-gold-bright underline underline-offset-[3px] decoration-rim-bright text-left"
                      >
                        {item.name}
                      </button>
                    </td>
                    <td className="px-3 py-[9px] border-b border-rim">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-[13px] text-gold-bright">{item.stock}</span>
                        <div className="flex gap-0.5">
                          <button
                            onClick={() => dispatch(changeInventoryStock({ cat: 'armory', itemId: item.id, delta: -1 }))}
                            className="text-parchment-dim hover:text-crimson-bright transition-colors text-[13px] px-[5px] py-0.5"
                            title="−1"
                          >
                            −
                          </button>
                          <button
                            onClick={() => dispatch(changeInventoryStock({ cat: 'armory', itemId: item.id, delta: 1 }))}
                            className="text-neon hover:text-neon/80 transition-colors text-[13px] px-[5px] py-0.5"
                            title="+1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-[9px] border-b border-rim">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-[13px] text-blue-400">{equipped}</span>
                        {equipped > 0 && (
                          <button
                            onClick={() => handleUnequipAll(item.id)}
                            className="font-display text-[7px] uppercase tracking-[2px] px-[9px] py-1 bg-surface-3 border border-rim-bright text-parchment-dim hover:text-parchment hover:border-parchment-dim transition-colors"
                          >
                            RETIRAR TODO
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-[9px] border-b border-rim">
                      <span className={`font-display text-[13px] ${availCls}`}>{avail}</span>
                    </td>
                    <td className="px-3 py-[9px] border-b border-rim">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(item.id)}
                          className="text-parchment-dim hover:text-crimson-bright transition-colors text-[13px] px-[5px] py-0.5"
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-parchment-dim hover:text-crimson-bright transition-colors text-[13px] px-[5px] py-0.5"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
        title="// CONFIRMAR"
      />

      {showBook && (
        <BookCatalogModal
          title=""
          entries={WEAPON_ENTRIES}
          onPick={handlePickFromBook}
          onClose={() => setShowBook(false)}
        />
      )}

      {showManual && (
        <ItemFormModal
          title={editingItem ? 'Editar Arma' : 'Añadir Arma Manual'}
          initial={editingItem ? { name: editingItem.name, type: editingItem.type, stock: editingItem.stock, notes: editingItem.notes } : undefined}
          namePlaceholder="Nombre del arma..."
          typePlaceholder="Pistola, Básica, CaC..."
          notesPlaceholder="Daño, alcance, efectos..."
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
            .filter(m => m.equipment.some(e => e.itemId === detailItem.id))
            .map(m => {
              const e = m.equipment.find(e => e.itemId === detailItem.id)!
              return {
                id: m.id,
                name: m.name,
                qty: e.qty,
                onUnequip: () => {
                  dispatch(unequipItem({ seqId: m.id, cat: 'armory', itemId: detailItem.id }))
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
