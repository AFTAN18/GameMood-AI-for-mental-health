import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { motion } from 'framer-motion'
import { Heart, Brain, Target, Award, TrendingUp, Calendar, Clock, Zap, Users, Activity } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { loadWellnessMetrics, loadWellnessGoals, loadAchievements } from '../store/slices/wellnessSlice'

export default function WellnessPage() {
  const dispatch = useAppDispatch()
  const { metrics, goals, achievements, currentStreak, totalScore } = useAppSelector((state) => state.wellness)
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        dispatch(loadWellnessMetrics()),
        dispatch(loadWellnessGoals()),
        dispatch(loadAchievements())
      ])
    } catch (error) {
      console.error('Failed to load wellness data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getWellnessLevel = (score: number) => {
    if (score >= 8) return { level: 'Excellent', color: 'text-green-500', emoji: '🌟' }
    if (score >= 6) return { level: 'Good', color: 'text-blue-500', emoji: '👍' }
    if (score >= 4) return { level: 'Fair', color: 'text-yellow-500', emoji: '👌' }
    return { level: 'Needs Improvement', color: 'text-red-500', emoji: '💪' }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">Loading your wellness data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Wellness Center
            </h1>
            <p className="text-gray-600">
              Track your gaming wellness journey and achieve your goals
            </p>
          </div>
        </motion.div>

        {/* Wellness Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Wellness Score</p>
                  <p className="text-3xl font-bold">{totalScore}</p>
                </div>
                <Heart className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Current Streak</p>
                  <p className="text-3xl font-bold">{currentStreak} days</p>
                </div>
                <Zap className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Goals Active</p>
                  <p className="text-3xl font-bold">{goals.length}</p>
                </div>
                <Target className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Achievements</p>
                  <p className="text-3xl font-bold">{achievements.length}</p>
                </div>
                <Award className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Recent Metrics */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Wellness Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {metrics.slice(0, 6).map((metric, index) => {
                        const wellnessLevel = getWellnessLevel(metric.overall_wellness_score)
                        return (
                          <Card key={metric.id} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  {new Date(metric.date).toLocaleDateString()}
                                </span>
                                <span className="text-2xl">{wellnessLevel.emoji}</span>
                              </div>
                              <div className={`text-2xl font-bold ${wellnessLevel.color} mb-1`}>
                                {metric.overall_wellness_score.toFixed(1)}/10
                              </div>
                              <div className="text-sm text-gray-600">
                                {wellnessLevel.level}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="goals" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">Your Wellness Goals</h3>
                    <Button className="gaming-button">
                      <Target className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>
                  
                  {goals.length === 0 ? (
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-8 text-center">
                        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Goals Yet</h4>
                        <p className="text-gray-500 mb-4">Set your first wellness goal to start tracking your progress.</p>
                        <Button className="gaming-button">
                          Create Your First Goal
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {goals.map((goal) => (
                        <Card key={goal.id} className="bg-white border-gray-200">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-800">{goal.title}</h4>
                                <p className="text-gray-600">{goal.description}</p>
                              </div>
                              <Badge variant={goal.is_achieved ? "gaming" : "outline"}>
                                {goal.is_achieved ? "Achieved" : "In Progress"}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold">
                                  {goal.current_value} / {goal.target_value} {goal.unit}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Your Achievements</h3>
                  
                  {achievements.length === 0 ? (
                    <Card className="bg-gray-50 border-gray-200">
                      <CardContent className="p-8 text-center">
                        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-600 mb-2">No Achievements Yet</h4>
                        <p className="text-gray-500">Keep using GameMood AI to unlock achievements!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <Card key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                          <CardContent className="p-6 text-center">
                            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">{achievement.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                            <div className="text-xs text-gray-500">
                              Earned on {new Date(achievement.earned_date).toLocaleDateString()}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">Wellness Insights</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                          <h4 className="text-lg font-semibold text-blue-800">Trend Analysis</h4>
                        </div>
                        <p className="text-blue-700">
                          Your wellness score has improved by 15% over the last month. 
                          Keep up the great work with your gaming wellness routine!
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Activity className="w-6 h-6 text-green-600" />
                          <h4 className="text-lg font-semibold text-green-800">Activity Pattern</h4>
                        </div>
                        <p className="text-green-700">
                          You're most active with wellness tracking on weekday evenings. 
                          Consider adding morning check-ins for better balance.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Brain className="w-6 h-6 text-purple-600" />
                          <h4 className="text-lg font-semibold text-purple-800">Mood Insights</h4>
                        </div>
                        <p className="text-purple-700">
                          Puzzle and simulation games seem to have the most positive impact 
                          on your mood. Consider exploring more games in these genres.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Users className="w-6 h-6 text-orange-600" />
                          <h4 className="text-lg font-semibold text-orange-800">Social Gaming</h4>
                        </div>
                        <p className="text-orange-700">
                          You tend to feel more energized after social gaming sessions. 
                          Try scheduling more multiplayer gaming time with friends.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
