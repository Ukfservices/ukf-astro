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
  '/articles/logistics-process': '/insights',

  // Legacy /insights/* slugs that should live under /articles/*
  '/insights/uae-us-trade-corridor': '/articles/uae-us-trade-corridor',

  // Tool URLs without .html extension -> static .html versions in public/
  '/tools/fcl-lcl-calculator': '/tools/fcl-lcl-calculator.html',
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
