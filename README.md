# Round Runner

A web application for verifying long-distance running and swimming challenges in the UK. The app helps athletes track and validate their completion of various challenging rounds, including the Frog Graham Round, Bob Graham Round, and other notable routes.

## Features

- Interactive map visualization of challenge routes
- GPX file upload and route verification
- Support for multiple challenge rounds including:
  - Frog Graham Round
  - Tadpole Round
  - Tea Round
  - Puddle Buckley Round
  - Ring of Stirling
  - Bob Graham Round
  - Cumbrian Traverse
- Detailed route information and statistics
- Mobile-friendly interface

## Adding Additional Rounds

To add a new round to the application:

1. Create a GeoJSON feature collection of Points defining the route. You can use `static/data/frog-graham-cw.geo.json` as a template.
2. Add your entry in `src/lib/data/round-manifest.json` with the following information:
   - `slug`: URL-friendly identifier
   - `title`: Display name
   - `description`: Short description
   - `json`: Path to your GeoJSON file
   - `logo`: Path to round logo image
   - `info`: Detailed description
   - `link`: Official website link
3. Open a Pull Request for review

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev -- --open
   ```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build
- `npm run test`: Run Playwright tests
- `npm run test:unit`: Run unit tests
- `npm run check`: Type checking
- `npm run lint`: Lint code
- `npm run format`: Format code

## Building for Production

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Technologies Used

- SvelteKit
- TypeScript
- TailwindCSS
- MapLibre GL
- Turf.js
- FilePond
- Playwright (testing)
- Vitest (unit testing)

## License

This project is licensed under the Non-Profit OSL - see the LICENSE file for details.
