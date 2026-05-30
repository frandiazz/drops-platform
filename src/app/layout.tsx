import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const metadata: Metadata = {
  title: 'Drops | Monetización Inteligente para Creadores',
  description: 'La agencia de management definitiva para modelos de IA y creadores. Escalamos tu viralidad y monetizamos tu contenido con nuestra plataforma de cobro express sin registros.',
  keywords: 'monetización, creadores, contenido, modelos IA, agencia, viralidad, TikTok, Instagram, plataforma de cobro',
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
    description: 'La agencia de management definitiva para modelos de IA y creadores.',
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
              "description": "Agencia de monetización y management para creadores de contenido y modelos de IA",
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
