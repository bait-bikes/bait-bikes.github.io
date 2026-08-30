# Bait Bikes public site

The Astro source for [baitbikes.org](https://baitbikes.org), a public-safety education and partnership site focused on bicycle and e-bike theft prevention, responsible bait-bike operations, recovery technology, and cross-institution coordination. GitHub Pages remains the source-controlled deployment origin at [bait-bikes.github.io](https://bait-bikes.github.io); `baitbikes.org` is the canonical public domain and `bikes.men` redirects to it through Cloudflare.

## Local development

```sh
npm install
npm run dev
npm run build
```

Major sections are separate Astro routes under `src/pages/`. Shared navigation, metadata, footer content, and social-preview metadata live in `src/layouts/SiteLayout.astro`; the visual system lives in `src/styles/global.css`.

The petition toolkit is intentionally browser-only. It can create a PDF and a standards-based `.eml` draft addressed to the verified government recipient, carbon-copied to the submitter, with the full petition PDF attached. The site does not transmit or retain petition content or email addresses.

Set `PUBLIC_ORG_PORTAL_URL`, `PUBLIC_OWNER_PORTAL_URL`, and `PUBLIC_USER_APP_URL` at build time when the organization and owner applications are ready. The authentication header defaults to `https://user.baitbikes.org`; the other calls to action resolve to relevant educational sections until their applications are deployed.

Canonical-domain behavior is owned by `bait-bikes-infra`: the `bikes.men`
apex and supported service subdomains redirect with HTTP 308 to the equivalent
`baitbikes.org` host while preserving path and query. This site emits canonical
and social metadata for `https://baitbikes.org`, regardless of its deployment
origin.

## Content standard

This project distinguishes sourced cases from general claims, uses precise language around allegations and varying theft thresholds, and treats lawful authority, safe response, privacy, data minimization, and community accountability as core operational requirements.
