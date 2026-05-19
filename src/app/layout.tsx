import type { Metadata } from 'next';
import './globals.css';

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
    url: 'https://drops.vercel.app',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Drops",
              "description": "Agencia de monetización y management para creadores de contenido y modelos de IA",
              "url": "https://drops.vercel.app",
            }),
          }}
        />
      </head>
      <body className="bg-grid">{children}</body>
    </html>
  );
}
