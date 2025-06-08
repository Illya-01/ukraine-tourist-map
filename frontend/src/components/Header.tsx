import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import FilterListIcon from '@mui/icons-material/FilterList'
import { AttractionCategory } from '../types'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}))

interface HeaderProps {
  onMenuToggle: () => void
  onSearch: (query: string) => void
  onCategorySelect: (category: AttractionCategory | null) => void
}

export default function Header({ onMenuToggle, onSearch, onCategorySelect }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCategorySelect = (category: AttractionCategory | null) => {
    onCategorySelect(category)
    handleClose()
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
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Пошук пам'яток..."
            inputProps={{ 'aria-label': 'пошук' }}
            onChange={e => onSearch(e.target.value)}
          />
        </Search>
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
        <Menu
          id="category-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'filter-button',
          }}
        >
          <MenuItem onClick={() => handleCategorySelect(null)}>Усі категорії</MenuItem>
          <MenuItem onClick={() => handleCategorySelect(AttractionCategory.HISTORICAL)}>
            Історичні
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect(AttractionCategory.NATURAL)}>
            Природні
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect(AttractionCategory.CULTURAL)}>
            Культурні
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect(AttractionCategory.ENTERTAINMENT)}>
            Розважальні
          </MenuItem>
          <MenuItem onClick={() => handleCategorySelect(AttractionCategory.RELIGIOUS)}>
            Релігійні
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
