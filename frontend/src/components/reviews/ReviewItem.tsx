import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import GoogleIcon from '@mui/icons-material/Google'
import { formatDistanceToNow } from 'date-fns'
import { uk } from 'date-fns/locale'
import { Review } from '../../types'
import { useAppSelector } from '../../store/hooks'

interface ReviewItemProps {
  review: Review
  onEdit: (reviewId: string) => void
  onDelete: (reviewId: string) => void
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { user } = useAppSelector(state => state.auth)

  // Handle both cases: when user is a string and when it's an object
  const getUserId = (userField: any): string | undefined => {
    if (!userField) return undefined

    // If user is an object with _id property (from backend)
    if (typeof userField === 'object' && userField._id) {
      return userField._id
    }

    // If user is a string ID (directly stored in review)
    if (typeof userField === 'string') {
      return userField
    }

    return undefined
  }

  const reviewUserId = getUserId(review.user)
  const currentUserId = user?.id

  // Check if the current user is the owner of this review
  const isOwner = !!currentUserId && !!reviewUserId && currentUserId === reviewUserId
  const isGoogleReview = review.source === 'google'

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit(review._id)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDelete(review._id)
    handleMenuClose()
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true, locale: uk })
    } catch (e) {
      return 'невідома дата'
    }
  }

  return (
    <Card sx={{ mb: 2, boxShadow: 1 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Avatar
              src={review.userPhotoUrl}
              alt={review.userName}
              sx={{ mr: 2, bgcolor: isGoogleReview ? '#DB4437' : 'primary.main' }}
            >
              {review.userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.userName}
                </Typography>
                {isGoogleReview && (
                  <Chip
                    icon={<GoogleIcon />}
                    label="Google"
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1, height: 20 }}
                  />
                )}
              </Box>
              <Box display="flex" alignItems="center">
                <Rating value={review.rating} readOnly size="small" precision={1} />
                <Typography variant="caption" color="text.secondary" ml={1}>
                  {formatDate(review.date)}
                </Typography>
                {isGoogleReview && review.language && review.language !== 'uk' && (
                  <Typography variant="caption" color="text.secondary" ml={1}>
                    • {review.language.toUpperCase()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {isOwner && !isGoogleReview && (
            <div>
              <IconButton aria-label="more options" onClick={handleMenuOpen} size="small">
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleEdit}>Редагувати</MenuItem>
                <MenuItem onClick={handleDelete}>Видалити</MenuItem>
              </Menu>
            </div>
          )}
        </Box>

        <Typography variant="body2" mt={2}>
          {review.text}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ReviewItem
