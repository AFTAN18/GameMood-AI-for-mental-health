// Core Types
export interface User {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
  last_login_at?: string
  is_verified: boolean
  preferences: UserPreferences
  accessibility_settings: AccessibilitySettings
  privacy_settings: PrivacySettings
  notification_preferences: NotificationPreferences
  wellness_streak: number
  total_wellness_score: number
}

export interface UserPreferences {
  preferred_platforms: Platform[]
  favorite_genres: Genre[]
  wellness_goals: WellnessGoal[]
  timezone: string
  language: string
  theme: 'light' | 'dark' | 'auto'
}

export interface AccessibilitySettings {
  colorblind_support: boolean
  subtitle_required: boolean
  one_handed_controls: boolean
  motion_sensitivity: boolean
  screen_reader: boolean
  anxiety_accommodations: boolean
  adhd_accommodations: boolean
  autism_accommodations: boolean
  high_contrast: boolean
  reduced_motion: boolean
  font_size: 'small' | 'medium' | 'large'
  voice_control: boolean
}

export interface PrivacySettings {
  share_mood_data: boolean
  participate_in_community: boolean
  anonymous_analytics: boolean
  wellness_reminders: boolean
  data_retention_days: number
}

export interface NotificationPreferences {
  mood_check_reminders: boolean
  break_reminders: boolean
  wellness_tips: boolean
  new_recommendations: boolean
  community_updates: boolean
  achievement_notifications: boolean
  email_notifications: boolean
  push_notifications: boolean
}

// Mood Types
export interface MoodEntry {
  id: string
  user_id: string
  energy_level: number
  stress_level: number
  focus_level: number
  social_desire: number
  challenge_seeking: number
  mood_text?: string
  mood_analysis?: MoodAnalysis
  context: TimeContext
  weather_mood_factor: WeatherMood
  biometric_data?: BiometricData
  created_at: string
  updated_at: string
}

export interface MoodAnalysis {
  sentiment_score: number
  emotional_keywords: string[]
  recommended_activities: string[]
  confidence_score: number
  mood_category: MoodCategory
  intensity_level: IntensityLevel
}

export interface BiometricData {
  heart_rate?: number
  stress_level?: number
  sleep_quality?: number
  activity_level?: number
  source: 'apple_watch' | 'fitbit' | 'samsung_health' | 'manual'
}

// Game Types
export interface Game {
  id: string
  title: string
  description: string
  genres: Genre[]
  platforms: Platform[]
  mood_tags: MoodTag[]
  ideal_energy_range: EnergyRange
  stress_compatibility: StressCompatibility
  session_length: SessionLength
  accessibility_features: AccessibilityFeature[]
  wellness_rating: number
  image_url: string
  price_range: PriceRange
  release_date: string
  developer: string
  publisher: string
  esrb_rating: string
  user_rating: number
  play_count: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface GameSession {
  id: string
  user_id: string
  game_id: string
  start_mood: MoodEntry
  end_mood?: MoodEntry
  duration_minutes: number
  satisfaction_rating: number
  notes?: string
  platform_used: Platform
  achievements_unlocked: string[]
  wellness_impact_score: number
  created_at: string
  updated_at: string
}

// Recommendation Types
export interface Recommendation {
  id: string
  user_id: string
  game_id: string
  mood_entry_id: string
  algorithm_version: string
  match_score: number
  reasoning: string[]
  confidence_level: ConfidenceLevel
  created_at: string
  expires_at: string
}

export interface RecommendationRequest {
  mood_entry: MoodEntry
  preferences?: Partial<UserPreferences>
  time_available?: number
  platform_filter?: Platform[]
  genre_filter?: Genre[]
  exclude_played?: boolean
}

// Wellness Types
export interface WellnessMetrics {
  id: string
  user_id: string
  date: string
  mood_score: number
  energy_level: number
  stress_level: number
  focus_level: number
  social_satisfaction: number
  sleep_quality: number
  physical_activity: number
  gaming_balance_score: number
  overall_wellness_score: number
  notes?: string
  created_at: string
}

export interface WellnessGoalItem {
  id: string
  user_id: string
  title: string
  description: string
  category: WellnessGoalCategory
  target_value: number
  current_value: number
  unit: string
  deadline?: string
  is_achieved: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  user_id: string
  badge_type: BadgeType
  title: string
  description: string
  icon_url: string
  earned_date: string
  progress_data: Record<string, any>
  is_featured: boolean
}

// Community Types
export interface CommunityPost {
  id: string
  user_id: string
  content: string
  mood_context?: MoodEntry
  game_recommendations?: Game[]
  likes: number
  comments: Comment[]
  is_anonymous: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  likes: number
  created_at: string
}

export interface SocialConnection {
  id: string
  user_id: string
  friend_id: string
  connection_type: ConnectionType
  permissions: ConnectionPermissions
  created_at: string
}

// AI/ML Types
export interface MoodAnalysisRequest {
  text: string
  context?: TimeContext
  biometric_data?: BiometricData
  user_history?: MoodEntry[]
}

export interface MoodAnalysisResponse {
  mood_dimensions: Partial<MoodEntry>
  sentiment_score: number
  emotional_keywords: string[]
  recommended_activities: string[]
  confidence_score: number
  mood_category: MoodCategory
  intensity_level: IntensityLevel
  supportive_message: string
}

export interface RecommendationEngineConfig {
  algorithm: 'collaborative' | 'content_based' | 'hybrid' | 'neural'
  weights: {
    mood_match: number
    genre_preference: number
    platform_preference: number
    wellness_impact: number
    user_rating: number
    popularity: number
  }
  filters: {
    min_wellness_rating: number
    max_price_range: PriceRange
    exclude_genres: Genre[]
    include_platforms: Platform[]
  }
}

// Enums and Constants
export type Platform = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'Mobile' | 'Web Browser'
export type Genre = 'Action' | 'Adventure' | 'RPG' | 'Strategy' | 'Puzzle' | 'Simulation' | 'Sports' | 'Racing' | 'Fighting' | 'Shooter' | 'Platformer' | 'Indie' | 'Casual' | 'Educational' | 'Horror' | 'Survival'
export type MoodTag = 'calming' | 'energizing' | 'challenging' | 'social' | 'solo' | 'creative' | 'competitive' | 'relaxing' | 'focus-building' | 'stress-relief' | 'mindful' | 'escapist' | 'therapeutic' | 'uplifting' | 'meditative'
export type TimeContext = 'morning' | 'afternoon' | 'evening' | 'late_night'
export type WeatherMood = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'neutral'
export type MoodCategory = 'excited' | 'calm' | 'focused' | 'stressed' | 'energetic' | 'tired' | 'social' | 'introverted' | 'creative' | 'analytical'
export type IntensityLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high'
export type EnergyRange = { min: number; max: number }
export type StressCompatibility = 'low_stress_only' | 'medium_stress_ok' | 'high_stress_friendly' | 'any_stress'
export type SessionLength = 'quick_5min' | 'short_15min' | 'medium_30min' | 'long_1hour' | 'extended_2plus_hours'
export type AccessibilityFeature = 'colorblind_friendly' | 'subtitle_support' | 'one_handed_play' | 'low_motion' | 'screen_reader_compatible' | 'adjustable_difficulty' | 'pause_friendly' | 'adhd_friendly' | 'anxiety_friendly'
export type PriceRange = 'free' | 'under_10' | '10_to_30' | '30_to_60' | 'over_60'
export type ConfidenceLevel = 'low' | 'medium' | 'high' | 'very_high'
export type WellnessGoalCategory = 'mood_improvement' | 'stress_management' | 'focus_enhancement' | 'social_connection' | 'physical_health' | 'sleep_quality' | 'gaming_balance' | 'creativity' | 'relaxation'
export type WellnessGoal = 'mood_improvement' | 'stress_management' | 'balanced_gaming' | 'mindful_breaks' | 'social_connection' | 'focus_enhancement' | 'creativity_boost' | 'relaxation'
export type BadgeType = 'wellness_streak' | 'mood_consistency' | 'gaming_balance' | 'community_helper' | 'explorer' | 'achiever' | 'mentor' | 'innovator' | 'wellness_champion' | 'gaming_zen_master'
export type ConnectionType = 'friend' | 'mentor' | 'mentee' | 'wellness_buddy' | 'gaming_partner'
export type ConnectionPermissions = {
  view_mood_data: boolean
  view_gaming_activity: boolean
  send_recommendations: boolean
  view_wellness_goals: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// State Types
export interface AppState {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface MoodState {
  currentMood: MoodEntry | null
  moodHistory: MoodEntry[]
  isLoading: boolean
  error: string | null
  lastAnalysis: MoodAnalysisResponse | null
}

export interface GameState {
  games: Game[]
  featuredGames: Game[]
  userLibrary: Game[]
  currentGame: Game | null
  isLoading: boolean
  error: string | null
  filters: GameFilters
}

export interface GameFilters {
  platforms: Platform[]
  genres: Genre[]
  priceRange: PriceRange[]
  moodTags: MoodTag[]
  accessibilityFeatures: AccessibilityFeature[]
  minWellnessRating: number
  searchQuery: string
}

export interface RecommendationState {
  recommendations: Recommendation[]
  currentRecommendation: Recommendation | null
  isLoading: boolean
  error: string | null
  lastRequest: RecommendationRequest | null
}

export interface WellnessState {
  metrics: WellnessMetrics[]
  goals: WellnessGoalItem[]
  achievements: Achievement[]
  currentStreak: number
  totalScore: number
  isLoading: boolean
  error: string | null
}

export interface CommunityState {
  posts: CommunityPost[]
  connections: SocialConnection[]
  isLoading: boolean
  error: string | null
}

export interface SettingsState {
  preferences: UserPreferences
  accessibility: AccessibilitySettings
  privacy: PrivacySettings
  notifications: NotificationPreferences
  isLoading: boolean
  error: string | null
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SortOrder = 'asc' | 'desc'
export type SortField = 'created_at' | 'updated_at' | 'title' | 'rating' | 'wellness_score'

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface CardProps extends BaseComponentProps {
  title?: string
  description?: string
  variant?: 'default' | 'gaming' | 'wellness' | 'mood'
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gaming' | 'wellness'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

// Event Types
export interface MoodSubmitEvent {
  moodEntry: MoodEntry
  analysis: MoodAnalysisResponse
  timestamp: string
}

export interface GameRecommendationEvent {
  recommendations: Recommendation[]
  moodEntry: MoodEntry
  timestamp: string
}

export interface WellnessUpdateEvent {
  metrics: WellnessMetrics
  achievements: Achievement[]
  timestamp: string
}

