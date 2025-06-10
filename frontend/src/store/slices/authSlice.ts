import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AuthUser } from '../../types'
import config from '../../config'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
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
        return rejectWithValue(data.message || 'Невірний email або пароль')
      }

      localStorage.setItem('token', data.token)
      return data.user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Помилка входу')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (
    { email, password, name }: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
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
        return rejectWithValue(data.message || 'Помилка реєстрації')
      }

      localStorage.setItem('token', data.token)
      return data.user
    } catch (error: any) {
      return rejectWithValue(error.message || 'Помилка реєстрації')
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('No token found')
      }

      const response = await fetch(`${config.API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        localStorage.removeItem('token')
        return rejectWithValue('Invalid token')
      }

      const data = await response.json()
      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const toggleFavorite = createAsyncThunk(
  'auth/toggleFavorite',
  async (attractionId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return rejectWithValue('Authentication token not found')
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
        return rejectWithValue('Failed to update favorites')
      }

      const data = await response.json()
      return data.favorites
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error updating favorites')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token')
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(register.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, state => {
        state.loading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(fetchCurrentUser.rejected, state => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action: PayloadAction<string[]>) => {
        if (state.user) {
          state.user.favorites = action.payload
        }
      })
  },
})

export const { logout, clearError } = authSlice.actions

export default authSlice.reducer
