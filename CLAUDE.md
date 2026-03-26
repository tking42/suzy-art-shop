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
node seed.js          # Seed products into MongoDB
node createAdmin.js   # Create the admin user (run once)
```

### Stripe webhook (local dev)
```bash
stripe listen --forward-to localhost:5050/api/webhook
```
Use the `whsec_...` printed by this command as `STRIPE_WEBHOOK_SECRET` in `server/.env` during development.

## Architecture

### Frontend (React + Vite)
- **Routing**: React Router v7 — routes defined in `client/src/App.jsx`
- **Cart state**: `CartContext` in `client/src/context/CartContext.jsx` — persisted to `localStorage`, wraps the whole app in `main.jsx`
- **API calls**: `axios` using `import.meta.env.VITE_API_URL` as base URL
- **Payment flow**: customer fills email + shipping address → `POST /api/create-payment-intent` → Stripe card form loads → on success redirects to `/success`
- **Admin**: `/admin/login` and `/admin` (JWT-protected) — outside the Nav/Footer layout

### Backend (Express 5 + MongoDB)
- **Entry point**: `server/server.js` — mounts routes, connects to MongoDB Atlas, starts on `PORT` from `.env`
- **Active routes**: `/api/products` (CRUD, write operations admin-protected), `/api/orders`, `/api/auth`, `/api/upload` (admin-protected image upload)
- **Webhook**: `POST /api/webhook` — registered before `express.json()` for raw body; handles `payment_intent.succeeded` to mark order Paid, decrement stock, email customer + admin

### Data Models
- **Product**: `name`, `description`, `price`, `stock`, `image`
- **User**: `name`, `email`, `password` (bcrypt), `isAdmin`
- **Order**: `email`, `items[]`, `total`, `shippingCost`, `shippingAddress` (name/line1/line2/city/postcode), `status` (Pending/Paid/Shipped/Delivered), `paymentIntentId`, `emailSent`

### Environment Variables
- `client/.env`: `VITE_API_URL`, `VITE_STRIPE_PUBLIC_KEY`
- `server/.env`: `MONGO_URI`, `PORT`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `JWT_SECRET`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`

## Key Implementation Details

- **Shipping cost** is defined in two places — keep them in sync: `SHIPPING_COST` in `client/src/Payment.jsx` and `SHIPPING_COST_PENCE` in `server/server.js`
- Product images uploaded via admin are stored in `server/public/uploads/` (local only — swap to cloud storage before deploy)
- Product images from `client/public/images/products/` are served by Vite; uploaded images at `/uploads/*` are served by Express — `getImageSrc()` in Shop/Product handles both
- `server/utils/email.js` has three functions: `sendOrderConfirmation` (customer), `sendAdminOrderNotification` (admin on new order), `sendShippingNotification` (customer on dispatch)
- Auth middleware at `server/middleware/authMiddleware.js` — `protect` verifies JWT, `isAdmin` checks the flag
