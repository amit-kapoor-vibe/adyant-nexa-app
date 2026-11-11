import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Brokerage Access | Adyant Nexa',
  description:
    'Connect directly with Adyant Nexa systems principals to deploy private autonomous qualification fleets for your brokerage.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact & Brokerage Access | Adyant Nexa',
    description:
      'Connect directly with Adyant Nexa systems principals to deploy private autonomous qualification fleets for your brokerage.',
    url: 'https://adyantnexa.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
