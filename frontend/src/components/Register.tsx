import React, { useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

interface RegisterProps {
  onSwitchToLogin: () => void
  onRegisterSuccess?: () => void
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  let register: (email: string, password: string, name: string) => Promise<void> = async (
    _email,
    _password,
    _name
  ) => {
    throw new Error('Auth context not available')
  }
  let loading = false
  let error: string | null = null
  let clearError = () => {}

  try {
    const auth = useAuth()
    register = auth.register
    loading = auth.loading
    error = auth.error
    clearError = auth.clearError
  } catch (e) {
    console.error('Auth context not available', e)
  }

  const validateForm = (): boolean => {
    const errors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}
    let isValid = true

    if (!name) {
      errors.name = "Ім'я обов'язкове"
      isValid = false
    }

    if (!email) {
      errors.email = "Електронна пошта обов'язкова"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Введіть дійсну електронну адресу'
      isValid = false
    }

    if (!password) {
      errors.password = "Пароль обов'язковий"
      isValid = false
    } else if (password.length < 6) {
      errors.password = 'Пароль повинен містити не менше 6 символів'
      isValid = false
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Паролі не збігаються'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (clearError) clearError()

    if (!validateForm()) return

    try {
      await register(email, password, name)
      // Only call onRegisterSuccess if registration was successful
      if (onRegisterSuccess) {
        onRegisterSuccess()
      }
    } catch (error) {
      // If registration fails, we do nothing, so the modal stays open with error message
      console.error('Registration failed:', error)
      // Don't call onRegisterSuccess here
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 400,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'visible',
      }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Реєстрація
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Ім'я"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          error={!!formErrors.name}
          helperText={formErrors.name}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Електронна пошта"
          name="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={!!formErrors.email}
          helperText={formErrors.email}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Пароль"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!formErrors.password}
          helperText={formErrors.password}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Підтвердіть пароль"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          error={!!formErrors.confirmPassword}
          helperText={formErrors.confirmPassword}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Зареєструватися'}
        </Button>
      </Box>

      <Box
        textAlign="center"
        sx={{
          mt: 2,
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography variant="body2">Вже є обліковий запис?</Typography>
        <Link component="button" variant="body2" onClick={onSwitchToLogin} underline="hover">
          Увійти
        </Link>
      </Box>
    </Paper>
  )
}

export default Register
