import { Modal } from '@/shared/components/Modal'

interface Carrier {
  id: string
  name: string
  qty: number
  onUnequip: () => void
}

interface Props {
  name: string
  notes: string
  stock: number
  equipped: number
  carriers: Carrier[]
  onEdit: () => void
  onClose: () => void
}

/** Modal de detalle de un objeto de inventario ("showItemDetail" del HTML legacy). */
export function ItemDetailModal({ name, notes, stock, equipped, carriers, onEdit, onClose }: Props) {
  const avail = stock - equipped
  const availCls = avail <= 0 ? 'text-crimson-bright' : avail <= 2 ? 'text-gold' : 'text-neon'

  return (
    <Modal>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4 bg-black/85" onClick={onClose}>
        <div
          className="w-full max-w-[480px] max-h-[90vh] flex flex-col border border-rim-bright border-t-[3px] border-t-crimson bg-surface-2"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-rim px-[18px] py-[14px] shrink-0">
            <p className="font-display text-[11px] uppercase tracking-[3px] text-crimson">// {name.toUpperCase()}</p>
            <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-[13px] px-[5px] py-0.5">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-3.5">
            {notes && (
              <div className="bg-surface border border-rim px-3 py-[10px] font-mono text-[11px] text-parchment leading-[1.8]">
                {notes}
              </div>
            )}
            <div className="flex gap-5">
              {([
                { label: 'STOCK', val: stock, cls: 'text-gold-bright' },
                { label: 'EQUIPADOS', val: equipped, cls: 'text-blue-400' },
                { label: 'DISPONIBLES', val: avail, cls: availCls },
              ] as const).map(({ label, val, cls }) => (
                <div key={label} className="text-center">
                  <div className="font-mono text-[8px] tracking-[1px] text-parchment-dim mb-1">{label}</div>
                  <div className={`font-display text-xl ${cls}`}>{val}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim mb-2">Portadores</div>
              {carriers.length === 0 ? (
                <div className="font-mono text-[10px] text-parchment-dim">Ningún séquito lleva este objeto.</div>
              ) : (
                <div className="bg-surface border border-rim">
                  {carriers.map(c => (
                    <div key={c.id} className="flex items-center justify-between border-b border-rim px-2 py-[5px]">
                      <span className="font-rajdhani text-[13px] text-parchment">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[11px] text-gold">×{c.qty}</span>
                        <button
                          onClick={c.onUnequip}
                          className="text-parchment-dim hover:text-crimson-bright transition-colors text-[13px] px-[5px] py-0.5"
                          title="Retirar"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-rim px-[18px] py-3 shrink-0">
            <button
              onClick={onClose}
              className="font-display text-[7px] uppercase tracking-[2px] bg-surface-3 border border-rim-bright text-parchment-dim px-[9px] py-1 hover:text-parchment hover:border-parchment-dim transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={onEdit}
              className="font-display text-[7px] uppercase tracking-[2px] bg-crimson text-white px-[9px] py-1 hover:bg-crimson-bright transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
