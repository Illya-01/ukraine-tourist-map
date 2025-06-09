import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../contexts/AuthContext'
import { Attraction } from '../types'
import { fetchAttractionById } from '../services/api.service'
import LazyImage from './LazyImage'
import { getImageUrl } from '../utils'

interface FavoritesDialogProps {
  open: boolean
  onClose: () => void
  onSelectAttraction: (attraction: Attraction) => void
}

const FavoritesDialog: React.FC<FavoritesDialogProps> = ({ open, onClose, onSelectAttraction }) => {
  const { user, toggleFavorite } = useAuth()
  const [favorites, setFavorites] = useState<Attraction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && user) {
      const loadFavorites = async () => {
        setLoading(true)
        setError(null)
        try {
          const attractions = await Promise.all(user.favorites.map(id => fetchAttractionById(id)))
          setFavorites(attractions.filter(a => a !== undefined) as Attraction[])
        } catch (err) {
          console.error('Error loading favorites:', err)
          setError("Не вдалося завантажити улюблені пам'ятки")
        } finally {
          setLoading(false)
        }
      }

      loadFavorites()
    }
  }, [open, user])

  const handleRemove = async (attractionId: string) => {
    try {
      await toggleFavorite(attractionId)
      setFavorites(favorites.filter(fav => fav.id !== attractionId))
    } catch (err) {
      setError("Не вдалося видалити пам'ятку з улюблених")
    }
  }

  const handleSelect = (attraction: Attraction) => {
    onSelectAttraction(attraction)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Улюблені пам'ятки
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" my={2}>
            {error}
          </Typography>
        ) : favorites.length === 0 ? (
          <Typography align="center" my={2}>
            У вас немає збережених пам'яток
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {favorites.map((attraction, index) => (
              <React.Fragment key={attraction.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemove(attraction.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  onClick={() => handleSelect(attraction)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar sx={{ mr: 2 }}>
                    <LazyImage
                      src={getImageUrl(attraction.images[0])}
                      alt={attraction.name}
                      width={70}
                      height={70}
                      borderRadius={1}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={attraction.name}
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {attraction.description}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < favorites.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FavoritesDialog
