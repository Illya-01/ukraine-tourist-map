import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { connectToDatabase } from './utils/db'
import attractionRoutes from './routes/attraction.routes'
import reviewRoutes from './routes/review.routes'
import authRoutes from './routes/auth.routes'
import config from './config'

const app = express()

connectToDatabase()

app.use(helmet())
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
)
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

app.use('/api/attractions', attractionRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

const PORT = config.port
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})
