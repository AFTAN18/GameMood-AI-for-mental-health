// Third-party integration services for GameMood AI

export interface SteamGame {
  appid: number
  name: string
  playtime_forever: number
  playtime_2weeks?: number
  img_icon_url: string
  img_logo_url: string
  has_community_visible_stats: boolean
}

export interface EpicGame {
  id: string
  title: string
  description: string
  developer: string
  publisher: string
  releaseDate: string
  genres: string[]
  tags: string[]
  thumbnail: string
  screenshots: string[]
}

export interface XboxGame {
  id: string
  title: string
  description: string
  developer: string
  publisher: string
  releaseDate: string
  genres: string[]
  rating: number
  thumbnail: string
}

export interface PlayStationGame {
  id: string
  title: string
  description: string
  developer: string
  publisher: string
  releaseDate: string
  genres: string[]
  rating: number
  thumbnail: string
}

export interface NintendoGame {
  id: string
  title: string
  description: string
  developer: string
  publisher: string
  releaseDate: string
  genres: string[]
  rating: number
  thumbnail: string
}

export interface HealthData {
  steps: number
  heartRate: number
  sleepHours: number
  stressLevel: number
  mood: string
  timestamp: Date
}

export interface SocialConnection {
  id: string
  platform: 'steam' | 'discord' | 'twitch' | 'youtube' | 'twitter'
  username: string
  displayName: string
  avatar: string
  isConnected: boolean
  lastSync: Date
}

class ThirdPartyIntegrationService {
  private apiKeys: Record<string, string> = {
    steam: process.env.REACT_APP_STEAM_API_KEY || '',
    epic: process.env.REACT_APP_EPIC_API_KEY || '',
    xbox: process.env.REACT_APP_XBOX_API_KEY || '',
    playstation: process.env.REACT_APP_PLAYSTATION_API_KEY || '',
    nintendo: process.env.REACT_APP_NINTENDO_API_KEY || '',
    discord: process.env.REACT_APP_DISCORD_CLIENT_ID || '',
    twitch: process.env.REACT_APP_TWITCH_CLIENT_ID || '',
    youtube: process.env.REACT_APP_YOUTUBE_API_KEY || '',
    twitter: process.env.REACT_APP_TWITTER_API_KEY || '',
    appleHealth: process.env.REACT_APP_APPLE_HEALTH_KEY || '',
    googleFit: process.env.REACT_APP_GOOGLE_FIT_KEY || '',
    samsungHealth: process.env.REACT_APP_SAMSUNG_HEALTH_KEY || ''
  }

  // Steam Integration
  async connectSteam(steamId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/steam/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steamId })
      })
      return response.ok
    } catch (error) {
      console.error('Steam connection failed:', error)
      return false
    }
  }

  async getSteamGames(steamId: string): Promise<SteamGame[]> {
    try {
      const response = await fetch(`/api/integrations/steam/games/${steamId}`)
      if (!response.ok) throw new Error('Failed to fetch Steam games')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Steam games:', error)
      return []
    }
  }

  async getSteamFriends(steamId: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/integrations/steam/friends/${steamId}`)
      if (!response.ok) throw new Error('Failed to fetch Steam friends')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Steam friends:', error)
      return []
    }
  }

  // Epic Games Integration
  async connectEpicGames(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/epic/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Epic Games connection failed:', error)
      return false
    }
  }

  async getEpicGames(): Promise<EpicGame[]> {
    try {
      const response = await fetch(`/api/integrations/epic/games`)
      if (!response.ok) throw new Error('Failed to fetch Epic games')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Epic games:', error)
      return []
    }
  }

  // Xbox Integration
  async connectXbox(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/xbox/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Xbox connection failed:', error)
      return false
    }
  }

  async getXboxGames(): Promise<XboxGame[]> {
    try {
      const response = await fetch(`/api/integrations/xbox/games`)
      if (!response.ok) throw new Error('Failed to fetch Xbox games')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Xbox games:', error)
      return []
    }
  }

  // PlayStation Integration
  async connectPlayStation(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/playstation/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('PlayStation connection failed:', error)
      return false
    }
  }

  async getPlayStationGames(): Promise<PlayStationGame[]> {
    try {
      const response = await fetch(`/api/integrations/playstation/games`)
      if (!response.ok) throw new Error('Failed to fetch PlayStation games')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch PlayStation games:', error)
      return []
    }
  }

  // Nintendo Switch Integration
  async connectNintendo(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/nintendo/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Nintendo connection failed:', error)
      return false
    }
  }

  async getNintendoGames(): Promise<NintendoGame[]> {
    try {
      const response = await fetch(`/api/integrations/nintendo/games`)
      if (!response.ok) throw new Error('Failed to fetch Nintendo games')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Nintendo games:', error)
      return []
    }
  }

  // Discord Integration
  async connectDiscord(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/discord/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Discord connection failed:', error)
      return false
    }
  }

  async getDiscordServers(): Promise<any[]> {
    try {
      const response = await fetch(`/api/integrations/discord/servers`)
      if (!response.ok) throw new Error('Failed to fetch Discord servers')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Discord servers:', error)
      return []
    }
  }

  // Twitch Integration
  async connectTwitch(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/twitch/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Twitch connection failed:', error)
      return false
    }
  }

  async getTwitchFollows(): Promise<any[]> {
    try {
      const response = await fetch(`/api/integrations/twitch/follows`)
      if (!response.ok) throw new Error('Failed to fetch Twitch follows')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Twitch follows:', error)
      return []
    }
  }

  // YouTube Integration
  async connectYouTube(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/youtube/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('YouTube connection failed:', error)
      return false
    }
  }

  async getYouTubeSubscriptions(): Promise<any[]> {
    try {
      const response = await fetch(`/api/integrations/youtube/subscriptions`)
      if (!response.ok) throw new Error('Failed to fetch YouTube subscriptions')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch YouTube subscriptions:', error)
      return []
    }
  }

  // Twitter Integration
  async connectTwitter(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/twitter/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Twitter connection failed:', error)
      return false
    }
  }

  async getTwitterTimeline(): Promise<any[]> {
    try {
      const response = await fetch(`/api/integrations/twitter/timeline`)
      if (!response.ok) throw new Error('Failed to fetch Twitter timeline')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch Twitter timeline:', error)
      return []
    }
  }

  // Health & Fitness Integrations
  async connectAppleHealth(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/health/apple/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Apple Health connection failed:', error)
      return false
    }
  }

  async connectGoogleFit(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/health/google/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Google Fit connection failed:', error)
      return false
    }
  }

  async connectSamsungHealth(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/health/samsung/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Samsung Health connection failed:', error)
      return false
    }
  }

  async getHealthData(platform: 'apple' | 'google' | 'samsung'): Promise<HealthData[]> {
    try {
      const response = await fetch(`/api/integrations/health/${platform}/data`)
      if (!response.ok) throw new Error(`Failed to fetch ${platform} health data`)
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch ${platform} health data:`, error)
      return []
    }
  }

  // Social Features
  async getSocialConnections(): Promise<SocialConnection[]> {
    try {
      const response = await fetch(`/api/integrations/social/connections`)
      if (!response.ok) throw new Error('Failed to fetch social connections')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch social connections:', error)
      return []
    }
  }

  async syncSocialData(): Promise<boolean> {
    try {
      const response = await fetch(`/api/integrations/social/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.ok
    } catch (error) {
      console.error('Social data sync failed:', error)
      return false
    }
  }

  // Game Recommendations based on third-party data
  async getPersonalizedRecommendations(): Promise<any[]> {
    try {
      const response = await fetch(`/api/integrations/recommendations/personalized`)
      if (!response.ok) throw new Error('Failed to fetch personalized recommendations')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch personalized recommendations:', error)
      return []
    }
  }

  // Wellness insights based on integrated data
  async getWellnessInsights(): Promise<any[]> {
    try {
      const response = await fetch(`/api/integrations/wellness/insights`)
      if (!response.ok) throw new Error('Failed to fetch wellness insights')
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch wellness insights:', error)
      return []
    }
  }
}

export const thirdPartyService = new ThirdPartyIntegrationService()
