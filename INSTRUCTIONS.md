# VOLLIFX Trading Platform

## Overview
VOLLIFX is a modern, professional Forex trading platform designed with a focus on capital allocation, performance transparency, and risk management.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons, Framer Motion
- **Components**: Shadcn-like architecture
- **Charts**: Recharts
- **Styling**: Custom "Fintech" Dark Mode theme

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000`

## Project Structure

- `app/page.tsx`: Landing Page (Hero, Features, Workflows)
- `app/login` & `app/register`: Authentication Pages
- `app/dashboard`: Main Trader Dashboard (Overview, Wallet, Trading)
- `app/admin`: Admin Control Panel
- `components/ui`: Reusable UI components (Button, Card, Input, Tabs)
- `lib/utils.ts`: Utility functions

## Features Implemented
- **Professional UI**: Dark-mode optimized, glassmorphism effects.
- **Dashboard**: Real-time equity charts (mock data), wallet management.
- **Wallet**: Deposit/Withdrawal interface with multiple methods.
- **Admin**: Panel to set daily performance and view pool stats.
- **Responsive**: Fully responsive design for desktop and mobile.

## Next Steps for Production
- Connect a real PostgreSQL database using Prisma or Drizzle ORM.
- Implement real authentication (NextAuth.js or Clerk).
- Integrate payment gateways (Stripe, Crypto APIs).
- Connect to live Forex data feeds for charts.
