import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'

// Slices
import appSlice from './slices/appSlice'
import userSlice from './slices/userSlice'
import moodSlice from './slices/moodSlice'
import gameSlice from './slices/gameSlice'
import recommendationSlice from './slices/recommendationSlice'
import wellnessSlice from './slices/wellnessSlice'
import communitySlice from './slices/communitySlice'
import settingsSlice from './slices/settingsSlice'

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'settings', 'mood'], // Only persist these slices
}

const rootReducer = combineReducers({
  app: appSlice,
  user: userSlice,
  mood: moodSlice,
  game: gameSlice,
  recommendation: recommendationSlice,
  wellness: wellnessSlice,
  community: communitySlice,
  settings: settingsSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

