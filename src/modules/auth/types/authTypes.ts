export interface AuthUser {
  id: string
  username: string
  email: string
  role: 'ADMIN' | 'USER'
}

export interface LoginInput {
  identifier: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  password: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export type AuthStatus = 'idle' | 'loading' | 'error'

export interface AuthState {
  token: string | null
  user: AuthUser | null
  status: AuthStatus
  error: string | null
}
