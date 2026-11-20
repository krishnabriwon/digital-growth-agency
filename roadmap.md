# Website completion

## Google Sheets contact integration
- [x] Prepare server-side form-encoded forwarding, confirmed success and duplicate-click protection without redesign.
- [ ] Verify full form delivery to both destinations (database returns HTTP 521; Apps Script replies "Leads sheet not found"; owner must correct script sheet reference and storage must recover).
- [x] Run targeted tests and document integration (17 tests pass; preview builds pass); save completed changes.

- [x] Audit original requirements, all pages and 12 service details.
- [x] Fix critical TypeScript build error in `src/routes/__root.tsx` (migrated from deprecated `match.globalNotFound` to `match.status === "notFound"`).
- [x] Fix enquiry persistence, failure handling and truthful confirmation (verified with live Supabase test insertion).
- [x] Verify navigation, SEO, mobile layout and custom 404; fix gaps.
- [x] Document Git sync and Vercel deployment preparation with `.env.example`.
- [ ] Complete sitemap when a public site URL is available (currently unpublished; no fake domain invented).
- [x] Run targeted automated tests and check preview build reports (17 tests passed; production deployment not performed).
