import { createPortal } from 'react-dom'

interface Props {
  children: React.ReactNode
}

/**
 * Renderiza su contenido directamente en `document.body` vía portal.
 *
 * `<main class="relative z-10">` crea su propio contexto de apilamiento: cualquier
 * modal `fixed` anidado dentro (aunque tenga z-index alto) queda capado por ese z-10
 * al compararse con hermanos de `main` como la barra de tabs (`z-20`). El portal saca
 * el modal de ese árbol para que compita en el stacking context raíz, donde nada le
 * tapa.
 */
export function Modal({ children }: Props) {
  return createPortal(children, document.body)
}
