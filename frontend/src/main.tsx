import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import App from './App.tsx'
import './assets/index.css'

// Add a loader component if needed
const LoadingPersistence = () => <div>Loading...</div>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingPersistence />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
)
