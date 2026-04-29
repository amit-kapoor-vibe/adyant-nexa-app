import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adyantnexa.com';

  // Core pages
  const routes = ['', '/journal', '/marketing', '/admin'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add individual blog slugs (J-series)
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
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
