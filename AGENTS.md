# Project Guidelines & Rules (AGENTS.md)

## Critical Server & Preview Rule
- **Never modify `server.ts` away from the robust static serving setup**: The server must always build or serve static files from `dist/` and use `express.static(distPath)` with an SPA fallback (`app.get('*', ...)`).
- Always ensure `npm run build` generates `dist/index.html` and assets correctly so that the preview loads instantly without a blank screen or connection refusal.
