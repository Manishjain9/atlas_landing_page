import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atlas — The Donor CRM Built for Catholic Dioceses',
  description:
    'Atlas is built natively on GiveCentral\'s giving infrastructure, designed around the Diocese → Parish → Household hierarchy. Early access preview 2026.',
  openGraph: {
    title: 'Atlas — The Donor CRM Built for Catholic Dioceses',
    description:
      'The only CRM built natively for Catholic diocese stewardship. Native GiveCentral integration, AI-powered donor insights, and real parish hierarchy.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,600&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
