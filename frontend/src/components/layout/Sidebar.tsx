import { Box, Typography, Drawer, IconButton, Rating, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Attraction } from '../../types'
import LazyImage from '../common/LazyImage'
import { getImageUrl } from '../../utils'
import ReviewList from '../reviews/ReviewList'

interface SidebarProps {
  open: boolean
  onClose: () => void
  attraction: Attraction | null
}

export default function Sidebar({ open, onClose, attraction }: SidebarProps) {
  if (!attraction) {
    return null
  }

  const getCategoryName = (category: string): string => {
    const categories: Record<string, string> = {
      historical: 'Історична',
      natural: 'Природна',
      cultural: 'Культурна',
      entertainment: 'Розважальна',
      religious: 'Релігійна',
    }
    return categories[category] || category
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, overflow: 'auto' },
      }}
    >
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h2">
            {attraction.name}
          </Typography>
          <IconButton onClick={onClose} edge="end" aria-label="закрити">
            <CloseIcon />
          </IconButton>
        </Box>

        {attraction.images && attraction.images.length > 0 && (
          <Box mb={2}>
            <LazyImage
              src={getImageUrl(attraction.images[0])}
              alt={attraction.name}
              height={200}
              borderRadius={2}
              fallbackSrc="img/default-image.png"
            />
          </Box>
        )}

        {attraction.rating && (
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={attraction.rating} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary" ml={1}>
              {attraction.rating.toFixed(1)}
            </Typography>
          </Box>
        )}

        <Typography variant="body1" component="p" mb={2}>
          {attraction.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="flex-start" mb={1}>
          <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {attraction.address}
          </Typography>
        </Box>

        <Typography variant="subtitle2" color="primary" mt={2}>
          Категорія: {getCategoryName(attraction.category)}
        </Typography>

        {attraction.id && <ReviewList attractionId={attraction.id} />}
      </Box>
    </Drawer>
  )
}
