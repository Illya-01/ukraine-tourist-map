import mongoose from 'mongoose'
import config from '../config'

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri)
    console.info('Connected to MongoDB')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}
