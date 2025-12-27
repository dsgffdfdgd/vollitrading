# Deploying VOLLIFX to vollitrading.com

You have configured the application to run on `https://vollitrading.com`. Because I am an AI assistant running locally, I cannot directly "push" files to your remote server.

## Instructions to Deploy

You need a hosting provider (like Vercel, Railway, or a VPS with Node.js).

### Option 1: Vercel (Recommended & Easiest)
1.  **Push this code to GitHub.**
2.  Go to [Vercel.com](https://vercel.com) and import the repository.
3.  Vercel will detect Next.js automatically.
4.  **Environment Variables**: Go to Project Settings > Environment Variables and add:
    *   `JWT_SECRET`: (Generate a long random string)
    *   `PESAPAL_CONSUMER_KEY`: `vLWPDMX8o/0BtGsGdDrKuaC8RbmKIBUl`
    *   `PESAPAL_CONSUMER_SECRET`: `sIuyZY/sSQ0p13FpP92Fj3NmepM=`
5.  **Database**: Vercel works best with a cloud database (like Vercel Postgres or Turso).
    *   If using the current SQLite (`dev.db`), it **will reset** on every deployment.
    *   **CRITICAL**: You must switch `prisma/schema.prisma` to use `postgresql` instead of `sqlite` for production.

### Option 2: VPS (DigitalOcean, Ubuntu)
1.  SSH into your server: `ssh root@vollitrading.com`
2.  Install Node.js 18+.
3.  Copy all project files to the server (you can use FileZilla or `scp`).
4.  **Create the Environment File**:
    *   On the server, in the project folder, create a file named `.env`.
    *   Copy the text from `env-config.txt` and paste it into `.env`.
    *   Update `DATABASE_URL` with your real database connection string.
5.  Run:
    ```bash
    npm install
    npx prisma generate
    npm run build
    npm start
    ```
5.  Use Nginx to reverse proxy port 3000 to port 80/443.

## Production Checklist (Important)
1.  **Database**: Move from SQLite to PostgreSQL (Supabase or Neon.tech are free/good options).
2.  **PesaPal IPN**: Ensure `https://vollitrading.com/api/ipn` is actually implemented if you want automatic payment confirmation without Admin approval (currently Admin approval is required, which is safer for now).

## Admin Access on Production
Once deployed, the first user you create will be a normal user. You must access the production database (via your hosting provider's dashboard) to change their role to `ADMIN` to access `/admin`.
