import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.83f3e57aa1a7413bb6a20fa918f869df',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://83f3e57a-a1a7-413b-b6a2-0fa918f869df.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false
    }
  }
};

export default config;