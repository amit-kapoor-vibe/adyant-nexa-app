import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/leads/'], // Privacy for internal data
    },
    sitemap: 'https://adyantnexa.com/sitemap.xml',
  };
}
