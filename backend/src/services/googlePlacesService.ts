import { Client, PlaceInputType, Language, PlaceType1 } from '@googlemaps/google-maps-services-js'
import { PlaceSearchResult, Location } from '../types'
import config from '../config'

class GooglePlacesService {
  private client: Client

  constructor() {
    this.client = new Client({})
  }

  async searchPlaces(
    query: string,
    location: Location,
    radius: number = 50000, // 50km radius
    type?: PlaceType1
  ): Promise<PlaceSearchResult[]> {
    try {
      const response = await this.client.textSearch({
        params: {
          query,
          location: `${location.lat},${location.lng}`,
          radius,
          type,
          language: Language.uk, // Ukrainian results
          key: config.googleMapsApiKey,
        },
      })

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`)
      }

      return response.data.results.map(place => ({
        id: place.place_id || '',
        name: place.name || '',
        location: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0,
        },
        address: place.formatted_address || '',
        rating: place.rating || 0,
        photos:
          place.photos?.map(
            photo =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${
                photo.photo_reference
              }&key=${config.googleMapsApiKey}`
          ) || [],
        placeId: place.place_id || '',
      }))
    } catch (error) {
      console.error('Error searching places:', error)
      throw error
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          fields: [
            'name',
            'formatted_address',
            'geometry',
            'photos',
            'rating',
            'opening_hours',
            'editorial_summary',
          ],
          language: Language.uk,
          key: config.googleMapsApiKey,
        },
      })

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`)
      }

      return response.data.result
    } catch (error) {
      console.error('Error getting place details:', error)
      throw error
    }
  }

  async getNearbyAttractions(
    location: Location,
    radius: number = 10000,
    type: PlaceType1 = PlaceType1.tourist_attraction
  ): Promise<PlaceSearchResult[]> {
    try {
      const response = await this.client.placesNearby({
        params: {
          location: `${location.lat},${location.lng}`,
          radius,
          type,
          language: Language.uk,
          key: config.googleMapsApiKey,
        },
      })

      if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API error: ${response.data.status}`)
      }

      if (response.data.status === 'ZERO_RESULTS') {
        return []
      }

      return response.data.results.map(place => ({
        id: place.place_id || '',
        name: place.name || '',
        location: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0,
        },
        address: place.vicinity || '',
        rating: place.rating || 0,
        photos:
          place.photos?.map(
            photo =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${
                photo.photo_reference
              }&key=${config.googleMapsApiKey}`
          ) || [],
        placeId: place.place_id || '',
      }))
    } catch (error) {
      console.error('Error getting nearby attractions:', error)
      throw error
    }
  }
}

export default new GooglePlacesService()
