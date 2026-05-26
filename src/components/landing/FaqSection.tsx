interface Props {
  openFaq: number | null;
  setOpenFaq: (v: number | null) => void;
  faqs: { q: string; a: string }[];
}

export default function FaqSection({ openFaq, setOpenFaq, faqs }: Props) {
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
}
