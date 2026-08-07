export interface CampaignSummary {
  id: string
  name: string
  masterId: string
  masterUsername: string
  memberCount: number
  createdAt: string
}

// Subconjuntos de solo lectura de Character/SequitoState/ProyectosState —
// deliberadamente propios y acotados a lo que se pinta aquí, sin importar
// los tipos internos de ficha/sequito/proyectos (los módulos son opacos
// entre sí, solo se habla con ellos vía el backend).
export interface CampaignMemberCharacter {
  id: string
  info: { name: string; rank: string; career: string; homeworld: string }
  wounds: { current: number; max: number }
  fate: { current: number; max: number }
}

export interface CampaignMemberFicha {
  characters: CampaignMemberCharacter[]
}

export interface CampaignMemberSequitoEntry {
  id: string
  name: string
  role: string
  alive: boolean
}

export interface CampaignMemberSequito {
  sequito: Record<string, CampaignMemberSequitoEntry>
}

export interface CampaignMemberProject {
  id: number
  name: string
  category: string
  status: string
  daysTotal: number
  daysElapsed: number
}

export interface CampaignMemberProyectos {
  projects: CampaignMemberProject[]
}

export interface CampaignMember {
  id: string
  username: string
  ficha: CampaignMemberFicha | null
  sequito: CampaignMemberSequito | null
  proyectos: CampaignMemberProyectos | null
}

export interface CampaignDetail {
  id: string
  name: string
  master: { id: string; username: string }
  members: CampaignMember[]
  createdAt: string
  updatedAt: string
}

export type CampanaStatus = 'idle' | 'loading' | 'error'

export interface CampanaState {
  campaigns: CampaignSummary[]
  current: CampaignDetail | null
  status: CampanaStatus
  error: string | null
}
