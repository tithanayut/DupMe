import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thanayut.dupme',
  appName: 'DupMe',
  webDir: '../server/dist/dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
