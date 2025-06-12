import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Review, NewReview } from '../../types'
import ReviewItem from './ReviewItem'
import ReviewForm from './ReviewForm'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { toggleAuthModal } from '../../store/slices/uiSlice'
import {
  fetchReviews,
  addReview,
  updateReview,
  deleteReview,
  setCurrentAttractionId,
} from '../../store/slices/reviewSlice'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../store'

interface ReviewListProps {
  attractionId: string
}

const ReviewList: React.FC<ReviewListProps> = ({ attractionId }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  // Create a memoized selector for the reviews data
  const selectReviewsData = useMemo(() => {
    // Create memorized selectors for each piece of state
    const selectReviews = (state: RootState) => state.reviews.reviews[attractionId] || []
    const selectLoading = (state: RootState) => state.reviews.loading
    const selectError = (state: RootState) => state.reviews.error

    // Use these stable selectors as inputs
    return createSelector(
      [selectReviews, selectLoading, selectError],
      (reviews, loading, error) => ({
        reviews,
        loading,
        error,
      })
    )
  }, [attractionId])
  const { reviews, loading, error } = useAppSelector(selectReviewsData)
  const dispatch = useAppDispatch()

  // Find user's review using the helper function
  const canAddReview = isAuthenticated && !showForm

  useEffect(() => {
    dispatch(setCurrentAttractionId(attractionId))
    dispatch(fetchReviews(attractionId))
  }, [attractionId, dispatch])

  const handleAddReview = async (attractionId: string, review: NewReview) => {
    if (!isAuthenticated || !user) {
      dispatch(toggleAuthModal(true))
      return
    }

    try {
      await dispatch(
        addReview({
          attractionId,
          review,
          token: localStorage.getItem('token') || '',
        })
      ).unwrap()
      setShowForm(false)
    } catch (err: any) {
      console.error('Error adding review:', err)
      throw err
    }
  }

  const handleEditReview = (reviewId: string) => {
    const review = reviews.find(r => r._id === reviewId)
    if (review) {
      setEditingReview(review)
    }
  }

  const handleUpdateReview = async (attractionId: string, reviewData: NewReview) => {
    if (!editingReview || !user) return

    try {
      await dispatch(
        updateReview({
          reviewId: editingReview._id,
          review: reviewData,
          token: localStorage.getItem('token') || '',
          attractionId,
        })
      ).unwrap()
      setEditingReview(null)
    } catch (err: any) {
      console.error('Error updating review:', err)
      throw err
    }
  }

  const handleDeleteClick = (reviewId: string) => {
    setDeleteId(reviewId)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId || !user) return

    try {
      await dispatch(
        deleteReview({
          reviewId: deleteId,
          token: localStorage.getItem('token') || '',
          attractionId,
        })
      ).unwrap()
    } catch (err) {
      console.error('Error deleting review:', err)
    } finally {
      setDeleteConfirmOpen(false)
      setDeleteId(null)
    }
  }

  return (
    <Box my={3}>
      <Typography variant="h6" gutterBottom>
        Відгуки ({reviews.length})
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {loading && reviews.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {canAddReview && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => setShowForm(true)}
              sx={{ mb: 2 }}
              variant="outlined"
              fullWidth
            >
              Написати відгук
            </Button>
          )}

          {showForm && (
            <ReviewForm
              attractionId={attractionId}
              onSubmit={handleAddReview}
              onCancel={() => setShowForm(false)}
            />
          )}

          {editingReview && (
            <ReviewForm
              attractionId={attractionId}
              existingReview={editingReview}
              onSubmit={handleUpdateReview}
              onCancel={() => setEditingReview(null)}
              isEdit
            />
          )}

          {reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewItem
                key={review._id}
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteClick}
              />
            ))
          ) : (
            <Typography align="center" color="text.secondary" py={4}>
              Ще немає відгуків для цієї пам'ятки. Будьте першим, хто залишить відгук!
            </Typography>
          )}

          {!isAuthenticated && reviews.length === 0 && (
            <Box textAlign="center" mt={2}>
              <Button variant="outlined" onClick={() => dispatch(toggleAuthModal(true))}>
                Увійти, щоб залишити відгук
              </Button>
            </Box>
          )}
        </>
      )}

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Підтвердити видалення</DialogTitle>
        <DialogContent>
          <Typography>Ви впевнені, що хочете видалити цей відгук?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Скасувати</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ReviewList
