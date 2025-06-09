import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function MapLegend() {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 1,
        padding: 1,
        boxShadow: 1,
        zIndex: 1000,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Категорії пам'яток:
      </Typography>
      <Box display="flex" alignItems="center" mb={0.5}>
        <Box component="img" src="img/marker-historical-sm.png" alt="Історичні" width={20} mr={1} />
        <Typography variant="body2">Історичні</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={0.5}>
        <Box component="img" src="img/marker-natural-sm.png" alt="Природні" width={20} mr={1} />
        <Typography variant="body2">Природні</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={0.5}>
        <Box component="img" src="img/marker-cultural-sm.png" alt="Культурні" width={20} mr={1} />
        <Typography variant="body2">Культурні</Typography>
      </Box>
      <Box display="flex" alignItems="center" mb={0.5}>
        <Box component="img" src="img/marker-religious-sm.png" alt="Релігійні" width={20} mr={1} />
        <Typography variant="body2">Релігійні</Typography>
      </Box>
      <Box display="flex" alignItems="center">
        <Box
          component="img"
          src="img/marker-entertainment-sm.png"
          alt="Розважальні"
          width={20}
          mr={1}
        />
        <Typography variant="body2">Розважальні</Typography>
      </Box>
    </Box>
  )
}
