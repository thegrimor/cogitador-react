import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ProyectosState, Project, ProjectStatus } from '../types/proyectosTypes'

const initialState: ProyectosState = {
  globalDay: 0,
  projects: [],
}

export const proyectosSlice = createSlice({
  name: 'proyectos',
  initialState,
  reducers: {
    advanceTime(state, action: PayloadAction<number>) {
      const days = action.payload
      if (days <= 0) return
      state.globalDay += days
      state.projects.forEach(p => {
        if (p.status === 'active') {
          p.daysElapsed = Math.min(p.daysElapsed + days, p.daysTotal)
          if (p.daysElapsed >= p.daysTotal) p.status = 'completed'
        }
      })
    },

    addProject(state, action: PayloadAction<Omit<Project, 'id' | 'daysElapsed' | 'status' | 'createdDay'>>) {
      state.projects.unshift({
        id: Date.now(),
        daysElapsed: 0,
        status: 'pending',
        createdDay: state.globalDay,
        ...action.payload,
      })
    },

    deleteProject(state, action: PayloadAction<number>) {
      state.projects = state.projects.filter(p => p.id !== action.payload)
    },

    setProjectStatus(state, action: PayloadAction<{ id: number; status: ProjectStatus }>) {
      const p = state.projects.find(x => x.id === action.payload.id)
      if (!p) return
      p.status = action.payload.status
      if (action.payload.status === 'active' && p.daysElapsed >= p.daysTotal) {
        p.daysElapsed = p.daysTotal - 1
      }
    },

    updateTotalDays(state, action: PayloadAction<{ id: number; days: number }>) {
      const p = state.projects.find(x => x.id === action.payload.id)
      if (!p) return
      p.daysTotal = action.payload.days
      if (p.daysElapsed > p.daysTotal) p.daysElapsed = p.daysTotal
      if (p.daysElapsed >= p.daysTotal && p.status === 'active') p.status = 'completed'
    },

    updateElapsedDays(state, action: PayloadAction<{ id: number; days: number }>) {
      const p = state.projects.find(x => x.id === action.payload.id)
      if (!p) return
      p.daysElapsed = Math.min(Math.max(0, action.payload.days), p.daysTotal)
      if (p.daysElapsed >= p.daysTotal) p.status = 'completed'
    },

    // Reemplaza el estado completo — usado por el sync con el backend al hidratar
    // tras login (ver core/sync).
    hydrateProyectos(_state, action: PayloadAction<ProyectosState>) {
      return action.payload
    },
  },
})

export const {
  advanceTime,
  addProject,
  deleteProject,
  setProjectStatus,
  updateTotalDays,
  updateElapsedDays,
  hydrateProyectos,
} = proyectosSlice.actions

export default proyectosSlice.reducer
