import React, { useState } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import Login from './Login'
import Register from './Register'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleAuthModal } from '../../store/slices/uiSlice'

interface AuthModalProps {
  open: boolean
  initialView?: 'login' | 'register'
}

const AuthModal: React.FC<AuthModalProps> = ({ open, initialView = 'login' }) => {
  const dispatch = useAppDispatch()
  const [view, setView] = useState<'login' | 'register'>(initialView)

  const handleClose = () => {
    dispatch(toggleAuthModal(false))
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        {view === 'login' ? (
          <Login onSwitchToRegister={() => setView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setView('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
