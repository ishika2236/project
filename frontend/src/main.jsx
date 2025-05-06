import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import ThemeProvider from './context/ThemeProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import store from './app/store.js'
import { Provider } from 'react-redux'
// import AuthSetup from './utils/AuthSetup.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {/* <AuthProvider> */}
          <Provider store={store}>
            {/* <AuthSetup/> */}
              <App />
          </Provider>
        {/* </AuthProvider> */}
      </ThemeProvider>
    </BrowserRouter>
    
  // </StrictMode>,
)
