import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adyantnexa.com';

  // Core commercial and system pages
  const coreRoutes = [
    '',
    '/how-it-works',
    '/tools',
    '/tools/dead-stock',
    '/tools/profit-opportunity',
    '/assessment',
    '/about',
    '/contact',
    '/journal',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add individual journal slugs
  const blogSlugs = [
    'death-of-chatbots-rise-of-agents',
    'zero-click-marketing-ai-overviews',
    'post-search-era-ai-discovery',
    'minimalist-architecture-lean-agency',
    'creative-is-the-new-targeting',
    'signal-recovery-sst-2026',
    'attribution-gap-capi-ios14',
    'ai-agent-economy-revenue'
  ];

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/journal/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...coreRoutes, ...blogRoutes];
}
