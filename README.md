# Digilibrary

A static React app for browsing a sample library catalog and recording book loans.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

GitHub Actions deploys the `dist` folder to GitHub Pages when changes are pushed to `main`. The catalog is currently sample data held in browser memory; changes reset when the page reloads and are not shared between visitors.
