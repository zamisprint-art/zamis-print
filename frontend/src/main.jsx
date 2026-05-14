import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Configure Axios to send cookies automatically
axios.defaults.withCredentials = true;

// Set baseURL for production (Render URL), locally it will use Vite Proxy or relative paths
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
