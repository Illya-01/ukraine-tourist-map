import { useState, useEffect, useRef } from 'react'
import { Box, Skeleton } from '@mui/material'

interface LazyImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  width?: string | number
  height?: string | number
  borderRadius?: number | string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  sx?: any
}

export default function LazyImage({
  src,
  alt,
  fallbackSrc = 'img/default-image.png',
  width = '100%',
  height = 'auto',
  borderRadius = 0,
  objectFit = 'cover',
  sx = {},
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer.disconnect() // Stop observing once the element is in view
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    // Only load the image when it's in view
    if (isInView) {
      setImgSrc(src)
    }
  }, [isInView, src])

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  // Handle image load error
  const handleImageError = () => {
    setImgSrc(fallbackSrc)
  }

  return (
    <Box
      ref={imgRef}
      sx={{
        width,
        height,
        position: 'relative',
        borderRadius,
        overflow: 'hidden',
        backgroundColor: 'action.hover',
        ...sx,
      }}
    >
      {(!isInView || !isLoaded) && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}

      {isInView && imgSrc && (
        <Box
          component="img"
          src={imgSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sx={{
            width: '100%',
            height: '100%',
            objectFit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        />
      )}
    </Box>
  )
}
