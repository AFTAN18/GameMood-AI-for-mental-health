import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AppState } from '../../types'

const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  theme: 'auto',
  language: 'en',
  timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
}

// Async thunks
export const initializeApp = createAsyncThunk(
  'app/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return {
          theme: 'auto',
          language: 'en',
          timezone: 'UTC',
        }
      }

      // Initialize app settings from localStorage
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'auto'
      const savedLanguage = localStorage.getItem('language') || 'en'
      const savedTimezone = localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone

      // Apply theme
      if (savedTheme === 'dark' || (savedTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      return {
        theme: savedTheme,
        language: savedLanguage,
        timezone: savedTimezone,
      }
    } catch (error) {
      console.error('App initialization error:', error)
      // Return default values instead of rejecting
      return {
        theme: 'auto',
        language: 'en',
        timezone: 'UTC',
      }
    }
  }
)

export const setTheme = createAsyncThunk(
  'app/setTheme',
  async (theme: 'light' | 'dark' | 'auto', { rejectWithValue }) => {
    try {
      localStorage.setItem('theme', theme)
      
      if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      return theme
    } catch (error) {
      return rejectWithValue('Failed to set theme')
    }
  }
)

export const setLanguage = createAsyncThunk(
  'app/setLanguage',
  async (language: string, { rejectWithValue }) => {
    try {
      localStorage.setItem('language', language)
      return language
    } catch (error) {
      return rejectWithValue('Failed to set language')
    }
  }
)

export const setTimezone = createAsyncThunk(
  'app/setTimezone',
  async (timezone: string, { rejectWithValue }) => {
    try {
      localStorage.setItem('timezone', timezone)
      return timezone
    } catch (error) {
      return rejectWithValue('Failed to set timezone')
    }
  }
)

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize app
      .addCase(initializeApp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoading = false
        state.isInitialized = true
        state.theme = action.payload.theme
        state.language = action.payload.language
        state.timezone = action.payload.timezone
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Set theme
      .addCase(setTheme.pending, (state) => {
        state.isLoading = true
      })
      .addCase(setTheme.fulfilled, (state, action) => {
        state.isLoading = false
        state.theme = action.payload
      })
      .addCase(setTheme.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Set language
      .addCase(setLanguage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(setLanguage.fulfilled, (state, action) => {
        state.isLoading = false
        state.language = action.payload
      })
      .addCase(setLanguage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Set timezone
      .addCase(setTimezone.pending, (state) => {
        state.isLoading = true
      })
      .addCase(setTimezone.fulfilled, (state, action) => {
        state.isLoading = false
        state.timezone = action.payload
      })
      .addCase(setTimezone.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setLoading } = appSlice.actions
export default appSlice.reducer

