import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // Integrations enable support for external libraries and UI frameworks.
  integrations: [
    tailwind(), // Configures and enables Tailwind CSS utility framework.
    react()     // Enables rendering and usage of React components.
  ],
  
  // Output configuration - use server mode so API routes run at request time
  output: 'server',
  
  // Adapter for Vercel serverless functions
  adapter: vercel(),
  
  // Markdown configuration settings.
  markdown: {
    shikiConfig: {
      // Sets the code highlighting theme for all Markdown and MDX files.
      theme: 'github-light'
    }
  }
});