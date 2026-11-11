import type { Metadata } from 'next';
import { JOURNAL_POSTS } from '@/data/journalData';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = JOURNAL_POSTS[slug as keyof typeof JOURNAL_POSTS];

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The requested journal article could not be found.',
    };
  }

  const cleanDescription = (post.content || '')
    .replace(/[#*`_\[\]()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return {
    title: post.title,
    description: cleanDescription,
    alternates: {
      canonical: `/journal/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: `https://adyantnexa.com/journal/${slug}`,
      type: 'article',
      publishedTime: post.date,
      images: [
        {
          url: '/Fb%20%26Insta.png',
          width: 1080,
          height: 1080,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: cleanDescription,
      images: ['/Fb%20%26Insta.png'],
    },
  };
}

export default async function JournalPostLayout({
  children,
  params,
}: Props) {
  const { slug } = await params;
  const post = JOURNAL_POSTS[slug as keyof typeof JOURNAL_POSTS];

  const jsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: post.title,
        datePublished: post.date,
        description: (post.content || '')
          .replace(/[#*`_\[\]()\-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 160),
        author: {
          '@type': 'Organization',
          name: 'Adyant Nexa Engineering',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Adyant Nexa',
          logo: {
            '@type': 'ImageObject',
            url: 'https://adyantnexa.com/Favicon%20transparent.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://adyantnexa.com/journal/${slug}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
