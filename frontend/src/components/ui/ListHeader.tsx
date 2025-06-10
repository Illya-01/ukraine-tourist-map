import { Box, Typography } from '@mui/material'

interface ListHeaderProps {
  title: string
  count: number
  subtitle?: string
}

export default function ListHeader({ title, count, subtitle }: ListHeaderProps) {
  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="h6" component="h2">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle || `Знайдено: ${count} пам'яток`}
      </Typography>
    </Box>
  )
}
