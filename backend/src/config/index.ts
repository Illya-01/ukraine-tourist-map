import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export default {
  port: process.env.PORT || 8080,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ukraine-tourist-map',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  environment: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  // TODO: UPDATE THIS IN PRODUCTION
  jwtSecret: process.env.JWT_SECRET || 'my-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
}
