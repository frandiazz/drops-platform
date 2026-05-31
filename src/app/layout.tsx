import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const metadata: Metadata = {
  title: 'Drops | Monetización Inteligente para Creadores',
  description: 'Plataforma de monetización para creadores de contenido. Pagos express, comisiones justas, sin registros complicados.',
  keywords: 'monetización, creadores, contenido, agencia, viralidad, TikTok, Instagram, plataforma de cobro',
  authors: [{ name: 'Drops' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Drops | Monetización Inteligente para Creadores',
    description: 'Maximizamos tus ingresos de forma inteligente. Vos enfocate en crear.',
    type: 'website',
    url: siteUrl,
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drops | Monetización Inteligente para Creadores',
    description: 'Plataforma de monetización para creadores de contenido. Pagos express, comisiones justas, sin registros complicados.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Drops",
              "description": "Plataforma de monetización para creadores de contenido",
              "url": siteUrl,
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-grid`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
