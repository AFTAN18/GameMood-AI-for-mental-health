import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { motion } from 'framer-motion'
import { Gamepad2, Star, Clock, Users, Heart, Brain, Zap, Target, RefreshCw, Filter, SortAsc } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { generateRecommendations, loadRecommendations } from '../store/slices/recommendationSlice'
import { loadGames } from '../store/slices/gameSlice'
import { loadMoodHistory } from '../store/slices/moodSlice'
import { Recommendation, Game } from '../types'

export default function RecommendationsPage() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const moodEntryId = searchParams.get('mood_entry_id')
  
  const { recommendations, isLoading, error } = useAppSelector((state) => state.recommendation)
  const { games } = useAppSelector((state) => state.game)
  const { moodHistory } = useAppSelector((state) => state.mood)
  const { user } = useAppSelector((state) => state.user)
  
  const [sortBy, setSortBy] = useState<'match_score' | 'wellness_rating' | 'user_rating'>('match_score')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')

  useEffect(() => {
    loadData()
  }, [moodEntryId])

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(loadGames()),
        dispatch(loadMoodHistory())
      ])

      if (moodEntryId) {
        const moodEntry = moodHistory.find(entry => entry.id === moodEntryId)
        if (moodEntry) {
          await dispatch(generateRecommendations({
            mood_entry: moodEntry,
            preferences: user?.preferences,
            time_available: 60,
            platform_filter: user?.preferences?.preferred_platforms,
            genre_filter: user?.preferences?.favorite_genres,
            exclude_played: false
          }))
        }
      } else {
        await dispatch(loadRecommendations())
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    }
  }

  const getGameById = (gameId: string): Game | undefined => {
    return games.find(game => game.id === gameId)
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      'PC': '💻',
      'PlayStation': '🎮',
      'Xbox': '🎯',
      'Nintendo Switch': '🕹️',
      'Mobile': '📱',
      'Web Browser': '🌐',
    }
    return icons[platform] || '🎮'
  }

  const getGenreIcon = (genre: string) => {
    const icons: Record<string, string> = {
      'Action': '⚔️',
      'Adventure': '🗺️',
      'RPG': '⚔️',
      'Strategy': '♟️',
      'Puzzle': '🧩',
      'Simulation': '🏗️',
      'Sports': '⚽',
      'Racing': '🏎️',
      'Fighting': '👊',
      'Shooter': '🔫',
      'Platformer': '🦘',
      'Indie': '🎨',
      'Casual': '😌',
      'Educational': '📚',
      'Horror': '👻',
      'Survival': '🏕️',
    }
    return icons[genre] || '🎮'
  }

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'text-green-500'
      case 'high': return 'text-blue-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getConfidenceEmoji = (level: string) => {
    switch (level) {
      case 'very_high': return '🎯'
      case 'high': return '👍'
      case 'medium': return '👌'
      case 'low': return '🤔'
      default: return '❓'
    }
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const gameA = getGameById(a.game_id)
    const gameB = getGameById(b.game_id)
    
    if (!gameA || !gameB) return 0
    
    switch (sortBy) {
      case 'match_score':
        return b.match_score - a.match_score
      case 'wellness_rating':
        return gameB.wellness_rating - gameA.wellness_rating
      case 'user_rating':
        return gameB.user_rating - gameA.user_rating
      default:
        return 0
    }
  })

  const filteredRecommendations = sortedRecommendations.filter(rec => {
    const game = getGameById(rec.game_id)
    if (!game) return false
    
    if (filterPlatform !== 'all') {
      return game.platforms.includes(filterPlatform as any)
    }
    
    return true
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">Finding your perfect games...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">😞</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadData} className="gaming-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Your Game Recommendations
              </h1>
              <p className="text-gray-600">
                AI-powered suggestions based on your current mood and preferences
              </p>
            </div>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Platform:</span>
                  <select
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Platforms</option>
                    <option value="PC">PC</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Web Browser">Web Browser</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="match_score">Match Score</option>
                    <option value="wellness_rating">Wellness Rating</option>
                    <option value="user_rating">User Rating</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRecommendations.map((recommendation, index) => {
            const game = getGameById(recommendation.game_id)
            if (!game) return null

            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {game.title.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-800 group-hover:text-purple-600 transition-colors">
                            {game.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{game.developer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-700">{game.user_rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">{game.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Match Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Match Score</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${getConfidenceColor(recommendation.confidence_level)}`}>
                            {Math.round(recommendation.match_score * 100)}%
                          </span>
                          <span className="text-lg">{getConfidenceEmoji(recommendation.confidence_level)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${recommendation.match_score * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {game.genres.slice(0, 3).map((genre, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {getGenreIcon(genre)} {genre}
                          </Badge>
                        ))}
                        {game.genres.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{game.genres.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {game.platforms.map((platform, idx) => (
                          <Badge key={idx} variant="gaming" className="text-xs">
                            {getPlatformIcon(platform)} {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Mood Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {game.mood_tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="mood" className="text-xs">
                            {tag.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Why this game?</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {recommendation.reasoning.slice(0, 2).map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1 gaming-button">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Play Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Empty State */}
        {filteredRecommendations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No recommendations found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later for new suggestions.
            </p>
            <Button onClick={loadData} className="gaming-button">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Recommendations
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

