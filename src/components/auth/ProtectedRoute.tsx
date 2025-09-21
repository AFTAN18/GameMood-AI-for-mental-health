import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import LoadingScreen from '../ui/LoadingScreen'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.user)
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen message="Verifying your access..." />
  }

  if (!isAuthenticated) {
    // Redirect to home page with return url
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

