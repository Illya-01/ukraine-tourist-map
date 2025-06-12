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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          m: { xs: 2, sm: 4 },
          width: '100%',
          maxHeight: '95vh',
          overflowY: 'auto',
        },
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: { xs: 4, sm: 6 },
          px: 0,
        }}
      >
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
