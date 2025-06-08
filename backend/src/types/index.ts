export enum AttractionCategory {
  HISTORICAL = 'historical',
  NATURAL = 'natural',
  CULTURAL = 'cultural',
  ENTERTAINMENT = 'entertainment',
  RELIGIOUS = 'religious',
}

export interface Location {
  lat: number
  lng: number
}

export interface PlaceSearchResult {
  id: string
  name: string
  location: Location
  address: string
  rating?: number
  photos?: string[]
  placeId: string
}
