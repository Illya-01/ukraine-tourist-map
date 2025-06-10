export const getImageUrl = (image: string, options?: { defaultImage?: string }): string => {
  const defaultImage = options?.defaultImage || 'img/default-image.png'

  if (!image) {
    return defaultImage
  }

  if (image.startsWith('http')) {
    return image
  }

  // Handle image paths that already include /images/
  if (image.startsWith('/images/')) {
    return image
  }

  // Standard case - prepend /images/ to the path
  return `/images/${image}`
}

export const getCategoryName = (category: string): string => {
  const categories: Record<string, string> = {
    historical: 'Історична',
    natural: 'Природна',
    cultural: 'Культурна',
    entertainment: 'Розважальна',
    religious: 'Релігійна',
  }
  return categories[category] || category
}

export const getCategoryColor = (
  category: string
): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
  const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
    historical: 'primary',
    natural: 'success',
    cultural: 'secondary',
    entertainment: 'warning',
    religious: 'error',
  }
  return colors[category] || 'primary'
}
