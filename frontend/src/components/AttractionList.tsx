import { Paper } from '@mui/material'
import { FixedSizeList as VirtualList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import { Attraction } from '../types'
import AttractionCard from './AttractionCard'
import ListHeader from './ListHeader'
import EmptyState from './EmptyState'

interface AttractionListProps {
  attractions: Attraction[]
  onSelectAttraction: (attraction: Attraction) => void
  onOpenAuthModal?: () => void
}

export default function AttractionsList({
  attractions,
  onSelectAttraction,
  onOpenAuthModal,
}: AttractionListProps) {
  const estimateRowHeight = (attraction: Attraction) => {
    // Base height for card
    let height = 120

    // Add height for longer descriptions
    if (attraction.description.length > 80) {
      height += 20
    }

    // Add height for longer names
    if (attraction.name.length > 30) {
      height += 15
    }

    return height
  }

  // Calculate average row height for the list
  const averageRowHeight = Math.max(
    100,
    attractions.length > 0
      ? attractions.reduce((sum, attraction) => sum + estimateRowHeight(attraction), 0) /
          attractions.length
      : 120
  )

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const attraction = attractions[index]

    const enhancedStyle = {
      ...style,
      padding: '4px 8px',
    }

    return (
      <div style={enhancedStyle}>
        <AttractionCard
          key={attraction.id}
          attraction={attraction}
          onSelect={onSelectAttraction}
          onOpenAuthModal={onOpenAuthModal}
        />
      </div>
    )
  }

  return (
    <Paper sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <ListHeader title="Пам'ятки України" count={attractions.length} />

      {attractions.length === 0 ? (
        <EmptyState icon={<SearchOffIcon sx={{ fontSize: 48, color: 'text.secondary' }} />} />
      ) : (
        <div style={{ flex: 1 }}>
          <AutoSizer>
            {({ height, width }) => (
              <VirtualList
                height={height}
                width={width}
                itemCount={attractions.length}
                itemSize={averageRowHeight} // Use the calculated average height
                overscanCount={5}
              >
                {renderRow}
              </VirtualList>
            )}
          </AutoSizer>
        </div>
      )}
    </Paper>
  )
}
