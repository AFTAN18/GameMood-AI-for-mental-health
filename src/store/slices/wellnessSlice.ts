import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { WellnessState, WellnessMetrics, WellnessGoalItem, Achievement, BadgeType } from '../../types'

const initialState: WellnessState = {
  metrics: [],
  goals: [],
  achievements: [],
  currentStreak: 0,
  totalScore: 0,
  isLoading: false,
  error: null,
}

// Async thunks
export const loadWellnessMetrics = createAsyncThunk(
  'wellness/loadMetrics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage (in real app, this would be an API call)
      const metrics = JSON.parse(localStorage.getItem(`wellnessMetrics_${userId}`) || '[]')
      return metrics
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load wellness metrics')
    }
  }
)

export const createWellnessMetric = createAsyncThunk(
  'wellness/createMetric',
  async (metricData: Partial<WellnessMetrics>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newMetric: WellnessMetrics = {
        id: crypto.randomUUID(),
        user_id: userId,
        date: metricData.date || new Date().toISOString().split('T')[0],
        mood_score: metricData.mood_score || 0,
        energy_level: metricData.energy_level || 0,
        stress_level: metricData.stress_level || 0,
        focus_level: metricData.focus_level || 0,
        social_satisfaction: metricData.social_satisfaction || 0,
        sleep_quality: metricData.sleep_quality || 0,
        physical_activity: metricData.physical_activity || 0,
        gaming_balance_score: metricData.gaming_balance_score || 0,
        overall_wellness_score: metricData.overall_wellness_score || 0,
        notes: metricData.notes,
        created_at: new Date().toISOString(),
      }

      // Save to localStorage
      const existingMetrics = JSON.parse(localStorage.getItem(`wellnessMetrics_${userId}`) || '[]')
      existingMetrics.push(newMetric)
      localStorage.setItem(`wellnessMetrics_${userId}`, JSON.stringify(existingMetrics))

      return newMetric
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create wellness metric')
    }
  }
)

export const loadWellnessGoals = createAsyncThunk(
  'wellness/loadGoals',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage
      const goals = JSON.parse(localStorage.getItem(`wellnessGoals_${userId}`) || '[]')
      return goals
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load wellness goals')
    }
  }
)

export const createWellnessGoal = createAsyncThunk(
  'wellness/createGoal',
  async (goalData: Partial<WellnessGoalItem>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newGoal: WellnessGoalItem = {
        id: crypto.randomUUID(),
        user_id: userId,
        title: goalData.title || '',
        description: goalData.description || '',
        category: goalData.category || 'mood_improvement',
        target_value: goalData.target_value || 0,
        current_value: goalData.current_value || 0,
        unit: goalData.unit || '',
        deadline: goalData.deadline,
        is_achieved: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage
      const existingGoals = JSON.parse(localStorage.getItem(`wellnessGoals_${userId}`) || '[]')
      existingGoals.push(newGoal)
      localStorage.setItem(`wellnessGoals_${userId}`, JSON.stringify(existingGoals))

      return newGoal
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create wellness goal')
    }
  }
)

export const updateWellnessGoal = createAsyncThunk(
  'wellness/updateGoal',
  async ({ id, updates }: { id: string; updates: Partial<WellnessGoalItem> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const goals = JSON.parse(localStorage.getItem(`wellnessGoals_${userId}`) || '[]')
      const goalIndex = goals.findIndex((goal: WellnessGoalItem) => goal.id === id)
      
      if (goalIndex === -1) {
        throw new Error('Wellness goal not found')
      }

      const updatedGoal = {
        ...goals[goalIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }

      goals[goalIndex] = updatedGoal
      localStorage.setItem(`wellnessGoals_${userId}`, JSON.stringify(goals))

      return updatedGoal
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update wellness goal')
    }
  }
)

export const loadAchievements = createAsyncThunk(
  'wellness/loadAchievements',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage
      const achievements = JSON.parse(localStorage.getItem(`achievements_${userId}`) || '[]')
      return achievements
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load achievements')
    }
  }
)

export const unlockAchievement = createAsyncThunk(
  'wellness/unlockAchievement',
  async ({ badgeType, title, description }: { badgeType: BadgeType; title: string; description: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newAchievement: Achievement = {
        id: crypto.randomUUID(),
        user_id: userId,
        badge_type: badgeType,
        title,
        description,
        icon_url: `/icons/achievements/${badgeType}.svg`,
        earned_date: new Date().toISOString(),
        progress_data: {},
        is_featured: false,
      }

      // Save to localStorage
      const existingAchievements = JSON.parse(localStorage.getItem(`achievements_${userId}`) || '[]')
      existingAchievements.push(newAchievement)
      localStorage.setItem(`achievements_${userId}`, JSON.stringify(existingAchievements))

      return newAchievement
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to unlock achievement')
    }
  }
)

export const calculateWellnessScore = createAsyncThunk(
  'wellness/calculateScore',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any }, wellness: WellnessState }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const metrics = state.wellness.metrics
      if (metrics.length === 0) {
        return { currentStreak: 0, totalScore: 0 }
      }

      // Calculate current streak
      let currentStreak = 0
      const today = new Date().toISOString().split('T')[0]
      const sortedMetrics = metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      for (const metric of sortedMetrics) {
        if (metric.overall_wellness_score >= 7) {
          currentStreak++
        } else {
          break
        }
      }

      // Calculate total score
      const totalScore = metrics.reduce((sum, metric) => sum + metric.overall_wellness_score, 0)

      return { currentStreak, totalScore }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to calculate wellness score')
    }
  }
)

const wellnessSlice = createSlice({
  name: 'wellness',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentStreak: (state, action) => {
      state.currentStreak = action.payload
    },
    setTotalScore: (state, action) => {
      state.totalScore = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Load wellness metrics
      .addCase(loadWellnessMetrics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadWellnessMetrics.fulfilled, (state, action) => {
        state.isLoading = false
        state.metrics = action.payload
      })
      .addCase(loadWellnessMetrics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create wellness metric
      .addCase(createWellnessMetric.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createWellnessMetric.fulfilled, (state, action) => {
        state.isLoading = false
        state.metrics.push(action.payload)
      })
      .addCase(createWellnessMetric.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load wellness goals
      .addCase(loadWellnessGoals.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadWellnessGoals.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals = action.payload
      })
      .addCase(loadWellnessGoals.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create wellness goal
      .addCase(createWellnessGoal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createWellnessGoal.fulfilled, (state, action) => {
        state.isLoading = false
        state.goals.push(action.payload as WellnessGoalItem)
      })
      .addCase(createWellnessGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update wellness goal
      .addCase(updateWellnessGoal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateWellnessGoal.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.goals.findIndex(goal => goal.id === action.payload.id)
        if (index !== -1) {
          state.goals[index] = action.payload
        }
      })
      .addCase(updateWellnessGoal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load achievements
      .addCase(loadAchievements.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadAchievements.fulfilled, (state, action) => {
        state.isLoading = false
        state.achievements = action.payload
      })
      .addCase(loadAchievements.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Unlock achievement
      .addCase(unlockAchievement.pending, (state) => {
        state.isLoading = true
      })
      .addCase(unlockAchievement.fulfilled, (state, action) => {
        state.isLoading = false
        state.achievements.push(action.payload)
      })
      .addCase(unlockAchievement.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Calculate wellness score
      .addCase(calculateWellnessScore.pending, (state) => {
        state.isLoading = true
      })
      .addCase(calculateWellnessScore.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentStreak = action.payload.currentStreak
        state.totalScore = action.payload.totalScore
      })
      .addCase(calculateWellnessScore.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentStreak, setTotalScore } = wellnessSlice.actions
export default wellnessSlice.reducer

