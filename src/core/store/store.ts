import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import authReducer from '@/modules/auth/services/authSlice'
import fichaReducer from '@/modules/ficha/services/fichaSlice'
import proyectosReducer from '@/modules/proyectos/services/proyectosSlice'
import sequitoReducer from '@/modules/sequito/services/sequitoSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  ficha: fichaReducer,
  proyectos: proyectosReducer,
  sequito: sequitoReducer,
})

const persistConfig = {
  key: 'cogitador-root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
