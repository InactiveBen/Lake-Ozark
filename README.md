# Lake Ozark Christian Church

This is the codebase for the Lake Ozark Christian Church website, built with Astro. For more information, visit [lakeozarkdisciples.org](https://lakeozarkdisciples.org). This project was built by [@InactiveBen](https://benji.services).

## 📁 Project Structure

Our codebase is organized into several key directories:

- `src/pages/`: The heart of our routing system
  - Contains `.astro` and `.md` files that automatically generate website routes
  - Each file corresponds to a page on the site
  - Markdown files power our content-heavy pages

- `src/components/`: Our component library
  - Houses reusable Astro components for consistent UI elements
  - Includes navigation, footer, cards, and other shared elements
  - Promotes maintainability and DRY (Don't Repeat Yourself) principles

- `src/layouts/`: Page templates and structures
  - Contains base layouts that wrap our pages
  - Ensures consistent styling and structure across the site
  - Handles common elements like headers and meta tags

- `public/`: Static asset storage
  - Stores images, fonts, and other unchanging files
  - Directly copied to the build directory
  - Optimized for performance and caching

- `src/styles/`: Global styling
  - Contains site-wide CSS styles
  - Manages theme variables and design tokens
  - Handles responsive design rules

## 🧞 Development Commands

To work with this project, use these NPM commands from the project root:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Builds the production site to `./dist/`          |
| `npm run preview`         | Preview the built site locally before deploying  |
| `npm run astro ...`       | Run Astro CLI commands (add, check, etc.)       |
| `npm run astro -- --help` | Get help with the Astro CLI                     |

## 🔗 Important Links

- [Live Site](https://lakeozarkdisciples.org) - Visit our main website
- [CDN Site](https://cdn.lakeozarkdisciples.org) - Content delivery network
- [Report an Issue](https://lakeozarkdisciples.org/report) - Help us improve
