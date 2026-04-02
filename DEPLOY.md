# Deployment Instructions

## Local Development
1. Ensure Node.js is installed.
2. Run `npm install` to install dependencies.
3. Run `npm run start` to start the Webpack development server.
4. Access the game at `http://localhost:3000`.

## Production Build
1. Run `npm run build` to compile the production bundle via Webpack.
2. Output is placed in the `build/` and `site/` directories.

## GitHub Pages Deployment
1. Run `npm run deploy` to automatically build and push to the `gh-pages` branch.
