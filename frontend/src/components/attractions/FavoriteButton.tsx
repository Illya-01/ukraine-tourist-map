import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleFavorite } from '../../store/slices/authSlice'
import { toggleAuthModal } from '../../store/slices/uiSlice'

interface FavoriteButtonProps {
  attractionId: string
  size?: 'small' | 'medium' | 'large'
  position?: 'static' | 'absolute'
  top?: number
  right?: number
  showTooltip?: boolean
  onOpenAuthModal?: () => void
}

export default function FavoriteButton({
  attractionId,
  size = 'small',
  position = 'absolute',
  top = 8,
  right = 8,
  showTooltip = true,
  onOpenAuthModal,
}: FavoriteButtonProps) {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)

  const isFavorite = user?.favorites.includes(attractionId) || false

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (isAuthenticated) {
      dispatch(toggleFavorite(attractionId))
    } else {
      if (onOpenAuthModal) {
        onOpenAuthModal()
      } else {
        dispatch(toggleAuthModal(true))
      }
    }
  }

  const button = (
    <IconButton
      size={size}
      onClick={handleFavoriteClick}
      sx={{
        position: position,
        top: position === 'absolute' ? top : undefined,
        right: position === 'absolute' ? right : undefined,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>
  )

  if (showTooltip) {
    return (
      <Tooltip title={isFavorite ? 'Видалити з улюблених' : 'Додати до улюблених'}>
        {button}
      </Tooltip>
    )
  }

  return button
}
