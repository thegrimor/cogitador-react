import { useState } from 'react'

interface ConfirmState {
  isOpen: boolean
  message: string
}

interface UseConfirmReturn {
  isOpen: boolean
  message: string
  confirm: (msg: string, callback: () => void) => void
  close: () => void
  onConfirm: () => void
  onCancel: () => void
}

export function useConfirm(): UseConfirmReturn {
  const [state, setState] = useState<ConfirmState>({ isOpen: false, message: '' })
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null)

  function confirm(msg: string, callback: () => void) {
    setState({ isOpen: true, message: msg })
    setPendingCallback(() => callback)
  }

  function close() {
    setState({ isOpen: false, message: '' })
    setPendingCallback(null)
  }

  function onConfirm() {
    pendingCallback?.()
    close()
  }

  function onCancel() {
    close()
  }

  return {
    isOpen: state.isOpen,
    message: state.message,
    confirm,
    close,
    onConfirm,
    onCancel,
  }
}
