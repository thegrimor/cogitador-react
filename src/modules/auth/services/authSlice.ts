import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError } from '@/core/api/client'
import * as authApi from './authApi'
import type {
  AuthState, ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput,
} from '../types/authTypes'

const initialState: AuthState = { token: null, user: null, status: 'idle', error: null }

function errorMessage(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Error de red — inténtalo de nuevo'
}

export const login = createAsyncThunk('auth/login', async (input: LoginInput, { rejectWithValue }) => {
  try {
    return await authApi.loginRequest(input)
  } catch (err) {
    return rejectWithValue(errorMessage(err))
  }
})

export const register = createAsyncThunk('auth/register', async (input: RegisterInput, { rejectWithValue }) => {
  try {
    return await authApi.registerRequest(input)
  } catch (err) {
    return rejectWithValue(errorMessage(err))
  }
})

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (input: ForgotPasswordInput, { rejectWithValue }) => {
    try {
      return await authApi.forgotPasswordRequest(input)
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (input: ResetPasswordInput, { rejectWithValue }) => {
    try {
      return await authApi.resetPasswordRequest(input)
    } catch (err) {
      return rejectWithValue(errorMessage(err))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })

      .addCase(register.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })

      .addCase(forgotPassword.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.status = 'idle'
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })

      .addCase(resetPassword.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(resetPassword.fulfilled, state => {
        state.status = 'idle'
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
