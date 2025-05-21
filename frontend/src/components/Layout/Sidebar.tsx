import React from 'react'
import './Sidebar.css'

const Sidebar: React.FC = () => {
  return (
    <aside className='sidebar'>
      <h2>Категорії</h2>
      <div className='categories'>
        <div className='category'>🏛️ Історичні пам'ятки</div>
        <div className='category'>⛰️ Природні пам'ятки</div>
        <div className='category'>🏰 Замки та фортеці</div>
        <div className='category'>🏞️ Національні парки</div>
        <div className='category'>🏖️ Курорти</div>
      </div>

      <h2>Регіони</h2>
      <div className='regions'>
        <div className='region'>Київська область</div>
        <div className='region'>Львівська область</div>
        <div className='region'>Одеська область</div>
        <div className='region'>Закарпатська область</div>
        <div className='region'>Харківська область</div>
      </div>
    </aside>
  )
}

export default Sidebar
