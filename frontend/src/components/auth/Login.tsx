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
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { login, clearError } from '../../store/slices/authSlice'
import { toggleAuthModal } from '../../store/slices/uiSlice'

interface LoginProps {
  onSwitchToRegister: () => void
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({})

  // Close modal if login was successful
  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(toggleAuthModal(false))
    }
  }, [isAuthenticated, dispatch])

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    let isValid = true

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
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())

    if (!validateForm()) return

    dispatch(login({ email, password }))
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, width: '100%' }}>
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        Вхід
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
          id="email"
          label="Електронна пошта"
          name="email"
          autoComplete="email"
          autoFocus
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
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={!!formErrors.password}
          helperText={formErrors.password}
          disabled={loading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Увійти'}
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
        <Typography variant="body2">Немає облікового запису?</Typography>
        <Link component="button" variant="body2" onClick={onSwitchToRegister} underline="hover">
          Зареєструватися
        </Link>
      </Box>
    </Paper>
  )
}

export default Login
