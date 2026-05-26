interface Props {
  fans: number;
  price: number;
  setFans: (v: number) => void;
  setPrice: (v: number) => void;
  formatNumber: (n: number) => string;
}

export default function CalculatorSection({ fans, price, setFans, setPrice, formatNumber }: Props) {
  const gross = fans * price;
  const net = Math.round(gross * 0.80);

  return (
    <section id="calculadora" className="py-24 relative" aria-labelledby="calculator-heading">
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent-cyan/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 section-fade">
          <span className="text-accent-violet text-sm font-semibold uppercase tracking-widest">Calculadora</span>
          <h2 id="calculator-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Calculá cuánto podés <span className="gradient-text">ganar con Drops</span>
          </h2>
        </div>

        <div className="glass rounded-2xl p-8 sm:p-12 section-fade">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="fansRange" className="text-sm font-semibold text-muted">Número de Fans Estimados</label>
                  <span className="text-accent-cyan font-bold text-lg">{formatNumber(fans)}</span>
                </div>
                <input type="range" id="fansRange" min="100" max="10000" step="100" value={fans} onChange={(e) => setFans(Number(e.target.value))} aria-label="Seleccionar número de fans estimados" />
                <div className="flex justify-between text-xs text-muted mt-2"><span>100</span><span>10,000</span></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="priceRange" className="text-sm font-semibold text-muted">Precio del Pack (USD)</label>
                  <span className="text-accent-violet font-bold text-lg">${price}</span>
                </div>
                <input type="range" id="priceRange" min="5" max="100" step="1" value={price} onChange={(e) => setPrice(Number(e.target.value))} aria-label="Seleccionar precio del pack en dólares" />
                <div className="flex justify-between text-xs text-muted mt-2"><span>$5</span><span>$100</span></div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-muted mb-2">Ingreso mensual estimado</p>
              <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-cyan">${formatNumber(gross)}</span>
              <p className="mt-4 text-xs text-muted">* Basado en una conversión del 80% después de la comisión de Drops (20%).</p>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted">
                <svg className="w-4 h-4 text-accent-violet" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                Tu ganancia neta: <span className="text-green-400 font-semibold">${formatNumber(net)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
