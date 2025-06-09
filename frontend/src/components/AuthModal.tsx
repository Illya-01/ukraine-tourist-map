import React, { useState } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import Login from './Login'
import Register from './Register'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  initialView?: 'login' | 'register'
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register'>(initialView)

  const handleLoginSuccess = () => {
    onClose()
  }

  const handleRegisterSuccess = () => {
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {view === 'login' ? (
          <Login
            onSwitchToRegister={() => setView('register')}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setView('login')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
