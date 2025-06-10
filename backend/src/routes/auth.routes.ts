import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticateUser } from '../middleware/auth'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authenticateUser, authController.getCurrentUser)
router.post('/favorites', authenticateUser, authController.updateFavorites)

export default router
