import React from 'react'
import './Footer.css'

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <p>© 2025 Туристична мапа України</p>
        <div className='footer-links'>
          <a href='/about'>Про нас</a>
          <a href='/contact'>Контакти</a>
          <a href='/privacy'>Політика конфіденційності</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
