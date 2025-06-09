import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthUser } from '../types'
import config from '../config'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  toggleFavorite: (attractionId: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState({
    user: null as AuthUser | null,
    isAuthenticated: false,
    loading: false,
    error: null as string | null,
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          setState(prev => ({ ...prev, loading: true }))
          const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setState({
              user: userData,
              isAuthenticated: true,
              loading: false,
              error: null,
            })
          } else {
            // Token is invalid or expired
            localStorage.removeItem('token')
            setState({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            })
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
          setState({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: 'Помилка автентифікації',
          })
        }
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || 'Невірний email або пароль',
        }))
        throw new Error(data.message || 'Невірний email або пароль')
      }

      // Save token
      localStorage.setItem('token', data.token)

      setState({
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      console.error('Login error:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Помилка входу',
      }))
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.message || 'Помилка реєстрації',
        }))
        throw new Error(data.message || 'Помилка реєстрації')
      }

      // Auto-login after registration
      localStorage.setItem('token', data.token)

      setState({
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      })
    } catch (error: any) {
      console.error('Registration error:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Помилка реєстрації',
      }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    })
  }

  const toggleFavorite = async (attractionId: string) => {
    if (!state.user) return Promise.reject('User not authenticated')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch(`${config.API_BASE_URL}/auth/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attractionId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update favorites')
      }

      const data = await response.json()

      // Update user state with new favorites
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, favorites: data.favorites } : null,
      }))

      return data
    } catch (error) {
      console.error('Toggle favorite error:', error)
      throw error
    }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        toggleFavorite,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
