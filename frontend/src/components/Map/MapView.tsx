import React from 'react'
import './MapView.css'

const MapView: React.FC = () => {
  return (
    <div className='map-container'>
      <img
        src='/tourist-map.png'
        alt='картинка-заглушка, що показує туристичну мапу України'
      />
    </div>
  )
}

export default MapView
