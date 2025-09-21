import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/redux'

interface AccessibilityContextType {
  isHighContrast: boolean
  isReducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large'
  isScreenReader: boolean
  isKeyboardNavigation: boolean
  setHighContrast: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  setScreenReader: (value: boolean) => void
  setKeyboardNavigation: (value: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { accessibility_settings } = useAppSelector((state) => state.user.user || { accessibility_settings: {} })
  
  const [isHighContrast, setIsHighContrast] = useState(
    (accessibility_settings as any)?.high_contrast || false
  )
  const [isReducedMotion, setIsReducedMotion] = useState(
    (accessibility_settings as any)?.reduced_motion || false
  )
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>(
    (accessibility_settings as any)?.font_size || 'medium'
  )
  const [isScreenReader, setIsScreenReader] = useState(
    (accessibility_settings as any)?.screen_reader || false
  )
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false)

  useEffect(() => {
    // Apply high contrast mode
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isHighContrast])

  useEffect(() => {
    // Apply reduced motion
    if (isReducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  }, [isReducedMotion])

  useEffect(() => {
    // Apply font size
    document.documentElement.setAttribute('data-font-size', fontSize)
  }, [fontSize])

  useEffect(() => {
    // Detect screen reader usage
    const detectScreenReader = () => {
      const hasScreenReader = 
        window.navigator.userAgent.includes('NVDA') ||
        window.navigator.userAgent.includes('JAWS') ||
        window.navigator.userAgent.includes('VoiceOver') ||
        window.navigator.userAgent.includes('TalkBack') ||
        window.speechSynthesis?.getVoices().length > 0
      
      setIsScreenReader(hasScreenReader)
    }

    detectScreenReader()
    window.addEventListener('load', detectScreenReader)
    return () => window.removeEventListener('load', detectScreenReader)
  }, [])

  useEffect(() => {
    // Keyboard navigation detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardNavigation(true)
        document.body.classList.add('keyboard-navigation')
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false)
      document.body.classList.remove('keyboard-navigation')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const setHighContrast = (value: boolean) => {
    setIsHighContrast(value)
    localStorage.setItem('accessibility-high-contrast', value.toString())
  }

  const setReducedMotion = (value: boolean) => {
    setIsReducedMotion(value)
    localStorage.setItem('accessibility-reduced-motion', value.toString())
  }

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size)
    localStorage.setItem('accessibility-font-size', size)
  }

  const setScreenReader = (value: boolean) => {
    setIsScreenReader(value)
    localStorage.setItem('accessibility-screen-reader', value.toString())
  }

  const setKeyboardNavigation = (value: boolean) => {
    setIsKeyboardNavigation(value)
  }

  const value: AccessibilityContextType = {
    isHighContrast,
    isReducedMotion,
    fontSize,
    isScreenReader,
    isKeyboardNavigation,
    setHighContrast,
    setReducedMotion,
    setFontSize,
    setScreenReader,
    setKeyboardNavigation,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}
