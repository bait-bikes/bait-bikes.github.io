# Bait Bikes public site

The Astro source for [bait-bikes.github.io](https://bait-bikes.github.io), a public-safety education and partnership site focused on bicycle and e-bike theft prevention, responsible bait-bike operations, recovery technology, and cross-institution coordination.

## Local development

```sh
npm install
npm run dev
npm run build
```

Major sections are separate Astro routes under `src/pages/`. Shared navigation, metadata, footer content, and social-preview metadata live in `src/layouts/SiteLayout.astro`; the visual system lives in `src/styles/global.css`.

Set `PUBLIC_ORG_PORTAL_URL` and `PUBLIC_OWNER_PORTAL_URL` at build time when the organization and owner applications are ready. Until then, those calls to action resolve to relevant educational sections on this site.

## Content standard

This project distinguishes sourced cases from general claims, uses precise language around allegations and varying theft thresholds, and treats lawful authority, safe response, privacy, data minimization, and community accountability as core operational requirements.
