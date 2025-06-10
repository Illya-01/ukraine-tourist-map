import { Review, NewReview } from '../types'
import config from '../config'

export const fetchAttractionReviews = async (attractionId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/reviews/attraction/${attractionId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export const addReview = async (
  attractionId: string,
  review: NewReview,
  token: string
): Promise<Review | null> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/reviews/attraction/${attractionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(review),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to add review: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error adding review:', error)
    throw error
  }
}

export const updateReview = async (
  reviewId: string,
  review: NewReview,
  token: string
): Promise<Review | null> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(review),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to update review: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating review:', error)
    throw error
  }
}

export const deleteReview = async (reviewId: string, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to delete review: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Error deleting review:', error)
    throw error
  }
}
