import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Eye, 
  Ear, 
  Hand, 
  Heart, 
  Zap, 
  Shield, 
  Clock,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Palette,
  Focus,
  Users
} from 'lucide-react'

interface NeurodivergentSupportProps {
  onSettingsChange?: (settings: NeurodivergentSettings) => void
}

interface NeurodivergentSettings {
  autism_support: {
    clear_visual_hierarchy: boolean
    reduced_sensory_overload: boolean
    predictable_navigation: boolean
    social_interaction_cues: boolean
    routine_based_reminders: boolean
  }
  adhd_support: {
    focus_enhancement: boolean
    task_breakdown: boolean
    attention_reminders: boolean
    hyperfocus_protection: boolean
    executive_function_aids: boolean
  }
  anxiety_support: {
    calming_visuals: boolean
    stress_reduction_mode: boolean
    gradual_exposure: boolean
    breathing_exercises: boolean
    safe_spaces: boolean
  }
  dyslexia_support: {
    font_optimization: boolean
    reading_assistance: boolean
    visual_processing_aids: boolean
    text_simplification: boolean
    audio_alternatives: boolean
  }
}

export default function NeurodivergentSupport({ onSettingsChange }: NeurodivergentSupportProps) {
  const [settings, setSettings] = useState<NeurodivergentSettings>({
    autism_support: {
      clear_visual_hierarchy: true,
      reduced_sensory_overload: true,
      predictable_navigation: true,
      social_interaction_cues: false,
      routine_based_reminders: true
    },
    adhd_support: {
      focus_enhancement: true,
      task_breakdown: true,
      attention_reminders: true,
      hyperfocus_protection: true,
      executive_function_aids: true
    },
    anxiety_support: {
      calming_visuals: true,
      stress_reduction_mode: true,
      gradual_exposure: false,
      breathing_exercises: true,
      safe_spaces: true
    },
    dyslexia_support: {
      font_optimization: true,
      reading_assistance: true,
      visual_processing_aids: true,
      text_simplification: false,
      audio_alternatives: true
    }
  })

  const [activeTab, setActiveTab] = useState('autism')
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  useEffect(() => {
    onSettingsChange?.(settings)
  }, [settings, onSettingsChange])

  const updateSetting = (category: keyof NeurodivergentSettings, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const speakText = (text: string) => {
    if (isAudioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.7
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const supportCategories = [
    {
      id: 'autism',
      title: 'Autism Support',
      icon: Brain,
      color: 'blue',
      description: 'Features to support autistic users',
      settings: settings.autism_support
    },
    {
      id: 'adhd',
      title: 'ADHD Support',
      icon: Focus,
      color: 'green',
      description: 'Tools for attention and focus management',
      settings: settings.adhd_support
    },
    {
      id: 'anxiety',
      title: 'Anxiety Support',
      icon: Heart,
      color: 'purple',
      description: 'Calming and stress-reduction features',
      settings: settings.anxiety_support
    },
    {
      id: 'dyslexia',
      title: 'Dyslexia Support',
      icon: Eye,
      color: 'orange',
      description: 'Reading and text processing assistance',
      settings: settings.dyslexia_support
    }
  ]

  const getSettingDescription = (category: string, setting: string) => {
    const descriptions: Record<string, Record<string, string>> = {
      autism_support: {
        clear_visual_hierarchy: 'Use clear visual structure and consistent layouts',
        reduced_sensory_overload: 'Minimize overwhelming visual and audio elements',
        predictable_navigation: 'Maintain consistent navigation patterns',
        social_interaction_cues: 'Provide hints for social interactions',
        routine_based_reminders: 'Send reminders based on established routines'
      },
      adhd_support: {
        focus_enhancement: 'Highlight important elements and reduce distractions',
        task_breakdown: 'Break complex tasks into smaller, manageable steps',
        attention_reminders: 'Gentle reminders to refocus when attention wanders',
        hyperfocus_protection: 'Warn about excessive gaming sessions',
        executive_function_aids: 'Tools to help with planning and organization'
      },
      anxiety_support: {
        calming_visuals: 'Use soothing colors and gentle animations',
        stress_reduction_mode: 'Simplify interface during high-stress periods',
        gradual_exposure: 'Slowly introduce new features to reduce overwhelm',
        breathing_exercises: 'Integrate breathing and mindfulness exercises',
        safe_spaces: 'Create designated areas for relaxation and comfort'
      },
      dyslexia_support: {
        font_optimization: 'Use dyslexia-friendly fonts and spacing',
        reading_assistance: 'Highlight text and provide reading guides',
        visual_processing_aids: 'Use visual cues to support text comprehension',
        text_simplification: 'Simplify complex language and instructions',
        audio_alternatives: 'Provide audio versions of text content'
      }
    }
    return descriptions[category]?.[setting] || 'Accessibility feature'
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
            Neurodivergent Support
          </h2>
          <p className="text-gray-600">
            Customize your experience to support your unique needs and preferences
          </p>
        </motion.div>
      </div>

      {/* Quick Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              variant={isAudioEnabled ? "default" : "outline"}
              size="sm"
            >
              {isAudioEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
              Audio {isAudioEnabled ? 'On' : 'Off'}
            </Button>
            
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <Button
                onClick={() => setCurrentTheme('light')}
                variant={currentTheme === 'light' ? "default" : "outline"}
                size="sm"
              >
                Light
              </Button>
              <Button
                onClick={() => setCurrentTheme('dark')}
                variant={currentTheme === 'dark' ? "default" : "outline"}
                size="sm"
              >
                <Moon className="w-4 h-4 mr-1" />
                Dark
              </Button>
              <Button
                onClick={() => setCurrentTheme('auto')}
                variant={currentTheme === 'auto' ? "default" : "outline"}
                size="sm"
              >
                Auto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          {supportCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              <category.icon className="w-4 h-4 mr-2" />
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {supportCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${category.color}-500`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span>{category.title}</span>
                    <p className="text-sm text-gray-600 font-normal mt-1">
                      {category.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(category.settings).map(([setting, value]) => (
                    <div key={setting} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-800 capitalize">
                            {setting.replace(/_/g, ' ')}
                          </h4>
                          {value && (
                            <Badge variant="gaming" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {getSettingDescription(`${category.id}_support`, setting)}
                        </p>
                        <Button
                          onClick={() => speakText(getSettingDescription(`${category.id}_support`, setting))}
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          disabled={!isAudioEnabled}
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          Listen
                        </Button>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting(
                            `${category.id}_support` as keyof NeurodivergentSettings,
                            setting,
                            e.target.checked
                          )}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Support Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportCategories.map((category) => {
              const activeCount = Object.values(category.settings).filter(Boolean).length
              const totalCount = Object.keys(category.settings).length
              return (
                <div key={category.id} className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {activeCount}/{totalCount}
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.title} Features
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
