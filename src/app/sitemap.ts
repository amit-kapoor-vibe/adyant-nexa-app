import { MetadataRoute } from 'next';
import { JOURNAL_POSTS } from '@/data/journalData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://adyantnexa.com';

  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: '2026-04-15',
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/terminal`,
      lastModified: '2026-04-15',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: '2026-04-15',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: '2026-04-15',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: '2026-04-15',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: '2026-04-15',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: '2026-04-15',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = Object.entries(JOURNAL_POSTS).map(([slug, post]) => {
    let dateStr = '2026-04-20';
    if (post && post.date) {
      const parsed = new Date(post.date);
      if (!isNaN(parsed.getTime())) {
        dateStr = parsed.toISOString().split('T')[0];
      }
    }

    return {
      url: `${baseUrl}/journal/${slug}`,
      lastModified: dateStr,
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  return [...coreRoutes, ...blogRoutes];
}
