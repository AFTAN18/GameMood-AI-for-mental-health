import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {
  children: React.ReactNode
  variant?: 'gradient' | 'particles' | 'waves' | 'geometric'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export default function AnimatedBackground({ 
  children, 
  variant = 'gradient',
  intensity = 'medium',
  className = ''
}: AnimatedBackgroundProps) {
  const getIntensityClass = () => {
    switch (intensity) {
      case 'low': return 'opacity-30'
      case 'medium': return 'opacity-60'
      case 'high': return 'opacity-90'
      default: return 'opacity-60'
    }
  }

  const renderGradient = () => (
    <motion.div
      className={`absolute inset-0 ${getIntensityClass()}`}
      animate={{
        background: [
          'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
          'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
          'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
          'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
        ]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )

  const renderParticles = () => (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 bg-white rounded-full ${getIntensityClass()}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  )

  const renderWaves = () => (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className={`absolute inset-0 ${getIntensityClass()}`}
        style={{
          background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
        }}
        animate={{
          clipPath: [
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            'polygon(0% 0%, 100% 0%, 100% 80%, 0% 100%)',
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 80%)',
            'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className={`absolute inset-0 ${getIntensityClass()}`}
        style={{
          background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)'
        }}
        animate={{
          clipPath: [
            'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            'polygon(0% 100%, 100% 100%, 100% 20%, 0% 0%)',
            'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4
        }}
      />
    </div>
  )

  const renderGeometric = () => (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${getIntensityClass()}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            background: `linear-gradient(45deg, 
              hsl(${Math.random() * 360}, 70%, 60%), 
              hsl(${Math.random() * 360}, 70%, 60%)
            )`,
            borderRadius: '50%'
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            delay: Math.random() * 10
          }}
        />
      ))}
    </div>
  )

  const renderBackground = () => {
    switch (variant) {
      case 'gradient': return renderGradient()
      case 'particles': return renderParticles()
      case 'waves': return renderWaves()
      case 'geometric': return renderGeometric()
      default: return renderGradient()
    }
  }

  return (
    <div className={`relative ${className}`}>
      {renderBackground()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
