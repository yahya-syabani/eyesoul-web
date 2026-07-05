# Eyesoul — Free Deployment Guide

**Strategy: Vercel (web) + Render (CMS + PostgreSQL) — $0/mo**

---

## Step 1: Create Accounts

| Platform | Sign up at | What for |
|----------|-----------|----------|
| **Vercel** | https://vercel.com | Web frontend |
| **Render** | https://render.com | CMS backend + PostgreSQL |

Connect your GitHub account to both.

---

## Step 2: Deploy PostgreSQL on Render

1. Go to https://dashboard.render.com → **New +** → **PostgreSQL**
2. Fill in:
   - **Name**: `eyesoul-cms-db`
   - **Database**: `eyesoul`
   - **User**: `eyesoul`
   - **Region**: `Singapore` (closest to your target audience)
3. Click **Create Database**
4. Wait for it to be ready (~2 min)
5. Copy the **Internal Database URL** (looks like `postgres://...`) — you'll need this

---

## Step 3: Deploy CMS on Render

1. Push your repo to GitHub (if not already)
2. Go to https://dashboard.render.com → **New +** → **Web Service**
3. Connect your GitHub repo
4. Fill in:
   - **Name**: `eyesoul-cms`
   - **Root Directory**: `cms`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Region**: `Singapore`
   - **Plan**: **Free**
5. Add environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Paste the Internal Database URL from Step 2 |
| `PAYLOAD_SECRET` | Generate a random 64-char string: `openssl rand -hex 32` |
| `PAYLOAD_PUBLIC_SERVER_URL` | Will be `https://eyesoul-cms.onrender.com` (after deploy) |
| `FRONTEND_URL` | Will be `https://eyesoul-web.vercel.app` (after Step 4) |
| `NODE_VERSION` | `20` |
| `CMS_API_KEY` | (optional, leave blank) |

6. Click **Create Web Service**
7. After deploy finishes, copy your CMS URL (e.g. `https://eyesoul-cms.onrender.com`)

⚠️ **First deploy note:** You need to run migrations. After the first deploy fails (due to no tables), go to **Shell** tab and run:
```bash
npm run payload migrate
```
Then manually trigger a new deploy from the Render dashboard.

### Seed the CMS

After migrations succeed, run in Render Shell:
```bash
npx tsx seed.ts
```
This creates the admin user (credentials shown during seed) and seed data.

---

## Step 4: Deploy Web on Vercel

1. Go to https://vercel.com → **Add New** → **Project**
2. Import your GitHub repo
3. Fill in:
   - **Root Directory**: `web`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `next build` (default)
4. Add environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_CMS_URL` | `https://eyesoul-cms.onrender.com` (your Render CMS URL) |
| `FRONTEND_URL` | Will be `https://eyesoul-web.vercel.app` |

5. Click **Deploy**
6. After deploy, copy your Vercel URL (e.g. `https://eyesoul-web.vercel.app`)

### Update CMS with frontend URL

Go back to Render → **Environment** → update `FRONTEND_URL` to your Vercel URL → **Manual Deploy** → **Clear build cache & deploy**.

---

## Step 5: Custom Domain (Optional)

- **Render**: Add a custom domain in Render dashboard → Settings → Custom Domain
- **Vercel**: Add domain in Vercel dashboard → Domains

---

## Step 6: Future Updates

Every time you push to `main`:

| Platform | Auto-deploys? | Note |
|----------|--------------|------|
| **Vercel** | ✅ Yes | Instant |
| **Render** | ✅ Yes | Takes ~2 min |

---

## Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Hobby | **$0/mo** | 100 GB bandwidth, 6000 build minutes |
| Render Web Service | **$0/mo** | Spins down after 15 min idle |
| Render PostgreSQL | **$0/mo** | 1 GB storage, automatic backups |
| **Total** | **$0/mo** | |

### Caveats

- **Render free tier**: The CMS sleeps after ~15 min of inactivity. First request after idle takes ~5s to wake up. For a marketing/catalogue site, this is fine — visitors won't notice because the web frontend caches data.
- **Render PostgreSQL free**: 1 GB storage limit. Your product images and CMS content will fit easily. If you add heavy user-generated content, upgrade to $7/mo for 10 GB.
- **Vercel Hobby**: 6000 build minutes/month — plenty for a single developer team. 100 GB bandwidth — more than enough for a catalogue site.

---

## Post-Deployment Checklist

- [ ] CMS admin accessible at `https://eyesoul-cms.onrender.com/admin`
- [ ] Login with `admin@stratlogic.com` / `Admin1234!` (change password immediately)
- [ ] Web frontend loads at `https://eyesoul-web.vercel.app/en`
- [ ] Both locales work (`/en`, `/id`)
- [ ] Products page loads and filters work
- [ ] Search works (Ctrl+K)
- [ ] Store locator loads
- [ ] Service pages render
- [ ] Newsletter and contact forms submit successfully
- [ ] Wishlist works
