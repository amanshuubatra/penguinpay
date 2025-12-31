# PenguinPay 🐧

A full-stack web application for Indian streamers to accept UPI tips using Razorpay, built with Next.js, Express, and Supabase.

## 🚀 Features

- **Frontend**: Next.js 14 (App Router) with TailwindCSS.
- **Backend**: Node.js/Express with strict input validation (Zod) and Rate Limiting.
- **Database**: Supabase (PostgreSQL).
- **Payments**: Razorpay UPI integration (Orders & Webhooks).
- **Security**: Google reCAPTCHA v3.
- **Branding**: Custom Penguin mascot and theme.

## 📁 Project Structure

```
penguinpay/
├── frontend/             # Next.js Client
│   ├── app/              # App Router (Pages)
│   ├── components/       # UI Components (Navbar, PenguinMascot)
│   └── lib/              # Utilities (API, Utils)
└── backend/              # Express Server
    ├── src/
    │   ├── routes/       # API Routes (Auth, Payments, Webhook)
    │   ├── services/     # External Services (Razorpay)
    │   └── middleware/   # Auth & Security Middleware
    └── schema.sql        # Database Schema
```

## 🛠️ Setup Instructions

### 1. Database Setup (Supabase)
1. Creates a new Supabase project.
2. Go to the SQL Editor and run the contents of `backend/schema.sql`.

### 2. Environment Variables
Create a `.env` file in `frontend/` and `backend/` with the following keys:

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

**Backend (`backend/.env`)**
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### 3. Quick Start (Recommended)
Run these commands from the root `penguinpay/` folder:

```bash
# 1. Install all dependencies (Frontend + Backend)
npm install

# 2. Start both servers concurrently
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### 4. Verified Flows
- **Signup**: Register a new account.
- **Dashboard**: View your total earnings (initially 0).
- **Tip Page**: Go to `http://localhost:3000/[your_username]` to simulate a payment.
- **Razorpay**: Use Test Mode UPI (success@razorpay) to complete payment.
