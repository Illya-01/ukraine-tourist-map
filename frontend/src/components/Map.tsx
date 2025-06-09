import { useCallback, useState, useRef, useEffect } from 'react'
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  MarkerClusterer,
} from '@react-google-maps/api'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { Box, Typography, CircularProgress, Fab } from '@mui/material'
import ExploreIcon from '@mui/icons-material/Explore'
import { Attraction, AttractionCategory, UserFavorites } from '../types'
import MapLegend from './MapLegend'
import { fetchNearbyAttractions } from '../services/api.service'
import StarRating from './StarRating'
import LazyImage from './LazyImage'
import { getImageUrl } from '../utils'
import FavoriteButton from './FavoriteButton'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

// Координати центру України
const DEFAULT_CENTER = { lat: 49.0, lng: 31.0 }
const DEFAULT_ZOOM = 6

interface MapComponentProps {
  attractions: Attraction[]
  isLoading: boolean
  onSelectAttraction?: (attraction: Attraction) => void
  onAddAttractions?: (attractions: Attraction[]) => void
  onOpenAuthModal?: () => void
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const options = {
  disableDefaultUI: false,
  zoomControl: true,
}

const clusterOptions = {
  gridSize: 50,
  maxZoom: 15,
  minimumClusterSize: 3,
}

const getMarkerIcon = (category: AttractionCategory): string => {
  switch (category) {
    case AttractionCategory.HISTORICAL:
      return 'img/marker-historical-sm.png'
    case AttractionCategory.NATURAL:
      return 'img/marker-natural-sm.png'
    case AttractionCategory.CULTURAL:
      return 'img/marker-cultural-sm.png'
    case AttractionCategory.RELIGIOUS:
      return 'img/marker-religious-sm.png'
    case AttractionCategory.ENTERTAINMENT:
      return 'img/marker-entertainment-sm.png'
    default:
      return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
  }
}

export default function MapComponent({
  attractions,
  isLoading,
  onSelectAttraction,
  onAddAttractions,
  onOpenAuthModal,
}: MapComponentProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const [loadingNearby, setLoadingNearby] = useState(false)
  const [userLocation, setUserLocation] = useState<null | { lat: number; lng: number }>(null)
  const [favorites, setFavorites] = useState<UserFavorites>({})
  const mapRef = useRef<google.maps.Map | null>(null)

  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          if (mapRef.current) {
            mapRef.current.panTo(location)
            mapRef.current.setZoom(13)
          }
        },
        () => {
          alert('Не вдалося отримати ваше місцезнаходження')
        }
      )
    } else {
      alert('Геолокація не підтримується вашим браузером')
    }
  }

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    if (loadError) {
      console.error('Error loading Google Maps API:', loadError)
      showSnackbar(
        "Не вдалося завантажити Google Maps. Перевірте ваше з'єднання з Інтернетом.",
        'error'
      )
    }
  }, [loadError])

  const handleMarkerClick = useCallback(
    (attraction: Attraction) => {
      setSelectedAttraction(attraction)
      if (onSelectAttraction) {
        onSelectAttraction(attraction)
      }
    },
    [onSelectAttraction]
  )

  const handleInfoWindowClose = useCallback(() => {
    setSelectedAttraction(null)
  }, [])

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const handleMapCenterChanged = useCallback(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter()
      if (center) {
        setMapCenter({
          lat: center.lat(),
          lng: center.lng(),
        })
      }
    }
  }, [])

  const handleFetchNearbyAttractions = useCallback(async () => {
    if (!onAddAttractions) return

    setLoadingNearby(true)
    try {
      const nearbyAttractions = await fetchNearbyAttractions(mapCenter.lat, mapCenter.lng, 15000)
      if (nearbyAttractions.length > 0) {
        onAddAttractions(nearbyAttractions)
      } else {
        alert("Пам'яток поблизу не знайдено. Спробуйте змінити масштаб або перемістити карту.")
      }
    } catch (error) {
      console.error("Помилка отримання пам'яток поблизу:", error)
      alert("Не вдалося отримати пам'ятки поблизу. Будь ласка, спробуйте ще раз.")
    } finally {
      setLoadingNearby(false)
    }
  }, [mapCenter, onAddAttractions])

  if (loadError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography color="error">Помилка завантаження карти</Typography>
      </Box>
    )
  }

  if (!isLoaded || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={DEFAULT_ZOOM}
        center={DEFAULT_CENTER}
        options={options}
        onLoad={handleMapLoad}
        onCenterChanged={handleMapCenterChanged}
      >
        <MarkerClusterer options={{ ...clusterOptions }}>
          {clusterer => (
            <>
              {attractions.map((attraction, index) => (
                <Marker
                  key={attraction.id ? `marker-${attraction.id}` : `marker-index-${index}`}
                  position={attraction.location}
                  onClick={() => handleMarkerClick(attraction)}
                  icon={getMarkerIcon(attraction.category)}
                  clusterer={clusterer}
                />
              ))}
            </>
          )}
        </MarkerClusterer>

        {selectedAttraction && (
          <InfoWindow
            key={selectedAttraction.id ? `info-${selectedAttraction.id}` : 'info-selected'}
            position={selectedAttraction.location}
            onCloseClick={handleInfoWindowClose}
          >
            <Box sx={{ position: 'relative', width: '100%' }}>
              {selectedAttraction.images && selectedAttraction.images.length > 0 && (
                <LazyImage
                  src={getImageUrl(selectedAttraction.images[0])}
                  alt={selectedAttraction.name}
                  height={120}
                  borderRadius={1}
                  sx={{ mb: 1 }}
                  fallbackSrc="img/default-image.png"
                />
              )}
              <Box p={1} maxWidth={240}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ lineHeight: 1.25, mb: 1 }}
                >
                  {selectedAttraction.name}
                </Typography>

                <Typography variant="body2">
                  {selectedAttraction.description.length > 100
                    ? `${selectedAttraction.description.substring(0, 100)}...`
                    : selectedAttraction.description}
                </Typography>

                {selectedAttraction.rating && (
                  <StarRating rating={selectedAttraction.rating} showValue={true} size="small" />
                )}
              </Box>

              <FavoriteButton
                attractionId={selectedAttraction.id}
                position="absolute"
                top={5}
                right={5}
                onOpenAuthModal={onOpenAuthModal}
                size="medium"
              />
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>

      <MapLegend />

      <Fab
        color="primary"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        onClick={handleFetchNearbyAttractions}
        disabled={loadingNearby}
        title="Знайти пам'ятки поблизу"
      >
        {loadingNearby ? <CircularProgress size={24} color="inherit" /> : <ExploreIcon />}
      </Fab>

      <Fab
        color="primary"
        sx={{ position: 'absolute', bottom: 16, right: 80 }}
        onClick={handleGetUserLocation}
        title="Моє місцезнаходження"
      >
        <MyLocationIcon />
      </Fab>
    </Box>
  )
}
function showSnackbar(arg0: string, arg1: string) {
  throw new Error('Function not implemented.')
}
