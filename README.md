# The Communist Record

A clean, professional static website providing a full historical review of communism, its human cost, and its continuing ideological influence.

## Run Locally
```powershell
cd "E:\AI\Projects\the-communist-record"
python -m http.server 8080
```
Then open http://localhost:8080

## Pages
- index.html — Overview and navigation
- origins.html — Ideological foundations
- timeline.html — Historical timeline
- regimes.html — Major communist states
- human-cost.html — Death tolls and suffering
- why-it-fails.html — Structural reasons for failure
- modern-risks.html — Risks to Western civilization today
- sources.html — Bibliography and references

## Design
Dark, serious, highly readable theme. Tailwind via CDN. Fully static.

## After Completion
A separate VIDEO-USAGE-GUIDE.md will be provided with instructions on using the site for video production. This guide is intentionally kept out of the public website.

## Disclaimer
For educational purposes only. All content is attributed to historical sources. See the Sources page.

## Project Location
E:\AI\Projects\the-communist-record

## Hosting / Deployment

This is a **fully static** site (pure HTML + Tailwind via CDN + Chart.js via CDN + vanilla JS). No build step required.

### Vercel Deployment (Recommended)

Vercel is excellent for static sites, offers great performance, instant previews, and is very reliable.

#### Step-by-step:

1. **Initialize Git** (if not already done)
   ```powershell
   cd "E:\AI\Projects\the-communist-record"
   git init
   git add .
   git commit -m "Initial commit - The Communist Record"
   ```

2. **Create a GitHub repository**
   - Go to https://github.com/new
   - Create a new **public** repository (name it `the-communist-record`)
   - Do **NOT** initialize with README, .gitignore, or license (we already have files)
   - After creation, push your local repo:
     ```powershell
     git remote add origin https://github.com/Goliaith/the-communist-record.git
     git branch -M main
     git push -u origin main
     ```

3. **Deploy on Vercel**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click **"Add New Project"** (or "New Project")
   - Import your GitHub repository (`communist-record`)
   - Vercel should auto-detect it as a static site
   - (Optional) Under "Build and Output Settings":
     - Build Command: leave empty
     - Output Directory: leave empty (or `.`)
   - Click **Deploy**

4. **Done!**
   - Vercel will give you a production URL like `https://your-project.vercel.app`
   - Every time you push to `main`, it will auto-deploy with preview URLs for PRs.

#### Optional: vercel.json (already created in this folder)
We included a `vercel.json` that explicitly tells Vercel to treat the folder as static content.

### Other Hosting Notes
- All internal links are relative → the site works correctly when deployed from any path.
- Tailwind and Chart.js are loaded from CDNs (perfectly fine and common for static sites).
- You can add a custom domain in Vercel settings later (free with Vercel).

## Local Development
```powershell
cd "E:\AI\Projects\the-communist-record"
python -m http.server 8080
```
Then open http://localhost:8080

## Pages Overview
- index.html — Main landing
- origins.html — Philosophical roots
- timeline.html — Historical timeline (collapsible)
- regimes.html — Major regimes + economic analysis + charts
- human-cost.html — Human cost with visuals and charts
- why-it-fails.html — Why communism fails (with comparisons)
- modern-risks.html — Modern ideological risks
- current-groups.html — Current organizations and movements
- sources.html — Full references

## Local Development
```powershell
cd "E:\AI\Projects\the-communist-record"
python -m http.server 8080
```
Open http://localhost:8080

## Pages Overview
- index.html — Main landing
- origins.html — Philosophical roots
- timeline.html — Historical timeline (collapsible)
- regimes.html — Major regimes + economic analysis + charts
- human-cost.html — Human cost with visuals and charts
- why-it-fails.html — Why communism fails (with comparisons)
- modern-risks.html — Modern ideological risks
- current-groups.html — Current organizations and movements (new)
- sources.html — Full references

For video production guidance see VIDEO-USAGE-GUIDE.md (kept separate).
