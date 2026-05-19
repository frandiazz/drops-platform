import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function TermsPage() {
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
            Términos y <span className="gradient-text">Condiciones</span>
          </h1>
          <p className="text-muted mb-12">Última actualización: Mayo 2026</p>

          <div className="space-y-10 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Introducción</h2>
              <p>Estos Términos y Condiciones (&ldquo;Términos&rdquo;) regulan el uso de la plataforma Drops (&ldquo;la Plataforma&rdquo;), operada por Drops (&ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo;). Al registrarte como creador o utilizar nuestros servicios, aceptás estos Términos en su totalidad.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Servicios Ofrecidos</h2>
              <p>Drops ofrece los siguientes servicios:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Full Management:</strong> Gestión completa de redes sociales (Instagram, X, Threads, TikTok) y cuenta de Telegram. Comisión: 50%.</li>
                <li><strong>Social Media Only:</strong> Gestión de redes sociales. El creador administra su Telegram. Comisión: 30%.</li>
                <li><strong>Solo Plataforma:</strong> Acceso a la plataforma de monetización. El creador gestiona todo. Comisión: 20% (puede reducirse a 10% por alto volumen de ventas).</li>
                <li><strong>Mini Curso:</strong> Formación de 10 horas por WhatsApp sobre viralización. Costo: $100.000 ARS o equivalente en USD.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Pagos y Distribución de Ingresos</h2>
              <p>Los pagos se distribuyen según el porcentaje acordado según el nivel de servicio seleccionado. Drops retiene su comisión antes de transferir el restante al creador.</p>
              <p className="mt-2"><strong>Retiros:</strong> Los creadores pueden solicitar retiros de sus ganancias. Los fondos se acreditan entre 24 y 48 horas hábiles después de la solicitud. El monto mínimo de retiro es de $50 USD.</p>
              <p className="mt-2"><strong>Métodos de pago:</strong> Transferencia bancaria (cuenta internacional Lead Bank), criptomonedas (USDT TRC20), Mercado Pago (Argentina).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Contenido del Creador</h2>
              <p>El creador conserva todos los derechos de propiedad intelectual sobre el contenido que sube a la Plataforma. Al subir contenido, el creador otorga a Drops una licencia limitada para distribuir dicho contenido exclusivamente a los compradores que hayan realizado el pago correspondiente.</p>
              <p className="mt-2"><strong>Importante:</strong> Drops solo se hace responsable de la entrega de contenido cuando esta se realiza a través de la Plataforma. Si el creador o el comprador acuerdan una entrega por fuera de la app (por ejemplo, por Telegram directo), Drops no se hace responsable de dicha entrega ni de cualquier problema derivado de la misma.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Protección Antifraude y Contracargos</h2>
              <p>Drops implementa sistemas de detección de fraude y control de contracargos. Sin embargo, Drops no garantiza la eliminación total de fraudes o contracargos. En caso de contracargo comprobado, el monto será descontado de las ganancias del creador correspondiente.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Manejo de Fondos</h2>
              <p>Drops actúa como intermediario en la recepción y distribución de los pagos realizados por los compradores. Los fondos de los creadores son administrados por Drops hasta el momento del retiro solicitado. Drops se compromete a mantener registros transparentes de todas las transacciones.</p>
              <p className="mt-2">Drops no es una entidad financiera ni un banco. Los fondos no están asegurados por ningún sistema de garantía de depósitos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Limitación de Responsabilidad</h2>
              <p>Drops no será responsable por:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Daños indirectos, incidentales o consecuentes derivados del uso de la Plataforma.</li>
                <li>Contenido entregado por fuera de la Plataforma.</li>
                <li>Acciones de terceros, incluyendo compradores o plataformas de pago.</li>
                <li>Interrupciones del servicio por mantenimiento, fallos técnicos o fuerza mayor.</li>
              </ul>
              <p className="mt-2">La responsabilidad total de Drops hacia el creador no excederá el monto de las comisiones cobradas en los últimos 3 meses.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Terminación</h2>
              <p>El creador puede cancelar su cuenta en cualquier momento sin penalización. Drops puede suspender o cancelar una cuenta en caso de violación de estos Términos, actividades fraudulentas o contenido ilegal.</p>
              <p className="mt-2">Al cancelar, el creador recibirá todas las ganancias pendientes en el siguiente ciclo de pago.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">9. Propiedad Intelectual</h2>
              <p>La Plataforma, su diseño, logotipos, código y marca son propiedad exclusiva de Drops. El creador no puede reproducir, distribuir o crear trabajos derivados sin autorización expresa.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">10. DMCA y Contenido Ilegal</h2>
              <p>Drops respeta los derechos de propiedad intelectual. Si considerás que tu contenido ha sido utilizado de manera que constituye una violación de derechos de autor, contactanos a DropsDrops2005@gmail.com con la información requerida por la DMCA.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">11. Ley Aplicable</h2>
              <p>Estos Términos se rigen por las leyes aplicables. Cualquier disputa será resuelta en los tribunales competentes.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">12. Contacto</h2>
              <p>Para consultas sobre estos Términos: <a href="mailto:DropsDrops2005@gmail.com" className="text-accent-cyan hover:underline">DropsDrops2005@gmail.com</a></p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
