import { Request, Response } from 'express'
import Review from '../models/Review'
import Attraction from '../models/Attraction'
import mongoose from 'mongoose'
import { getAllAttractionReviews } from '../services/review.service'

export const getAttractionReviews = async (req: Request, res: Response) => {
  try {
    const { attractionId } = req.params

    if (!mongoose.Types.ObjectId.isValid(attractionId)) {
      res.status(400).json({ message: 'Неправильний ID визначного місця' })
      return
    }

    const reviews = await getAllAttractionReviews(attractionId)
    res.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    res.status(500).json({ message: 'Помилка при отриманні відгуків' })
  }
}

export const addReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Потрібна автентифікація' })
      return
    }

    const { attractionId } = req.params
    const { rating, text } = req.body

    if (!mongoose.Types.ObjectId.isValid(attractionId)) {
      res.status(400).json({ message: 'Неправильний ID визначного місця' })
      return
    }

    const attraction = await Attraction.findById(attractionId)
    if (!attraction) {
      res.status(404).json({ message: 'Визначне місце не знайдено' })
      return
    }

    const existingReview = await Review.findOne({
      attraction: attractionId,
      user: req.user.id,
      source: 'user',
    })

    if (existingReview) {
      res.status(400).json({ message: 'Ви вже зробили відгук на це визначне місце' })
      return
    }
    const review = new Review({
      attraction: attractionId,
      user: req.user.id,
      userName: req.user.name,
      userPhotoUrl: req.user.photo || null, // Make photo optional
      rating,
      text,
      date: new Date(),
      source: 'user',
    })

    await review.save()

    await updateAttractionRating(attractionId)

    res.status(201).json(review)
  } catch (error) {
    console.error('Error adding review:', error)
    res.status(500).json({ message: 'Не вдалося додати відгук' })
  }
}

export const updateReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Потрібна автентифікація' })
      return
    }

    const { reviewId } = req.params
    const { rating, text } = req.body

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({ message: 'Неправильне ID відгука' })
      return
    }

    const review = await Review.findById(reviewId)

    if (!review) {
      res.status(404).json({ message: 'Відгук не знайдено' })
      return
    }

    if (review.source !== 'user' || review.user?.toString() !== req.user.id) {
      res.status(403).json({ message: 'Ви неавторизовані: Не можете редагувати цей відгук' })
      return
    }

    review.rating = rating
    review.text = text
    await review.save()

    await updateAttractionRating(review.attraction.toString())

    res.json(review)
  } catch (error) {
    console.error('Error updating review:', error)
    res.status(500).json({ message: 'Не вдалося оновити відгук' })
  }
}

export const deleteReview = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Потрібна автентифікація' })
      return
    }

    const { reviewId } = req.params

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      res.status(400).json({ message: 'Неправильне ID відгука' })
      return
    }

    const review = await Review.findById(reviewId)

    if (!review) {
      res.status(404).json({ message: 'Відгук не знайдено' })
      return
    }

    if (review.source !== 'user' || review.user?.toString() !== req.user.id) {
      res.status(403).json({ message: 'Ви неавторизовані: Не можете видалити цей відгук' })
      return
    }

    const attractionId = review.attraction.toString()
    await Review.findByIdAndDelete(reviewId)

    await updateAttractionRating(attractionId)

    res.json({ message: 'Відгук видалено вдало' })
  } catch (error) {
    console.error('Error deleting review:', error)
    res.status(500).json({ message: 'Не вдалося видалити відгук' })
  }
}

const updateAttractionRating = async (attractionId: string) => {
  const allReviews = await Review.find({ attraction: attractionId })
  if (allReviews.length > 0) {
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length
    await Attraction.findByIdAndUpdate(attractionId, { rating: averageRating })
  }
}
