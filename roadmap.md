# Website completion

- [x] Audit original requirements, all pages and 12 service details.
- [x] Fix critical TypeScript build error in `src/routes/__root.tsx` (migrated from deprecated `match.globalNotFound` to `match.status === "notFound"`).
- [x] Fix enquiry persistence, failure handling and truthful confirmation (verified with live Supabase test insertion).
- [x] Verify navigation, SEO, mobile layout and custom 404; fix gaps.
- [x] Document Git sync and Vercel deployment preparation with `.env.example`.
- [ ] Complete sitemap when a public site URL is available (currently unpublished; no fake domain invented).
- [ ] Run automated tests and production build in local environment (requires Node 20+/Bun installation).
