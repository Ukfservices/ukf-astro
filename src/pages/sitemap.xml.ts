import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const baseUrl = 'https://ukfservices.com';

  // Static pages with priorities and change frequencies
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.9', changefreq: 'monthly' },
    { url: '/process', priority: '0.7', changefreq: 'monthly' },
    { url: '/insights', priority: '0.9', changefreq: 'daily' },
    { url: '/testimonials', priority: '0.7', changefreq: 'monthly' },
    { url: '/services', priority: '0.9', changefreq: 'monthly' },
    { url: '/services/air-freight', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/ocean-freight', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/customs-clearance', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/road-freight', priority: '0.7', changefreq: 'monthly' },
    { url: '/services/cross-border', priority: '0.7', changefreq: 'monthly' },
    { url: '/services/incoterms', priority: '0.7', changefreq: 'monthly' },
    { url: '/services/warehousing', priority: '0.7', changefreq: 'monthly' },
    { url: '/services/project-cargo', priority: '0.7', changefreq: 'monthly' },
    { url: '/services/indonesia', priority: '0.8', changefreq: 'monthly' },
  ];

  // Fetch articles from D1
  let articleUrls: { url: string; lastmod: string }[] = [];
  try {
    const db = (env as any).ukf_insights_db as D1Database;
    const result = await db.prepare(
      'SELECT slug, published_date FROM articles ORDER BY published_date DESC'
    ).all();
    articleUrls = (result.results || []).map((a: any) => ({
      url: `/articles/${a.slug}`,
      lastmod: a.published_date ? new Date(a.published_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    }));
  } catch (e) {
    // If D1 fails, sitemap still works with static pages
  }

  const today = new Date().toISOString().split('T')[0];

  const staticEntries = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const articleEntries = articleUrls.map(a => `
  <url>
    <loc>${baseUrl}${a.url}</loc>
    <lastmod>${a.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${articleEntries}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
