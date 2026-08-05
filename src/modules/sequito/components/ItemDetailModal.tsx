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
      <div className="fixed inset-0 z-50 flex items-end bg-black/85" onClick={onClose}>
        <div
          className="w-full max-h-[80vh] flex flex-col border-t-2 border-gold bg-surface-2"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-rim-bright px-4 py-3 shrink-0">
            <p className="font-display text-[10px] uppercase tracking-[3px] text-gold">// {name.toUpperCase()}</p>
            <button onClick={onClose} className="text-parchment-dim hover:text-crimson-bright text-sm">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {notes && (
              <div className="bg-surface border border-rim px-3 py-2 font-mono text-[11px] text-parchment leading-relaxed">
                {notes}
              </div>
            )}
            <div className="flex gap-5">
              {([
                { label: 'STOCK', val: stock, cls: 'text-gold' },
                { label: 'EQUIPADOS', val: equipped, cls: 'text-neon' },
                { label: 'DISPONIBLES', val: avail, cls: availCls },
              ] as const).map(({ label, val, cls }) => (
                <div key={label} className="text-center">
                  <div className="font-mono text-[8px] tracking-[1px] text-parchment-dim mb-1">{label}</div>
                  <div className={`font-display text-xl ${cls}`}>{val}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="font-mono text-[8px] uppercase tracking-[2px] text-parchment-dim mb-1">Portadores</div>
              {carriers.length === 0 ? (
                <div className="font-mono text-[10px] text-parchment-dim">Ningún séquito lleva este objeto.</div>
              ) : (
                <div className="bg-surface border border-rim">
                  {carriers.map(c => (
                    <div key={c.id} className="flex items-center justify-between border-b border-rim px-2 py-1.5 last:border-b-0">
                      <span className="font-rajdhani font-semibold text-sm text-parchment">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[11px] text-gold">×{c.qty}</span>
                        <button
                          onClick={c.onUnequip}
                          className="text-parchment-dim hover:text-crimson-bright transition-colors text-xs"
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

          <div className="flex justify-end gap-2 border-t border-rim-bright px-4 py-3 shrink-0">
            <button
              onClick={onClose}
              className="font-display text-[9px] uppercase tracking-[2px] border border-rim-bright text-parchment-dim px-4 py-2 hover:text-parchment transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={onEdit}
              className="font-display text-[9px] uppercase tracking-[2px] bg-crimson text-white px-4 py-2 hover:bg-crimson-bright transition-colors"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
