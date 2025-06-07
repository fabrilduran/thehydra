import React from 'react'
import ReactDOM from 'react-dom/client'
import './config/firebaseConfig.js';

import App from './App.jsx'
import './index.css'

import { FavoritosProvider } from './context/FavoritosContext'; // 👈 Importamos el Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FavoritosProvider> {/* 👈 Envolvemos toda la app */}
      <App />
    </FavoritosProvider>
  </React.StrictMode>,
);
