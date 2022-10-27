import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'trailApp',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    }
  },
  server: {
    hostname: '127.0.0.1',
    cleartext: true,
    allowNavigation: ['*'],
  }
};

export default config;
