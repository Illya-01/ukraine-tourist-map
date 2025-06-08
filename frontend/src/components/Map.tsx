import { useCallback, useState, useRef } from 'react'
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  MarkerClusterer,
} from '@react-google-maps/api'
import { Box, Typography, CircularProgress, Fab, Rating } from '@mui/material'
import ExploreIcon from '@mui/icons-material/Explore'
import { Attraction, AttractionCategory } from '../types'
import MapLegend from './MapLegend'
import { fetchNearbyAttractions } from '../services/api'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

// Координати центру України
const DEFAULT_CENTER = { lat: 49.0, lng: 31.0 }
const DEFAULT_ZOOM = 6

interface MapComponentProps {
  attractions: Attraction[]
  isLoading: boolean
  onSelectAttraction?: (attraction: Attraction) => void
  onAddAttractions?: (attractions: Attraction[]) => void
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const options = {
  disableDefaultUI: false,
  zoomControl: true,
}

// Опції кластеризації
const clusterOptions = {
  gridSize: 50,
  maxZoom: 15,
  minimumClusterSize: 3,
}

// Функція для отримання іконки маркера відповідно до категорії
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
}: MapComponentProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })

  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const [loadingNearby, setLoadingNearby] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

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
            <Box p={1} maxWidth={240}>
              {selectedAttraction.images && selectedAttraction.images.length > 0 && (
                <Box
                  component="img"
                  src={
                    selectedAttraction.images[0].startsWith('http')
                      ? selectedAttraction.images[0]
                      : `/images/${selectedAttraction.images[0]}`
                  }
                  alt={selectedAttraction.name}
                  sx={{
                    width: '100%',
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mb: 1,
                  }}
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.onerror = null
                    target.src = 'img/default-image.png'
                  }}
                />
              )}
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
                <Box display="flex" alignItems="center" mt={1}>
                  <Rating value={selectedAttraction.rating} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    {selectedAttraction.rating.toFixed(1)}
                  </Typography>
                </Box>
              )}
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
    </Box>
  )
}
