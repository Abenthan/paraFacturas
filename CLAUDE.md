# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (from `server/`)
```bash
npm run dev      # Development with nodemon (auto-reload)
npm start        # Production
```

### Frontend (from `client/`)
```bash
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # Production build → dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

No test suite is configured.

## Architecture

**Monorepo:** `server/` (Node.js/Express) + `client/` (React/Vite). No shared root package.

### Backend

- **Entry:** `server/src/index.js` → loads dotenv, starts Express on PORT (default 4001)
- **Routes:** All prefixed `/api`. Registered in `server/src/app.js` via `server/src/routes/index.js`
- **Auth:** JWT via `libs/jwt.js`. Token validated in `middlewares/validateToken.js`. Auth required on protected routes.
- **Database:** Centralized MySQL2 pool in `server/src/db.js`. All controllers import this pool directly.
- **Validation:** Zod schemas in `server/src/schemas/`, applied via `middlewares/validator.js`.
- **Config:** `server/src/config.js` — reads env vars, throws at startup if `DB_PASSWORD` or `TOKEN_SECRET` are missing.

Route → Controller pattern: each resource (clientes, productos, suscripciones, novedades, facturacion, auth) has its own route file and controller.

### Frontend

- **Entry:** `client/src/main.jsx` → `App.jsx` with React Router
- **API layer:** `client/src/api/` — Axios wrappers, base URL from `VITE_API_URL` env var
- **State:** Context providers in `client/src/context/` (Auth, Clientes, Productos, Suscripciones, Facturacion) wrap the app
- **Route protection:** `client/src/ProtectedRoute.jsx`
- **PDF/print:** `react-to-print` + `html2pdf.js` used in facturacion pages
- **Export:** `xlsx` used for spreadsheet export

### Environment

**Backend** (`server/.env`):
```
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME (schema: parafacturas)
TOKEN_SECRET
NODE_ENV
```

**Frontend** (`client/.env` / `client/.env.production`):
```
VITE_API_URL=http://localhost:4001/api          # dev
VITE_API_URL=https://parafacturas-production.up.railway.app/api  # prod
```

### Deploy
- Frontend → Vercel (`https://parafacturasclient.vercel.app`)
- Backend → Railway (`https://parafacturas-production.up.railway.app`)
- CORS whitelist is hardcoded in `server/src/app.js`

## Known Issues

See `ANALISIS.md` at the project root for a full security/bug analysis. Key points:

- **Magic number product IDs** hardcoded in controllers: `10`, `11`, `12`, `13`
- Financial operations (`registrarPago`, `crearFacturas`) lack DB transactions
- `getEstadoCuentaCliente` JOIN uses wrong column (`pagos.factura_id` → should be `pagofactura`)
- Alias `p` duplicated in `getCartera` query
