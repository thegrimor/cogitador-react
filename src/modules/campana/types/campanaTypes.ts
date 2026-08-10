import type { Character } from '@/modules/ficha'

export interface CampaignSummary {
  id: string
  name: string
  masterId: string
  masterUsername: string
  memberCount: number
  createdAt: string
}

// Séquito/proyectos/notas: subconjuntos de solo lectura, propios y acotados
// a lo que se pinta aquí (los módulos son opacos entre sí, solo se habla
// con ellos vía el backend). La ficha es la excepción: se reutiliza el tipo
// real de `ficha` porque "entrar al perfil" de un jugador renderiza su
// FichaView real (ver ProfileSections/ReadOnlyFicha), no un resumen propio.
export interface CampaignMemberFicha {
  characters: Character[]
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

export interface CampaignMemberNote {
  id: string
  title: string
  section: string
  importance: string
  content: string
  characterId?: string
}

export interface CampaignMemberNotas {
  notes: CampaignMemberNote[]
}

export interface CampaignMember {
  id: string
  username: string
  ficha: CampaignMemberFicha | null
  sequito: CampaignMemberSequito | null
  proyectos: CampaignMemberProyectos | null
  notas: CampaignMemberNotas | null
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
