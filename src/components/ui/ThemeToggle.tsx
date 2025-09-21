import React from 'react'
import { Button } from './button'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme, actualTheme } = useTheme()

  const getIcon = () => {
    switch (theme) {
      case 'light': return Sun
      case 'dark': return Moon
      case 'auto': return Monitor
      default: return Sun
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light': return 'Light mode'
      case 'dark': return 'Dark mode'
      case 'auto': return 'Auto mode'
      default: return 'Light mode'
    }
  }

  const Icon = getIcon()

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="relative overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2"
      >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{getLabel()}</span>
      </motion.div>
    </Button>
  )
}
