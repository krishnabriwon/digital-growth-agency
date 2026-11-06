# Digital Marketing Agency

Professional Pan India agency website built with React, TypeScript, TanStack Start and Tailwind CSS. It includes 12 service detail pages, the required company pages, three resources, a saved-enquiry confirmation page and custom 404 handling.

## Development and checks

Use Bun with the checked-in lockfile (`bun install --frozen-lockfile`), then `bun run dev`. Run tests with `bun run test`. The ordinary production build is `bun run build`.

## Editable business and tracking details

`src/lib/site-config.ts` holds contact numbers and Google tracking IDs. Empty values intentionally produce pending contact labels and no third-party tracking scripts. Never substitute invented contact details or IDs.

Google Tag Manager: configure GA4, Google Ads conversions and Conversion Linker in the container. Send a lead only for `generate_lead`, not `cta_click`, a form button click or a Thank You page view. Use the explicit `page_view` event for initial and client navigation views; disable overlapping automatic/history page-view triggers. Configure consent requirements before enabling tracking. Search Console verification is the HTML-tag token, not the full tag.

## Enquiry handling

The server validates input and inserts into `public.contact_submissions` using the public INSERT policy. It returns success only after storage acknowledges the insert. Visitors cannot read stored enquiries. There is no email notification or agency inbox UI; authorised team members can review submissions in Lovable Cloud. A failed or interrupted request never triggers a lead event or confirmation navigation. A clearly labelled website-verification test enquiry may be present after QA.

## GitHub synchronization

Connect through Lovable Project settings → Git; connecting creates a new repository. Repository connection and synchronization status must be checked in that interface. Keep generated integration files unchanged, do not commit private keys, and do not force-push or rewrite synchronized history.

## Vercel preparation

This is an SSR application with server functions, **not** a static Vite site. The existing managed Vite configuration selects Nitro's `vercel` preset only when Vercel CI supplies `VERCEL=1`; Lovable retains its normal deployment target. Do not add duplicate TanStack/Nitro plugins or catch-all static rewrites.

Import the synchronized repository in Vercel, use Node 24+, and let Vercel detect TanStack Start. Preserve the server output rather than pointing the output directory at a static `dist` folder. Configure the public browser values `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`, plus server-only `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, for the backend you are using. These are the backend address and public/publishable key; contact inserts do not need a service-role key. Never prefix private credentials with `VITE_`.

An actual Vercel deployment has not been performed or verified. After deploying, test direct service/article URLs, a 404, and a saved enquiry from the deployed origin. Follow [Vercel's TanStack Start guide](https://vercel.com/docs/frameworks/full-stack/tanstack-start) and [TanStack hosting documentation](https://tanstack.com/start/latest/docs/framework/react/guide/hosting).

## SEO launch checklist

Every content page has unique metadata and a self-referencing canonical. Relative canonicals and `og:url` are intentional while no public domain exists. Bundled imagery is not used as a relative social-image URL. Thank You is `noindex,nofollow`; `robots.txt` preserves its exclusion.

**Sitemap setup is pending a public site URL.** No preview URL is substituted for a public domain. Once published or connected to a production domain, install the router-derived sitemap using the documented Lovable recipe, include the public static pages plus all 12 service URLs and three article URLs, exclude Thank You and missing pages, and add the production sitemap address to robots.txt. Omit `lastmod` unless an authoritative page-specific content-change timestamp exists.

The privacy policy describes current processing but is not legal advice. Confirm your retention policy and privacy contact before launch; update it and implement any required consent before enabling analytics or advertising.
