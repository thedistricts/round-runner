# Round Runner

Verify your long-distance challenges.

## Adding Addtional Rounds

1. Create a GeoJSON feature collection of Points defining the route. You can use `static/data/frog-graham-cw.geo.json` as a template.
2. Add your entry in `src/lib/data/round-manifest.json`
3. Open a Pull Request for review

## Developing

Install dependencies with `npm install`, start a development server:

```bash
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.