import { Router } from 'express'
import * as attractionController from '../controllers/attractionController'

const router = Router()

router.get('/', attractionController.getAllAttractions)
router.get('/:id', attractionController.getAttractionById)
router.post('/', attractionController.createAttraction)
router.put('/:id', attractionController.updateAttraction)
router.delete('/:id', attractionController.deleteAttraction)

router.get('/search/nearby', attractionController.searchNearbyAttractions)
router.post('/import/google', attractionController.importFromGooglePlaces)

export default router
