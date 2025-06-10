import { AuthUser } from '../types'
import config from '../config'

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: AuthUser; token: string }> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to register')
    }

    const data = await response.json()

    // Save token to local storage
    localStorage.setItem('token', data.token)

    return data
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export const login = async (
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string }> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to login')
    }

    const data = await response.json()

    // Save token to local storage
    localStorage.setItem('token', data.token)

    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token')
}

export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get user data')
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting current user:', error)
    throw error
  }
}

export const toggleFavorite = async (attractionId: string): Promise<string[]> => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      throw new Error('Not authenticated')
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
    return data.favorites
  } catch (error) {
    console.error('Error toggling favorite:', error)
    throw error
  }
}
