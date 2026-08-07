import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '@/core/api/client'
import * as campanaApi from './campanaApi'
import type { CampanaState } from '../types/campanaTypes'

const initialState: CampanaState = { campaigns: [], current: null, status: 'idle', error: null }

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Error de red — inténtalo de nuevo'
}

export const fetchMyCampaigns = createAsyncThunk(
  'campana/fetchMyCampaigns',
  async (token: string, { rejectWithValue }) => {
    try {
      return await campanaApi.listCampaignsRequest(token)
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

export const fetchCampaignDetail = createAsyncThunk(
  'campana/fetchCampaignDetail',
  async ({ token, id }: { token: string; id: string }, { rejectWithValue }) => {
    try {
      return await campanaApi.getCampaignRequest(token, id)
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

export const createCampaign = createAsyncThunk(
  'campana/createCampaign',
  async ({ token, name }: { token: string; name: string }, { rejectWithValue }) => {
    try {
      return await campanaApi.createCampaignRequest(token, name)
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

export const renameCampaign = createAsyncThunk(
  'campana/renameCampaign',
  async ({ token, id, name }: { token: string; id: string; name: string }, { rejectWithValue }) => {
    try {
      return await campanaApi.renameCampaignRequest(token, id, name)
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

export const deleteCampaign = createAsyncThunk(
  'campana/deleteCampaign',
  async ({ token, id }: { token: string; id: string }, { rejectWithValue }) => {
    try {
      await campanaApi.deleteCampaignRequest(token, id)
      return id
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

export const addPlayer = createAsyncThunk(
  'campana/addPlayer',
  async (
    { token, campaignId, identifier }: { token: string; campaignId: string; identifier: string },
    { rejectWithValue },
  ) => {
    try {
      return await campanaApi.addPlayerRequest(token, campaignId, identifier)
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

export const removePlayer = createAsyncThunk(
  'campana/removePlayer',
  async (
    { token, campaignId, userId }: { token: string; campaignId: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      await campanaApi.removePlayerRequest(token, campaignId, userId)
      return userId
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

const campanaSlice = createSlice({
  name: 'campana',
  initialState,
  reducers: {
    resetCampana() {
      return initialState
    },
    clearActiveCampaign(state) {
      state.current = null
    },
    clearCampanaError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMyCampaigns.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMyCampaigns.fulfilled, (state, action) => {
        state.status = 'idle'
        state.campaigns = action.payload
      })
      .addCase(fetchMyCampaigns.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })

      .addCase(fetchCampaignDetail.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCampaignDetail.fulfilled, (state, action) => {
        state.status = 'idle'
        state.current = action.payload
      })
      .addCase(fetchCampaignDetail.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })

      .addCase(createCampaign.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(renameCampaign.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.campaigns = state.campaigns.filter(c => c.id !== action.payload)
        if (state.current?.id === action.payload) state.current = null
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(addPlayer.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(removePlayer.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { resetCampana, clearActiveCampaign, clearCampanaError } = campanaSlice.actions
export default campanaSlice.reducer
