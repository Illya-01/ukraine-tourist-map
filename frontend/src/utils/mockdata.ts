import { Attraction, AttractionCategory } from '../types'

export const mockAttractions: Attraction[] = [
  {
    id: '1',
    name: 'Києво-Печерська Лавра',
    description: 'An ancient monastery complex and UNESCO World Heritage site',
    category: AttractionCategory.RELIGIOUS,
    location: {
      lat: 50.434,
      lng: 30.557,
    },
    images: ['lavra.webp'],
    rating: 4.8,
    address: 'Lavrska St, 15, Kyiv, Ukraine',
  },
  {
    id: '2',
    name: "Кам'янець-Подільська фортеця",
    description: 'A medieval fortress dating back to the 14th century',
    category: AttractionCategory.HISTORICAL,
    location: {
      lat: 48.672,
      lng: 26.563,
    },
    images: ['podilsk.webp'],
    rating: 4.7,
    address: 'Zamkova St, 1, Kamianets-Podilskyi, Ukraine',
  },
  {
    id: '3',
    name: 'Софіївський парк',
    description: 'A scenic arboretum and scientific-researching institute',
    category: AttractionCategory.NATURAL,
    location: {
      lat: 48.763,
      lng: 30.227,
    },
    images: ['sofiyivka.webp'],
    rating: 4.9,
    address: 'Kyivska St, 12a, Uman, Ukraine',
  },
]
