import { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
}

/**
 * Desplegable genérico del header — hoy aloja el selector de tema y el
 * botón de cerrar sesión; pensado para ir sumando más entradas de cuenta
 * (perfil, ajustes...) sin tener que rediseñar el header cada vez.
 */
export function AccountMenu({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center justify-center w-7 h-7 border border-rim-bright hover:border-gold text-parchment-dim hover:text-parchment transition-colors"
        title="Menú"
        aria-label="Menú de cuenta"
      >
        <span className="text-sm leading-none select-none">⚙</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-60 border border-rim-bright bg-surface-2 z-30 shadow-2xl flex flex-col py-1">
          {children}
        </div>
      )}
    </div>
  )
}
