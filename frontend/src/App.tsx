import { useState, useEffect } from 'react'
import { Box, CssBaseline, ThemeProvider, createTheme, Snackbar, Alert } from '@mui/material'
import Header from './components/Header'
import MapComponent from './components/Map'
import Sidebar from './components/Sidebar'
import AttractionsList from './components/AttractionList'
import { Attraction, AttractionCategory } from './types'
import { fetchAttractions } from './services/api.service'
import { AuthProvider } from './contexts/AuthContext'
import AuthModal from './components/AuthModal'
import FavoritesDialog from './components/FavoritesDialog'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<AttractionCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [favoritesDialogOpen, setFavoritesDialogOpen] = useState(false)

  useEffect(() => {
    const loadAttractions = async () => {
      setIsLoading(true)
      try {
        const data = await fetchAttractions(selectedCategory || undefined)
        setAttractions(data)
      } catch (error) {
        console.error("Помилка завантаження пам'яток:", error)
        showSnackbar("Не вдалося завантажити пам'ятки", 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadAttractions()
  }, [selectedCategory])

  const handleAttractionSelect = (attraction: Attraction) => {
    setSelectedAttraction(attraction)
    setSidebarOpen(true)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: AttractionCategory | null) => {
    setSelectedCategory(category)
  }

  const handleViewModeChange = (mode: 'map' | 'list') => {
    setViewMode(mode)
  }

  const handleAddAttractions = (newAttractions: Attraction[]) => {
    // Фільтрація пам'яток, які вже існують (за місцезнаходженням)
    const uniqueAttractions = newAttractions.filter(newAttraction => {
      return !attractions.some(
        existingAttraction =>
          existingAttraction.location.lat === newAttraction.location.lat &&
          existingAttraction.location.lng === newAttraction.location.lng
      )
    })

    if (uniqueAttractions.length > 0) {
      setAttractions(prev => [...prev, ...uniqueAttractions])
      showSnackbar(`Додано ${uniqueAttractions.length} нових пам'яток на карту`, 'success')
    } else {
      showSnackbar("Не знайдено нових пам'яток у цій області", 'error')
    }
  }

  const handleOpenAuth = () => setAuthModalOpen(true)
  const handleCloseAuth = () => setAuthModalOpen(false)
  const handleOpenFavorites = () => setFavoritesDialogOpen(true)
  const handleCloseFavorites = () => setFavoritesDialogOpen(false)

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  // Фільтрація пам'яток за пошуковим запитом та вибраною категорією
  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch =
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? attraction.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Header
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onSearch={handleSearch}
            onCategorySelect={handleCategorySelect}
            onViewModeChange={handleViewModeChange}
            viewMode={viewMode}
            onOpenAuth={handleOpenAuth}
            onOpenFavorites={handleOpenFavorites}
          />

          <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
            {viewMode === 'map' ? (
              <MapComponent
                attractions={filteredAttractions}
                isLoading={isLoading}
                onSelectAttraction={handleAttractionSelect}
                onAddAttractions={handleAddAttractions}
                onOpenAuthModal={handleOpenAuth}
              />
            ) : (
              <AttractionsList
                attractions={filteredAttractions}
                onSelectAttraction={handleAttractionSelect}
                onOpenAuthModal={handleOpenAuth}
              />
            )}
          </Box>

          <Sidebar
            open={sidebarOpen}
            onClose={handleSidebarClose}
            attraction={selectedAttraction}
          />

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <AuthModal open={authModalOpen} onClose={handleCloseAuth} />

          <FavoritesDialog
            open={favoritesDialogOpen}
            onClose={handleCloseFavorites}
            onSelectAttraction={handleAttractionSelect}
          />
        </Box>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
