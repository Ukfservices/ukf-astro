import { defineMiddleware } from 'astro:middleware';
// Single source of truth for every legacy URL that needs to 301 somewhere else.
// This runs before ANY route on the site, because the site builds as a single
// _worker.js (full SSR / "Advanced Mode" on Cloudflare Pages) -- which means
// Cloudflare's static public/_redirects file is NEVER consulted. It only
// applies to requests the Worker doesn't claim, and this Worker claims
// everything. Confirmed by curl -I testing on 09/07/2026: every /articles/*
// and /insights/* and /tools/* redirect in _redirects was returning 404 or a
// generic 302, not the intended 301, until this file was added.
//
// Add new entries here going forward. Do NOT add redirect rules to
// public/_redirects for this project -- they will silently do nothing.
const legacyRedirects: Record<string, string> = {
  // /articles/* -- old slugs from D1 migrations / deleted duplicate rows
  '/articles/article-fcl-vs-lcl': '/articles/fcl-vs-lcl-shipping-the-2026-decision-framework',
  '/articles/gcc-cross-border-shipping-guide': '/articles/september-gcc-crossborder',
  '/articles/uae-export-documents-guide': '/articles/july-uae-export-documents',
  '/articles/how-jebel-ali-port-works': '/articles/september-jebel-ali-port',
  '/articles/dubai-cargo-village-guide': '/articles/august-dubai-cargo-village',
  '/articles/shipping-trends-2025': '/articles/shipping-trends-2026',
  // Duplicate-topic consolidation: id 5 covered the same UAE-China lane as
  // id 24 with less current data (no live rates, no CEPA detail). Retired
  // in favour of id 24 rather than left to compete with it in search - Aug
  // 2026 KOM v2.0 editorial review.
  '/articles/china-to-dubai-trade-lane-strategy': '/articles/uae-china-trade-lane',
  // Duplicate-topic consolidation: id 15 was thin, generic, boilerplate
  // content (leaked markdown asterisks in headings, broken relative links)
  // fully superseded by id 26's "United Kingdom" destination card, which
  // has real current rates, HMRC/EORI/VAT specifics. Retired rather than
  // left live to compete in search - Aug 2026 KOM v2.0 editorial review.
  '/articles/how-to-ship-from-dubai-to-the-uk-the-complete-2026-guide': '/articles/uae-to-europe-trade-lane',
  '/articles/logistics-process': '/insights',
  '/articles/index.html': '/insights',
  // Legacy static-site homepage URL -- flagged as 404 in GSC (7/24/26),
  // last crawled at https://www.ukfservices.com/index.html
  '/index.html': '/',
  // Legacy /insights/* slugs that should live under /articles/*
  '/insights/uae-us-trade-corridor': '/articles/uae-us-trade-corridor',
  // Tool URLs -- redirect broken tool pages to services
  '/tools/fcl-lcl-calculator': '/services',
  '/tools/fcl-lcl-calculator.html': '/services',
  '/tools/volumetric-weight-calculator.html': '/services',
  '/tools/incoterms-guide': '/services',
  // Service sub-pages -- redirect to main services page
  '/services/sea-freight': '/services',
  // Legacy checklist page -- redirect to closest article
  '/uae-customs-documents-checklist': '/articles/uae-customs-clearance-guide',
};
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  // Normalise trailing slash for matching, but never touch the root path
  const key = pathname !== '/' && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  const target = legacyRedirects[key];
  if (target) {
    return context.redirect(target, 301);
  }
  return next();
});
