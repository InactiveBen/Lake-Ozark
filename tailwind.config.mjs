/** @type {import('tailwindcss').Config} */
export default {
  // 1. Content Paths: Tells Tailwind where to look for class names 
  //    to ensure only used CSS is included in the final production build (PurgeCSS).
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],

  // 2. Theme Configuration: Customizations for Tailwind's default design system.
  theme: {
    extend: {
      // Custom Font: Sets 'Inter' as the primary sans-serif font, 
      // falling back to system defaults.
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Custom Colors: Defines a 'brand' color palette.
      colors: {
        brand: {
          // The main brand color (used when referencing 'bg-brand', 'text-brand', etc.)
          DEFAULT: '#9e1e3e', 
          // A lighter shade of the brand color
          light: '#b84660', 
          // A darker shade for hover/active states
          dark: '#841834',   
        }
      }
    },
  },

  // 3. Plugins: Used to add extra features or utility classes.
  //    Currently empty, indicating no extra plugins are used.
  plugins: [],
}