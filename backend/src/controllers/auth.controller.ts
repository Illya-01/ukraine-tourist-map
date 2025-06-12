import { Request, Response } from 'express'
import User, { IUser } from '../models/User'
import jwt from 'jsonwebtoken'
import config from '../config'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ message: 'Користувач з цією поштою вже існує' })
      return
    }

    const user = new User({
      email,
      password,
      name,
    })

    await user.save()

    const token = user.generateAuthToken()

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      favorites: user.favorites,
    }

    res.status(201).json({ user: userData, token })
  } catch (error) {
    console.error('Error in register:', error)
    res.status(500).json({ message: 'Помилка сервера при реєстрації' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      res.status(401).json({ message: 'Неправильна пошта чи пароль' })
      return
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ message: 'Неправильна пошта чи пароль' })
      return
    }

    const token = user.generateAuthToken()

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      favorites: user.favorites,
    }

    res.json({ user: userData, token })
  } catch (error) {
    console.error('Error in login:', error)
    res.status(500).json({ message: 'Помилка сервера при вході' })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user

    if (!user) {
      res.status(401).json({ message: 'Не підтверджено автентичність' })
      return
    }

    res.json(user)
  } catch (error) {
    console.error('Error getting current user:', error)
    res.status(500).json({ message: 'Помилка сервера' })
  }
}

export const updateFavorites = async (req: Request, res: Response) => {
  try {
    const { attractionId } = req.body
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ message: 'Не підтверджено автентичність' })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ message: 'Не знайдено користувача' })
      return
    }

    // Check if attraction is already in favorites
    const index = user.favorites.indexOf(attractionId)

    if (index > -1) {
      user.favorites.splice(index, 1)
    } else {
      user.favorites.push(attractionId)
    }

    await user.save()

    res.json({ favorites: user.favorites })
  } catch (error) {
    console.error('Error updating favorites:', error)
    res.status(500).json({ message: 'Помилка сервера' })
  }
}
