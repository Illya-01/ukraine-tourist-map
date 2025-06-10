import { Box, Typography, Rating } from '@mui/material'

interface StarRatingProps {
  rating: number
  precision?: number
  readOnly?: boolean
  showValue?: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function StarRating({
  rating,
  precision = 0.1,
  readOnly = true,
  showValue = true,
  size = 'small',
}: StarRatingProps) {
  return (
    <Box component="div" display="flex" alignItems="center" gap={0.5}>
      <Rating value={rating} precision={precision} readOnly={readOnly} size={size} />
      {showValue && (
        <Typography variant="body2" color="text.secondary" component="span">
          {rating.toFixed(1)}
        </Typography>
      )}
    </Box>
  )
}
