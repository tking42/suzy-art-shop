# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce art shop with a React/Vite frontend and Express/MongoDB backend. Payment processing is handled via Stripe.

## Development Commands

### Frontend (client/)
```bash
cd client
npm run dev      # Start Vite dev server (default port 5173)
npm run build    # Production build
npm run lint     # ESLint
```

### Backend (server/)
```bash
cd server
npm run dev      # Start with nodemon (port 5050)
npm start        # Start with node
```

Run both concurrently in separate terminals. The client proxies API requests to `http://localhost:5050/api` via `VITE_API_URL`.

### Database Seeding
```bash
cd server
node seed.js     # Seed products into MongoDB
```

## Architecture

### Frontend (React + Vite)
- **Routing**: React Router v7 — routes defined in `client/src/App.jsx`
- **Cart state**: `CartContext` in `client/src/context/CartContext.jsx` — persisted to `localStorage`, wraps the whole app in `main.jsx`
- **API calls**: `axios` using `import.meta.env.VITE_API_URL` as base URL
- **Payment**: Stripe — checkout creates a session via `POST /api/create-checkout-session`, then redirects to Stripe-hosted page; success redirects to `/success`

### Backend (Express 5 + MongoDB)
- **Entry point**: `server/server.js` — mounts routes, connects to MongoDB Atlas, starts on `PORT` from `.env`
- **DB connection**: `server/config/db.js` (Mongoose)
- **Active routes**: `/api/products` (CRUD), `/api/create-checkout-session` (Stripe)
- **Prepared but commented out**: `/api/auth`, `/api/orders`, `/api/cart` — controllers and models exist, routes just need to be uncommented in `server.js`

### Data Models
- **Product**: `name`, `description`, `price`, `stock`, `image`
- **User**: `name`, `email`, `password` (bcrypt), `isAdmin`
- **Order**: `user` (optional), `email`, `items[]`, `total`, `status` (Pending/Paid/Shipped/Delivered), `paymentIntentId`

### Environment Variables
- `client/.env`: `VITE_API_URL`, `VITE_STRIPE_PUBLIC_KEY`
- `server/.env`: `MONGO_URI`, `PORT`, `STRIPE_SECRET_KEY`

## Key Implementation Details

- Product images are served as static files from `client/public/images/products/`
- The Stripe success redirect URL is hardcoded to `http://localhost:5174/success` in `server.js` — update this for production
- Auth middleware exists at `server/middleware/authMiddleware.js` (JWT-based) but is not yet wired up to any routes
- `server/utils/email.js` exists (Nodemailer) but is not currently used
