export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'ADMIN' | 'MASTER' | 'USER'
  createdAt: string
}
