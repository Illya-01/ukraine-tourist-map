import React, { useState } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  ListItemIcon,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useAuth } from '../contexts/AuthContext'

interface UserMenuProps {
  onLogin: () => void
  onOpenFavorites: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogin, onOpenFavorites }) => {
  let user = null
  let isAuthenticated = false
  let logout = () => {}

  try {
    const auth = useAuth()
    user = auth.user
    isAuthenticated = auth.isAuthenticated
    logout = auth.logout
  } catch (e) {
    console.error('Auth context not available', e)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
  }

  const handleLoginClick = () => {
    handleClose()
    onLogin()
  }

  const handleFavoritesClick = () => {
    handleClose()
    onOpenFavorites()
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2) || '?'
    )
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {isAuthenticated && user ? (
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {getInitials(user.name)}
          </Avatar>
        ) : (
          <AccountCircleIcon />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isAuthenticated && user ? (
          [
            <MenuItem key="user-info" onClick={handleClose} disabled>
              <Typography variant="subtitle2">{user.name}</Typography>
            </MenuItem>,
            <Divider key="divider" />,
            <MenuItem key="favorites" onClick={handleFavoritesClick}>
              <ListItemIcon>
                <FavoriteIcon fontSize="small" />
              </ListItemIcon>
              Улюблені пам'ятки
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Вийти
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleLoginClick}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>
            Увійти
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default UserMenu
