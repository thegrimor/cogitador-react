import { useEffect, useRef } from 'react'
import { apiFetch } from '@/core/api/client'
import { showToast } from '@/shared/components/Toast'

interface OwnedRecord<TData> {
  id: string
  name: string
  data: TData
}

interface UseCloudSyncResourceOptions<TState> {
  token: string
  resourcePath: string
  recordName: string
  state: TState
  onHydrate: (data: TState) => void
}

const SAVE_DEBOUNCE_MS = 1500

/**
 * Sincroniza un slice completo de Redux con un recurso "propiedad de un
 * usuario" del backend (`/api/fichas`, `/api/sequito`, `/api/proyectos`):
 * al montar, descarga el registro `recordName` y reemplaza el slice local
 * (o crea el registro si es la primera vez); a partir de ahí, cada cambio
 * de `state` se sube con debounce. Local-first: la UI nunca espera a la red.
 */
export function useCloudSyncResource<TState>({
  token, resourcePath, recordName, state, onHydrate,
}: UseCloudSyncResourceOptions<TState>) {
  const recordIdRef = useRef<string | null>(null)
  const hydratedRef = useRef(false)
  const skipNextUploadRef = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const onHydrateRef = useRef(onHydrate)
  onHydrateRef.current = onHydrate

  useEffect(() => {
    let cancelled = false
    hydratedRef.current = false
    recordIdRef.current = null

    void (async () => {
      try {
        const records = await apiFetch<OwnedRecord<TState>[]>(`/api/${resourcePath}`, { token })
        if (cancelled) return
        const existing = records.find(r => r.name === recordName) ?? records[0]
        if (existing) {
          recordIdRef.current = existing.id
          skipNextUploadRef.current = true
          onHydrateRef.current(existing.data)
        } else {
          const created = await apiFetch<OwnedRecord<TState>>(`/api/${resourcePath}`, {
            token, method: 'POST', body: { name: recordName, data: state },
          })
          if (cancelled) return
          recordIdRef.current = created.id
        }
        hydratedRef.current = true
      } catch {
        if (!cancelled) showToast(`No se pudo sincronizar con el servidor (${resourcePath})`)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, resourcePath, recordName])

  useEffect(() => {
    if (!hydratedRef.current || !recordIdRef.current) return
    if (skipNextUploadRef.current) {
      skipNextUploadRef.current = false
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const recordId = recordIdRef.current
      if (!recordId) return
      apiFetch(`/api/${resourcePath}/${recordId}`, { token, method: 'PUT', body: { data: state } }).catch(() => {
        showToast(`No se pudo guardar en el servidor (${resourcePath})`)
      })
    }, SAVE_DEBOUNCE_MS)

    return () => clearTimeout(debounceRef.current)
  }, [state, token, resourcePath])
}
