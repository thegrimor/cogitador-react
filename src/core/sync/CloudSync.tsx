import { useAppDispatch, useAppSelector } from '@/core/store/hooks'
import { hydrateFicha } from '@/modules/ficha/services/fichaSlice'
import { importState as hydrateSequito } from '@/modules/sequito/services/sequitoSlice'
import { hydrateProyectos } from '@/modules/proyectos/services/proyectosSlice'
import { hydrateNotas } from '@/modules/notas/services/notasSlice'
import { useCloudSyncResource } from './useCloudSyncResource'

/**
 * Componente sin render montado solo mientras hay sesión activa (ver App.tsx).
 * Engancha los 4 slices de datos de juego al backend vía useCloudSyncResource.
 */
export function CloudSync() {
  const dispatch = useAppDispatch()
  const token = useAppSelector(s => s.auth.token)
  const fichaState = useAppSelector(s => s.ficha)
  const sequitoState = useAppSelector(s => s.sequito)
  const proyectosState = useAppSelector(s => s.proyectos)
  const notasState = useAppSelector(s => s.notas)

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

  useCloudSyncResource({
    token: token as string,
    resourcePath: 'notas',
    recordName: 'main',
    state: notasState,
    onHydrate: data => dispatch(hydrateNotas(data)),
  })

  return null
}
