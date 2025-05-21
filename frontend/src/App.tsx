import './App.css'
import { useState } from 'react'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import MapView from './components/Map/MapView'
import Footer from './components/Layout/Footer'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className='app'>
      <Header />
      <main className='main-container'>
        {sidebarOpen && <Sidebar />}
        <MapView />
      </main>
      <Footer />
    </div>
  )
}

export default App
