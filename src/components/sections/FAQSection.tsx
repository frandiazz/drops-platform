import { memo } from 'react';

const faqs = [
  { q: '¿Cómo recibo el contenido después de pagar?', a: 'Al instante. Cuando completás el pago, te redirigimos automáticamente a una página con todo el contenido listo para ver o descargar. No hace falta que pongas tu email ni esperes ningún mensaje. El link de acceso es único y seguro.' },
  { q: '¿Es seguro poner los datos de mi tarjeta?', a: 'Sí. Todo el procesamiento de pagos lo hace Mercado Pago, la plataforma líder en Latinoamérica con más de 20 años de trayectoria. Los datos de tu tarjeta se tokenizan directamente desde tu navegador, nunca pasan por nuestros servidores.' },
  { q: '¿Puedo pedir un reembolso si no me gusta el contenido?', a: 'Si no recibís el acceso o hay un error técnico, contactanos a dropsdrops2005@gmail.com y lo resolvemos. Cada creador establece su propia política de reembolso, consultá directamente con él/ella.' },
  { q: '¿Cuánto cobra Drops de comisión?', a: 'Todos los planes tienen una comisión fija del 20%. La diferencia está en los servicios: Solo Plataforma no tiene costo mensual, Social Media tiene un costo de $299/mes y Full Management de $599/mes. Esto incluye gestión de redes, sistema de cobro express, protección antifraude y soporte continuo.' },
  { q: '¿Cómo y cuándo me pagan?', a: 'Los pagos se procesan y acreditan entre 24 y 48 horas después de solicitar el retiro. Podés retirar tus ganancias mediante transferencia bancaria, criptomonedas (USDT TRC20) o Mercado Pago. El mínimo de retiro es de $50 USD.' },
  { q: '¿Necesito un mínimo de seguidores para unirme?', a: 'No exigimos un mínimo de seguidores. Evaluamos cada caso individualmente. Si tenés contenido de calidad y compromiso para crecer, Drops te ayuda a escalar desde donde estés.' },
  { q: '¿Es seguro para mi contenido?', a: 'Absolutamente. Tu contenido se entrega mediante enlaces encriptados temporales que expiran después de la compra. Además, contamos con sistema DMCA activo y protección contra piratería. Importante: si la entrega se realiza por fuera de la app, Drops no se hace responsable.' },
  { q: '¿Puedo irme cuando quiera?', a: 'Sí, no hay contratos de permanencia. Podés cancelar tu cuenta en cualquier momento. Tus ganancias pendientes se te pagan en el siguiente ciclo de pago. Creemos en quedarnos porque generamos valor, no por obligación contractual.' },
];

const FAQSection = memo(function FAQSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  return (
    <section className="py-24 relative" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 section-fade">
          <span className="text-accent-violet text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 id="faq-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Preguntas <span className="gradient-text">frecuentes</span>
          </h2>
        </div>
        <div className="space-y-4 section-fade">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item glass-card rounded-xl overflow-hidden">
              <button
                className="faq-toggle w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span className="text-base font-semibold pr-4">{faq.q}</span>
                <span className={`faq-icon text-accent-cyan text-2xl font-light flex-shrink-0${openFaq === i ? ' rotate' : ''}`} aria-hidden="true">+</span>
              </button>
              <div className={`faq-answer px-6${openFaq === i ? ' open' : ''}`}>
                <p className="text-muted text-sm leading-relaxed pb-6">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default FAQSection;
