export { cn } from './cn'

// URL utilities
export const createPageUrl = (page: string) => {
  return `/${page.toLowerCase()}`
}

// Date utilities
export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatDateTime = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatRelativeTime = (date: string | Date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }

  return formatDate(date)
}

// Mood utilities
export const calculateMoodScore = (moodEntry: {
  energy_level: number
  stress_level: number
  focus_level: number
  social_desire: number
  challenge_seeking: number
}) => {
  const { energy_level, stress_level, focus_level, social_desire, challenge_seeking } = moodEntry
  // Invert stress level (higher stress = lower mood)
  const invertedStress = 10 - stress_level
  return (energy_level + invertedStress + focus_level + social_desire + challenge_seeking) / 5
}

export const getMoodCategory = (moodScore: number) => {
  if (moodScore >= 8) return 'excellent'
  if (moodScore >= 6) return 'good'
  if (moodScore >= 4) return 'fair'
  return 'poor'
}

export const getMoodColor = (moodScore: number) => {
  if (moodScore >= 8) return 'text-green-500'
  if (moodScore >= 6) return 'text-blue-500'
  if (moodScore >= 4) return 'text-yellow-500'
  return 'text-red-500'
}

export const getMoodEmoji = (moodScore: number) => {
  if (moodScore >= 8) return '😊'
  if (moodScore >= 6) return '🙂'
  if (moodScore >= 4) return '😐'
  return '😔'
}

// Game utilities
export const formatPlayTime = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export const getPlatformIcon = (platform: string) => {
  const icons: Record<string, string> = {
    'PC': '💻',
    'PlayStation': '🎮',
    'Xbox': '🎯',
    'Nintendo Switch': '🕹️',
    'Mobile': '📱',
    'Web Browser': '🌐',
  }
  return icons[platform] || '🎮'
}

export const getGenreIcon = (genre: string) => {
  const icons: Record<string, string> = {
    'Action': '⚔️',
    'Adventure': '🗺️',
    'RPG': '⚔️',
    'Strategy': '♟️',
    'Puzzle': '🧩',
    'Simulation': '🏗️',
    'Sports': '⚽',
    'Racing': '🏎️',
    'Fighting': '👊',
    'Shooter': '🔫',
    'Platformer': '🦘',
    'Indie': '🎨',
    'Casual': '😌',
    'Educational': '📚',
    'Horror': '👻',
    'Survival': '🏕️',
  }
  return icons[genre] || '🎮'
}

// Wellness utilities
export const calculateWellnessStreak = (metrics: Array<{ date: string; overall_wellness_score: number }>) => {
  if (metrics.length === 0) return 0

  let streak = 0
  const today = new Date().toISOString().split('T')[0]
  const sortedMetrics = metrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  for (const metric of sortedMetrics) {
    if (metric.overall_wellness_score >= 7) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export const getWellnessLevel = (score: number) => {
  if (score >= 8) return { level: 'Excellent', color: 'text-green-500', emoji: '🌟' }
  if (score >= 6) return { level: 'Good', color: 'text-blue-500', emoji: '👍' }
  if (score >= 4) return { level: 'Fair', color: 'text-yellow-500', emoji: '👌' }
  return { level: 'Needs Improvement', color: 'text-red-500', emoji: '💪' }
}

// Accessibility utilities
export const getAccessibilityIcon = (feature: string) => {
  const icons: Record<string, string> = {
    'colorblind_friendly': '🌈',
    'subtitle_support': '📝',
    'one_handed_play': '✋',
    'low_motion': '🌊',
    'screen_reader_compatible': '👁️',
    'adjustable_difficulty': '⚙️',
    'pause_friendly': '⏸️',
    'adhd_friendly': '🧠',
    'anxiety_friendly': '🤗',
  }
  return icons[feature] || '♿'
}

// Validation utilities
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string) => {
  return password.length >= 8
}

// Local storage utilities
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export const setToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to remove from localStorage:', error)
  }
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Random utilities
export const generateId = () => {
  return crypto.randomUUID()
}

export const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

