import { useState } from 'react'
import { AppBar, Toolbar, Typography, Box, IconButton, Badge } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchBar from '../filters/SearchBar'
import ViewToggle from '../filters/ViewToggle'
import CategoryFilter from '../filters/CategoryFilter'
import UserMenu from './UserMenu'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleSidebar } from '../../store/slices/uiSlice'
import { setSearchQuery, setSelectedCategory } from '../../store/slices/attractionSlice'
import { setViewMode } from '../../store/slices/uiSlice'
import { AttractionCategory } from '../../types'

export default function Header() {
  const dispatch = useAppDispatch()
  const viewMode = useAppSelector(state => state.ui.viewMode)
  const selectedCategory = useAppSelector(state => state.attractions.selectedCategory)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null)

  const handleMenuToggle = () => {
    dispatch(toggleSidebar())
  }

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query))
  }

  const handleCategorySelect = (category: AttractionCategory | null) => {
    dispatch(setSelectedCategory(category))
  }

  const handleViewModeChange = (mode: 'map' | 'list') => {
    dispatch(setViewMode(mode))
  }

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget)
    setFilterOpen(true)
  }

  const handleFilterClose = () => {
    setFilterOpen(false)
    setFilterAnchorEl(null)
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}
          >
            Ukraine Tourist Map
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" flex={1} justifyContent="center" mx={2}>
          <SearchBar onSearch={handleSearch} />
        </Box>

        <Box display="flex" alignItems="center">
          <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />

          <IconButton
            color="inherit"
            onClick={handleFilterClick}
            sx={{ position: 'relative' }}
            aria-label="filter-button"
          >
            <Badge color="secondary" variant="dot" invisible={!selectedCategory}>
              <FilterListIcon />
            </Badge>
          </IconButton>

          <CategoryFilter
            anchorEl={filterAnchorEl}
            open={filterOpen}
            onClose={handleFilterClose}
            onSelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />

          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
