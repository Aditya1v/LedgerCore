# LedgerCore — Backend

Express + MongoDB REST API powering LedgerCore — JWT-authenticated, double-entry ledger accounting for accounts and transfers.

> For architecture details and the full API reference, see the [root README](../Readme.md).

## Tech Stack

- Node.js + Express 5
- MongoDB + Mongoose (multi-document transactions)
- JWT auth (`jsonwebtoken` + `bcryptjs`)
- Zod validation
- Nodemailer

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in this folder:

```env
MONGO_URI=mongodb://localhost:27017/ledgercore
JWT_SECRET=replace-with-a-long-random-string

# Optional — only needed for outgoing emails
CLIENT_ID=your-google-oauth-client-id
CLIENT_SECRET=your-google-oauth-client-secret
REFRESH_TOKEN=your-google-refresh-token
EMAIL_USER=your-email@gmail.com
```

### 3. Run

```bash
npm run dev     # development, with auto-reload
npm start       # production
```

Server runs on `http://localhost:3000`. CORS is pre-configured to allow `http://localhost:5173` and `:5174` (the frontend dev server).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start in production mode |
| `npm run seed` | Seed the database with demo users, accounts & ~100 transactions |

## Project Structure

```
src/
├── app.js            # Express app, CORS, route mounting
├── config/            # DB connection, enum constants
├── controllers/        # Request handlers
├── services/             # Business logic (ledger, analytics, email...)
├── models/                # Mongoose schemas
├── middlewares/            # auth, validation, error handling
├── validations/             # Zod schemas
└── utils/                    # AppError, sendResponse, asyncHandler
```