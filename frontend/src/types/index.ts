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
  googlePlaceId?: string
}

export interface Review {
  _id: string
  attraction: string
  user?:
    | string
    | {
        _id: string
        name: string
        photo?: string | null
      }
  userName: string
  userPhotoUrl?: string
  rating: number
  text: string
  date: string
  source: 'google' | 'user'
  googleReviewId?: string
  language?: string
  googleProfileUrl?: string
  createdAt: string
  updatedAt: string
}

export interface NewReview {
  rating: number
  text: string
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

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  favorites: string[]
  photo?: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}
