## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Bait Bikes site rules

- Keep the site Astro-native. Do not add React, JSX, Hugo, or Jekyll.
- Preserve the multi-route information architecture and add hash links only for sections that are useful as direct references.
- Distinguish allegations, convictions, agency accounts, practitioner guidance, and locally measured outcomes. Do not turn a single case into a universal claim.
- State that criminal classifications and theft thresholds vary by jurisdiction. Operational material is educational and requires local counsel, policy, training, supervision, and community review.
- Never encourage vigilantism, confrontation, public live-location sharing, or remote disabling of a moving bicycle.
- Do not collect petition authors' or signers' personal data without an approved backend, privacy review, retention policy, and abuse controls. Client-side drafting tools must clearly disclose that data remains in the browser.
- Run `npm run build` and check every generated route before publication. Keep `dist/`, `.astro/`, and `node_modules/` untracked.
