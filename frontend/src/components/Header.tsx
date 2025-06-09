import { useState } from 'react'
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FilterListIcon from '@mui/icons-material/FilterList'
import { AttractionCategory } from '../types'
import SearchBar from './SearchBar'
import ViewToggle from './ViewToggle'
import CategoryFilter from './CategoryFilter'
import UserMenu from './UserMenu'

interface HeaderProps {
  onMenuToggle: () => void
  onSearch: (query: string) => void
  onCategorySelect: (category: AttractionCategory | null) => void
  onViewModeChange: (mode: 'map' | 'list') => void
  viewMode: 'map' | 'list'
  onOpenAuth: () => void
  onOpenFavorites: () => void
}

export default function Header({
  onMenuToggle,
  onSearch,
  onCategorySelect,
  onViewModeChange,
  viewMode,
  onOpenAuth,
  onOpenFavorites,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="відкрити меню"
          sx={{ mr: 2 }}
          onClick={onMenuToggle}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          Туристична карта України
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

        <SearchBar onSearch={onSearch} />

        <IconButton
          size="large"
          color="inherit"
          onClick={handleFilterClick}
          aria-controls={open ? 'category-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          title="Фільтрувати за категоріями"
        >
          <FilterListIcon />
        </IconButton>

        <CategoryFilter
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onCategorySelect={onCategorySelect}
        />

        <UserMenu onLogin={onOpenAuth} onOpenFavorites={onOpenFavorites} />
      </Toolbar>
    </AppBar>
  )
}
