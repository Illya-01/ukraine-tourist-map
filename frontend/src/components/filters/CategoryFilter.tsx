import { Menu, MenuItem, Divider, Typography } from '@mui/material'
import { AttractionCategory } from '../../types'
import { getCategoryName, getCategoryColor } from '../../utils'

interface CategoryFilterProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onSelect: (category: AttractionCategory | null) => void
  selectedCategory: AttractionCategory | null
}

export default function CategoryFilter({
  anchorEl,
  open,
  onClose,
  onSelect,
  selectedCategory,
}: CategoryFilterProps) {
  const handleCategorySelect = (category: AttractionCategory | null) => {
    onSelect(category)
    onClose()
  }

  const categories = Object.values(AttractionCategory)

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'filter-button',
      }}
    >
      <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 'bold' }}>
        Фільтр за категорією
      </Typography>
      <Divider />

      <MenuItem onClick={() => handleCategorySelect(null)} selected={selectedCategory === null}>
        Усі категорії
      </MenuItem>

      {categories.map(category => (
        <MenuItem
          key={category}
          onClick={() => handleCategorySelect(category)}
          selected={selectedCategory === category}
          sx={{
            '&.Mui-selected': {
              backgroundColor: theme => `${theme.palette[getCategoryColor(category)].main}22`,
            },
            '&.Mui-selected:hover': {
              backgroundColor: theme => `${theme.palette[getCategoryColor(category)].main}33`,
            },
          }}
        >
          {getCategoryName(category)}
        </MenuItem>
      ))}
    </Menu>
  )
}
