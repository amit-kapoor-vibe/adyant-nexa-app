import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Autonomous Real Estate Conversion Fleet',
  description:
    'From Meta ad click to sub-90s BANT qualification, Golden Visa verification, and calendar-synced viewing bookings on WhatsApp.',
  alternates: {
    canonical: '/how-it-works',
  },
  openGraph: {
    title: 'How It Works | Adyant Nexa',
    description:
      'From Meta ad click to sub-90s BANT qualification, Golden Visa verification, and calendar-synced viewing bookings on WhatsApp.',
    url: 'https://adyantnexa.com/how-it-works',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
