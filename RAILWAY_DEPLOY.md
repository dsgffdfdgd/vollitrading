# Deploying to Railway.app

Railway is an excellent alternative to Vercel that handles full-stack Next.js + Database applications very well.

## 1. Setup Railway Account
1. Go to [railway.app](https://railway.app) and sign up with GitHub.
2. Click "New Project" -> "Deploy from GitHub repo".
3. Select your `vollifx` repository.

## 2. Configure Database (PostgreSQL)
Railway can provision a database for you instantly.
1. In your project view, click "New" -> "Database" -> "PostgreSQL".
2. Wait for it to deploy.
3. Click on the Postgres card -> "Connect" tab.
4. Copy the **DATABASE_URL**.

## 3. Configure Environment Variables
1. Click on your `vollifx` repo card in the Railway dashboard.
2. Go to the **Variables** tab.
3. Add the following variables:
   - `DATABASE_URL`: (Paste the URl from step 2)
   - `JWT_SECRET`: (Generate a long random string)
   - `PESAPAL_CONSUMER_KEY`: `vLWPDMX8o/0BtGsGdDrKuaC8RbmKIBUl`
   - `PESAPAL_CONSUMER_SECRET`: `sIuyZY/sSQ0p13FpP92Fj3NmepM=`
   - `NEXT_PUBLIC_APP_URL`: `https://<your-railway-url>.up.railway.app` (You will get this URL after first deploy, or you can set a custom domain).

## 4. Deploy Updates
1. Railway detects `package.json` scripts automatically.
2. It will run `npm install`, then `npm run build`, and `npm start`.
3. Because our `build` script includes `prisma generate`, it will work out of the box.

## 5. Initialize Database schema
1. Once deployed, the app might fail initially because the DB is empty.
2. Install the Railway CLI locally (optional) OR use the Railway dashboard "Command" feature.
3. Ideally, add a "Deploy Command" in Railway Settings > Build:
   - `npx prisma db push && npm run build`
   - Use `npx prisma db push` to sync your schema effectively.

## Troubleshooting
- If you see "Prisma Client" errors, go to Settings > Build > Build Command and set it to: `npx prisma generate && npm run build`.

This path defeats the Vercel static generation issues because Railway builds a Docker container where the environment is consistent.
