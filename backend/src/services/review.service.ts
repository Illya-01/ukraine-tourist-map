import Review from '../models/Review'
import Attraction from '../models/Attraction'
import googlePlacesService from './googlePlaces.service'
import mongoose from 'mongoose'

export const fetchAndStoreGoogleReviews = async (attractionId: string): Promise<any[]> => {
  try {
    const attraction = await Attraction.findById(attractionId)
    if (!attraction || !attraction.googlePlaceId) {
      console.log('No attraction or googlePlaceId found')
      return []
    }

    const placeDetails = await googlePlacesService.getPlaceDetails(attraction.googlePlaceId)

    if (!placeDetails.reviews || !placeDetails.reviews.length) {
      console.log('No reviews found for this place')
      return []
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Found ${placeDetails.reviews.length} reviews for ${attraction.name}`)
    }

    const operations = placeDetails.reviews.map(async (googleReview: any) => {
      try {
        const googleReviewId = `${attraction.googlePlaceId}_${googleReview.time}_${googleReview.author_name}`

        const existingReview = await Review.findOne({
          googleReviewId,
          attraction: attraction._id,
        })

        if (existingReview) {
          if (
            existingReview.text !== googleReview.text ||
            existingReview.rating !== googleReview.rating
          ) {
            existingReview.text = googleReview.text
            existingReview.rating = googleReview.rating
            await existingReview.save()
            console.log(`Updated Google review from ${googleReview.author_name}`)
          }
          return existingReview
        } else {
          const newReview = new Review({
            attraction: attraction._id,
            userName: googleReview.author_name,
            userPhotoUrl: googleReview.profile_photo_url,
            rating: googleReview.rating,
            text: googleReview.text,
            date: new Date(googleReview.time * 1000),
            source: 'google',
            googleReviewId,
            language: googleReview.language,
            googleProfileUrl: googleReview.author_url,
          })

          await newReview.save()

          if (process.env.NODE_ENV === 'development') {
            console.log(`Saved new Google review from ${googleReview.author_name}`)
          }
          return newReview
        }
      } catch (error) {
        console.error('Error processing individual Google review:', error)
        return null
      }
    })

    const results = await Promise.all(operations)
    return results.filter(r => r !== null)
  } catch (error) {
    console.error('Error fetching and storing Google reviews:', error)
    throw error
  }
}

export const getAllAttractionReviews = async (attractionId: string): Promise<any[]> => {
  try {
    await fetchAndStoreGoogleReviews(attractionId)

    const reviews = await Review.find({
      attraction: new mongoose.Types.ObjectId(attractionId),
    })
      .sort({ date: -1 })
      .populate('user', 'name photo')

    return reviews
  } catch (error) {
    console.error('Error getting all attraction reviews:', error)
    throw error
  }
}
