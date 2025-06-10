import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Review, NewReview } from '../../types'
import {
  fetchAttractionReviews,
  addReview as addReviewService,
  updateReview as updateReviewService,
  deleteReview as deleteReviewService,
} from '../../services/review.service'

interface ReviewsState {
  reviews: { [attractionId: string]: Review[] }
  loading: boolean
  error: string | null
  currentAttractionId: string | null
}

const initialState: ReviewsState = {
  reviews: {},
  loading: false,
  error: null,
  currentAttractionId: null,
}

export const fetchReviews = createAsyncThunk(
  'reviews/fetchByAttractionId',
  async (attractionId: string, { rejectWithValue }) => {
    try {
      const reviews = await fetchAttractionReviews(attractionId)
      return { attractionId, reviews }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reviews')
    }
  }
)

export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (
    { attractionId, review, token }: { attractionId: string; review: NewReview; token: string },
    { rejectWithValue }
  ) => {
    try {
      const newReview = await addReviewService(attractionId, review, token)
      return { attractionId, review: newReview }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add review')
    }
  }
)

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async (
    {
      reviewId,
      review,
      token,
      attractionId,
    }: { reviewId: string; review: NewReview; token: string; attractionId: string },
    { rejectWithValue }
  ) => {
    try {
      const updatedReview = await updateReviewService(reviewId, review, token)
      return { attractionId, reviewId, updatedReview }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update review')
    }
  }
)

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (
    { reviewId, token, attractionId }: { reviewId: string; token: string; attractionId: string },
    { rejectWithValue }
  ) => {
    try {
      const success = await deleteReviewService(reviewId, token)
      if (success) {
        return { attractionId, reviewId }
      }
      return rejectWithValue('Failed to delete review')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete review')
    }
  }
)

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: state => {
      state.reviews = {}
    },
    setCurrentAttractionId: (state, action: PayloadAction<string>) => {
      state.currentAttractionId = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchReviews.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchReviews.fulfilled,
        (state, action: PayloadAction<{ attractionId: string; reviews: Review[] }>) => {
          const { attractionId, reviews } = action.payload
          state.reviews[attractionId] = reviews
          state.loading = false
        }
      )
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to fetch reviews'
      })
      // Add Review
      .addCase(addReview.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        addReview.fulfilled,
        (state, action: PayloadAction<{ attractionId: string; review: any }>) => {
          const { attractionId, review } = action.payload
          if (state.reviews[attractionId]) {
            state.reviews[attractionId] = [review as Review, ...state.reviews[attractionId]]
          } else {
            state.reviews[attractionId] = [review as Review]
          }
          state.loading = false
        }
      )
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to add review'
      })
      // Update Review
      .addCase(updateReview.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        updateReview.fulfilled,
        (
          state,
          action: PayloadAction<{ attractionId: string; reviewId: string; updatedReview: any }>
        ) => {
          const { attractionId, reviewId, updatedReview } = action.payload
          if (state.reviews[attractionId]) {
            state.reviews[attractionId] = state.reviews[attractionId].map(r =>
              r._id === reviewId ? (updatedReview as Review) : r
            )
          }
          state.loading = false
        }
      )
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to update review'
      })
      // Delete Review
      .addCase(deleteReview.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(
        deleteReview.fulfilled,
        (state, action: PayloadAction<{ attractionId: string; reviewId: string }>) => {
          const { attractionId, reviewId } = action.payload
          if (state.reviews[attractionId]) {
            state.reviews[attractionId] = state.reviews[attractionId].filter(
              r => r._id !== reviewId
            )
          }
          state.loading = false
        }
      )
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || 'Failed to delete review'
      })
  },
})

export const { clearReviews, setCurrentAttractionId } = reviewsSlice.actions
export default reviewsSlice.reducer
