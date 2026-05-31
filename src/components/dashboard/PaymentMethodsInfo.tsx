import { memo } from 'react';
import { CreditCard, Wallet } from 'lucide-react';

const PaymentMethodsInfo = memo(function PaymentMethodsInfo() {
  const cards = [
    { name: 'Visa', bg: '#1A1F71', text: 'VISA', size: 7 },
    { name: 'Mastercard', bg: '#EB001B', text: 'MC', size: 7 },
    { name: 'Amex', bg: '#2E77BC', text: 'AMEX', size: 6 },
    { name: 'Diners', bg: '#0066A2', text: 'DNRS', size: 6 },
    { name: 'Discover', bg: '#E87E1B', text: 'DISC', size: 6 },
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Cómo cobrás tus ventas</h3>
      <p className="text-xs text-muted mb-4">
        Tus clientes pagan con tarjeta vía Mercado Pago (ARS). Después solicitás un retiro manual y te pagamos por transferencia bancaria, criptomonedas (USDT TRC20) o Mercado Pago.
      </p>

      <h4 className="text-sm font-semibold text-muted mb-3">Tarjetas aceptadas para cobrar</h4>
      <div className="flex items-center gap-5 flex-wrap text-slate-400 mb-6">
        {cards.map(({ name, bg, text, size }) => (
          <div key={name} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-dark-light/50">
            <svg className="w-10 h-7" viewBox="0 0 50 30">
              <rect width="50" height="30" rx="4" fill={bg} />
              <text x="25" y="19" textAnchor="middle" fill="white" fontSize={size} fontWeight="bold">{text}</text>
            </svg>
            <span className="text-[10px]">{name}</span>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
          <CreditCard className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Pago con tarjeta</p>
            <p className="text-xs text-muted">Visa, Mastercard, Amex, Diners, Discover</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
          <Wallet className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Retiro a banco</p>
            <p className="text-xs text-muted">Transferencia bancaria a tu cuenta</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
          <Wallet className="w-6 h-6 text-accent-violet flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">Crypto o MP</p>
            <p className="text-xs text-muted">USDT TRC20 o Mercado Pago (ARS)</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PaymentMethodsInfo;
