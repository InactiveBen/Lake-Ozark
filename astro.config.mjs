import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

import sentry from '@sentry/astro';

export default defineConfig({
  integrations: [
    tailwind(), 
    react(), 
    sentry({
      dsn: "https://d4be77c82b4c10fc61de7d57705ddc7b@o4509496802738176.ingest.us.sentry.io/4509496803786752",
      // Disable automatic initialization - we'll handle it with cookie consent
      autoInstrument: false,
      // Setting this option to true will send default PII data to Sentry.
      // For example, automatic IP address collection on events
      sendDefaultPii: true,
      sourceMapsUploadOptions: {
        project: "javascript-astro",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});