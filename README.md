# Aravosh — Company Website

A modern, dark-themed **multi-page** company website for **Aravosh**, a technology and
digital solutions company. Fast, dependency-free static site with a sidebar layout.

## Stack

- Static HTML + `styles.css` + `script.js` — no runtime framework
- Pages assembled by a small generator (`build.mjs`) so the shared sidebar,
  head/meta and footer stay consistent across every page
- Optimised for [Vercel](https://vercel.com)

## Pages

| Route | File | Purpose |
| ----- | ---- | ------- |
| `/` | `index.html` | Home — hero, stats, highlights |
| `/services` | `services.html` | Six core service offerings |
| `/about` | `about.html` | Company story and differentiators |
| `/why` | `why.html` | Guiding principles |
| `/work` | `work.html` | Client testimonials |
| `/contact` | `contact.html` | Contact form + direct email |
| `/privacy` | `privacy.html` | Privacy Policy |
| `/terms` | `terms.html` | Terms of Service |
| `404` | `404.html` | Branded not-found page |

All pages share a fixed **sidebar** (off-canvas drawer on mobile) with the active
page highlighted.

## Editing content

Page content lives in `build.mjs`. After editing, regenerate the HTML:

```bash
node build.mjs
```

The generated `.html` files are committed to the repo, so **no build step runs on
Vercel** — it just serves the static output.

## Contact form & email alerts (Web3Forms)

The contact form posts to [Web3Forms](https://web3forms.com), which emails you on
**every** submission — no backend required.

**One required step to receive alerts:**

1. Go to <https://web3forms.com>, enter `team@aravosh.com`, and copy the free
   **Access Key** (it is emailed to that address).
2. In `build.mjs`, replace `WEB3FORMS_ACCESS_KEY` with your key.
3. Run `node build.mjs` and commit/push.

Until the key is set, the form shows a friendly fallback asking visitors to email
`team@aravosh.com` directly (so nothing looks broken).

## Production essentials

`robots.txt`, `sitemap.xml`, security headers + immutable asset caching
(`vercel.json`), Open Graph / Twitter share image, favicon set and PWA manifest
are all included.

> URLs in the meta tags, sitemap, robots and structured data point at
> `https://aravosh.vercel.app`. Update them to your custom domain once it is
> connected in Vercel, then `node build.mjs` and push.

## Local preview

```bash
npx serve .
```

## Deployment to Vercel (production)

Zero-config static site — no build settings needed.

1. Go to <https://vercel.com/new> and **Import** `rg6830303/Arav-web`.
2. Framework Preset **Other**, no build command, output = repo root.
3. Set **Production Branch** to `main` (Settings → Git).
4. **Deploy.** Every push to `main` then auto-deploys to production.

The deployment lives at <https://aravosh.vercel.app/>.

> Note: the remote sandbox that generated this site cannot reach `vercel.com`
> (network policy) and has no Vercel token, so the deploy is triggered from the
> Vercel dashboard or a machine with Vercel access.
