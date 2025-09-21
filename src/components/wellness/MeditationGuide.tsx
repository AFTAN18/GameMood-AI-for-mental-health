import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Clock,
  CheckCircle,
  Brain,
  Heart,
  Wind,
  Sun,
  Moon,
  Star,
  Leaf,
  Waves
} from 'lucide-react'

interface MeditationSession {
  id: string
  title: string
  description: string
  duration: number
  category: 'mindfulness' | 'stress-relief' | 'focus' | 'sleep' | 'gaming-balance'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: React.ComponentType<any>
  color: string
  instructions: string[]
}

const meditationSessions: MeditationSession[] = [
  {
    id: 'mindful-gaming',
    title: 'Mindful Gaming Preparation',
    description: 'Prepare your mind for a balanced gaming session',
    duration: 5,
    category: 'gaming-balance',
    difficulty: 'beginner',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    instructions: [
      'Find a comfortable seated position',
      'Close your eyes and take three deep breaths',
      'Set an intention for your gaming session',
      'Visualize yourself playing with awareness and balance',
      'Open your eyes and begin your session mindfully'
    ]
  },
  {
    id: 'stress-relief',
    title: 'Quick Stress Relief',
    description: 'A brief meditation to release tension and stress',
    duration: 10,
    category: 'stress-relief',
    difficulty: 'beginner',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    instructions: [
      'Sit comfortably with your back straight',
      'Place one hand on your heart, one on your belly',
      'Breathe deeply and feel your body relax',
      'Release any tension with each exhale',
      'Feel gratitude for this moment of peace'
    ]
  },
  {
    id: 'focus-enhancement',
    title: 'Focus Enhancement',
    description: 'Improve concentration and mental clarity',
    duration: 15,
    category: 'focus',
    difficulty: 'intermediate',
    icon: Star,
    color: 'from-purple-500 to-indigo-500',
    instructions: [
      'Sit in a comfortable position',
      'Focus your attention on your breath',
      'When your mind wanders, gently return to your breath',
      'Notice thoughts without judgment',
      'Feel your mind becoming clearer and more focused'
    ]
  },
  {
    id: 'sleep-preparation',
    title: 'Sleep Preparation',
    description: 'Wind down after gaming for better sleep',
    duration: 20,
    category: 'sleep',
    difficulty: 'beginner',
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
    instructions: [
      'Lie down comfortably in your bed',
      'Close your eyes and relax your entire body',
      'Imagine a peaceful, quiet place',
      'Let go of the day\'s activities and thoughts',
      'Drift into a restful sleep'
    ]
  },
  {
    id: 'nature-sounds',
    title: 'Nature Sounds Meditation',
    description: 'Connect with nature through guided imagery',
    duration: 12,
    category: 'mindfulness',
    difficulty: 'beginner',
    icon: Leaf,
    color: 'from-green-500 to-emerald-500',
    instructions: [
      'Find a quiet space and close your eyes',
      'Imagine yourself in a peaceful forest',
      'Listen to the sounds of nature around you',
      'Feel the fresh air and gentle breeze',
      'Return to the present moment refreshed'
    ]
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    description: 'Calming meditation with ocean imagery',
    duration: 8,
    category: 'stress-relief',
    difficulty: 'beginner',
    icon: Waves,
    color: 'from-cyan-500 to-blue-500',
    instructions: [
      'Sit comfortably and close your eyes',
      'Imagine you\'re on a peaceful beach',
      'Listen to the rhythm of ocean waves',
      'Feel the waves washing away your stress',
      'Breathe with the rhythm of the ocean'
    ]
  }
]

export default function MeditationGuide() {
  const [selectedSession, setSelectedSession] = useState<MeditationSession>(meditationSessions[0])
  const [isActive, setIsActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentInstruction, setCurrentInstruction] = useState(0)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isActive && timeRemaining === 0) {
      setIsCompleted(true)
      setIsActive(false)
    }
  }, [isActive, timeRemaining])

  useEffect(() => {
    if (isActive) {
      const instructionInterval = setInterval(() => {
        setCurrentInstruction(prev => 
          prev < selectedSession.instructions.length - 1 ? prev + 1 : prev
        )
      }, (selectedSession.duration * 60 * 1000) / selectedSession.instructions.length)
      
      return () => clearInterval(instructionInterval)
    }
  }, [isActive, selectedSession])

  const startMeditation = () => {
    setTimeRemaining(selectedSession.duration * 60)
    setCurrentInstruction(0)
    setIsActive(true)
    setIsCompleted(false)
  }

  const stopMeditation = () => {
    setIsActive(false)
  }

  const resetMeditation = () => {
    setIsActive(false)
    setTimeRemaining(0)
    setCurrentInstruction(0)
    setIsCompleted(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gaming-balance': return Brain
      case 'stress-relief': return Heart
      case 'focus': return Star
      case 'sleep': return Moon
      case 'mindfulness': return Leaf
      default: return Brain
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
            Meditation Guide
          </h2>
          <p className="text-gray-600">
            Guided meditations for gaming wellness and mental health
          </p>
        </motion.div>
      </div>

      {/* Session Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Meditation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meditationSessions.map((session) => {
              const Icon = session.icon
              const CategoryIcon = getCategoryIcon(session.category)
              return (
                <Button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  variant={selectedSession.id === session.id ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-start gap-3 text-left ${
                    selectedSession.id === session.id 
                      ? `bg-gradient-to-r ${session.color} text-white border-0` 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-semibold">{session.title}</div>
                      <div className="text-xs opacity-80">{session.description}</div>
                    </div>
                    <Badge className={`text-xs ${getDifficultyColor(session.difficulty)}`}>
                      {session.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 w-full text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <CategoryIcon className="w-3 h-3" />
                      {session.category.replace('-', ' ')}
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Meditation */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Meditation Circle */}
            <div className="relative w-64 h-64 mx-auto">
              <motion.div
                className={`w-full h-full rounded-full bg-gradient-to-r ${selectedSession.color} flex items-center justify-center text-white shadow-2xl`}
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                  opacity: isActive ? [1, 0.8, 1] : 1
                }}
                transition={{
                  duration: 4,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <selectedSession.icon className="w-16 h-16 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {isActive ? formatTime(timeRemaining) : `${selectedSession.duration}:00`}
                  </div>
                  <div className="text-sm">
                    {isActive ? 'Meditating...' : 'Ready to begin'}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Current Instruction */}
            {isActive && showInstructions && (
              <motion.div
                key={currentInstruction}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto"
              >
                <h3 className="font-semibold text-gray-800 mb-2">
                  Step {currentInstruction + 1} of {selectedSession.instructions.length}
                </h3>
                <p className="text-gray-700">
                  {selectedSession.instructions[currentInstruction]}
                </p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={isActive ? stopMeditation : startMeditation}
                className={`gaming-button ${isActive ? 'bg-red-500 hover:bg-red-600' : ''}`}
                size="lg"
                disabled={isCompleted}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetMeditation}
                variant="outline"
                size="lg"
                disabled={isActive}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Additional Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setShowInstructions(!showInstructions)}
                variant="ghost"
                size="sm"
              >
                {showInstructions ? 'Hide' : 'Show'} Instructions
              </Button>
              
              <Button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                variant="ghost"
                size="sm"
              >
                {isAudioEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Meditation Complete!
                </h3>
                <p className="text-gray-600 mb-4">
                  Great job! You've completed the {selectedSession.title} meditation.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={resetMeditation}
                    className="gaming-button"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={() => {
                      const nextIndex = (meditationSessions.findIndex(s => s.id === selectedSession.id) + 1) % meditationSessions.length
                      setSelectedSession(meditationSessions[nextIndex])
                      resetMeditation()
                    }}
                    variant="outline"
                  >
                    Next Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Details */}
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold">{selectedSession.duration} minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Difficulty</span>
              <Badge className={getDifficultyColor(selectedSession.difficulty)}>
                {selectedSession.difficulty}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-semibold capitalize">
                {selectedSession.category.replace('-', ' ')}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block mb-2">Instructions</span>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                {selectedSession.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
