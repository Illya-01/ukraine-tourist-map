import { Box, Typography } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'

interface EmptyStateProps {
  message?: string
  icon?: React.ReactNode
}

export default function EmptyState({
  message = "Пам'ятки не знайдені. Спробуйте змінити фільтри пошуку.",
  icon,
}: EmptyStateProps) {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      {icon && <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>{icon}</Box>}
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  )
}
