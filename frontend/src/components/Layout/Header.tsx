import React from 'react'
import './Header.css'

const Header: React.FC = () => {
  return (
    <header className='header'>
      <div className='logo'>
        <h1>Туристична мапа України</h1>
      </div>
      <div className='search-bar'>
        <input type='text' placeholder='Пошук місць...' />
        <button>Пошук</button>
      </div>
      <div className='user-actions'>
        <button className='login-btn'>Увійти</button>
      </div>
    </header>
  )
}

export default Header
