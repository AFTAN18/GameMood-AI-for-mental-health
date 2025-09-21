import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Heart, 
  Zap, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  Lightbulb,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Gamepad2,
  BookOpen,
  Activity
} from 'lucide-react'
import { useAppSelector } from '../../hooks/redux'

interface WellnessInsight {
  id: string
  type: 'tip' | 'warning' | 'achievement' | 'recommendation'
  title: string
  message: string
  action?: string
  priority: 'low' | 'medium' | 'high'
  category: 'mood' | 'gaming' | 'wellness' | 'social'
  timestamp: Date
}

interface WellnessGoal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline?: Date
  isAchieved: boolean
}

export default function AIWellnessCoach() {
  const { user } = useAppSelector((state) => state.user)
  const { metrics } = useAppSelector((state) => state.wellness)
  const [insights, setInsights] = useState<WellnessInsight[]>([])
  const [goals, setGoals] = useState<WellnessGoal[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('insights')

  useEffect(() => {
    generateInsights()
    loadGoals()
  }, [metrics])

  const generateInsights = async () => {
    setIsGenerating(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newInsights: WellnessInsight[] = [
      {
        id: '1',
        type: 'tip',
        title: 'Mood Improvement Detected',
        message: 'Your mood scores have improved by 15% this week. Keep up the great work with your gaming wellness routine!',
        action: 'View detailed analytics',
        priority: 'medium',
        category: 'mood',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Try Puzzle Games',
        message: 'Based on your stress levels, puzzle games like Tetris or Sudoku could help you relax and focus.',
        action: 'Browse puzzle games',
        priority: 'high',
        category: 'gaming',
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'achievement',
        title: '7-Day Streak!',
        message: 'Congratulations! You\'ve maintained your wellness tracking for 7 consecutive days.',
        action: 'Share achievement',
        priority: 'high',
        category: 'wellness',
        timestamp: new Date()
      },
      {
        id: '4',
        type: 'warning',
        title: 'Long Gaming Session',
        message: 'You\'ve been gaming for 3+ hours. Consider taking a break to maintain your wellness balance.',
        action: 'Take a break',
        priority: 'high',
        category: 'gaming',
        timestamp: new Date()
      }
    ]
    
    setInsights(newInsights)
    setIsGenerating(false)
  }

  const loadGoals = () => {
    const sampleGoals: WellnessGoal[] = [
      {
        id: '1',
        title: 'Daily Mood Tracking',
        description: 'Track your mood every day for better self-awareness',
        target: 30,
        current: 7,
        unit: 'days',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isAchieved: false
      },
      {
        id: '2',
        title: 'Balanced Gaming',
        description: 'Maintain a healthy balance between gaming and other activities',
        target: 5,
        current: 3,
        unit: 'hours per day',
        isAchieved: false
      },
      {
        id: '3',
        title: 'Social Gaming',
        description: 'Play multiplayer games with friends at least once a week',
        target: 4,
        current: 2,
        unit: 'sessions per month',
        isAchieved: false
      }
    ]
    setGoals(sampleGoals)
  }

  const getInsightIcon = (type: WellnessInsight['type']) => {
    switch (type) {
      case 'tip': return Lightbulb
      case 'warning': return AlertCircle
      case 'achievement': return Star
      case 'recommendation': return Target
      default: return MessageCircle
    }
  }

  const getInsightColor = (type: WellnessInsight['type']) => {
    switch (type) {
      case 'tip': return 'text-blue-500'
      case 'warning': return 'text-red-500'
      case 'achievement': return 'text-yellow-500'
      case 'recommendation': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityColor = (priority: WellnessInsight['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            AI Wellness Coach
          </h2>
          <p className="text-gray-600">
            Your personalized AI assistant for gaming wellness and mental health
          </p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{insights.length}</div>
            <div className="text-sm opacity-90">Active Insights</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{goals.length}</div>
            <div className="text-sm opacity-90">Wellness Goals</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">85%</div>
            <div className="text-sm opacity-90">Wellness Score</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm opacity-90">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                AI Insights
              </CardTitle>
              <Button
                onClick={generateInsights}
                disabled={isGenerating}
                size="sm"
                variant="outline"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
                    />
                    Analyzing...
                  </>
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {insights.map((insight, index) => {
                  const Icon = getInsightIcon(insight.type)
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-white ${getInsightColor(insight.type)}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                                <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                                  {insight.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{insight.message}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {insight.timestamp.toLocaleTimeString()}
                                </span>
                                {insight.action && (
                                  <Button size="sm" variant="outline" className="text-xs">
                                    {insight.action}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Wellness Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                      <Badge variant={goal.isAchieved ? "gaming" : "outline"}>
                        {goal.isAchieved ? 'Achieved' : 'In Progress'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        />
                      </div>
                      {goal.deadline && (
                        <div className="text-xs text-gray-500">
                          Deadline: {goal.deadline.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <Gamepad2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800 mb-1">Gaming Balance</h4>
              <p className="text-sm text-gray-600">Try 30-minute gaming sessions with 10-minute breaks</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800 mb-1">Social Gaming</h4>
              <p className="text-sm text-gray-600">Join a gaming community to enhance social connections</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800 mb-1">Mindful Gaming</h4>
              <p className="text-sm text-gray-600">Practice mindfulness before and after gaming sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
