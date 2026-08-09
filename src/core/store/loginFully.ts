import { login, register } from '@/modules/auth/services/authSlice'
import type { LoginInput, RegisterInput } from '@/modules/auth/types/authTypes'
import type { AppDispatch } from './store'
import { resetFicha } from '@/modules/ficha/services/fichaSlice'
import { resetSequito } from '@/modules/sequito/services/sequitoSlice'
import { resetProyectos } from '@/modules/proyectos/services/proyectosSlice'
import { resetNotas } from '@/modules/notas/services/notasSlice'
import { resetCampana } from '@/modules/campana'

/**
 * Login/registro con reseteo previo de los slices de datos de juego.
 * Sin esto, un dispositivo con datos locales de otra cuenta (logout
 * incompleto, sesión expirada) subiría esos datos "sucios" como parte de
 * la cuenta nueva en el primer sync con el backend (ver core/sync):
 * useCloudSyncResource crea el registro remoto con el estado local tal
 * cual lo encuentra si el usuario todavía no tiene ninguno.
 */
export async function loginFully(dispatch: AppDispatch, input: LoginInput) {
  const result = await dispatch(login(input))
  if (login.fulfilled.match(result)) {
    dispatch(resetFicha())
    dispatch(resetSequito())
    dispatch(resetProyectos())
    dispatch(resetNotas())
    dispatch(resetCampana())
  }
  return result
}

export async function registerFully(dispatch: AppDispatch, input: RegisterInput) {
  const result = await dispatch(register(input))
  if (register.fulfilled.match(result)) {
    dispatch(resetFicha())
    dispatch(resetSequito())
    dispatch(resetProyectos())
    dispatch(resetNotas())
    dispatch(resetCampana())
  }
  return result
}
