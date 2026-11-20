# Digital Marketing Agency

Professional Pan India agency website built with React, TypeScript, TanStack Start and Tailwind CSS. It includes 12 service detail pages, the required company pages, three resources, a saved-enquiry confirmation page and custom 404 handling.

## Development and checks

Use Bun with the checked-in lockfile (`bun install --frozen-lockfile`), then `bun run dev`. Run tests with `bun run test`. The ordinary production build is `bun run build`.

## Editable business and tracking details

`src/lib/site-config.ts` holds contact numbers and Google tracking IDs. Empty values intentionally produce pending contact labels and no third-party tracking scripts. Never substitute invented contact details or IDs.

Google Tag Manager: configure GA4, Google Ads conversions and Conversion Linker in the container. Send a lead only for `generate_lead`, not `cta_click`, a form button click or a Thank You page view. Use the explicit `page_view` event for initial and client navigation views; disable overlapping automatic/history page-view triggers. Configure consent requirements before enabling tracking. Search Console verification is the HTML-tag token, not the full tag.

## Enquiry handling

The server validates input and inserts into `public.contact_submissions` using the public INSERT policy. It returns success only after storage acknowledges the insert. Visitors cannot read stored enquiries. There is no email notification or agency inbox UI; authorised team members can review submissions in Lovable Cloud. A failed or interrupted request never triggers a lead event or confirmation navigation. A clearly labelled website-verification test enquiry may be present after QA.

### Google Sheets integration

The existing database insert is preserved. `src/lib/enquiry.functions.ts` then invokes `src/lib/google-sheets.server.ts`, which sends `application/x-www-form-urlencoded` to the owner's Apps Script `/exec` deployment. Exact parameters: `fullName`, `businessEmail`, `contactNumber`, `companyName`, `service`, `message`. The helper reads Google's ContentService redirect with GET, never repeats the POST, and requires JSON `success: true`. HTTP 200 alone, a login page or `success: false` is not confirmation.

`src/components/site/EnquiryForm.tsx` keeps its design and validation. A synchronous in-flight guard plus the disabled loading button prevents repeated clicks during a submission. The former browser database-only fallback is removed because it could bypass Google Sheets and duplicate a row after an ambiguous server response. Success, lead tracking and `/thank-you` occur only after both saves are confirmed. If Sheets fails after the database insert, the stored copy remains and an honest partial-delivery error appears. There are no automatic retries; network interruption or a later manual retry can still cause duplicates because the existing Apps Script contract has no idempotency key.

**Live checks on 20 November 2026:** the database endpoint returned HTTP 521 and the read-query tool could not access it. A separate labelled Apps Script test returned JSON failure with message `Leads sheet not found`. No successful dual-destination submission is claimed. Fix the sheet tab name/reference in Apps Script and restore existing enquiry storage, then test again. The test failure did not produce a confirmed sheet row; storage readback/cleanup was unavailable during the outage.

To test after those issues are resolved: open `/contact`, enter a distinctive test name, select a service and submit once. Confirm `/thank-you`, then check the matching row in Google Sheets and Lovable **More → Database → contact_submissions**. Confirm one row per destination and all six mapped values. Delete only your labelled test rows. Simulate a failed Google response and confirm the form stays on Contact without a lead conversion. The Google integration does not send owner emails.

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
