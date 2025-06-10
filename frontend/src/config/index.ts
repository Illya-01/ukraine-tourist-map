const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const GOOGLE_MAPS_API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export default {
  API_BASE_URL,
  GOOGLE_MAPS_API_KEY,
}
