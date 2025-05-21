import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapView.css'
import { type Location } from '../../types'

// Sample tourist locations in Ukraine
const initialLocations: Location[] = [
  {
    id: '1',
    name: 'Софійський собор',
    description: 'Собор Святої Софії, збудований у 11 столітті в Києві.',
    coordinates: {
      latitude: 50.452967,
      longitude: 30.5137386,
    },
  },
  {
    id: '2',
    name: 'Львівська Опера',
    description: 'Львівський національний академічний театр опери та балету.',
    coordinates: {
      latitude: 49.8438441,
      longitude: 24.0252362,
    },
  },
  {
    id: '3',
    name: 'Замок Паланок',
    description: 'Середньовічний замок в місті Мукачево, Закарпатська область.',
    coordinates: {
      latitude: 48.4359191,
      longitude: 22.6872148,
    },
  },
  {
    id: '4',
    name: 'Острів Хортиця',
    description: 'Найбільший острів на Дніпрі, історичне місце Запорізької Січі.',
    coordinates: {
      latitude: 47.8325694,
      longitude: 35.0865294,
    },
  },
]

const MapView: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>(initialLocations)

  // Center of Ukraine
  const centerPosition: [number, number] = [49.0139, 31.2858]

  // Custom icon for markers
  const customIcon = new Icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })

  return (
    <div className='map-container'>
      <MapContainer
        center={centerPosition}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.coordinates.latitude, location.coordinates.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div>
                <h3>{location.name}</h3>
                <p>{location.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapView
