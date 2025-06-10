import { Router } from 'express'
import * as reviewController from '../controllers/review.controller'
import { authenticateUser } from '../middleware/auth'

const router = Router()

router.get('/attraction/:attractionId', reviewController.getAttractionReviews)
router.post('/attraction/:attractionId', authenticateUser, reviewController.addReview)
router.put('/:reviewId', authenticateUser, reviewController.updateReview)
router.delete('/:reviewId', authenticateUser, reviewController.deleteReview)

export default router
