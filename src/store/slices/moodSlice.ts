import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { MoodEntry, MoodState, MoodAnalysisRequest, MoodAnalysisResponse } from '../../types'

const initialState: MoodState = {
  currentMood: null,
  moodHistory: [],
  isLoading: false,
  error: null,
  lastAnalysis: null,
}

// Async thunks
export const analyzeMoodText = createAsyncThunk(
  'mood/analyzeText',
  async (request: MoodAnalysisRequest, { rejectWithValue }) => {
    try {
      // Simulate AI analysis - in real app, this would call an API
      const mockAnalysis: MoodAnalysisResponse = {
        mood_dimensions: {
          energy_level: Math.floor(Math.random() * 10) + 1,
          stress_level: Math.floor(Math.random() * 10) + 1,
          focus_level: Math.floor(Math.random() * 10) + 1,
          social_desire: Math.floor(Math.random() * 10) + 1,
          challenge_seeking: Math.floor(Math.random() * 10) + 1,
        },
        sentiment_score: Math.random() * 2 - 1, // -1 to 1
        emotional_keywords: ['excited', 'focused', 'energetic'],
        recommended_activities: ['gaming', 'exercise', 'socializing'],
        confidence_score: 0.85,
        mood_category: 'excited',
        intensity_level: 'high',
        supportive_message: "You're feeling great! Perfect time for some engaging games.",
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return mockAnalysis
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to analyze mood text')
    }
  }
)

export const createMoodEntry = createAsyncThunk(
  'mood/createEntry',
  async (moodData: Partial<MoodEntry>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newEntry: MoodEntry = {
        id: crypto.randomUUID(),
        user_id: userId,
        energy_level: moodData.energy_level || 5,
        stress_level: moodData.stress_level || 5,
        focus_level: moodData.focus_level || 5,
        social_desire: moodData.social_desire || 5,
        challenge_seeking: moodData.challenge_seeking || 5,
        mood_text: moodData.mood_text,
        mood_analysis: moodData.mood_analysis,
        context: moodData.context || 'afternoon',
        weather_mood_factor: moodData.weather_mood_factor || 'neutral',
        biometric_data: moodData.biometric_data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage (in real app, this would be an API call)
      const existingEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]')
      existingEntries.push(newEntry)
      localStorage.setItem('moodEntries', JSON.stringify(existingEntries))

      return newEntry
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create mood entry')
    }
  }
)

export const loadMoodHistory = createAsyncThunk(
  'mood/loadHistory',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage (in real app, this would be an API call)
      const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]')
      const userEntries = entries.filter((entry: MoodEntry) => entry.user_id === userId)
      
      return userEntries.sort((a: MoodEntry, b: MoodEntry) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load mood history')
    }
  }
)

export const updateMoodEntry = createAsyncThunk(
  'mood/updateEntry',
  async ({ id, updates }: { id: string; updates: Partial<MoodEntry> }, { rejectWithValue }) => {
    try {
      const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]')
      const entryIndex = entries.findIndex((entry: MoodEntry) => entry.id === id)
      
      if (entryIndex === -1) {
        throw new Error('Mood entry not found')
      }

      const updatedEntry = {
        ...entries[entryIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }

      entries[entryIndex] = updatedEntry
      localStorage.setItem('moodEntries', JSON.stringify(entries))

      return updatedEntry
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update mood entry')
    }
  }
)

export const deleteMoodEntry = createAsyncThunk(
  'mood/deleteEntry',
  async (id: string, { rejectWithValue }) => {
    try {
      const entries = JSON.parse(localStorage.getItem('moodEntries') || '[]')
      const filteredEntries = entries.filter((entry: MoodEntry) => entry.id !== id)
      localStorage.setItem('moodEntries', JSON.stringify(filteredEntries))

      return id
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete mood entry')
    }
  }
)

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentMood: (state, action) => {
      state.currentMood = action.payload
    },
    clearCurrentMood: (state) => {
      state.currentMood = null
    },
    setLastAnalysis: (state, action) => {
      state.lastAnalysis = action.payload
    },
    clearLastAnalysis: (state) => {
      state.lastAnalysis = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Analyze mood text
      .addCase(analyzeMoodText.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(analyzeMoodText.fulfilled, (state, action) => {
        state.isLoading = false
        state.lastAnalysis = action.payload
      })
      .addCase(analyzeMoodText.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create mood entry
      .addCase(createMoodEntry.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createMoodEntry.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentMood = action.payload
        state.moodHistory.unshift(action.payload)
      })
      .addCase(createMoodEntry.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load mood history
      .addCase(loadMoodHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadMoodHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.moodHistory = action.payload
      })
      .addCase(loadMoodHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update mood entry
      .addCase(updateMoodEntry.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateMoodEntry.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.moodHistory.findIndex(entry => entry.id === action.payload.id)
        if (index !== -1) {
          state.moodHistory[index] = action.payload
        }
        if (state.currentMood?.id === action.payload.id) {
          state.currentMood = action.payload
        }
      })
      .addCase(updateMoodEntry.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete mood entry
      .addCase(deleteMoodEntry.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMoodEntry.fulfilled, (state, action) => {
        state.isLoading = false
        state.moodHistory = state.moodHistory.filter(entry => entry.id !== action.payload)
        if (state.currentMood?.id === action.payload) {
          state.currentMood = null
        }
      })
      .addCase(deleteMoodEntry.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { 
  clearError, 
  setCurrentMood, 
  clearCurrentMood, 
  setLastAnalysis, 
  clearLastAnalysis 
} = moodSlice.actions
export default moodSlice.reducer

