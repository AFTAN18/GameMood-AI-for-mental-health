import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Send, Loader2, CheckCircle } from 'lucide-react'
import { useAppDispatch } from '../../hooks/redux'
import { analyzeMoodText } from '../../store/slices/moodSlice'
import { MoodAnalysisResponse } from '../../types'

interface MoodTextAnalysisProps {
  onAnalysisComplete: (analysis: MoodAnalysisResponse) => void
}

export default function MoodTextAnalysis({ onAnalysisComplete }: MoodTextAnalysisProps) {
  const dispatch = useAppDispatch()
  const [text, setText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<MoodAnalysisResponse | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await dispatch(analyzeMoodText({
        text: text.trim(),
        context: getTimeContext(),
        user_history: []
      })).unwrap()

      setAnalysis(result)
      onAnalysisComplete(result)
    } catch (error) {
      console.error('Failed to analyze mood text:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getTimeContext = () => {
    const hour = new Date().getHours()
    if (hour < 6) return 'late_night'
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }

  const getSentimentColor = (score: number) => {
    if (score >= 0.5) return 'text-green-500'
    if (score >= 0) return 'text-blue-500'
    if (score >= -0.5) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSentimentEmoji = (score: number) => {
    if (score >= 0.5) return '😊'
    if (score >= 0) return '🙂'
    if (score >= -0.5) return '😐'
    return '😔'
  }

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>Describe Your Mood</span>
              <p className="text-sm text-gray-300 font-normal mt-1">
                Tell me how you're feeling and I'll analyze it for you
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I'm feeling excited about trying new games today, but also a bit stressed from work. I want something that can help me relax and unwind..."
              className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isAnalyzing}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {text.length}/500 characters
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
                className="gaming-button"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Analyze My Mood
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span>Mood Analysis Complete</span>
                  <p className="text-sm text-gray-300 font-normal mt-1">
                    Here's what I found about your emotional state
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Sentiment Score */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl">{getSentimentEmoji(analysis.sentiment_score)}</span>
                    <span className={`text-2xl font-bold ${getSentimentColor(analysis.sentiment_score)}`}>
                      {analysis.sentiment_score > 0 ? '+' : ''}{analysis.sentiment_score.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-300">Sentiment Score</p>
                </div>

                {/* Mood Dimensions */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Mood Dimensions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysis.mood_dimensions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300 capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${(Number(value) / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-semibold w-8 text-right">
                            {Number(value)}/10
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emotional Keywords */}
                {analysis.emotional_keywords.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Detected Emotions</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.emotional_keywords.map((keyword, index) => (
                        <Badge key={index} variant="gaming" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Activities */}
                {analysis.recommended_activities.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Recommended Activities</h4>
                    <div className="space-y-2">
                      {analysis.recommended_activities.map((activity, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Supportive Message */}
                {analysis.supportive_message && (
                  <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
                    <p className="text-white text-center font-medium">
                      {analysis.supportive_message}
                    </p>
                  </div>
                )}

                {/* Confidence Score */}
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Analysis Confidence</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">
                      {Math.round(analysis.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

