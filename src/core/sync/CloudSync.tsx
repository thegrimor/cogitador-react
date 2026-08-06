import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { hydrateFicha } from '@/modules/ficha/services/fichaSlice'
import { importState as hydrateSequito } from '@/modules/sequito/services/sequitoSlice'
import { hydrateProyectos } from '@/modules/proyectos/services/proyectosSlice'
import { useCloudSyncResource } from './useCloudSyncResource'

/**
 * Componente sin render montado solo mientras hay sesión activa (ver App.tsx).
 * Engancha los 3 slices de datos de juego al backend vía useCloudSyncResource.
 */
export function CloudSync() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(s => s.auth.token)
  const fichaState = useAppSelector(s => s.ficha)
  const sequitoState = useAppSelector(s => s.sequito)
  const proyectosState = useAppSelector(s => s.proyectos)

  useCloudSyncResource({
    token: token as string,
    resourcePath: 'fichas',
    recordName: 'main',
    state: fichaState,
    onHydrate: data => dispatch(hydrateFicha(data)),
  })

  useCloudSyncResource({
    token: token as string,
    resourcePath: 'sequito',
    recordName: 'main',
    state: sequitoState,
    onHydrate: data => dispatch(hydrateSequito(data)),
  })

  useCloudSyncResource({
    token: token as string,
    resourcePath: 'proyectos',
    recordName: 'main',
    state: proyectosState,
    onHydrate: data => dispatch(hydrateProyectos(data)),
  })

  return null
}
