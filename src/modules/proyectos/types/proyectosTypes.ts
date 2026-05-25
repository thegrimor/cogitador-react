export type ProjectStatus = 'pending' | 'active' | 'paused' | 'completed'

export type ProjectCategory =
  | 'MILITAR'
  | 'ENERGÍA'
  | 'INDUSTRIA'
  | 'ESPIONAJE'
  | 'CIVIL'
  | 'CULTO'
  | 'OTRO'

export interface Project {
  id: number
  name: string
  category: ProjectCategory
  daysTotal: number
  daysElapsed: number
  status: ProjectStatus
  desc: string
  createdDay: number
}

export interface ProyectosState {
  globalDay: number
  projects: Project[]
}
