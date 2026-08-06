import { Modal } from '../Modal'

interface Props {
  isOpen: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  title?: string
}

export function ConfirmModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  title = '⚠ CONFIRMACIÓN REQUERIDA',
}: Props) {
  if (!isOpen) return null

  return (
    <Modal>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm border-t-[3px] border-crimson bg-surface-2"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b border-rim-bright px-4 py-3">
          <p className="font-display text-[10px] uppercase tracking-[3px] text-crimson-bright">
            {title}
          </p>
        </div>

        <div className="px-4 py-5">
          <p className="font-mono text-sm text-parchment">{message}</p>
        </div>

        <div className="flex gap-2 border-t border-rim-bright px-4 py-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-surface-4 py-2 font-display text-[9px] uppercase tracking-[2px] text-parchment-dim transition-colors hover:text-parchment"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-crimson py-2 font-display text-[9px] uppercase tracking-[2px] text-white transition-colors hover:bg-crimson-bright"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
    </Modal>
  )
}
