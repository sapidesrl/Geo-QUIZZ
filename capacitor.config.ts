import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.geoquizz.app',
  appName: 'Geo-QUIZZ',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchAutoHide: false, // masqué manuellement quand l'app est prête (main.tsx)
      backgroundColor: '#0f172a',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
