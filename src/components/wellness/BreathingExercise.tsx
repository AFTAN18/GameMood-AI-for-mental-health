import React, { useState, useEffect, useRef } from 'react'
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
  Heart,
  Wind,
  Clock,
  CheckCircle,
  Settings
} from 'lucide-react'

interface BreathingPattern {
  id: string
  name: string
  description: string
  inhale: number
  hold: number
  exhale: number
  pause: number
  cycles: number
  color: string
  icon: React.ComponentType<any>
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Calming technique for stress relief and better sleep',
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 0,
    cycles: 4,
    color: 'from-blue-500 to-cyan-500',
    icon: Heart
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Military technique for focus and concentration',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    cycles: 5,
    color: 'from-green-500 to-emerald-500',
    icon: Wind
  },
  {
    id: 'triangle',
    name: 'Triangle Breathing',
    description: 'Simple pattern for quick relaxation',
    inhale: 4,
    hold: 0,
    exhale: 4,
    pause: 0,
    cycles: 6,
    color: 'from-purple-500 to-pink-500',
    icon: Heart
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: 'Balanced breathing for emotional regulation',
    inhale: 5,
    hold: 0,
    exhale: 5,
    pause: 0,
    cycles: 6,
    color: 'from-orange-500 to-yellow-500',
    icon: Wind
  }
]

export default function BreathingExercise() {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0])
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [settings, setSettings] = useState({
    showTimer: true,
    showProgress: true,
    gentleReminders: true
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (isActive) {
      startBreathingCycle()
    } else {
      stopBreathingCycle()
    }

    return () => stopBreathingCycle()
  }, [isActive, selectedPattern])

  useEffect(() => {
    if (isAudioEnabled && audioRef.current) {
      audioRef.current.volume = 0.3
    }
  }, [isAudioEnabled])

  const startBreathingCycle = () => {
    setCurrentCycle(0)
    setCurrentPhase('inhale')
    setTimeRemaining(selectedPattern.inhale)
    setIsCompleted(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return nextPhase()
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopBreathingCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsActive(false)
  }

  const nextPhase = () => {
    const phases = ['inhale', 'hold', 'exhale', 'pause'] as const
    const currentIndex = phases.indexOf(currentPhase)
    const nextIndex = (currentIndex + 1) % phases.length
    const nextPhase = phases[nextIndex]

    setCurrentPhase(nextPhase)

    // Check if cycle is complete
    if (nextPhase === 'inhale' && currentCycle >= selectedPattern.cycles - 1) {
      setIsCompleted(true)
      stopBreathingCycle()
      return 0
    }

    // Move to next cycle
    if (nextPhase === 'inhale') {
      setCurrentCycle(prev => prev + 1)
    }

    // Set time for next phase
    switch (nextPhase) {
      case 'inhale': return selectedPattern.inhale
      case 'hold': return selectedPattern.hold
      case 'exhale': return selectedPattern.exhale
      case 'pause': return selectedPattern.pause
      default: return 0
    }
  }

  const playAudio = (phase: string) => {
    if (!isAudioEnabled || !audioRef.current) return

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Different tones for different phases
    const frequencies = {
      inhale: 220, // A3
      hold: 330,   // E4
      exhale: 165, // E3
      pause: 110   // A2
    }

    oscillator.frequency.setValueAtTime(frequencies[phase as keyof typeof frequencies] || 220, audioContext.currentTime)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  useEffect(() => {
    if (isActive && timeRemaining === selectedPattern[currentPhase]) {
      playAudio(currentPhase)
    }
  }, [currentPhase, isActive])

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe in slowly through your nose'
      case 'hold': return 'Hold your breath gently'
      case 'exhale': return 'Breathe out slowly through your mouth'
      case 'pause': return 'Rest and prepare for the next breath'
      default: return 'Follow the breathing pattern'
    }
  }

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-green-400 to-emerald-500'
      case 'hold': return 'from-blue-400 to-cyan-500'
      case 'exhale': return 'from-purple-400 to-pink-500'
      case 'pause': return 'from-gray-400 to-gray-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const resetExercise = () => {
    stopBreathingCycle()
    setCurrentCycle(0)
    setCurrentPhase('inhale')
    setTimeRemaining(selectedPattern.inhale)
    setIsCompleted(false)
  }

  const progressPercentage = (currentCycle / selectedPattern.cycles) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wind className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Breathing Exercise
          </h2>
          <p className="text-gray-600">
            Guided breathing exercises for relaxation and stress relief
          </p>
        </motion.div>
      </div>

      {/* Pattern Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Choose Breathing Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {breathingPatterns.map((pattern) => (
              <Button
                key={pattern.id}
                onClick={() => setSelectedPattern(pattern)}
                variant={selectedPattern.id === pattern.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center gap-2 ${
                  selectedPattern.id === pattern.id 
                    ? `bg-gradient-to-r ${pattern.color} text-white border-0` 
                    : 'hover:bg-gray-50'
                }`}
              >
                <pattern.icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">{pattern.name}</div>
                  <div className="text-xs opacity-80">{pattern.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Exercise */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Breathing Circle */}
            <div className="relative w-64 h-64 mx-auto">
              <motion.div
                className={`w-full h-full rounded-full bg-gradient-to-r ${getPhaseColor()} flex items-center justify-center text-white font-bold text-2xl shadow-2xl`}
                animate={{
                  scale: currentPhase === 'inhale' ? 1.2 : currentPhase === 'exhale' ? 0.8 : 1,
                  opacity: currentPhase === 'pause' ? 0.7 : 1
                }}
                transition={{
                  duration: selectedPattern[currentPhase] || 1,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold">{timeRemaining}</div>
                  <div className="text-sm capitalize">{currentPhase}</div>
                </div>
              </motion.div>
              
              {/* Progress Ring */}
              {settings.showProgress && (
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 283" }}
                    animate={{
                      strokeDasharray: `${(progressPercentage / 100) * 283} 283`
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
              )}
            </div>

            {/* Instructions */}
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {getPhaseInstructions()}
              </h3>
              <p className="text-gray-600">
                Cycle {currentCycle + 1} of {selectedPattern.cycles}
              </p>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setIsActive(!isActive)}
                className={`gaming-button ${isActive ? 'bg-red-500 hover:bg-red-600' : ''}`}
                size="lg"
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
                onClick={resetExercise}
                variant="outline"
                size="lg"
                disabled={isActive}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Audio Control */}
            <div className="flex items-center justify-center gap-2">
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
              <span className="text-sm text-gray-600">
                Audio {isAudioEnabled ? 'On' : 'Off'}
              </span>
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
                  Exercise Complete!
                </h3>
                <p className="text-gray-600 mb-4">
                  Great job! You've completed the {selectedPattern.name} breathing exercise.
                </p>
                <Button
                  onClick={resetExercise}
                  className="gaming-button"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pattern Details */}
      <Card>
        <CardHeader>
          <CardTitle>Pattern Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{selectedPattern.inhale}s</div>
              <div className="text-sm text-gray-600">Inhale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{selectedPattern.hold}s</div>
              <div className="text-sm text-gray-600">Hold</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{selectedPattern.exhale}s</div>
              <div className="text-sm text-gray-600">Exhale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{selectedPattern.pause}s</div>
              <div className="text-sm text-gray-600">Pause</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}