import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from './hooks/redux'
import { initializeApp } from './store/slices/appSlice'
import { loadUserProfile } from './store/slices/userSlice'

// Layout Components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Pages
import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'
import ProfilePage from './pages/Profile'
import RecommendationsPage from './pages/Recommendations'
import OnboardingPage from './pages/Onboarding'
import SettingsPage from './pages/Settings'
import CommunityPage from './pages/Community'
import WellnessPage from './pages/Wellness'
import NotFoundPage from './pages/NotFound'

// Loading Component
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading } = useAppSelector((state) => state.app)
  const { user } = useAppSelector((state) => state.user)

  useEffect(() => {
    const initialize = async () => {
      try {
        await dispatch(initializeApp())
        if (localStorage.getItem('userToken')) {
          await dispatch(loadUserProfile())
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
      }
    }

    initialize()
  }, [dispatch])

  if (!isInitialized || isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Layout>
                  <RecommendationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellness"
            element={
              <ProtectedRoute>
                <Layout>
                  <WellnessPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Layout>
                  <CommunityPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Fallback Routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App

