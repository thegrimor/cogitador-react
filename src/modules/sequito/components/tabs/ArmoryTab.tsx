import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import {
  addInventoryItem,
  deleteInventoryItem,
  changeInventoryStock,
  unequipAll,
} from '../../services/sequitoSlice'
import { showToast } from '@/shared/components/Toast'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { useConfirm } from '@/shared/hooks/useConfirm'
import type { EquippedItem } from '../../types/sequitoTypes'

export function ArmoryTab() {
  const dispatch = useAppDispatch()
  const confirm = useConfirm()
  const armory = useAppSelector(s => s.sequito.armory)
  const allSequito = useAppSelector(s => s.sequito.sequito)

  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState('')
  const [formStock, setFormStock] = useState(1)
  const [formNotes, setFormNotes] = useState('')
  const [detailItemId, setDetailItemId] = useState<string | null>(null)

  function getEquippedCount(itemId: string): number {
    return Object.values(allSequito).reduce((sum, m) => {
      return sum + (m.equipment as EquippedItem[]).filter(e => e.itemId === itemId).reduce((s, e) => s + e.qty, 0)
    }, 0)
  }

  function handleAdd() {
    if (!formName.trim()) {
      showToast('Introduce un nombre')
      return
    }
    dispatch(addInventoryItem({
      cat: 'armory',
      item: { name: formName.trim(), type: formType.trim(), stock: Math.max(1, formStock), notes: formNotes.trim() },
    }))
    setFormName('')
    setFormType('')
    setFormStock(1)
    setFormNotes('')
    showToast('Arma añadida')
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

  return (
    <div className="p-4 space-y-4">
      <div className="bg-surface-2 border border-rim-bright p-3 space-y-2">
        <div className="font-display text-[9px] uppercase tracking-[3px] text-gold mb-3">
          // AÑADIR ARMA
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
              Nombre
            </label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="Nombre del arma..."
              className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson placeholder:text-parchment-dim/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
              Tipo
            </label>
            <input
              type="text"
              value={formType}
              onChange={e => setFormType(e.target.value)}
              placeholder="Pistola, Básica, CaC..."
              className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson placeholder:text-parchment-dim/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
              Stock
            </label>
            <input
              type="number"
              value={formStock}
              min={1}
              onChange={e => setFormStock(Number(e.target.value))}
              className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
              Notas / Stats
            </label>
            <input
              type="text"
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              placeholder="Daño, alcance, efectos..."
              className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson placeholder:text-parchment-dim/40"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="mt-1 bg-crimson text-white font-display text-[9px] uppercase tracking-[2px] px-4 py-2 hover:bg-crimson-bright transition-colors"
        >
          + AÑADIR ARMA
        </button>
      </div>

      {detailItem && (
        <div className="bg-surface-2 border border-rim-bright border-l-4 border-l-gold p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-[9px] uppercase tracking-[3px] text-gold">
              // {detailItem.name.toUpperCase()}
            </span>
            <button
              onClick={() => setDetailItemId(null)}
              className="text-parchment-dim hover:text-crimson-bright text-sm"
            >
              ✕
            </button>
          </div>
          {detailItem.notes && (
            <div className="bg-surface border border-rim px-3 py-2 font-mono text-[11px] text-parchment leading-relaxed mb-3">
              {detailItem.notes}
            </div>
          )}
          <div className="flex gap-5 mb-3">
            {([
              { label: 'STOCK', val: detailItem.stock, cls: 'text-gold' },
              { label: 'EQUIPADOS', val: getEquippedCount(detailItem.id), cls: 'text-neon' },
              {
                label: 'DISPONIBLES',
                val: detailItem.stock - getEquippedCount(detailItem.id),
                cls:
                  detailItem.stock - getEquippedCount(detailItem.id) <= 0
                    ? 'text-crimson-bright'
                    : detailItem.stock - getEquippedCount(detailItem.id) <= 2
                    ? 'text-gold'
                    : 'text-neon',
              },
            ] as Array<{ label: string; val: number; cls: string }>).map(({ label, val, cls }) => (
              <div key={label} className="text-center">
                <div className="font-mono text-[8px] tracking-[1px] text-parchment-dim mb-1">
                  {label}
                </div>
                <div className={`font-display text-xl ${cls}`}>{val}</div>
              </div>
            ))}
          </div>
          <div className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">
            PORTADORES
          </div>
          {Object.values(allSequito)
            .filter(m => m.equipment.some(e => e.itemId === detailItem.id))
            .map(m => {
              const e = m.equipment.find(e => e.itemId === detailItem.id)!
              return (
                <div key={m.id} className="flex items-center justify-between border-b border-rim px-2 py-1.5">
                  <span className="font-rajdhani font-semibold text-sm text-parchment">{m.name}</span>
                  <span className="font-display text-[11px] text-gold">×{e.qty}</span>
                </div>
              )
            })}
          {!Object.values(allSequito).some(m => m.equipment.some(e => e.itemId === detailItem.id)) && (
            <div className="font-mono text-[10px] text-parchment-dim">Ningún séquito lleva este objeto.</div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        {armory.length === 0 ? (
          <div className="text-center py-8 font-mono text-[10px] uppercase tracking-[1px] text-parchment-dim">
            SIN OBJETOS — AÑADE EL PRIMERO
          </div>
        ) : (
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
              {armory.map(item => {
                const equipped = getEquippedCount(item.id)
                const avail = item.stock - equipped
                const availCls =
                  avail <= 0 ? 'text-crimson-bright' : avail <= 2 ? 'text-gold' : 'text-neon'
                return (
                  <tr key={item.id} className="hover:bg-surface-3 transition-colors">
                    <td className="px-3 py-2 border-b border-rim">
                      <button
                        onClick={() => setDetailItemId(item.id === detailItemId ? null : item.id)}
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
                          onClick={() => dispatch(changeInventoryStock({ cat: 'armory', itemId: item.id, delta: -1 }))}
                          className="text-parchment-dim hover:text-crimson-bright transition-colors text-xs w-5 h-5 flex items-center justify-center"
                        >
                          −
                        </button>
                        <button
                          onClick={() => dispatch(changeInventoryStock({ cat: 'armory', itemId: item.id, delta: 1 }))}
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
                          onClick={() => setDetailItemId(item.id === detailItemId ? null : item.id)}
                          className="text-parchment-dim hover:text-gold transition-colors text-xs px-1"
                          title="Detalles"
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
    </div>
  )
}
