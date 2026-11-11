import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal & Intel | Engineering, Strategy & Unit Economics',
  description:
    'Research, post-mortems, and engineering playbooks on autonomous AI agents, signal recovery, and modern conversion infrastructure.',
  alternates: {
    canonical: '/journal',
  },
  openGraph: {
    title: 'Journal & Intel | Adyant Nexa',
    description:
      'Research, post-mortems, and engineering playbooks on autonomous AI agents, signal recovery, and modern conversion infrastructure.',
    url: 'https://adyantnexa.com/journal',
    type: 'website',
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
