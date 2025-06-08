import mongoose, { Schema, Document } from 'mongoose'
import { AttractionCategory } from '../types'

export interface IAttraction extends Document {
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

const AttractionSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(AttractionCategory),
      required: true,
      index: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    images: { type: [String], required: true },
    rating: { type: Number },
    address: { type: String, required: true },
    googlePlaceId: { type: String },
  },
  { timestamps: true }
)

// Add geospatial index for location-based queries
AttractionSchema.index({ location: '2dsphere' })

export default mongoose.model<IAttraction>('Attraction', AttractionSchema)
