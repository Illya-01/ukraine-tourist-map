export interface Location {
  id: string
  name: string
  description: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

export interface User {
  id: string
  username: string
  email: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}
