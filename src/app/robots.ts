import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/leads/'],
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
        ],
        allow: '/',
        disallow: ['/api/', '/admin/leads/'],
      },
    ],
    sitemap: 'https://adyantnexa.com/sitemap.xml',
    host: 'https://adyantnexa.com',
  };
}
