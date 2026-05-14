import { useEffect, useState } from 'react'

interface ToastState {
  visible: boolean
  msg: string
}

interface ShowToastDetail {
  msg: string
  duration?: number
}

export function showToast(msg: string, duration?: number): void {
  const event = new CustomEvent<ShowToastDetail>('show-toast', {
    detail: { msg, duration },
  })
  window.dispatchEvent(event)
}

export function useToast(): ToastState {
  const [state, setState] = useState<ToastState>({ visible: false, msg: '' })

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    function handleShowToast(e: Event) {
      const { msg, duration = 2500 } = (e as CustomEvent<ShowToastDetail>).detail
      clearTimeout(timer)
      setState({ visible: true, msg })
      timer = setTimeout(() => setState(s => ({ ...s, visible: false })), duration)
    }

    window.addEventListener('show-toast', handleShowToast)
    return () => {
      window.removeEventListener('show-toast', handleShowToast)
      clearTimeout(timer)
    }
  }, [])

  return state
}
