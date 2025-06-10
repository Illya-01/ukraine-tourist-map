import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'
import config from '../config'

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        name: string
        role: string
        favorites: string[]
        photo?: string
      }
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' })
      return
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string }

    const user = (await User.findById(decoded.id)) as IUser
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      favorites: user.favorites,
      photo: user.photo,
    }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
    return
  }
}

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied' })
    return
  }
  next()
}
