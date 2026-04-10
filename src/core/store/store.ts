import { configureStore } from '@reduxjs/toolkit'
import fichaReducer from '@/modules/ficha/services/fichaSlice'

export const store = configureStore({
  reducer: {
    ficha: fichaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
