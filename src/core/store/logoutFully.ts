import { persistor } from './store'
import type { AppDispatch } from './store'
import { logout } from '@/modules/auth/services/authSlice'
import { resetFicha } from '@/modules/ficha/services/fichaSlice'
import { resetSequito } from '@/modules/sequito/services/sequitoSlice'
import { resetProyectos } from '@/modules/proyectos/services/proyectosSlice'

/**
 * Logout con borrado total: limpia sesión + los 3 slices de datos de juego,
 * tanto en memoria como en el `localStorage` de redux-persist. Sin esto, un
 * segundo usuario en el mismo dispositivo vería (aunque sea un instante) los
 * datos del usuario anterior hasta que el próximo login los pisara.
 *
 * No espera a que termine ningún guardado con debounce pendiente en
 * core/sync — riesgo aceptado: como mucho se pierde el último cambio hecho
 * en los 1.5s previos al logout.
 */
export async function logoutFully(dispatch: AppDispatch) {
  dispatch(logout())
  dispatch(resetFicha())
  dispatch(resetSequito())
  dispatch(resetProyectos())
  await persistor.purge()
}
