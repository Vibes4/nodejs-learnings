# Deploying to GitHub Pages

This app is a **static site** — `index.html` at the repo root plus per-module
`index.html` / `index.js` fragments that the browser loads with `fetch()`.
Every asset path is **relative**, so it works correctly when served from a
project subpath like `https://<user>.github.io/<repo>/`.

> `server.js` is only for local development. GitHub Pages cannot run Node —
> it just serves the static files, so `server.js` is ignored in production.

---

## How deployment works

Deployment is fully automated by a GitHub Actions workflow:
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

On every push to `main` (or a manual run from the **Actions** tab), it:

1. Checks out the repo.
2. Configures GitHub Pages.
3. Uploads the repo root (`path: '.'`) as the Pages artifact.
4. Publishes it with `actions/deploy-pages`.

There is **no build step** — the files are served exactly as they are in the repo.

A `.nojekyll` file at the root tells GitHub to serve the files as-is (skip
Jekyll processing).

---

## One-time setup (first deploy only)

The workflow tries to enable Pages automatically (`enablement: true`). If the
**Setup Pages** step fails on the first run, enable it manually once:

1. Go to your repo on GitHub → **Settings** → **Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Go to the **Actions** tab → open the latest **Deploy to GitHub Pages** run →
   **Re-run all jobs**.

That setting only needs to be set once. After that, every push to `main`
deploys automatically.

---

## Deploying updates

Just push to `main`:

```bash
git add -A
git commit -m "your change"
git push origin main
```

Watch the deploy at **repo → Actions → Deploy to GitHub Pages**. When the run
goes green (usually under a minute), the changes are live.

---

## Live URL

```
https://<your-username>.github.io/<your-repo-name>/
```

For this repo: **https://vibes4.github.io/vaibhav-engineering-life/**

> If you rename the repo, the URL changes to match the new name. Because all
> paths are relative, the app keeps working under any repo name.

---

## Preview locally before deploying

You can't use `file://` directly — browsers block `fetch()` on the
`file://` protocol, so the modules won't load. Serve over HTTP instead:

```bash
# Option A: the included Express server
npm install
npm start
# → http://localhost:3000

# Option B: any static file server (no install needed)
npx serve .
# or
python3 -m http.server 3000
```

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| **404 at the Pages URL** | The first deploy hasn't finished, or Pages source isn't set to **GitHub Actions** (see one-time setup). |
| **"Setup Pages" step fails** | Enable Pages manually: Settings → Pages → Source → **GitHub Actions**, then re-run the workflow. |
| **Page loads but modules don't ("Could not load module")** | You opened a `file://` path. Use the live URL or a local HTTP server. |
| **Push rejected / auth fails over HTTPS** | Use SSH: `git remote set-url origin git@github.com:<user>/<repo>.git` (requires an SSH key added to GitHub). |
| **Changes not showing** | Hard-refresh (Ctrl/Cmd+Shift+R) to bypass cache; confirm the Actions run for your commit succeeded. |
