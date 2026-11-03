# Deployment Instructions

## Local Development
1. Ensure Node.js `v16+` (legacy peer deps required for Webpack 2.3.3) is active.
2. Run `npm install --legacy-peer-deps --ignore-scripts`.
3. Run `npm run start` to host the Webpack server locally.
4. Access the application on `http://localhost:3000`.

## Process & Tray Management
- Check running dev server & multiplayer relay state: `python3 tray_control.py status`
- Tail recent dev server logs: `python3 tray_control.py logs`
- Gracefully stop background servers: `python3 tray_control.py stop`

## Production Build
1. Run `npm run build` to compile the production bundle (`build/build.js`).
2. Run `npm run lint` and verify output.
3. Assets will be compiled via Webpack.

## Environment Configs
- Add API keys directly into `.env.example` if upgrading Firebase bounds.
- *Current integration uses anonymous API keys bound natively without strict secrets.*
