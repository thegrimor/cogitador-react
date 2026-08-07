import { useEffect, useState } from 'react'
import { useAppSelector } from '@/core/store/hooks'
import { ApiError } from '@/core/api/client'
import { deleteUserRequest, listUsersRequest, updateUserRoleRequest } from '../services/adminApi'
import { showToast } from '@/shared/components/Toast'
import { useConfirm } from '@/shared/hooks/useConfirm'
import { ConfirmModal } from '@/shared/components/ConfirmModal'
import type { AdminUser } from '../types/adminTypes'

interface Props {
  onBack: () => void
}

const ROLES: AdminUser['role'][] = ['USER', 'MASTER', 'ADMIN']

/** Administración mínima de usuarios: cambiar rol (para poder llegar a MASTER) o eliminar. Solo ADMIN. */
export function UsersAdminView({ onBack }: Props) {
  const token = useAppSelector(s => s.auth.token)
  const currentUserId = useAppSelector(s => s.auth.user?.id)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const confirm = useConfirm()

  useEffect(() => {
    if (!token) return
    listUsersRequest(token)
      .then(setUsers)
      .catch(() => showToast('No se pudo cargar la lista de usuarios'))
      .finally(() => setLoading(false))
  }, [token])

  async function handleRoleChange(id: string, role: AdminUser['role']) {
    if (!token) return
    try {
      const updated = await updateUserRoleRequest(token, id, role)
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)))
      showToast('Rol actualizado')
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'No se pudo actualizar el rol')
    }
  }

  function handleDelete(id: string, username: string) {
    confirm.confirm(`¿Eliminar a ${username}? Esta acción no se puede deshacer.`, async () => {
      if (!token) return
      try {
        await deleteUserRequest(token, id)
        setUsers(prev => prev.filter(u => u.id !== id))
        showToast('Usuario eliminado')
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'No se pudo eliminar al usuario')
      }
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-rim-bright bg-surface-2 px-4 py-2.5">
        <button
          onClick={onBack}
          className="font-display text-[9px] uppercase tracking-[2px] text-parchment-dim hover:text-parchment transition-colors"
        >
          ← Volver
        </button>
        <p className="font-display text-xs text-gold tracking-[1px]">Usuarios</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="font-mono text-xs text-parchment-dim">Cargando usuarios...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {users.map(u => (
              <div
                key={u.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-rim-bright bg-surface-2 px-4 py-3"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-display text-sm text-white truncate">{u.username}</span>
                  <span className="font-mono text-[10px] text-parchment-dim truncate">{u.email}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={u.role}
                    onChange={e => handleRoleChange(u.id, e.target.value as AdminUser['role'])}
                    disabled={u.id === currentUserId}
                    title={u.id === currentUserId ? 'No puedes cambiar tu propio rol' : undefined}
                    className="bg-surface border border-rim-bright text-parchment font-mono text-xs px-2 py-1.5 outline-none focus:border-gold transition-colors disabled:opacity-40"
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(u.id, u.username)}
                    disabled={u.id === currentUserId}
                    title={u.id === currentUserId ? 'No puedes eliminar tu propia cuenta' : undefined}
                    className="font-display text-[8px] uppercase tracking-[1px] border border-crimson-dim text-crimson-dim px-2 py-1.5 hover:bg-surface-3 transition-colors disabled:opacity-40"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirm.isOpen}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
        confirmLabel="Eliminar"
      />
    </div>
  )
}
