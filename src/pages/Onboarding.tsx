import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Gamepad2, Heart, Brain, Users, Target } from 'lucide-react'
import { useAppDispatch } from '../hooks/redux'
import { createUserProfile } from '../store/slices/userSlice'
import { Platform, Genre, WellnessGoal } from '../types'

const platforms: Platform[] = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Web Browser']
const genres: Genre[] = ['Action', 'Adventure', 'RPG', 'Strategy', 'Puzzle', 'Simulation', 'Sports', 'Racing', 'Fighting', 'Shooter', 'Platformer', 'Indie', 'Casual', 'Educational', 'Horror', 'Survival']
const wellnessGoals: WellnessGoal[] = ['mood_improvement', 'stress_management', 'balanced_gaming', 'mindful_breaks', 'social_connection', 'focus_enhancement', 'creativity_boost', 'relaxation'] as const

export default function OnboardingPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    preferred_platforms: [] as Platform[],
    favorite_genres: [] as Genre[],
    wellness_goals: [] as WellnessGoal[],
    accessibility_needs: [] as string[]
  })
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { title: 'Welcome', description: 'Let\'s set up your gaming wellness profile' },
    { title: 'Platforms', description: 'Choose your gaming platforms' },
    { title: 'Genres', description: 'Select your favorite game genres' },
    { title: 'Goals', description: 'What wellness goals do you have?' },
    { title: 'Accessibility', description: 'Any accessibility needs?' },
    { title: 'Complete', description: 'You\'re all set!' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      await dispatch(createUserProfile(formData)).unwrap()
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to create profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleArrayItem = (array: any[], item: any, setter: (items: any[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to GameMood AI!</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Let's create your personalized gaming wellness profile. This will help us recommend 
                the perfect games for your mood and wellness goals.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <Check className="w-5 h-5 text-green-500" />
                <span>AI-powered mood analysis</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Check className="w-5 h-5 text-green-500" />
                <span>Personalized game recommendations</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Check className="w-5 h-5 text-green-500" />
                <span>Wellness tracking and insights</span>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Gaming Platforms</h2>
              <p className="text-gray-600">Which platforms do you game on?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => toggleArrayItem(formData.preferred_platforms, platform, (items) => 
                    setFormData({ ...formData, preferred_platforms: items })
                  )}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.preferred_platforms.includes(platform)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">
                    {platform === 'PC' && '💻'}
                    {platform === 'PlayStation' && '🎮'}
                    {platform === 'Xbox' && '🎯'}
                    {platform === 'Nintendo Switch' && '🕹️'}
                    {platform === 'Mobile' && '📱'}
                    {platform === 'Web Browser' && '🌐'}
                  </div>
                  <div className="font-medium">{platform}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Favorite Genres</h2>
              <p className="text-gray-600">What types of games do you enjoy?</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleArrayItem(formData.favorite_genres, genre, (items) => 
                    setFormData({ ...formData, favorite_genres: items })
                  )}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    formData.favorite_genres.includes(genre)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm">{genre}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Wellness Goals</h2>
              <p className="text-gray-600">What would you like to achieve with gaming?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wellnessGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleArrayItem(formData.wellness_goals, goal, (items) => 
                    setFormData({ ...formData, wellness_goals: items })
                  )}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData.wellness_goals.includes(goal)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium capitalize">
                      {goal.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Accessibility Needs</h2>
              <p className="text-gray-600">Any accessibility preferences for your gaming experience?</p>
            </div>
            <div className="space-y-4">
              {[
                'colorblind_support',
                'subtitle_required',
                'one_handed_controls',
                'motion_sensitivity',
                'screen_reader',
                'anxiety_accommodations',
                'adhd_accommodations',
                'autism_accommodations'
              ].map((need) => (
                <label key={need} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accessibility_needs.includes(need)}
                    onChange={() => toggleArrayItem(formData.accessibility_needs, need, (items) => 
                      setFormData({ ...formData, accessibility_needs: items })
                    )}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="font-medium capitalize">
                    {need.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">You're All Set!</h2>
              <p className="text-gray-600 text-lg">
                Your gaming wellness profile has been created. Let's start your journey!
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-3">Profile Summary:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Platforms:</strong> {formData.preferred_platforms.join(', ') || 'None selected'}</p>
                <p><strong>Genres:</strong> {formData.favorite_genres.slice(0, 3).join(', ')}{formData.favorite_genres.length > 3 && '...'}</p>
                <p><strong>Goals:</strong> {formData.wellness_goals.slice(0, 3).join(', ')}{formData.wellness_goals.length > 3 && '...'}</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/10 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-white">
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-gray-300">
              {steps[currentStep].description}
            </p>
          </CardHeader>
          <CardContent className="pb-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="gaming-button"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Creating Profile...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gaming-button"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
