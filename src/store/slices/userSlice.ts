import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User, UserState, UserPreferences, AccessibilitySettings, PrivacySettings, NotificationPreferences } from '../../types'

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const loadUserProfile = createAsyncThunk(
  'user/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('userToken')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // In a real app, this would be an API call
      const userData = localStorage.getItem('userProfile')
      if (!userData) {
        throw new Error('No user profile found')
      }

      const user = JSON.parse(userData)
      return user
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load user profile')
    }
  }
)

export const createUserProfile = createAsyncThunk(
  'user/createProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const newUser: User = {
        id: crypto.randomUUID(),
        email: profileData.email || '',
        display_name: profileData.display_name || '',
        avatar_url: profileData.avatar_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login_at: new Date().toISOString(),
        is_verified: false,
        preferences: profileData.preferences || {
          preferred_platforms: [],
          favorite_genres: [],
          wellness_goals: [],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: 'en',
          theme: 'auto',
        },
        accessibility_settings: profileData.accessibility_settings || {
          colorblind_support: false,
          subtitle_required: false,
          one_handed_controls: false,
          motion_sensitivity: false,
          screen_reader: false,
          anxiety_accommodations: false,
          adhd_accommodations: false,
          autism_accommodations: false,
          high_contrast: false,
          reduced_motion: false,
          font_size: 'medium',
          voice_control: false,
        },
        privacy_settings: profileData.privacy_settings || {
          share_mood_data: false,
          participate_in_community: true,
          anonymous_analytics: true,
          wellness_reminders: true,
          data_retention_days: 365,
        },
        notification_preferences: profileData.notification_preferences || {
          mood_check_reminders: true,
          break_reminders: true,
          wellness_tips: true,
          new_recommendations: true,
          community_updates: false,
          achievement_notifications: true,
          email_notifications: false,
          push_notifications: true,
        },
        wellness_streak: 0,
        total_wellness_score: 0,
      }

      localStorage.setItem('userProfile', JSON.stringify(newUser))
      localStorage.setItem('userToken', crypto.randomUUID())
      
      return newUser
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create user profile')
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState }
      const currentUser = state.user.user
      
      if (!currentUser) {
        throw new Error('No user profile found')
      }

      const updatedUser: User = {
        ...currentUser,
        ...updates,
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem('userProfile', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user profile')
    }
  }
)

export const updatePreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserPreferences>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState }
      const currentUser = state.user.user
      
      if (!currentUser) {
        throw new Error('No user profile found')
      }

      const updatedUser: User = {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          ...preferences,
        },
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem('userProfile', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update preferences')
    }
  }
)

export const updateAccessibilitySettings = createAsyncThunk(
  'user/updateAccessibilitySettings',
  async (settings: Partial<AccessibilitySettings>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState }
      const currentUser = state.user.user
      
      if (!currentUser) {
        throw new Error('No user profile found')
      }

      const updatedUser: User = {
        ...currentUser,
        accessibility_settings: {
          ...currentUser.accessibility_settings,
          ...settings,
        },
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem('userProfile', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update accessibility settings')
    }
  }
)

export const updatePrivacySettings = createAsyncThunk(
  'user/updatePrivacySettings',
  async (settings: Partial<PrivacySettings>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState }
      const currentUser = state.user.user
      
      if (!currentUser) {
        throw new Error('No user profile found')
      }

      const updatedUser: User = {
        ...currentUser,
        privacy_settings: {
          ...currentUser.privacy_settings,
          ...settings,
        },
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem('userProfile', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update privacy settings')
    }
  }
)

export const updateNotificationPreferences = createAsyncThunk(
  'user/updateNotificationPreferences',
  async (preferences: Partial<NotificationPreferences>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState }
      const currentUser = state.user.user
      
      if (!currentUser) {
        throw new Error('No user profile found')
      }

      const updatedUser: User = {
        ...currentUser,
        notification_preferences: {
          ...currentUser.notification_preferences,
          ...preferences,
        },
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem('userProfile', JSON.stringify(updatedUser))
      return updatedUser
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update notification preferences')
    }
  }
)

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('userToken')
      localStorage.removeItem('userProfile')
      return null
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to logout')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
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
      // Load user profile
      .addCase(loadUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
      // Create user profile
      .addCase(createUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update accessibility settings
      .addCase(updateAccessibilitySettings.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateAccessibilitySettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(updateAccessibilitySettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update privacy settings
      .addCase(updatePrivacySettings.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(updatePrivacySettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update notification preferences
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setLoading } = userSlice.actions
export default userSlice.reducer

