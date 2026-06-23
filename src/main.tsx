import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Masque l'écran de démarrage natif une fois l'app montée (plateformes natives).
if (Capacitor.isNativePlatform()) {
  SplashScreen.hide().catch(() => {});
}
