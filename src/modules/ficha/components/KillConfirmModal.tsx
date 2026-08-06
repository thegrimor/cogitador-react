import { Modal } from '@/shared/components/Modal'

interface Props {
  name: string
  xp: number
  onConfirm: () => void
  onCancel: () => void
}

/** Modal de confirmación de "Caído en combate" — réplica de showKillModal() del HTML legacy. */
export function KillConfirmModal({ name, xp, onConfirm, onCancel }: Props) {
  return (
    <Modal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-5"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
        onClick={onCancel}
      >
        <div
          className="w-full max-w-[340px] p-6 font-mono"
          style={{ background: '#0f0505', border: '2px solid #7a1a1a' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="font-display text-[13px] tracking-[2px] mb-4" style={{ color: '#c87070' }}>
            ☠ CAÍDO EN COMBATE
          </div>
          <div className="text-[13px] leading-relaxed mb-5 text-parchment">
            ¿Confirmas la muerte de <span className="text-white font-bold">{name}</span>?
            <br />
            <br />
            Se creará un nuevo acólito en blanco con{' '}
            <span className="text-gold font-bold">{xp} PE</span> heredados.
            <br />
            <br />
            <span className="text-[11px]" style={{ color: '#7a7a7a' }}>
              La ficha quedará guardada en la pestaña Caídos.
            </span>
          </div>
          <div className="flex gap-2.5 justify-end">
            <button
              onClick={onCancel}
              className="font-display text-[9px] tracking-[2px] px-4 py-2.5 bg-surface-4 text-parchment-dim border border-rim"
            >
              CANCELAR
            </button>
            <button
              onClick={onConfirm}
              className="font-display text-[9px] tracking-[2px] px-4 py-2.5 text-white"
              style={{ background: '#7a1a1a', border: '1px solid #c41e1e' }}
            >
              CONFIRMAR MUERTE
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
