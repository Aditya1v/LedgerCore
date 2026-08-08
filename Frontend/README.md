# LedgerCore — Frontend

React + Vite single-page app for LedgerCore, a banking dashboard for managing accounts, transferring funds, and tracking spending.

> For the full project overview, architecture, and API reference, see the [root README](../Readme.md).

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- React Router 7
- React Hook Form + Zod
- Axios + TanStack React Query
- Recharts, Framer Motion, lucide-react

## Getting Started

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` and expects the backend API at `http://localhost:3000/api` (see [`../backend/Readme.md`](../backend/Readme.md)). No `.env` file is needed on the frontend.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── pages/          # Route-level screens
├── components/     # ui/, layout/, dashboard/, accounts/, transactions/, analytics/, settings/, forms/
├── layouts/         # DashboardLayout, AuthLayout
├── context/          # Auth context/provider
├── services/          # Axios API clients
├── validations/        # Zod schemas
└── utils/               # Formatting & PDF receipt helpers
```