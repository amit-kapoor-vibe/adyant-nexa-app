import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autonomous AI Terminal | Real-Time Brokerage Telemetry',
  description:
    'Experience the real-time bilingual WhatsApp qualification engine, telemetry cockpit, and autonomous buyer verification protocol.',
  alternates: {
    canonical: '/terminal',
  },
  openGraph: {
    title: 'Autonomous AI Terminal | Adyant Nexa',
    description:
      'Experience the real-time bilingual WhatsApp qualification engine, telemetry cockpit, and autonomous buyer verification protocol.',
    url: 'https://adyantnexa.com/terminal',
  },
};

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
