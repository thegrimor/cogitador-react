import { apiFetch } from '@/core/api/client'
import type {
  AuthResponse, ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput,
} from '../types/authTypes'

export function registerRequest(input: RegisterInput) {
  return apiFetch<AuthResponse>('/api/auth/register', { method: 'POST', body: input })
}

export function loginRequest(input: LoginInput) {
  return apiFetch<AuthResponse>('/api/auth/login', { method: 'POST', body: input })
}

export function forgotPasswordRequest(input: ForgotPasswordInput) {
  return apiFetch<{ message: string; devToken?: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: input,
  })
}

export function resetPasswordRequest(input: ResetPasswordInput) {
  return apiFetch<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: input })
}
