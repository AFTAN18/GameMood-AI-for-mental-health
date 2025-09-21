import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Game, GameState, GameFilters, Platform, Genre, MoodTag, AccessibilityFeature, PriceRange } from '../../types'

const initialState: GameState = {
  games: [],
  featuredGames: [],
  userLibrary: [],
  currentGame: null,
  isLoading: false,
  error: null,
  filters: {
    platforms: [],
    genres: [],
    priceRange: [],
    moodTags: [],
    accessibilityFeatures: [],
    minWellnessRating: 0,
    searchQuery: '',
  },
}

// Mock game data
const mockGames: Game[] = [
  {
    id: '1',
    title: 'Stardew Valley',
    description: 'A relaxing farming simulation game perfect for stress relief and creativity.',
    genres: ['Simulation', 'Indie', 'Casual'],
    platforms: ['PC', 'Nintendo Switch', 'Mobile'],
    mood_tags: ['calming', 'relaxing', 'creative', 'mindful'],
    ideal_energy_range: { min: 3, max: 7 },
    stress_compatibility: 'low_stress_only',
    session_length: 'medium_30min',
    accessibility_features: ['pause_friendly', 'anxiety_friendly', 'adhd_friendly'],
    wellness_rating: 4.8,
    image_url: '/images/stardew-valley.jpg',
    price_range: '10_to_30',
    release_date: '2016-02-26',
    developer: 'ConcernedApe',
    publisher: 'Chucklefish',
    esrb_rating: 'E',
    user_rating: 4.9,
    play_count: 15000000,
    is_featured: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Celeste',
    description: 'A challenging platformer about overcoming anxiety and self-doubt.',
    genres: ['Platformer', 'Indie'],
    platforms: ['PC', 'Nintendo Switch', 'PlayStation', 'Xbox'],
    mood_tags: ['challenging', 'therapeutic', 'focus-building'],
    ideal_energy_range: { min: 6, max: 10 },
    stress_compatibility: 'medium_stress_ok',
    session_length: 'medium_30min',
    accessibility_features: ['adjustable_difficulty', 'anxiety_friendly', 'pause_friendly'],
    wellness_rating: 4.7,
    image_url: '/images/celeste.jpg',
    price_range: '10_to_30',
    release_date: '2018-01-25',
    developer: 'Maddy Makes Games',
    publisher: 'Maddy Makes Games',
    esrb_rating: 'E',
    user_rating: 4.8,
    play_count: 5000000,
    is_featured: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'Animal Crossing: New Horizons',
    description: 'A peaceful life simulation game perfect for relaxation and social connection.',
    genres: ['Simulation', 'Casual'],
    platforms: ['Nintendo Switch'],
    mood_tags: ['calming', 'social', 'relaxing', 'mindful'],
    ideal_energy_range: { min: 2, max: 6 },
    stress_compatibility: 'low_stress_only',
    session_length: 'short_15min',
    accessibility_features: ['pause_friendly', 'anxiety_friendly', 'adhd_friendly'],
    wellness_rating: 4.9,
    image_url: '/images/animal-crossing.jpg',
    price_range: '30_to_60',
    release_date: '2020-03-20',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    esrb_rating: 'E',
    user_rating: 4.7,
    play_count: 40000000,
    is_featured: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'The Legend of Zelda: Breath of the Wild',
    description: 'An open-world adventure that encourages exploration and wonder.',
    genres: ['Adventure', 'RPG'],
    platforms: ['Nintendo Switch'],
    mood_tags: ['energizing', 'creative', 'escapist', 'uplifting'],
    ideal_energy_range: { min: 5, max: 9 },
    stress_compatibility: 'any_stress',
    session_length: 'extended_2plus_hours',
    accessibility_features: ['pause_friendly', 'adjustable_difficulty'],
    wellness_rating: 4.6,
    image_url: '/images/zelda-botw.jpg',
    price_range: '30_to_60',
    release_date: '2017-03-03',
    developer: 'Nintendo EPD',
    publisher: 'Nintendo',
    esrb_rating: 'E10+',
    user_rating: 4.9,
    play_count: 30000000,
    is_featured: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    title: 'Journey',
    description: 'A meditative adventure about connection and self-discovery.',
    genres: ['Adventure', 'Indie'],
    platforms: ['PC', 'PlayStation'],
    mood_tags: ['meditative', 'therapeutic', 'mindful', 'uplifting'],
    ideal_energy_range: { min: 3, max: 7 },
    stress_compatibility: 'low_stress_only',
    session_length: 'medium_30min',
    accessibility_features: ['low_motion', 'anxiety_friendly', 'pause_friendly'],
    wellness_rating: 4.8,
    image_url: '/images/journey.jpg',
    price_range: '10_to_30',
    release_date: '2012-03-13',
    developer: 'thatgamecompany',
    publisher: 'Sony Computer Entertainment',
    esrb_rating: 'E',
    user_rating: 4.7,
    play_count: 2000000,
    is_featured: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

// Async thunks
export const loadGames = createAsyncThunk(
  'game/loadGames',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would be an API call
      return mockGames
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load games')
    }
  }
)

export const loadFeaturedGames = createAsyncThunk(
  'game/loadFeaturedGames',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const featured = mockGames.filter(game => game.is_featured)
      return featured
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load featured games')
    }
  }
)

export const loadUserLibrary = createAsyncThunk(
  'game/loadUserLibrary',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage (in real app, this would be an API call)
      const library = JSON.parse(localStorage.getItem(`userLibrary_${userId}`) || '[]')
      return library
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load user library')
    }
  }
)

export const addToLibrary = createAsyncThunk(
  'game/addToLibrary',
  async (gameId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any }, game: GameState }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const game = state.game.games.find(g => g.id === gameId)
      if (!game) {
        throw new Error('Game not found')
      }

      // Add to localStorage (in real app, this would be an API call)
      const library = JSON.parse(localStorage.getItem(`userLibrary_${userId}`) || '[]')
      if (!library.find((g: Game) => g.id === gameId)) {
        library.push(game)
        localStorage.setItem(`userLibrary_${userId}`, JSON.stringify(library))
      }

      return game
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add game to library')
    }
  }
)

export const removeFromLibrary = createAsyncThunk(
  'game/removeFromLibrary',
  async (gameId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Remove from localStorage (in real app, this would be an API call)
      const library = JSON.parse(localStorage.getItem(`userLibrary_${userId}`) || '[]')
      const filteredLibrary = library.filter((g: Game) => g.id !== gameId)
      localStorage.setItem(`userLibrary_${userId}`, JSON.stringify(filteredLibrary))

      return gameId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove game from library')
    }
  }
)

export const searchGames = createAsyncThunk(
  'game/searchGames',
  async (query: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { game: GameState }
      const allGames = state.game.games
      
      if (!query.trim()) {
        return allGames
      }

      const filteredGames = allGames.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase()) ||
        game.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase())) ||
        game.mood_tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )

      return filteredGames
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search games')
    }
  }
)

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload
    },
    clearCurrentGame: (state) => {
      state.currentGame = null
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        platforms: [],
        genres: [],
        priceRange: [],
        moodTags: [],
        accessibilityFeatures: [],
        minWellnessRating: 0,
        searchQuery: '',
      }
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Load games
      .addCase(loadGames.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadGames.fulfilled, (state, action) => {
        state.isLoading = false
        state.games = action.payload
      })
      .addCase(loadGames.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load featured games
      .addCase(loadFeaturedGames.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadFeaturedGames.fulfilled, (state, action) => {
        state.isLoading = false
        state.featuredGames = action.payload
      })
      .addCase(loadFeaturedGames.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load user library
      .addCase(loadUserLibrary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadUserLibrary.fulfilled, (state, action) => {
        state.isLoading = false
        state.userLibrary = action.payload
      })
      .addCase(loadUserLibrary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add to library
      .addCase(addToLibrary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addToLibrary.fulfilled, (state, action) => {
        state.isLoading = false
        if (!state.userLibrary.find(g => g.id === action.payload.id)) {
          state.userLibrary.push(action.payload)
        }
      })
      .addCase(addToLibrary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Remove from library
      .addCase(removeFromLibrary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(removeFromLibrary.fulfilled, (state, action) => {
        state.isLoading = false
        state.userLibrary = state.userLibrary.filter(g => g.id !== action.payload)
      })
      .addCase(removeFromLibrary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Search games
      .addCase(searchGames.pending, (state) => {
        state.isLoading = true
      })
      .addCase(searchGames.fulfilled, (state, action) => {
        state.isLoading = false
        // Update games with search results
        state.games = action.payload
      })
      .addCase(searchGames.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { 
  clearError, 
  setCurrentGame, 
  clearCurrentGame, 
  updateFilters, 
  clearFilters, 
  setSearchQuery 
} = gameSlice.actions
export default gameSlice.reducer

