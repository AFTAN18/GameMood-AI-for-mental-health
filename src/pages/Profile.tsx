import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { motion } from 'framer-motion'
import { User, Settings, Heart, Brain, Award, Gamepad2, Edit3, Save, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { updateUserProfile, updatePreferences, updateAccessibilitySettings } from '../store/slices/userSlice'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">👤</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
            <p className="text-gray-600">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Your Profile
              </h1>
              <p className="text-gray-600">
                Manage your gaming preferences and wellness settings
              </p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.display_name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="gaming" className="text-sm">
                      <Gamepad2 className="w-3 h-3 mr-1" />
                      {user.preferences.preferred_platforms.length} Platforms
                    </Badge>
                    <Badge variant="wellness" className="text-sm">
                      <Heart className="w-3 h-3 mr-1" />
                      {user.wellness_streak} Day Streak
                    </Badge>
                    <Badge variant="mood" className="text-sm">
                      <Brain className="w-3 h-3 mr-1" />
                      Score: {user.total_wellness_score}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Tabs */}
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
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-blue-800 mb-1">Mood Tracking</h3>
                        <p className="text-2xl font-bold text-blue-600">Active</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <Heart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-green-800 mb-1">Wellness Score</h3>
                        <p className="text-2xl font-bold text-green-600">{user.total_wellness_score}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-purple-800 mb-1">Current Streak</h3>
                        <p className="text-2xl font-bold text-purple-600">{user.wellness_streak} days</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Gaming Platforms</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.preferred_platforms.map((platform, index) => (
                            <Badge key={index} variant="gaming">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Favorite Genres</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.favorite_genres.map((genre, index) => (
                            <Badge key={index} variant="wellness">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="accessibility" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(user.accessibility_settings).map(([key, value]) => (
                      <Card key={key}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <Badge variant={value ? "gaming" : "outline"}>
                              {value ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-6">
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Achievements Coming Soon!</h3>
                    <p className="text-gray-600">Your gaming wellness achievements will appear here.</p>
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
