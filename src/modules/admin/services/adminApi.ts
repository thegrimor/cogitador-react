import { apiFetch } from '@/core/api/client'
import type { AdminUser } from '../types/adminTypes'

export function listUsersRequest(token: string) {
  return apiFetch<AdminUser[]>('/api/users', { token })
}

export function updateUserRoleRequest(token: string, id: string, role: AdminUser['role']) {
  return apiFetch<AdminUser>(`/api/users/${id}/role`, { method: 'PATCH', token, body: { role } })
}

export function deleteUserRequest(token: string, id: string) {
  return apiFetch<void>(`/api/users/${id}`, { method: 'DELETE', token })
}
