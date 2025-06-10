import { Attraction, AttractionCategory } from '../types'
import config from '../config'
import { mockAttractions } from '../utils/mockdata'

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const fetchAttractions = async (category?: AttractionCategory): Promise<Attraction[]> => {
  try {
    let url = `${config.API_BASE_URL}/attractions`

    // Add category filter if provided
    if (category) {
      url += `?category=${category}`
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Transform backend data to match frontend Attraction type
    return data.map((item: any) => ({
      id: item._id || item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      location: item.location,
      images: item.images,
      rating: item.rating,
      address: item.address,
    }))
  } catch (error) {
    console.error('Error fetching attractions:', error)
    // Fallback to mock data if API fails
    return mockAttractions
  }
}

export const fetchAttractionById = async (id: string): Promise<Attraction | undefined> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/attractions/${id}`)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return {
      id: data._id || data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      location: data.location,
      images: data.images,
      rating: data.rating,
      address: data.address,
    }
  } catch (error) {
    console.error(`Error fetching attraction ${id}:`, error)
    return mockAttractions.find(a => a.id === id)
  }
}

// New function to fetch nearby attractions
export const fetchNearbyAttractions = async (
  lat: number,
  lng: number,
  radius: number = 10000
): Promise<Attraction[]> => {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/attractions/search/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return data.map((item: any) => ({
      id: item.id || item.placeId,
      name: item.name,
      description: item.description || 'Tourist attraction in Ukraine',
      category: AttractionCategory.HISTORICAL, // Default category, will be updated if imported
      location: item.location,
      images: item.photos || [],
      rating: item.rating,
      address: item.address,
      placeId: item.placeId,
    }))
  } catch (error) {
    console.error('Error fetching nearby attractions:', error)
    return []
  }
}

export const importAttractionFromGoogle = async (placeId: string): Promise<Attraction | null> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/attractions/import/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeId }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return {
      id: data._id,
      name: data.name,
      description: data.description,
      category: data.category,
      location: data.location,
      images: data.images,
      rating: data.rating,
      address: data.address,
    }
  } catch (error) {
    console.error('Error importing attraction:', error)
    return null
  }
}
