import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { motion } from 'framer-motion'
import { 
  Gamepad2, 
  Users, 
  Heart, 
  Settings, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  ExternalLink,
  Shield,
  Zap,
  Activity,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react'
import { thirdPartyService, SocialConnection } from '../../services/thirdPartyIntegrations'

interface IntegrationStatus {
  platform: string
  isConnected: boolean
  lastSync: Date | null
  dataCount: number
  status: 'active' | 'inactive' | 'error' | 'syncing'
}

export default function IntegrationManager() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([])
  const [socialConnections, setSocialConnections] = useState<SocialConnection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('gaming')

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    setIsLoading(true)
    try {
      // Load gaming platform integrations
      const gamingIntegrations = await Promise.all([
        checkIntegrationStatus('steam'),
        checkIntegrationStatus('epic'),
        checkIntegrationStatus('xbox'),
        checkIntegrationStatus('playstation'),
        checkIntegrationStatus('nintendo')
      ])

      // Load social platform integrations
      const socialIntegrations = await Promise.all([
        checkIntegrationStatus('discord'),
        checkIntegrationStatus('twitch'),
        checkIntegrationStatus('youtube'),
        checkIntegrationStatus('twitter')
      ])

      // Load health platform integrations
      const healthIntegrations = await Promise.all([
        checkIntegrationStatus('apple-health'),
        checkIntegrationStatus('google-fit'),
        checkIntegrationStatus('samsung-health')
      ])

      setIntegrations([
        ...gamingIntegrations,
        ...socialIntegrations,
        ...healthIntegrations
      ])

      // Load social connections
      const connections = await thirdPartyService.getSocialConnections()
      setSocialConnections(connections)
    } catch (error) {
      console.error('Failed to load integrations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkIntegrationStatus = async (platform: string): Promise<IntegrationStatus> => {
    try {
      // This would normally check the actual integration status
      // For now, we'll simulate the status
      const isConnected = Math.random() > 0.5
      return {
        platform,
        isConnected,
        lastSync: isConnected ? new Date(Date.now() - Math.random() * 86400000) : null,
        dataCount: isConnected ? Math.floor(Math.random() * 100) : 0,
        status: isConnected ? 'active' : 'inactive'
      }
    } catch (error) {
      return {
        platform,
        isConnected: false,
        lastSync: null,
        dataCount: 0,
        status: 'error'
      }
    }
  }

  const connectIntegration = async (platform: string) => {
    try {
      setIntegrations(prev => prev.map(integration => 
        integration.platform === platform 
          ? { ...integration, status: 'syncing' }
          : integration
      ))

      let success = false
      switch (platform) {
        case 'steam':
          success = await thirdPartyService.connectSteam('123456789')
          break
        case 'epic':
          success = await thirdPartyService.connectEpicGames()
          break
        case 'xbox':
          success = await thirdPartyService.connectXbox()
          break
        case 'playstation':
          success = await thirdPartyService.connectPlayStation()
          break
        case 'nintendo':
          success = await thirdPartyService.connectNintendo()
          break
        case 'discord':
          success = await thirdPartyService.connectDiscord()
          break
        case 'twitch':
          success = await thirdPartyService.connectTwitch()
          break
        case 'youtube':
          success = await thirdPartyService.connectYouTube()
          break
        case 'twitter':
          success = await thirdPartyService.connectTwitter()
          break
        case 'apple-health':
          success = await thirdPartyService.connectAppleHealth()
          break
        case 'google-fit':
          success = await thirdPartyService.connectGoogleFit()
          break
        case 'samsung-health':
          success = await thirdPartyService.connectSamsungHealth()
          break
      }

      setIntegrations(prev => prev.map(integration => 
        integration.platform === platform 
          ? { 
              ...integration, 
              isConnected: success,
              status: success ? 'active' : 'error',
              lastSync: success ? new Date() : integration.lastSync
            }
          : integration
      ))
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error)
      setIntegrations(prev => prev.map(integration => 
        integration.platform === platform 
          ? { ...integration, status: 'error' }
          : integration
      ))
    }
  }

  const disconnectIntegration = async (platform: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.platform === platform 
        ? { 
            ...integration, 
            isConnected: false,
            status: 'inactive',
            lastSync: null,
            dataCount: 0
          }
        : integration
    ))
  }

  const syncIntegration = async (platform: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.platform === platform 
        ? { ...integration, status: 'syncing' }
        : integration
    ))

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIntegrations(prev => prev.map(integration => 
      integration.platform === platform 
        ? { 
            ...integration, 
            status: 'active',
            lastSync: new Date(),
            dataCount: integration.dataCount + Math.floor(Math.random() * 10)
          }
        : integration
    ))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'steam': return Gamepad2
      case 'epic': return Gamepad2
      case 'xbox': return Gamepad2
      case 'playstation': return Gamepad2
      case 'nintendo': return Gamepad2
      case 'discord': return Users
      case 'twitch': return Users
      case 'youtube': return Users
      case 'twitter': return Users
      case 'apple-health': return Heart
      case 'google-fit': return Heart
      case 'samsung-health': return Heart
      default: return Settings
    }
  }

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'steam': return 'Steam'
      case 'epic': return 'Epic Games'
      case 'xbox': return 'Xbox'
      case 'playstation': return 'PlayStation'
      case 'nintendo': return 'Nintendo Switch'
      case 'discord': return 'Discord'
      case 'twitch': return 'Twitch'
      case 'youtube': return 'YouTube'
      case 'twitter': return 'Twitter'
      case 'apple-health': return 'Apple Health'
      case 'google-fit': return 'Google Fit'
      case 'samsung-health': return 'Samsung Health'
      default: return platform
    }
  }

  const getStatusColor = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'inactive': return 'text-gray-600'
      case 'error': return 'text-red-600'
      case 'syncing': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: IntegrationStatus['status']) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'inactive': return XCircle
      case 'error': return XCircle
      case 'syncing': return RefreshCw
      default: return XCircle
    }
  }

  const gamingPlatforms = integrations.filter(i => 
    ['steam', 'epic', 'xbox', 'playstation', 'nintendo'].includes(i.platform)
  )
  const socialPlatforms = integrations.filter(i => 
    ['discord', 'twitch', 'youtube', 'twitter'].includes(i.platform)
  )
  const healthPlatforms = integrations.filter(i => 
    ['apple-health', 'google-fit', 'samsung-health'].includes(i.platform)
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">Loading integrations...</p>
        </div>
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
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Integration Manager
            </h1>
            <p className="text-gray-600">
              Connect your gaming platforms, social accounts, and health apps for a complete wellness experience
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-4 text-center">
              <Gamepad2 className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{gamingPlatforms.filter(p => p.isConnected).length}</div>
              <div className="text-sm opacity-90">Gaming Platforms</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{socialPlatforms.filter(p => p.isConnected).length}</div>
              <div className="text-sm opacity-90">Social Platforms</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{healthPlatforms.filter(p => p.isConnected).length}</div>
              <div className="text-sm opacity-90">Health Apps</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{integrations.filter(p => p.isConnected).length}</div>
              <div className="text-sm opacity-90">Total Connected</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Integration Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="gaming">Gaming Platforms</TabsTrigger>
                  <TabsTrigger value="social">Social Platforms</TabsTrigger>
                  <TabsTrigger value="health">Health & Fitness</TabsTrigger>
                </TabsList>

                <TabsContent value="gaming" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gamingPlatforms.map((integration) => {
                      const Icon = getPlatformIcon(integration.platform)
                      const StatusIcon = getStatusIcon(integration.status)
                      return (
                        <Card key={integration.platform} className="bg-white border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100">
                                  <Icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {getPlatformName(integration.platform)}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-4 h-4 ${getStatusColor(integration.status)}`} />
                                    <span className={`text-sm ${getStatusColor(integration.status)}`}>
                                      {integration.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Data Count</span>
                                <span className="font-semibold">{integration.dataCount}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Sync</span>
                                <span className="font-semibold">
                                  {integration.lastSync 
                                    ? integration.lastSync.toLocaleDateString()
                                    : 'Never'
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {integration.isConnected ? (
                                <>
                                  <Button
                                    onClick={() => syncIntegration(integration.platform)}
                                    disabled={integration.status === 'syncing'}
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    {integration.status === 'syncing' ? (
                                      <>
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                          className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
                                        />
                                        Syncing...
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Sync
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    onClick={() => disconnectIntegration(integration.platform)}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Disconnect
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => connectIntegration(integration.platform)}
                                  size="sm"
                                  className="gaming-button flex-1"
                                >
                                  Connect
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {socialPlatforms.map((integration) => {
                      const Icon = getPlatformIcon(integration.platform)
                      const StatusIcon = getStatusIcon(integration.status)
                      return (
                        <Card key={integration.platform} className="bg-white border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-100">
                                  <Icon className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {getPlatformName(integration.platform)}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-4 h-4 ${getStatusColor(integration.status)}`} />
                                    <span className={`text-sm ${getStatusColor(integration.status)}`}>
                                      {integration.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Connections</span>
                                <span className="font-semibold">{integration.dataCount}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Sync</span>
                                <span className="font-semibold">
                                  {integration.lastSync 
                                    ? integration.lastSync.toLocaleDateString()
                                    : 'Never'
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {integration.isConnected ? (
                                <>
                                  <Button
                                    onClick={() => syncIntegration(integration.platform)}
                                    disabled={integration.status === 'syncing'}
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    {integration.status === 'syncing' ? (
                                      <>
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                          className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"
                                        />
                                        Syncing...
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Sync
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    onClick={() => disconnectIntegration(integration.platform)}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Disconnect
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => connectIntegration(integration.platform)}
                                  size="sm"
                                  className="gaming-button flex-1"
                                >
                                  Connect
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="health" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {healthPlatforms.map((integration) => {
                      const Icon = getPlatformIcon(integration.platform)
                      const StatusIcon = getStatusIcon(integration.status)
                      return (
                        <Card key={integration.platform} className="bg-white border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100">
                                  <Icon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">
                                    {getPlatformName(integration.platform)}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <StatusIcon className={`w-4 h-4 ${getStatusColor(integration.status)}`} />
                                    <span className={`text-sm ${getStatusColor(integration.status)}`}>
                                      {integration.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Health Data</span>
                                <span className="font-semibold">{integration.dataCount}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Sync</span>
                                <span className="font-semibold">
                                  {integration.lastSync 
                                    ? integration.lastSync.toLocaleDateString()
                                    : 'Never'
                                  }
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {integration.isConnected ? (
                                <>
                                  <Button
                                    onClick={() => syncIntegration(integration.platform)}
                                    disabled={integration.status === 'syncing'}
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    {integration.status === 'syncing' ? (
                                      <>
                                        <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                          className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mr-2"
                                        />
                                        Syncing...
                                      </>
                                    ) : (
                                      <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Sync
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    onClick={() => disconnectIntegration(integration.platform)}
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    Disconnect
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => connectIntegration(integration.platform)}
                                  size="sm"
                                  className="gaming-button flex-1"
                                >
                                  Connect
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
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
