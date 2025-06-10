import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { alpha } from '@mui/material/styles'
import MapIcon from '@mui/icons-material/Map'
import ViewListIcon from '@mui/icons-material/ViewList'

interface ViewToggleProps {
  viewMode: 'map' | 'list'
  onViewModeChange: (mode: 'map' | 'list') => void
}

export default function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: 'map' | 'list' | null
  ) => {
    if (newMode !== null) {
      onViewModeChange(newMode)
    }
  }

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={handleViewModeChange}
      aria-label="view mode"
      size="small"
      sx={{
        mr: 2,
        '& .MuiToggleButton-root': {
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.23)',
          '&:hover': {
            backgroundColor: alpha('#ffffff', 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha('#ffffff', 0.16),
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.24),
            },
          },
        },
      }}
    >
      <ToggleButton value="map" aria-label="map view">
        <MapIcon />
      </ToggleButton>
      <ToggleButton value="list" aria-label="list view">
        <ViewListIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
