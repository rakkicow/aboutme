# rakshita.me

Personal site and portfolio for Rakshita "Ria" Gupta — Computer Engineering @ Purdue.

Live at **[rakshita.me](https://rakshita.me)**.

## Stack

- [Astro](https://astro.build) — static site framework
- [Tailwind CSS](https://tailwindcss.com) — styling (with `darkMode: 'class'`)
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering/) — animation and smooth scrolling
- [GitHub Pages](https://pages.github.com) — hosting, deployed via GitHub Actions

## Local development

```bash
npm install
npm run dev       # start dev server at http://localhost:4321
npm run build     # build to ./dist
npm run preview   # preview the built site locally
```

## Project structure

```
.
├── .github/workflows/   # GitHub Actions (deploy to Pages)
├── public/              # static assets served as-is
│   ├── CNAME            # custom domain (rakshita.me)
│   ├── favicon.svg
│   ├── assets/          # site images
│   ├── plex/            # legacy plex.* page (served at /plex)
│   └── lhshosa/         # legacy LHS HOSA page (served at /lhshosa)
├── src/
│   ├── components/      # Astro components
│   ├── data/            # static content/data
│   ├── layouts/         # page layouts
│   ├── pages/           # routes
│   ├── scripts/         # client-side scripts
│   └── styles/          # global CSS
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds with Astro and publishes `dist/` to GitHub Pages. The `public/CNAME` file binds the site to `rakshita.me`.
