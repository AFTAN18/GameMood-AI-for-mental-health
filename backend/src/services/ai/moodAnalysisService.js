import * as tf from '@tensorflow/tfjs-node'
import natural from 'natural'
import Sentiment from 'sentiment'

class MoodAnalysisService {
  constructor() {
    this.sentiment = new Sentiment()
    this.model = null
    this.isModelLoaded = false
  }

  async initialize() {
    try {
      // Load pre-trained mood analysis model
      this.model = await tf.loadLayersModel('file://./models/mood-analysis-model.json')
      this.isModelLoaded = true
      console.log('Mood analysis model loaded successfully')
    } catch (error) {
      console.warn('Could not load mood analysis model, using fallback methods:', error.message)
      this.isModelLoaded = false
    }
  }

  async analyzeMoodFromText(text) {
    if (!text || text.trim().length === 0) {
      return {
        overall_sentiment: 'neutral',
        confidence: 0.5,
        emotions: {
          joy: 0.2,
          sadness: 0.2,
          anger: 0.2,
          fear: 0.2,
          surprise: 0.2
        },
        mood_score: 5,
        keywords: [],
        suggestions: []
      }
    }

    try {
      // Clean and preprocess text
      const cleanedText = this.preprocessText(text)
      
      // Get sentiment analysis
      const sentimentResult = this.sentiment.analyze(cleanedText)
      
      // Extract emotions using keyword analysis
      const emotions = this.extractEmotions(cleanedText)
      
      // Calculate mood score (1-10)
      const moodScore = this.calculateMoodScore(sentimentResult, emotions)
      
      // Extract keywords
      const keywords = this.extractKeywords(cleanedText)
      
      // Generate suggestions
      const suggestions = this.generateSuggestions(moodScore, emotions, keywords)
      
      return {
        overall_sentiment: this.getOverallSentiment(sentimentResult.score),
        confidence: Math.min(Math.abs(sentimentResult.score) / 10, 1),
        emotions,
        mood_score: moodScore,
        keywords,
        suggestions,
        raw_sentiment: sentimentResult
      }
    } catch (error) {
      console.error('Error in mood analysis:', error)
      return this.getDefaultMoodAnalysis()
    }
  }

  async analyzeMoodFromSliders(moodData) {
    const { energy_level, stress_level, focus_level, social_desire, challenge_seeking } = moodData
    
    // Calculate overall mood score
    const moodScore = Math.round(
      (energy_level + (10 - stress_level) + focus_level + social_desire + challenge_seeking) / 5
    )
    
    // Determine mood category
    let moodCategory = 'neutral'
    if (moodScore >= 8) moodCategory = 'excellent'
    else if (moodScore >= 6) moodCategory = 'good'
    else if (moodScore >= 4) moodCategory = 'fair'
    else moodCategory = 'poor'
    
    // Analyze patterns
    const patterns = this.analyzeMoodPatterns(moodData)
    
    // Generate insights
    const insights = this.generateMoodInsights(moodData, patterns)
    
    return {
      mood_score: moodScore,
      mood_category: moodCategory,
      patterns,
      insights,
      recommendations: this.generateMoodRecommendations(moodData)
    }
  }

  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }

  extractEmotions(text) {
    const emotionKeywords = {
      joy: ['happy', 'excited', 'joyful', 'cheerful', 'elated', 'thrilled', 'delighted', 'ecstatic'],
      sadness: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'sorrowful', 'miserable'],
      anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'livid'],
      fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous', 'fearful', 'panicked'],
      surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'startled', 'bewildered', 'stunned']
    }

    const emotions = {}
    const words = text.split(' ')
    
    Object.keys(emotionKeywords).forEach(emotion => {
      const matches = words.filter(word => 
        emotionKeywords[emotion].includes(word)
      ).length
      emotions[emotion] = Math.min(matches / emotionKeywords[emotion].length, 1)
    })

    return emotions
  }

  calculateMoodScore(sentimentResult, emotions) {
    // Base score from sentiment (-10 to 10, convert to 1-10)
    let score = (sentimentResult.score + 10) / 2
    
    // Adjust based on emotions
    const emotionWeights = {
      joy: 0.3,
      sadness: -0.3,
      anger: -0.2,
      fear: -0.2,
      surprise: 0.1
    }
    
    Object.keys(emotionWeights).forEach(emotion => {
      if (emotions[emotion]) {
        score += emotions[emotion] * emotionWeights[emotion] * 2
      }
    })
    
    return Math.max(1, Math.min(10, Math.round(score)))
  }

  extractKeywords(text) {
    const tokenizer = new natural.WordTokenizer()
    const tokens = tokenizer.tokenize(text)
    
    // Remove stop words
    const stopWords = natural.stopwords
    const filteredTokens = tokens.filter(token => 
      !stopWords.includes(token.toLowerCase()) && token.length > 2
    )
    
    // Get word frequency
    const wordFreq = {}
    filteredTokens.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })
    
    // Sort by frequency and return top keywords
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  generateSuggestions(moodScore, emotions, keywords) {
    const suggestions = []
    
    if (moodScore <= 3) {
      suggestions.push('Consider trying calming games like puzzle or simulation games')
      suggestions.push('Take a break and practice deep breathing exercises')
      suggestions.push('Connect with friends for social gaming')
    } else if (moodScore >= 8) {
      suggestions.push('Great mood! Try challenging games or competitive multiplayer')
      suggestions.push('Consider sharing your positive energy with the community')
    } else {
      suggestions.push('Try games that match your current energy level')
      suggestions.push('Consider setting a gaming goal for today')
    }
    
    // Emotion-specific suggestions
    if (emotions.sadness > 0.5) {
      suggestions.push('Try uplifting games or connect with supportive gaming communities')
    }
    if (emotions.anger > 0.5) {
      suggestions.push('Consider relaxing games or take a break before gaming')
    }
    if (emotions.fear > 0.5) {
      suggestions.push('Try familiar, comfortable games or play with friends')
    }
    
    return suggestions
  }

  getOverallSentiment(score) {
    if (score > 2) return 'positive'
    if (score < -2) return 'negative'
    return 'neutral'
  }

  analyzeMoodPatterns(moodData) {
    const patterns = {
      energy_stress_ratio: moodData.energy_level / (moodData.stress_level || 1),
      social_engagement: moodData.social_desire,
      challenge_preference: moodData.challenge_seeking,
      focus_level: moodData.focus_level
    }
    
    return patterns
  }

  generateMoodInsights(moodData, patterns) {
    const insights = []
    
    if (patterns.energy_stress_ratio > 2) {
      insights.push('You have high energy with low stress - great for action games!')
    } else if (patterns.energy_stress_ratio < 0.5) {
      insights.push('You might be feeling stressed - consider relaxing games')
    }
    
    if (patterns.social_engagement > 7) {
      insights.push('You\'re feeling social - try multiplayer games!')
    } else if (patterns.social_engagement < 3) {
      insights.push('You prefer solo gaming today - single-player games might be perfect')
    }
    
    if (patterns.challenge_preference > 7) {
      insights.push('You\'re seeking challenge - try difficult or competitive games')
    } else if (patterns.challenge_preference < 3) {
      insights.push('You prefer easier games today - casual or puzzle games might be ideal')
    }
    
    return insights
  }

  generateMoodRecommendations(moodData) {
    const recommendations = []
    
    // Energy-based recommendations
    if (moodData.energy_level > 7) {
      recommendations.push('High energy - try action or sports games')
    } else if (moodData.energy_level < 4) {
      recommendations.push('Low energy - try puzzle or strategy games')
    }
    
    // Stress-based recommendations
    if (moodData.stress_level > 7) {
      recommendations.push('High stress - try calming games like Stardew Valley or Animal Crossing')
    } else if (moodData.stress_level < 4) {
      recommendations.push('Low stress - you can handle more intense games')
    }
    
    // Focus-based recommendations
    if (moodData.focus_level > 7) {
      recommendations.push('High focus - try complex strategy or puzzle games')
    } else if (moodData.focus_level < 4) {
      recommendations.push('Low focus - try simple, casual games')
    }
    
    return recommendations
  }

  getDefaultMoodAnalysis() {
    return {
      overall_sentiment: 'neutral',
      confidence: 0.5,
      emotions: {
        joy: 0.2,
        sadness: 0.2,
        anger: 0.2,
        fear: 0.2,
        surprise: 0.2
      },
      mood_score: 5,
      keywords: [],
      suggestions: ['Try describing your mood in more detail for better analysis']
    }
  }
}

export default new MoodAnalysisService()
