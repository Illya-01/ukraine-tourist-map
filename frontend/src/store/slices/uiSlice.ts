import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  authModalOpen: boolean
  favoritesDialogOpen: boolean
  viewMode: 'map' | 'list'
  snackbar: {
    open: boolean
    message: string
    severity: 'success' | 'error'
  }
}

const initialState: UIState = {
  sidebarOpen: false,
  authModalOpen: false,
  favoritesDialogOpen: false,
  viewMode: 'map',
  snackbar: {
    open: false,
    message: '',
    severity: 'success',
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state, action: PayloadAction<boolean | undefined>) {
      state.sidebarOpen = action.payload !== undefined ? action.payload : !state.sidebarOpen
    },
    openSidebar(state) {
      state.sidebarOpen = true
    },
    closeSidebar(state) {
      state.sidebarOpen = false
    },
    toggleAuthModal(state, action: PayloadAction<boolean>) {
      state.authModalOpen = action.payload
    },
    toggleFavoritesDialog(state, action: PayloadAction<boolean>) {
      state.favoritesDialogOpen = action.payload
    },
    setViewMode(state, action: PayloadAction<'map' | 'list'>) {
      state.viewMode = action.payload
    },
    showSnackbar(state, action: PayloadAction<{ message: string; severity: 'success' | 'error' }>) {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      }
    },
    hideSnackbar(state) {
      state.snackbar.open = false
    },
  },
})

export const {
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleAuthModal,
  toggleFavoritesDialog,
  setViewMode,
  showSnackbar,
  hideSnackbar,
} = uiSlice.actions

export default uiSlice.reducer
