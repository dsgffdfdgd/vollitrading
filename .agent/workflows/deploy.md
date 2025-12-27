---
description: Deploy the site and connect a custom domain
---

# Deploying to Vercel and Connecting Your Domain

This workflow guides you through deploying your VOLLIFX application to Vercel and connecting your external domain name (e.g., `vollitrading.com`).

## Prerequisites
- A GitHub account.
- A Vercel account (free at [vercel.com](https://vercel.com)).
- Access to your domain registrar (GoDaddy, Namecheap, etc.).

## Step 1: Push Code to GitHub
1.  Initialize a git repository if you haven't already:
    ```bash
    git init
    git add .
    git commit -m "Ready for deploy"
    ```
2.  Create a new repository on GitHub.
3.  Link and push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/vollifx.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy on Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `vollifx` repository from GitHub.
4.  **Configure Project**:
    - **Framework Preset**: Next.js (should be auto-detected).
    - **Environment Variables**:
        - `DATABASE_URL`: Your PostgreSQL connection string. ( *Tip: You can use Vercel Storage to create a new Postgres database instantly and link it.* )
        - `JWT_SECRET`: A long random string.
        - `PESAPAL_CONSUMER_KEY`: Your key.
        - `PESAPAL_CONSUMER_SECRET`: Your secret.
5.  Click **Deploy**.

## Step 3: Connect Your External Domain
Once the deployment is complete and you see your site live (on a `vercel.app` domain):

1.  Go to your Project Dashboard on Vercel.
2.  Navigate to **Settings** -> **Domains**.
3.  Enter your domain name (e.g., `vollitrading.com`) and click **Add**.
4.  Vercel will provide you with DNS records to add. Usually, you need to add an **A Record** or **CNAME Record** at your domain registrar.

### Typical DNS Configuration:
- **Type**: `A`
- **Name**: `@` (or leave blank)
- **Value**: `76.76.21.21` (Vercel's IP)

- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `cname.vercel-dns.com`

*Note: Propagation can take up to 24-48 hours, but usually happens in minutes.*

## Step 4: Verify
Visit your domain (e.g., `https://vollitrading.com`). You should see your live application.
