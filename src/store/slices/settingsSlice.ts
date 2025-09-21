import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { SettingsState, UserPreferences, AccessibilitySettings, PrivacySettings, NotificationPreferences } from '../../types'

const initialState: SettingsState = {
  preferences: {
    preferred_platforms: [],
    favorite_genres: [],
    wellness_goals: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'en',
    theme: 'auto',
  },
  accessibility: {
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
  privacy: {
    share_mood_data: false,
    participate_in_community: true,
    anonymous_analytics: true,
    wellness_reminders: true,
    data_retention_days: 365,
  },
  notifications: {
    mood_check_reminders: true,
    break_reminders: true,
    wellness_tips: true,
    new_recommendations: true,
    community_updates: false,
    achievement_notifications: true,
    email_notifications: false,
    push_notifications: true,
  },
  isLoading: false,
  error: null,
}

// Async thunks
export const loadSettings = createAsyncThunk(
  'settings/load',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const user = state.user.user
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      return {
        preferences: user.preferences,
        accessibility: user.accessibility_settings,
        privacy: user.privacy_settings,
        notifications: user.notification_preferences,
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load settings')
    }
  }
)

export const updatePreferences = createAsyncThunk(
  'settings/updatePreferences',
  async (preferences: Partial<UserPreferences>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const user = state.user.user
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const updatedPreferences = {
        ...user.preferences,
        ...preferences,
      }

      // Update user in localStorage
      const updatedUser = {
        ...user,
        preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedUser))

      return updatedPreferences
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update preferences')
    }
  }
)

export const updateAccessibilitySettings = createAsyncThunk(
  'settings/updateAccessibility',
  async (accessibility: Partial<AccessibilitySettings>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const user = state.user.user
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const updatedAccessibility = {
        ...user.accessibility_settings,
        ...accessibility,
      }

      // Update user in localStorage
      const updatedUser = {
        ...user,
        accessibility_settings: updatedAccessibility,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedUser))

      // Apply accessibility settings to DOM
      if (accessibility.high_contrast !== undefined) {
        if (accessibility.high_contrast) {
          document.documentElement.classList.add('high-contrast')
        } else {
          document.documentElement.classList.remove('high-contrast')
        }
      }

      if (accessibility.reduced_motion !== undefined) {
        if (accessibility.reduced_motion) {
          document.documentElement.classList.add('reduced-motion')
        } else {
          document.documentElement.classList.remove('reduced-motion')
        }
      }

      if (accessibility.font_size) {
        document.documentElement.style.setProperty('--font-size', accessibility.font_size)
      }

      return updatedAccessibility
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update accessibility settings')
    }
  }
)

export const updatePrivacySettings = createAsyncThunk(
  'settings/updatePrivacy',
  async (privacy: Partial<PrivacySettings>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const user = state.user.user
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const updatedPrivacy = {
        ...user.privacy_settings,
        ...privacy,
      }

      // Update user in localStorage
      const updatedUser = {
        ...user,
        privacy_settings: updatedPrivacy,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedUser))

      return updatedPrivacy
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update privacy settings')
    }
  }
)

export const updateNotificationPreferences = createAsyncThunk(
  'settings/updateNotifications',
  async (notifications: Partial<NotificationPreferences>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const user = state.user.user
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const updatedNotifications = {
        ...user.notification_preferences,
        ...notifications,
      }

      // Update user in localStorage
      const updatedUser = {
        ...user,
        notification_preferences: updatedNotifications,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedUser))

      // Request notification permission if needed
      if (notifications.push_notifications && 'Notification' in window) {
        if (Notification.permission === 'default') {
          await Notification.requestPermission()
        }
      }

      return updatedNotifications
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update notification preferences')
    }
  }
)

export const resetSettings = createAsyncThunk(
  'settings/reset',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const user = state.user.user
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const defaultSettings = {
        preferences: {
          preferred_platforms: [],
          favorite_genres: [],
          wellness_goals: [],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: 'en',
          theme: 'auto',
        },
        accessibility: {
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
        privacy: {
          share_mood_data: false,
          participate_in_community: true,
          anonymous_analytics: true,
          wellness_reminders: true,
          data_retention_days: 365,
        },
        notifications: {
          mood_check_reminders: true,
          break_reminders: true,
          wellness_tips: true,
          new_recommendations: true,
          community_updates: false,
          achievement_notifications: true,
          email_notifications: false,
          push_notifications: true,
        },
      }

      // Update user in localStorage
      const updatedUser = {
        ...user,
        preferences: defaultSettings.preferences,
        accessibility_settings: defaultSettings.accessibility,
        privacy_settings: defaultSettings.privacy,
        notification_preferences: defaultSettings.notifications,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedUser))

      return defaultSettings
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to reset settings')
    }
  }
)

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Load settings
      .addCase(loadSettings.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.preferences = action.payload.preferences
        state.accessibility = action.payload.accessibility
        state.privacy = action.payload.privacy
        state.notifications = action.payload.notifications
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false
        state.preferences = action.payload
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
        state.accessibility = action.payload
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
        state.privacy = action.payload
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
        state.notifications = action.payload
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Reset settings
      .addCase(resetSettings.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.isLoading = false
        state.preferences = action.payload.preferences as any
        state.accessibility = action.payload.accessibility as any
        state.privacy = action.payload.privacy as any
        state.notifications = action.payload.notifications as any
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = settingsSlice.actions
export default settingsSlice.reducer

