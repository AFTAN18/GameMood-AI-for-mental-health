import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Recommendation, RecommendationState, RecommendationRequest, MoodEntry } from '../../types'

const initialState: RecommendationState = {
  recommendations: [],
  currentRecommendation: null,
  isLoading: false,
  error: null,
  lastRequest: null,
}

// Async thunks
export const generateRecommendations = createAsyncThunk(
  'recommendation/generate',
  async (request: RecommendationRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { game: { games: any[] } }
      const allGames = state.game.games
      
      if (allGames.length === 0) {
        throw new Error('No games available for recommendations')
      }

      // Simulate AI recommendation algorithm
      const moodEntry = request.mood_entry
      const recommendations: Recommendation[] = []

      // Calculate mood-based scores for each game
      for (const game of allGames) {
        let matchScore = 0
        const reasoning: string[] = []

        // Energy level matching
        const energyMatch = Math.abs(game.ideal_energy_range.min - moodEntry.energy_level) <= 2
        if (energyMatch) {
          matchScore += 0.3
          reasoning.push('Matches your energy level')
        }

        // Stress compatibility
        const stressLevel = moodEntry.stress_level
        if (game.stress_compatibility === 'low_stress_only' && stressLevel <= 4) {
          matchScore += 0.25
          reasoning.push('Perfect for low-stress mood')
        } else if (game.stress_compatibility === 'high_stress_friendly' && stressLevel >= 7) {
          matchScore += 0.25
          reasoning.push('Great for high-energy mood')
        } else if (game.stress_compatibility === 'any_stress') {
          matchScore += 0.2
          reasoning.push('Works with any stress level')
        }

        // Mood tag matching
        const moodTags = request.mood_entry.mood_analysis?.emotional_keywords || []
        const matchingTags = game.mood_tags.filter((tag: any) => 
          moodTags.some(keyword => 
            keyword.toLowerCase().includes(tag.toLowerCase()) || 
            tag.toLowerCase().includes(keyword.toLowerCase())
          )
        )
        if (matchingTags.length > 0) {
          matchScore += 0.2
          reasoning.push(`Matches your mood: ${matchingTags.join(', ')}`)
        }

        // Platform preference
        if (request.preferences?.preferred_platforms?.includes(game.platforms[0])) {
          matchScore += 0.15
          reasoning.push('Available on your preferred platform')
        }

        // Genre preference
        if (request.preferences?.favorite_genres?.some(genre => game.genres.includes(genre))) {
          matchScore += 0.1
          reasoning.push('Matches your favorite genre')
        }

        // Wellness rating bonus
        matchScore += (game.wellness_rating / 5) * 0.1
        reasoning.push(`High wellness rating (${game.wellness_rating}/5)`)

        // Only include games with reasonable match scores
        if (matchScore >= 0.3) {
          const recommendation: Recommendation = {
            id: crypto.randomUUID(),
            user_id: request.mood_entry.user_id,
            game_id: game.id,
            mood_entry_id: request.mood_entry.id,
            algorithm_version: '1.0',
            match_score: Math.min(matchScore, 1.0),
            reasoning,
            confidence_level: matchScore >= 0.7 ? 'high' : matchScore >= 0.5 ? 'medium' : 'low',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          }
          recommendations.push(recommendation)
        }
      }

      // Sort by match score and take top recommendations
      const sortedRecommendations = recommendations
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 10)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      return {
        recommendations: sortedRecommendations,
        request,
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate recommendations')
    }
  }
)

export const loadRecommendations = createAsyncThunk(
  'recommendation/load',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage (in real app, this would be an API call)
      const recommendations = JSON.parse(localStorage.getItem(`recommendations_${userId}`) || '[]')
      return recommendations
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load recommendations')
    }
  }
)

export const saveRecommendations = createAsyncThunk(
  'recommendation/save',
  async (recommendations: Recommendation[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem(`recommendations_${userId}`, JSON.stringify(recommendations))
      return recommendations
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save recommendations')
    }
  }
)

export const rateRecommendation = createAsyncThunk(
  'recommendation/rate',
  async ({ recommendationId, rating }: { recommendationId: string; rating: number }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any }, recommendation: RecommendationState }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Update recommendation rating in localStorage
      const recommendations = JSON.parse(localStorage.getItem(`recommendations_${userId}`) || '[]')
      const updatedRecommendations = recommendations.map((rec: Recommendation) => 
        rec.id === recommendationId ? { ...rec, user_rating: rating } : rec
      )
      localStorage.setItem(`recommendations_${userId}`, JSON.stringify(updatedRecommendations))

      return { recommendationId, rating }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to rate recommendation')
    }
  }
)

export const clearExpiredRecommendations = createAsyncThunk(
  'recommendation/clearExpired',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const recommendations = JSON.parse(localStorage.getItem(`recommendations_${userId}`) || '[]')
      const now = new Date()
      const activeRecommendations = recommendations.filter((rec: Recommendation) => 
        new Date(rec.expires_at) > now
      )
      
      localStorage.setItem(`recommendations_${userId}`, JSON.stringify(activeRecommendations))
      return activeRecommendations
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to clear expired recommendations')
    }
  }
)

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentRecommendation: (state, action) => {
      state.currentRecommendation = action.payload
    },
    clearCurrentRecommendation: (state) => {
      state.currentRecommendation = null
    },
    clearRecommendations: (state) => {
      state.recommendations = []
      state.currentRecommendation = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate recommendations
      .addCase(generateRecommendations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = action.payload.recommendations
        state.lastRequest = action.payload.request
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load recommendations
      .addCase(loadRecommendations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = action.payload
      })
      .addCase(loadRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Save recommendations
      .addCase(saveRecommendations.pending, (state) => {
        state.isLoading = true
      })
      .addCase(saveRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = action.payload
      })
      .addCase(saveRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Rate recommendation
      .addCase(rateRecommendation.pending, (state) => {
        state.isLoading = true
      })
      .addCase(rateRecommendation.fulfilled, (state, action) => {
        state.isLoading = false
        const { recommendationId, rating } = action.payload
        const recommendation = state.recommendations.find(rec => rec.id === recommendationId)
        if (recommendation) {
          (recommendation as any).user_rating = rating
        }
      })
      .addCase(rateRecommendation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Clear expired recommendations
      .addCase(clearExpiredRecommendations.pending, (state) => {
        state.isLoading = true
      })
      .addCase(clearExpiredRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = action.payload
      })
      .addCase(clearExpiredRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { 
  clearError, 
  setCurrentRecommendation, 
  clearCurrentRecommendation, 
  clearRecommendations 
} = recommendationSlice.actions
export default recommendationSlice.reducer

