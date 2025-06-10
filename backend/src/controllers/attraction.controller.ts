import { Request, Response } from 'express'
import Attraction, { IAttraction } from '../models/Attraction'
import googlePlacesService from '../services/googlePlaces.service'
import { AttractionCategory } from '../types'

const determineCategoryFromTypes = (types: string[]): AttractionCategory => {
  if (types.includes('church') || types.includes('place_of_worship')) {
    return AttractionCategory.RELIGIOUS
  } else if (
    types.includes('museum') ||
    types.includes('art_gallery') ||
    types.includes('library')
  ) {
    return AttractionCategory.CULTURAL
  } else if (
    types.includes('amusement_park') ||
    types.includes('zoo') ||
    types.includes('aquarium')
  ) {
    return AttractionCategory.ENTERTAINMENT
  } else if (
    types.includes('natural_feature') ||
    types.includes('park') ||
    types.includes('campground')
  ) {
    return AttractionCategory.NATURAL
  } else {
    return AttractionCategory.HISTORICAL // Default for historic sites
  }
}

export const getAllAttractions = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as AttractionCategory | undefined
    const query = category ? { category } : {}

    const attractions = await Attraction.find(query)

    res.json(attractions)
  } catch (error) {
    console.error('Error getting attractions:', error)
    res.status(500).json({ message: 'Failed to get attractions' })
  }
}

export const getAttractionById = async (req: Request, res: Response) => {
  try {
    const attraction = await Attraction.findById(req.params.id)

    if (!attraction) {
      res.status(404).json({ message: 'Attraction not found' })
      return
    }

    res.json(attraction)
  } catch (error) {
    console.error('Error getting attraction:', error)
    res.status(500).json({ message: 'Failed to get attraction' })
  }
}

export const createAttraction = async (req: Request, res: Response) => {
  try {
    const newAttraction = new Attraction(req.body)
    await newAttraction.save()

    res.status(201).json(newAttraction)
  } catch (error) {
    console.error('Error creating attraction:', error)
    res.status(400).json({ message: 'Failed to create attraction' })
  }
}

export const updateAttraction = async (req: Request, res: Response) => {
  try {
    const attraction = await Attraction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!attraction) {
      res.status(404).json({ message: 'Attraction not found' })
      return
    }

    res.json(attraction)
  } catch (error) {
    console.error('Error updating attraction:', error)
    res.status(400).json({ message: 'Failed to update attraction' })
  }
}

export const deleteAttraction = async (req: Request, res: Response) => {
  try {
    const attraction = await Attraction.findByIdAndDelete(req.params.id)

    if (!attraction) {
      res.status(404).json({ message: 'Attraction not found' })
      return
    }

    res.json({ message: 'Attraction deleted successfully' })
  } catch (error) {
    console.error('Error deleting attraction:', error)
    res.status(500).json({ message: 'Failed to delete attraction' })
  }
}

export const searchNearbyAttractions = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius } = req.query

    if (!lat || !lng) {
      res.status(400).json({ message: 'Latitude and longitude are required' })
      return
    }

    const location = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string),
    }

    const searchRadius = radius ? parseInt(radius as string) : 10000

    const nearbyPlaces = await googlePlacesService.getNearbyAttractions(location, searchRadius)

    res.json(nearbyPlaces)
  } catch (error) {
    console.error('Error searching nearby attractions:', error)
    res.status(500).json({ message: 'Failed to search nearby attractions' })
  }
}

export const importFromGooglePlaces = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.body

    if (!placeId) {
      res.status(400).json({ message: 'Place ID is required' })
      return
    }

    // Check if attraction already exists
    const existingAttraction = await Attraction.findOne({ googlePlaceId: placeId })

    if (existingAttraction) {
      res.status(400).json({ message: 'Attraction already imported' })
      return
    }

    const placeDetails = await googlePlacesService.getPlaceDetails(placeId)

    // Determine category based on place types
    const category = determineCategoryFromTypes(placeDetails.types)

    const newAttraction: Partial<IAttraction> = {
      name: placeDetails.name,
      description:
        placeDetails.editorial_summary?.overview ||
        'No description available. This information was imported from Google Places.',
      category,
      location: {
        lat: placeDetails.geometry.location.lat,
        lng: placeDetails.geometry.location.lng,
      },
      images: placeDetails.photos
        ? placeDetails.photos
            .slice(0, 5)
            .map(
              (photo: any) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            )
        : [],
      rating: placeDetails.rating,
      address: placeDetails.formatted_address,
      googlePlaceId: placeId,
    }

    const attraction = new Attraction(newAttraction)
    await attraction.save()

    res.status(201).json(attraction)
  } catch (error) {
    console.error('Error importing from Google Places:', error)
    res.status(500).json({ message: 'Failed to import from Google Places' })
  }
}

export const getAttractionReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const attraction = await Attraction.findById(id)

    if (!attraction) {
      res.status(404).json({ message: 'Attraction not found' })
      return
    }

    if (!attraction.googlePlaceId) {
      res.status(400).json({ message: 'No Google Place ID available for this attraction' })
      return
    }

    const placeDetails = await googlePlacesService.getPlaceDetails(attraction.googlePlaceId)

    const reviews = await googlePlacesService.getPlaceReviews(attraction.googlePlaceId)

    res.json({ reviews })
  } catch (error) {
    console.error('Error getting attraction reviews:', error)
    res.status(500).json({ message: 'Failed to get attraction reviews' })
  }
}
