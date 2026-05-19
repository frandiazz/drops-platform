import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Volver
          </Link>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Política de <span className="gradient-text">Privacidad</span>
          </h1>
          <p className="text-muted mb-12">Última actualización: Mayo 2026</p>

          <div className="space-y-10 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
              <p>Recopilamos la siguiente información:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Creadores:</strong> Nombre artístico, email, links de redes sociales, información de verificación de identidad (KYC).</li>
                <li><strong>Compradores:</strong> Email (para entrega de contenido), datos de pago (procesados por terceros como Takenos y Mercado Pago).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Cómo Usamos tu Información</h2>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Procesar pagos y distribuir ganancias a creadores.</li>
                <li>Entregar contenido digital a compradores.</li>
                <li>Comunicarnos con creadores sobre su cuenta y servicios.</li>
                <li>Mejorar la Plataforma y nuestros servicios.</li>
                <li>Cumplir con obligaciones legales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Compartición de Datos</h2>
              <p>No vendemos ni compartimos tu información personal con terceros para fines de marketing. Podemos compartir información con:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Procesadores de pago:</strong> Takenos, Mercado Pago (para procesar transacciones).</li>
                <li><strong>Servicios de hosting:</strong> Vercel, Supabase, Cloudinary (para operar la Plataforma).</li>
                <li><strong>Autoridades:</strong> Si es requerido por ley.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Seguridad</h2>
              <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tu información, incluyendo encriptación de datos, acceso restringido y monitoreo de actividad.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Retención de Datos</h2>
              <p>Conservamos tu información mientras tu cuenta esté activa y por el tiempo necesario para cumplir con obligaciones legales y resolver disputas.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Tus Derechos</h2>
              <p>Tenés derecho a:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Acceder a tu información personal.</li>
                <li>Rectificar datos incorrectos.</li>
                <li>Solicitar la eliminación de tu cuenta y datos.</li>
                <li>Oponerte al procesamiento de tus datos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Cookies</h2>
              <p>Utilizamos cookies esenciales para el funcionamiento de la Plataforma. No utilizamos cookies de rastreo ni publicitarias.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Contacto</h2>
              <p>Para consultas sobre privacidad: <a href="mailto:DropsDrops2005@gmail.com" className="text-accent-cyan hover:underline">DropsDrops2005@gmail.com</a></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
