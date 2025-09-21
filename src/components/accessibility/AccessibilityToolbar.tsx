import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Accessibility, 
  Eye, 
  Type, 
  Volume2, 
  Keyboard, 
  Settings,
  ChevronDown,
  ChevronUp,
  Contrast,
  Zap,
  Text,
  Mic
} from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'

export default function AccessibilityToolbar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    isHighContrast,
    isReducedMotion,
    fontSize,
    isScreenReader,
    isKeyboardNavigation,
    setHighContrast,
    setReducedMotion,
    setFontSize,
    setScreenReader,
  } = useAccessibility()

  const toggleExpanded = () => setIsExpanded(!isExpanded)

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const accessibilityFeatures = [
    {
      id: 'high-contrast',
      label: 'High Contrast',
      icon: Contrast,
      active: isHighContrast,
      toggle: () => setHighContrast(!isHighContrast),
      description: 'Increase contrast for better visibility'
    },
    {
      id: 'reduced-motion',
      label: 'Reduced Motion',
      icon: Zap,
      active: isReducedMotion,
      toggle: () => setReducedMotion(!isReducedMotion),
      description: 'Reduce animations and motion effects'
    },
    {
      id: 'font-size',
      label: 'Font Size',
      icon: Type,
      active: false,
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      current: fontSize,
      onChange: (value: 'small' | 'medium' | 'large') => setFontSize(value),
      description: 'Adjust text size for better readability'
    },
    {
      id: 'screen-reader',
      label: 'Screen Reader',
      icon: Volume2,
      active: isScreenReader,
      toggle: () => setScreenReader(!isScreenReader),
      description: 'Optimize for screen reader usage'
    }
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardContent className="p-0">
          {/* Toolbar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Accessibility className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Accessibility</h3>
                <p className="text-xs text-gray-600">Customize your experience</p>
              </div>
            </div>
            <Button
              onClick={toggleExpanded}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
              aria-label={isExpanded ? 'Collapse toolbar' : 'Expand toolbar'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>

          {/* Accessibility Features */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {accessibilityFeatures.map((feature) => (
                    <div key={feature.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <feature.icon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {feature.label}
                          </span>
                          {feature.active && (
                            <Badge variant="gaming" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        {feature.toggle && (
                          <Button
                            onClick={feature.toggle}
                            variant={feature.active ? "default" : "outline"}
                            size="sm"
                            className="text-xs"
                          >
                            {feature.active ? 'On' : 'Off'}
                          </Button>
                        )}
                      </div>
                      
                      {feature.options && (
                        <div className="flex gap-2">
                          {feature.options.map((option) => (
                            <Button
                              key={option.value}
                              onClick={() => feature.onChange?.(option.value as 'small' | 'medium' | 'large')}
                              variant={feature.current === option.value ? "default" : "outline"}
                              size="sm"
                              className="text-xs"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  ))}

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => speakText('Welcome to GameMood AI. This is a gaming wellness platform.')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Mic className="w-3 h-3 mr-1" />
                        Test Audio
                      </Button>
                      <Button
                        onClick={() => {
                          const focusableElements = document.querySelectorAll(
                            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                          )
                          if (focusableElements.length > 0) {
                            (focusableElements[0] as HTMLElement).focus()
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Keyboard className="w-3 h-3 mr-1" />
                        Focus First
                      </Button>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Keyboard Navigation</span>
                        <Badge variant={isKeyboardNavigation ? "gaming" : "outline"}>
                          {isKeyboardNavigation ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Screen Reader</span>
                        <Badge variant={isScreenReader ? "gaming" : "outline"}>
                          {isScreenReader ? 'Detected' : 'Not Detected'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
