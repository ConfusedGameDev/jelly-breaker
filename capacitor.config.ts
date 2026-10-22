import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.confusedgame.jellybreaker',
  appName: 'Jelly Breaker',
  webDir: 'www',
  backgroundColor: '#1d0d3a',
  server: {
    // Serve from https://localhost so secure-context APIs (audio, storage) behave like the web.
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#1d0d3a',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#1d0d3a',
  },
};

export default config;
