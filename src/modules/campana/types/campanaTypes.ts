import type { FichaState } from '@/modules/ficha'
import type { SequitoState } from '@/modules/sequito'
import type { ProyectosState } from '@/modules/proyectos'
import type { NotasState } from '@/modules/notas'

export interface CampaignSummary {
  id: string
  name: string
  masterId: string
  masterUsername: string
  memberCount: number
  createdAt: string
}

// "Entrar al perfil" de un jugador renderiza la app real de ese jugador
// (FichaView/SequitoView/ProyectosView/NotasView) sobre un store de Redux
// propio precargado con estos 4 bloques — ver PlayerProfileView. Por eso
// se reutilizan los tipos reales de cada módulo en vez de un resumen
// propio y acotado.
export interface CampaignMember {
  id: string
  username: string
  ficha: FichaState | null
  sequito: SequitoState | null
  proyectos: ProyectosState | null
  notas: NotasState | null
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
