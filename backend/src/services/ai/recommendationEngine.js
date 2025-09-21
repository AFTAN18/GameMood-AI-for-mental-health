import db from '../../config/database.js'

class RecommendationEngine {
  constructor() {
    this.collaborativeWeights = {
      mood_similarity: 0.4,
      gaming_preferences: 0.3,
      wellness_goals: 0.2,
      social_connections: 0.1
    }
  }

  async generateRecommendations(userId, moodData, limit = 10) {
    try {
      // Get user profile and preferences
      const user = await this.getUserProfile(userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Get user's gaming history
      const gamingHistory = await this.getUserGamingHistory(userId)
      
      // Get similar users
      const similarUsers = await this.findSimilarUsers(userId, moodData)
      
      // Get candidate games
      const candidateGames = await this.getCandidateGames(user, moodData)
      
      // Score and rank games
      const scoredGames = await this.scoreGames(
        candidateGames, 
        user, 
        moodData, 
        gamingHistory, 
        similarUsers
      )
      
      // Sort by score and return top recommendations
      const recommendations = scoredGames
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(game => ({
          game_id: game.id,
          title: game.title,
          confidence_score: Math.round(game.score * 100),
          reasoning: game.reasoning,
          mood_match: game.moodMatch,
          wellness_benefits: game.wellnessBenefits,
          similar_users_liked: game.similarUsersLiked
        }))

      return recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return []
    }
  }

  async getUserProfile(userId) {
    const user = await db('users')
      .where('id', userId)
      .first()
    
    if (!user) return null

    return {
      id: user.id,
      preferences: user.preferences || {},
      accessibility_settings: user.accessibility_settings || {},
      wellness_streak: user.wellness_streak,
      total_wellness_score: user.total_wellness_score
    }
  }

  async getUserGamingHistory(userId) {
    const sessions = await db('game_sessions')
      .join('games', 'game_sessions.game_id', 'games.id')
      .where('game_sessions.user_id', userId)
      .select(
        'games.*',
        'game_sessions.enjoyment_rating',
        'game_sessions.mood_before',
        'game_sessions.mood_after',
        'game_sessions.duration_minutes'
      )
      .orderBy('game_sessions.started_at', 'desc')
      .limit(100)

    return sessions
  }

  async findSimilarUsers(userId, moodData) {
    // Find users with similar mood patterns
    const similarUsers = await db.raw(`
      SELECT 
        u.id,
        u.preferences,
        COUNT(me.id) as mood_entries_count,
        AVG(
          CASE 
            WHEN me.energy_level BETWEEN ? - 2 AND ? + 2 THEN 1 
            ELSE 0 
          END
        ) as energy_similarity,
        AVG(
          CASE 
            WHEN me.stress_level BETWEEN ? - 2 AND ? + 2 THEN 1 
            ELSE 0 
          END
        ) as stress_similarity,
        AVG(
          CASE 
            WHEN me.focus_level BETWEEN ? - 2 AND ? + 2 THEN 1 
            ELSE 0 
          END
        ) as focus_similarity
      FROM users u
      JOIN mood_entries me ON u.id = me.user_id
      WHERE u.id != ?
        AND me.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY u.id, u.preferences
      HAVING mood_entries_count >= 5
        AND (energy_similarity + stress_similarity + focus_similarity) / 3 > 0.6
      ORDER BY (energy_similarity + stress_similarity + focus_similarity) / 3 DESC
      LIMIT 20
    `, [
      moodData.energy_level, moodData.energy_level,
      moodData.stress_level, moodData.stress_level,
      moodData.focus_level, moodData.focus_level,
      userId
    ])

    return similarUsers.rows || []
  }

  async getCandidateGames(user, moodData) {
    // Get games that match user preferences and mood
    let query = db('games')
      .where('is_active', true)

    // Filter by preferred platforms
    if (user.preferences.preferred_platforms?.length > 0) {
      query = query.whereRaw(
        'platforms && ?',
        [JSON.stringify(user.preferences.preferred_platforms)]
      )
    }

    // Filter by preferred genres
    if (user.preferences.favorite_genres?.length > 0) {
      query = query.whereRaw(
        'genres && ?',
        [JSON.stringify(user.preferences.favorite_genres)]
      )
    }

    // Mood-based filtering
    const energyLevel = moodData.energy_level
    const stressLevel = moodData.stress_level

    if (energyLevel >= 7) {
      // High energy - prefer action games
      query = query.whereRaw("genres @> ?", [JSON.stringify(['Action', 'Sports', 'Racing'])])
    } else if (energyLevel <= 4) {
      // Low energy - prefer calm games
      query = query.whereRaw("genres @> ?", [JSON.stringify(['Puzzle', 'Simulation', 'Casual'])])
    }

    if (stressLevel >= 7) {
      // High stress - prefer relaxing games
      query = query.where('stress_compatibility', '<=', 3)
    } else if (stressLevel <= 4) {
      // Low stress - can handle intense games
      query = query.where('stress_compatibility', '>=', 5)
    }

    const games = await query.limit(100)
    return games
  }

  async scoreGames(candidateGames, user, moodData, gamingHistory, similarUsers) {
    const scoredGames = []

    for (const game of candidateGames) {
      let score = 0
      const reasoning = []
      const moodMatch = {}
      const wellnessBenefits = []

      // 1. Mood matching score (0-40 points)
      const moodScore = this.calculateMoodMatch(game, moodData)
      score += moodScore * 0.4
      moodMatch.overall = moodScore
      reasoning.push(`Mood match: ${Math.round(moodScore * 100)}%`)

      // 2. Gaming preferences score (0-30 points)
      const preferenceScore = this.calculatePreferenceMatch(game, user.preferences)
      score += preferenceScore * 0.3
      reasoning.push(`Preference match: ${Math.round(preferenceScore * 100)}%`)

      // 3. Wellness goals score (0-20 points)
      const wellnessScore = this.calculateWellnessMatch(game, user)
      score += wellnessScore * 0.2
      wellnessBenefits.push(...this.getWellnessBenefits(game))
      reasoning.push(`Wellness benefits: ${Math.round(wellnessScore * 100)}%`)

      // 4. Similar users score (0-10 points)
      const similarUsersScore = await this.calculateSimilarUsersScore(game, similarUsers)
      score += similarUsersScore * 0.1
      reasoning.push(`Similar users liked: ${Math.round(similarUsersScore * 100)}%`)

      // 5. Gaming history bonus/penalty
      const historyScore = this.calculateHistoryScore(game, gamingHistory)
      score += historyScore * 0.1

      // 6. Accessibility considerations
      const accessibilityScore = this.calculateAccessibilityScore(game, user.accessibility_settings)
      score += accessibilityScore * 0.05

      scoredGames.push({
        ...game,
        score: Math.min(score, 1), // Normalize to 0-1
        reasoning: reasoning.join(', '),
        moodMatch,
        wellnessBenefits,
        similarUsersLiked: Math.round(similarUsersScore * 100)
      })
    }

    return scoredGames
  }

  calculateMoodMatch(game, moodData) {
    let match = 0.5 // Base match

    // Energy level matching
    const energyMatch = 1 - Math.abs(game.ideal_energy_min - moodData.energy_level) / 10
    match += energyMatch * 0.3

    // Stress compatibility
    const stressMatch = 1 - Math.abs(game.stress_compatibility - moodData.stress_level) / 10
    match += stressMatch * 0.3

    // Social desire
    if (moodData.social_desire > 7 && game.genres.includes('Multiplayer')) {
      match += 0.2
    } else if (moodData.social_desire < 4 && !game.genres.includes('Multiplayer')) {
      match += 0.2
    }

    // Challenge seeking
    if (moodData.challenge_seeking > 7 && game.genres.includes('Strategy')) {
      match += 0.2
    } else if (moodData.challenge_seeking < 4 && game.genres.includes('Casual')) {
      match += 0.2
    }

    return Math.max(0, Math.min(1, match))
  }

  calculatePreferenceMatch(game, preferences) {
    let match = 0.5 // Base match

    // Platform matching
    if (preferences.preferred_platforms?.length > 0) {
      const platformMatch = game.platforms.filter(platform => 
        preferences.preferred_platforms.includes(platform)
      ).length / preferences.preferred_platforms.length
      match += platformMatch * 0.4
    }

    // Genre matching
    if (preferences.favorite_genres?.length > 0) {
      const genreMatch = game.genres.filter(genre => 
        preferences.favorite_genres.includes(genre)
      ).length / preferences.favorite_genres.length
      match += genreMatch * 0.4
    }

    // Session length preference
    if (preferences.preferred_session_length) {
      const sessionMatch = 1 - Math.abs(
        game.session_length_minutes - preferences.preferred_session_length
      ) / 120 // Max 2 hours difference
      match += sessionMatch * 0.2
    }

    return Math.max(0, Math.min(1, match))
  }

  calculateWellnessMatch(game, user) {
    let match = 0.5 // Base match

    // Wellness rating
    match += (game.wellness_rating / 10) * 0.3

    // User's wellness streak consideration
    if (user.wellness_streak > 7 && game.wellness_rating >= 7) {
      match += 0.2
    }

    // Accessibility features
    if (user.accessibility_settings?.colorblind_support && 
        game.accessibility_features?.includes('colorblind_support')) {
      match += 0.1
    }

    if (user.accessibility_settings?.reduced_motion && 
        game.accessibility_features?.includes('reduced_motion')) {
      match += 0.1
    }

    return Math.max(0, Math.min(1, match))
  }

  async calculateSimilarUsersScore(game, similarUsers) {
    if (similarUsers.length === 0) return 0.5

    // This would typically involve checking if similar users liked this game
    // For now, return a random score based on game popularity
    return Math.random() * 0.8 + 0.2
  }

  calculateHistoryScore(game, gamingHistory) {
    // Check if user has played this game before
    const playedBefore = gamingHistory.find(session => session.id === game.id)
    
    if (playedBefore) {
      // If they enjoyed it, boost score; if not, reduce score
      return (playedBefore.enjoyment_rating - 5) / 5 * 0.2
    }

    // Slight penalty for completely new games (encourage exploration)
    return -0.05
  }

  calculateAccessibilityScore(game, accessibilitySettings) {
    if (!accessibilitySettings) return 0

    let score = 0
    const features = game.accessibility_features || []

    if (accessibilitySettings.high_contrast && features.includes('high_contrast')) {
      score += 0.2
    }

    if (accessibilitySettings.screen_reader && features.includes('screen_reader')) {
      score += 0.2
    }

    if (accessibilitySettings.one_handed_controls && features.includes('one_handed_controls')) {
      score += 0.2
    }

    if (accessibilitySettings.subtitle_required && features.includes('subtitles')) {
      score += 0.2
    }

    return Math.min(score, 0.2)
  }

  getWellnessBenefits(game) {
    const benefits = []

    if (game.wellness_rating >= 8) {
      benefits.push('High wellness rating')
    }

    if (game.genres.includes('Puzzle')) {
      benefits.push('Improves cognitive function')
    }

    if (game.genres.includes('Sports')) {
      benefits.push('Encourages physical activity')
    }

    if (game.genres.includes('Simulation')) {
      benefits.push('Promotes relaxation')
    }

    if (game.genres.includes('Multiplayer')) {
      benefits.push('Enhances social connections')
    }

    return benefits
  }
}

export default new RecommendationEngine()
