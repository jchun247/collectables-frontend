import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
// Enable dark mode
document.documentElement.classList.add('dark');
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
)
