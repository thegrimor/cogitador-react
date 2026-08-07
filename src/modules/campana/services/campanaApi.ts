import { apiFetch } from '@/core/api/client'
import type { CampaignDetail, CampaignSummary } from '../types/campanaTypes'

export function listCampaignsRequest(token: string) {
  return apiFetch<CampaignSummary[]>('/api/campaigns', { token })
}

export function createCampaignRequest(token: string, name: string) {
  return apiFetch<{ id: string }>('/api/campaigns', { method: 'POST', token, body: { name } })
}

export function getCampaignRequest(token: string, id: string) {
  return apiFetch<CampaignDetail>(`/api/campaigns/${id}`, { token })
}

export function renameCampaignRequest(token: string, id: string, name: string) {
  return apiFetch<{ id: string }>(`/api/campaigns/${id}`, { method: 'PATCH', token, body: { name } })
}

export function deleteCampaignRequest(token: string, id: string) {
  return apiFetch<void>(`/api/campaigns/${id}`, { method: 'DELETE', token })
}

export function addPlayerRequest(token: string, campaignId: string, identifier: string) {
  return apiFetch<{ userId: string; username: string }>(`/api/campaigns/${campaignId}/players`, {
    method: 'POST',
    token,
    body: { identifier },
  })
}

export function removePlayerRequest(token: string, campaignId: string, userId: string) {
  return apiFetch<void>(`/api/campaigns/${campaignId}/players/${userId}`, { method: 'DELETE', token })
}
