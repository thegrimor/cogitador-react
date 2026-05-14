import { useToast } from '../../hooks/useToast'

export function Toast() {
  const { visible, msg } = useToast()

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'fixed bottom-20 right-4 z-50 max-w-xs',
        'border-l-4 border-crimson bg-surface-3',
        'px-4 py-3',
        'font-mono text-sm text-parchment',
        'transition-transform duration-300 ease-out',
        visible ? 'translate-x-0' : 'translate-x-[calc(100%+1rem)]',
      ].join(' ')}
    >
      {msg}
    </div>
  )
}
