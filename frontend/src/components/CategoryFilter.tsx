import { Menu, MenuItem } from '@mui/material'
import { AttractionCategory } from '../types'

interface CategoryFilterProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onCategorySelect: (category: AttractionCategory | null) => void
}

export default function CategoryFilter({
  anchorEl,
  open,
  onClose,
  onCategorySelect,
}: CategoryFilterProps) {
  const handleCategorySelect = (category: AttractionCategory | null) => {
    onCategorySelect(category)
    onClose()
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'filter-button',
      }}
    >
      <MenuItem onClick={() => handleCategorySelect(null)}>Усі категорії</MenuItem>
      <MenuItem onClick={() => handleCategorySelect(AttractionCategory.HISTORICAL)}>
        Історичні
      </MenuItem>
      <MenuItem onClick={() => handleCategorySelect(AttractionCategory.NATURAL)}>Природні</MenuItem>
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
  )
}
