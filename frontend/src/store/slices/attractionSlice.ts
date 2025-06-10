import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Attraction, AttractionCategory } from '../../types'
import { fetchAttractions } from '../../services/attraction.service'

interface AttractionState {
  attractions: Attraction[]
  filteredAttractions: Attraction[]
  selectedAttraction: Attraction | null
  selectedCategory: AttractionCategory | null
  searchQuery: string
  loading: boolean
  error: string | null
}

const initialState: AttractionState = {
  attractions: [],
  filteredAttractions: [],
  selectedAttraction: null,
  selectedCategory: null,
  searchQuery: '',
  loading: false,
  error: null,
}

// Helper function to filter attractions
const applyFilters = (
  attractions: Attraction[],
  category: AttractionCategory | null,
  searchQuery: string
): Attraction[] => {
  return attractions.filter(attraction => {
    // Filter by category
    const matchesCategory = category === null || attraction.category === category

    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attraction.address && attraction.address.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })
}

// Async thunk for fetching attractions
export const fetchAllAttractions = createAsyncThunk('attractions/fetchAll', async () => {
  const attractions = await fetchAttractions()
  return attractions
})

const attractionSlice = createSlice({
  name: 'attractions',
  initialState,
  reducers: {
    setSelectedAttraction: (state, action: PayloadAction<Attraction | null>) => {
      state.selectedAttraction = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<AttractionCategory | null>) => {
      state.selectedCategory = action.payload
      // Reapply filters when category changes
      state.filteredAttractions = applyFilters(state.attractions, action.payload, state.searchQuery)
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      // Reapply filters when search query changes
      state.filteredAttractions = applyFilters(
        state.attractions,
        state.selectedCategory,
        action.payload
      )
      console.log('Filtered attractions count:', state.filteredAttractions.length) // Debug log
    },
    addAttractions: (state, action: PayloadAction<Attraction[]>) => {
      // Add new attractions, avoiding duplicates
      const newAttractions = action.payload.filter(
        newAttraction => !state.attractions.some(existing => existing.id === newAttraction.id)
      )

      if (newAttractions.length > 0) {
        state.attractions = [...state.attractions, ...newAttractions]
        // Reapply filters with updated attractions list
        state.filteredAttractions = applyFilters(
          state.attractions,
          state.selectedCategory,
          state.searchQuery
        )
      }
    },
    clearFilters: state => {
      state.selectedCategory = null
      state.searchQuery = ''
      state.filteredAttractions = [...state.attractions]
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllAttractions.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllAttractions.fulfilled, (state, action) => {
        state.loading = false
        state.attractions = action.payload
        // Apply current filters to newly loaded attractions
        state.filteredAttractions = applyFilters(
          action.payload,
          state.selectedCategory,
          state.searchQuery
        )
      })
      .addCase(fetchAllAttractions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch attractions'
      })
  },
})

export const {
  setSelectedAttraction,
  setSelectedCategory,
  setSearchQuery,
  addAttractions,
  clearFilters,
} = attractionSlice.actions

export default attractionSlice.reducer
