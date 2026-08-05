import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import {
  editSequito,
  moveSequitoToLayer,
  equipItem,
  unequipItem,
  deleteSequito,
} from '../services/sequitoSlice'
import { showToast } from '@/shared/components/Toast'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import { useConfirm } from '@/shared/hooks/useConfirm'
import { Modal } from '@/shared/components/Modal'
import type { InvCategory, InventoryItem, EquippedItem } from '../types/sequitoTypes'

interface Props {
  seqId: string
  onClose: () => void
}

const STAT_KEYS = ['WS', 'BS', 'S', 'T', 'Ag', 'Int', 'Per', 'WP', 'Fel'] as const

const INV_CATS: Array<{ cat: InvCategory; label: string; eqKey: string }> = [
  { cat: 'armory', label: 'ARMAS', eqKey: 'equipment' },
  { cat: 'implants', label: 'IMPLANTES', eqKey: 'eq_implants' },
  { cat: 'mechadendrites', label: 'MECADENDRITES', eqKey: 'eq_mechadendrites' },
  { cat: 'equipment', label: 'EQUIPO', eqKey: 'eq_equipment' },
  { cat: 'armor', label: 'ARMADURAS', eqKey: 'eq_armor' },
]

export function SeqEditModal({ seqId, onClose }: Props) {
  const dispatch = useAppDispatch()
  const confirm = useConfirm()

  const member = useAppSelector(s => s.sequito.sequito[seqId])
  const layers = useAppSelector(s => s.sequito.layers)
  const armory = useAppSelector(s => s.sequito.armory)
  const implants = useAppSelector(s => s.sequito.implants)
  const mechadendrites = useAppSelector(s => s.sequito.mechadendrites)
  const equipment = useAppSelector(s => s.sequito.equipment)
  const armor = useAppSelector(s => s.sequito.armor)
  const allSequito = useAppSelector(s => s.sequito.sequito)

  const [name, setName] = useState(member?.name ?? '')
  const [role, setRole] = useState(member?.role ?? '')
  const [alive, setAlive] = useState(member?.alive ?? true)
  const [layerId, setLayerId] = useState(member?.layerId ?? '')
  const [stats, setStats] = useState<Record<string, number>>({ ...(member?.stats ?? {}) })
  const [addQty, setAddQty] = useState<Record<string, number>>({})
  const [addSel, setAddSel] = useState<Record<string, string>>({})

  if (!member) return null

  function getInventoryByCat(cat: InvCategory): InventoryItem[] {
    if (cat === 'armory') return armory
    if (cat === 'implants') return implants
    if (cat === 'mechadendrites') return mechadendrites
    if (cat === 'equipment') return equipment
    if (cat === 'armor') return armor
    return []
  }

  function getEquippedCountForItem(cat: InvCategory, itemId: string): number {
    const eqKey = cat === 'armory' ? 'equipment' : (`eq_${cat}` as keyof typeof member)
    return Object.values(allSequito).reduce((sum, m) => {
      const arr = m[eqKey] as EquippedItem[]
      return sum + arr.filter(e => e.itemId === itemId).reduce((s, e) => s + e.qty, 0)
    }, 0)
  }

  function getAvailable(cat: InvCategory, itemId: string): number {
    const items = getInventoryByCat(cat)
    const item = items.find(i => i.id === itemId)
    if (!item) return 0
    return item.stock - getEquippedCountForItem(cat, itemId)
  }

  function handleStatChange(key: string, val: string) {
    const n = Math.min(99, Math.max(0, Number(val) || 0))
    setStats(prev => ({ ...prev, [key]: n }))
  }

  function handleSave() {
    dispatch(editSequito({ id: seqId, name: name.trim() || member.name, role: role.trim(), alive, stats }))
    if (layerId !== member.layerId) {
      dispatch(moveSequitoToLayer({ seqId, targetLayerId: layerId }))
    }
    showToast('Cambios guardados')
    onClose()
  }

  function handleUnequip(cat: InvCategory, itemId: string) {
    dispatch(unequipItem({ seqId, cat, itemId }))
  }

  function handleEquip(cat: InvCategory) {
    const itemId = addSel[cat]
    if (!itemId) return
    const qty = Math.max(1, addQty[cat] ?? 1)
    const avail = getAvailable(cat, itemId)
    if (qty > avail) {
      showToast(`Solo ${avail} disponibles`)
      return
    }
    dispatch(equipItem({ seqId, cat, itemId, qty }))
    setAddSel(prev => ({ ...prev, [cat]: '' }))
    setAddQty(prev => ({ ...prev, [cat]: 1 }))
  }

  function handleDelete() {
    confirm.confirm(
      `¿Eliminar a "${member.name}" permanentemente?`,
      () => {
        dispatch(deleteSequito(seqId))
        showToast('Séquito eliminado')
        onClose()
      }
    )
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function getMemberEquipped(cat: InvCategory): EquippedItem[] {
    const eqKey = cat === 'armory' ? 'equipment' : (`eq_${cat}` as keyof typeof member)
    return member[eqKey] as EquippedItem[]
  }

  return (
    <>
      <Modal>
      <div
        className="fixed inset-0 z-40 flex items-end sm:items-center justify-center px-0 sm:px-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        onClick={handleOverlayClick}
      >
        <div
          className="w-full sm:max-w-lg border-t-[3px] border-crimson bg-surface-2 border border-rim-bright flex flex-col"
          style={{ maxHeight: '92vh' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-rim-bright px-4 py-3 flex-shrink-0">
            <h3 className="font-display text-[11px] uppercase tracking-[3px] text-crimson truncate mr-4">
              // {member.name.toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleDelete}
                className="text-crimson-dim hover:text-crimson-bright transition-colors text-xs font-display tracking-widest"
              >
                ELIMINAR
              </button>
              <button
                onClick={onClose}
                className="text-parchment-dim hover:text-crimson-bright transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Rol
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Estado
                </label>
                <select
                  value={alive ? 'true' : 'false'}
                  onChange={e => setAlive(e.target.value === 'true')}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson"
                >
                  <option value="true">● Activo</option>
                  <option value="false">✕ Caído</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim">
                  Grupo
                </label>
                <select
                  value={layerId}
                  onChange={e => setLayerId(e.target.value)}
                  className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2.5 py-1.5 outline-none focus:border-crimson"
                >
                  {layers.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="font-display text-[8px] uppercase tracking-[3px] text-gold mb-2">
                // CARACTERÍSTICAS
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {STAT_KEYS.map(key => (
                  <div
                    key={key}
                    className="bg-surface border border-rim-bright px-2 py-2 text-center"
                  >
                    <div className="font-mono text-[8px] tracking-[1px] text-parchment-dim mb-0.5">
                      {key}
                    </div>
                    <input
                      type="number"
                      value={stats[key] ?? 15}
                      min={0}
                      max={99}
                      onChange={e => handleStatChange(key, e.target.value)}
                      className="bg-transparent border-b border-rim-bright text-crimson-bright font-display text-base font-bold w-full text-center outline-none focus:border-crimson"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-display text-[8px] uppercase tracking-[3px] text-gold mb-2">
                // EQUIPO
              </div>
              {INV_CATS.map(({ cat, label }) => {
                const items = getInventoryByCat(cat)
                if (items.length === 0) return null
                const equipped = getMemberEquipped(cat)
                return (
                  <div key={cat} className="mb-4">
                    <div className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim border-b border-rim pb-1 mb-2">
                      {label}
                    </div>
                    {equipped.length === 0 ? (
                      <div className="font-mono text-[10px] text-rim-bright py-1">Sin asignar</div>
                    ) : (
                      <div className="space-y-1 mb-2">
                        {equipped.map(e => {
                          const item = items.find(i => i.id === e.itemId)
                          if (!item) return null
                          return (
                            <div
                              key={e.itemId}
                              className="flex items-center justify-between bg-surface border border-rim px-2 py-1.5"
                            >
                              <span className="font-rajdhani font-semibold text-sm text-parchment truncate mr-2">
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="font-display text-[11px] text-gold">×{e.qty}</span>
                                <button
                                  onClick={() => handleUnequip(cat, e.itemId)}
                                  className="text-parchment-dim hover:text-crimson-bright transition-colors text-xs leading-none"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <select
                        value={addSel[cat] ?? ''}
                        onChange={e => setAddSel(prev => ({ ...prev, [cat]: e.target.value }))}
                        className="flex-1 bg-surface border border-rim-bright text-parchment font-mono text-[11px] px-2 py-1.5 outline-none focus:border-crimson min-w-0"
                      >
                        <option value="">— Añadir —</option>
                        {items.map(item => {
                          const avail = getAvailable(cat, item.id)
                          return (
                            <option key={item.id} value={item.id} disabled={avail <= 0}>
                              {item.name} ({avail})
                            </option>
                          )
                        })}
                      </select>
                      <input
                        type="number"
                        value={addQty[cat] ?? 1}
                        min={1}
                        onChange={e =>
                          setAddQty(prev => ({ ...prev, [cat]: Number(e.target.value) }))
                        }
                        className="w-12 bg-surface border border-rim-bright text-parchment font-mono text-xs px-2 py-1.5 outline-none focus:border-crimson"
                      />
                      <button
                        onClick={() => handleEquip(cat)}
                        className="bg-gold text-black font-display text-[8px] uppercase tracking-[2px] px-3 py-1.5 hover:bg-gold-bright transition-colors flex-shrink-0"
                      >
                        DAR
                      </button>
                    </div>
                  </div>
                )
              })}
              {INV_CATS.every(({ cat }) => getInventoryByCat(cat).length === 0) && (
                <div className="font-mono text-[10px] text-parchment-dim">
                  Añade objetos en las pestañas de inventario primero.
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 border-t border-rim-bright px-4 py-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 bg-surface-4 border border-rim-bright py-2 font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-crimson py-2 font-display text-[9px] uppercase tracking-[2px] text-white hover:bg-crimson-bright transition-colors"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
      </Modal>

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
