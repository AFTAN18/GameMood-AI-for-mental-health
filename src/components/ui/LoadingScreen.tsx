import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
  showProgress?: boolean
  progress?: number
}

export default function LoadingScreen({ 
  message = "Loading your gaming wellness experience...", 
  showProgress = false,
  progress = 0 
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.2),transparent_50%)]"></div>
      
      {/* Floating particles */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-32 right-32 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-1500"></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-3000"></div>

      <div className="text-center z-10">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25 mx-auto"
            >
              <Brain className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
        >
          GameMood AI
        </motion.h1>

        {/* Loading Message */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-gray-300 text-lg mb-8 max-w-md mx-auto"
        >
          {message}
        </motion.p>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="w-64 mx-auto mb-4"
          >
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">{progress}% complete</p>
          </motion.div>
        )}

        {/* Loading Spinner */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full"
          />
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex justify-center space-x-2 mt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            />
          ))}
        </motion.div>

        {/* Gaming-themed loading text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-8 text-sm text-gray-400"
        >
          <p>🎮 Preparing your personalized gaming experience...</p>
          <p className="mt-1">🧠 Analyzing your mood patterns...</p>
          <p className="mt-1">✨ Crafting perfect recommendations...</p>
        </motion.div>
      </div>
    </div>
  )
}

