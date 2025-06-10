import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  attraction: mongoose.Types.ObjectId
  user?: mongoose.Types.ObjectId // Optional for Google reviews
  userName: string
  userPhotoUrl?: string
  rating: number
  text: string
  date: Date
  source: 'google' | 'user'
  googleReviewId?: string // To prevent duplicates when re-fetching
  language?: string
  googleProfileUrl?: string
}

const ReviewSchema: Schema = new Schema(
  {
    attraction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attraction',
      required: [true, 'Attraction ID is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Not required for Google reviews
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    userPhotoUrl: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      enum: ['google', 'user'],
      required: true,
      default: 'user',
    },
    googleReviewId: {
      type: String,
      sparse: true, // Only index non-null values
    },
    language: String,
    googleProfileUrl: String,
  },
  { timestamps: true }
)

// Create a compound index to prevent duplicate Google reviews
ReviewSchema.index(
  { googleReviewId: 1, attraction: 1 },
  {
    unique: true,
    partialFilterExpression: { googleReviewId: { $exists: true } },
  }
)

export default mongoose.model<IReview>('Review', ReviewSchema)
