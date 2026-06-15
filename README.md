# Aravosh — Company Website

A modern, dark-themed single-page company website for **Aravosh**, a technology and
digital solutions company. Built as a fast, dependency-free static site.

## Stack

- Static `index.html` + `styles.css` + `script.js`
- No build step — deploys instantly on any static host
- Optimised for [Vercel](https://vercel.com)

## Structure

| Section   | Purpose                                   |
| --------- | ----------------------------------------- |
| Hero      | Headline, value proposition, key stats    |
| Services  | Six core service offerings                |
| About     | Company story and differentiators         |
| Why Us    | Guiding principles                        |
| Work      | Client testimonials                       |
| Contact   | Direct email call-to-action               |

## Contact

All enquiries open the visitor's email app via a `mailto:` link to
**[team@aravosh.com](mailto:team@aravosh.com)**.

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```

## Deployment to Vercel (production)

This is a zero-config static site, so Vercel needs no build settings.

### One-time setup (via the Vercel dashboard)

1. Go to <https://vercel.com/new>.
2. **Import** the GitHub repository `rg6830303/Arav-web`
   (authorise the Vercel GitHub app for this repo if prompted).
3. Framework Preset: **Other** · Build Command: _none_ ·
   Output Directory: leave as the repo root.
4. Set **Production Branch** to `main`
   (Project → Settings → Git → Production Branch).
5. Click **Deploy**. The first deploy is your production deployment.

### Ongoing

Every push to `main` triggers an automatic **production** deployment.

### CLI alternative

From a machine with outbound access to Vercel and a logged-in CLI:

```bash
npm i -g vercel
vercel --prod
```

> Note: the Claude Code remote sandbox that generated this site cannot reach
> `vercel.com` (network policy) and has no Vercel token, so the deploy must be
> triggered from the dashboard or a machine with Vercel access.
