import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Engineering Private Autonomous AI Infrastructure',
  description:
    'Adyant Nexa builds private autonomous AI infrastructure for enterprise real estate brokerages and modern commercial operations.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About | Adyant Nexa',
    description:
      'Adyant Nexa builds private autonomous AI infrastructure for enterprise real estate brokerages and modern commercial operations.',
    url: 'https://adyantnexa.com/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
