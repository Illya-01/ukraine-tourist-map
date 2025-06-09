export interface Attraction {
  id: string
  name: string
  description: string
  category: AttractionCategory
  location: {
    lat: number
    lng: number
  }
  images: string[]
  rating?: number
  address: string
}

export enum AttractionCategory {
  HISTORICAL = 'historical',
  NATURAL = 'natural',
  CULTURAL = 'cultural',
  ENTERTAINMENT = 'entertainment',
  RELIGIOUS = 'religious',
}

export interface MapState {
  center: {
    lat: number
    lng: number
  }
  zoom: number
}

export interface UserFavorites {
  [id: string]: boolean
}
