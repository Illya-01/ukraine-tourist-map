import { useEffect } from 'react'
import { Box, CssBaseline, ThemeProvider, createTheme, Snackbar, Alert } from '@mui/material'
import Header from './components/layout/Header'
import MapComponent from './components/map/Map'
import Sidebar from './components/layout/Sidebar'
import AttractionsList from './components/attractions/AttractionList'
import AuthModal from './components/auth/AuthModal'
import FavoritesDialog from './components/attractions/FavoritesDialog'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchAllAttractions, setSelectedAttraction } from './store/slices/attractionSlice'
import { fetchCurrentUser } from './store/slices/authSlice'
import {
  hideSnackbar,
  closeSidebar,
  toggleAuthModal,
  showSnackbar,
  openSidebar,
} from './store/slices/uiSlice'

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
  const dispatch = useAppDispatch()

  const {
    filteredAttractions,
    selectedAttraction,
    loading: isAttractionLoading,
  } = useAppSelector(state => state.attractions)

  const { sidebarOpen, authModalOpen, favoritesDialogOpen, viewMode, snackbar } = useAppSelector(
    state => state.ui
  )

  useEffect(() => {
    dispatch(fetchAllAttractions(undefined))
    dispatch(fetchCurrentUser())
  }, [dispatch])

  const handleOpenAuthModal = () => {
    dispatch(toggleAuthModal(true))
  }

  const handleNotification = (message: string, severity: 'success' | 'error') => {
    dispatch(showSnackbar({ message, severity }))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />

        <Box component="main" sx={{ flexGrow: 1, position: 'relative' }}>
          {viewMode === 'map' ? (
            <MapComponent
              attractions={filteredAttractions}
              isLoading={isAttractionLoading}
              onSelectAttraction={attraction => {
                dispatch(setSelectedAttraction(attraction))
                dispatch(openSidebar())
              }}
              onOpenAuthModal={handleOpenAuthModal}
              showNotification={handleNotification}
            />
          ) : (
            <AttractionsList
              attractions={filteredAttractions}
              onSelectAttraction={attraction => {
                dispatch(setSelectedAttraction(attraction))
                dispatch(openSidebar())
              }}
              onOpenAuthModal={handleOpenAuthModal}
            />
          )}
        </Box>

        <Sidebar
          open={sidebarOpen}
          attraction={selectedAttraction}
          onClose={() => dispatch(closeSidebar())}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => dispatch(hideSnackbar())}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={() => dispatch(hideSnackbar())}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <AuthModal open={authModalOpen} />
        <FavoritesDialog open={favoritesDialogOpen} />
      </Box>
    </ThemeProvider>
  )
}

export default App
