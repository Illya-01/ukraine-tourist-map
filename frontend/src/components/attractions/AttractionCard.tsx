import { ListItemButton, ListItemAvatar, Box, Typography, Chip } from '@mui/material'
import { Attraction } from '../../types'
import StarRating from '../common/StarRating'
import LazyImage from '../common/LazyImage'
import { getImageUrl, getCategoryName, getCategoryColor } from '../../utils'
import FavoriteButton from './FavoriteButton'

interface AttractionCardProps {
  attraction: Attraction
  onSelect: (attraction: Attraction) => void
  onOpenAuthModal?: () => void
}

export default function AttractionCard({
  attraction,
  onSelect,
  onOpenAuthModal,
}: AttractionCardProps) {
  return (
    <ListItemButton
      onClick={() => onSelect(attraction)}
      sx={{
        py: 2,
        px: 3,
        borderBottom: 1,
        borderColor: 'divider',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        position: 'relative',
      }}
    >
      <FavoriteButton attractionId={attraction.id} onOpenAuthModal={onOpenAuthModal} />

      <ListItemAvatar sx={{ minWidth: 72 }}>
        <LazyImage
          src={
            attraction.images && attraction.images.length > 0
              ? getImageUrl(attraction.images[0])
              : 'img/default-image.png'
          }
          alt={attraction.name}
          width={70}
          height={70}
          borderRadius={2}
          fallbackSrc="img/default-image.png"
        />
      </ListItemAvatar>

      <Box sx={{ ml: 2, flex: 1, overflow: 'hidden', width: 'calc(100% - 80px)' }}>
        <Box display="flex" flexDirection="column" width="100%">
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            sx={{
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >
            {attraction.name}
          </Typography>
          <Chip
            label={getCategoryName(attraction.category)}
            size="small"
            color={getCategoryColor(attraction.category)}
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          />
        </Box>

        <Box sx={{ mt: 1, width: '100%' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5 }}
            component="div"
            noWrap={false}
          >
            {attraction.description.length > 80
              ? `${attraction.description.substring(0, 80)}...`
              : attraction.description}
          </Typography>

          {attraction.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarRating
                rating={attraction.rating}
                precision={0.1}
                readOnly
                showValue={false}
                size="small"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                component="span"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                • {attraction.address?.split(',')[0] || 'Адреса невідома'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </ListItemButton>
  )
}
