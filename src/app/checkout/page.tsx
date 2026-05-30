'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentForm from '@/components/checkout/PaymentForm';
import { luhnCheck, validExpiry, validCvv, SANITIZE, detectCardBrand } from '@/components/checkout/cardUtils';

interface MercadoPagoInstance {
  checkout: (opts: { preference: { id: string }; render: { container: string; label: string } }) => void;
  createCardToken: (opts: {
    cardNumber: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    securityCode: string;
    cardholderName: string;
    identificationType: string;
    identificationNumber: string;
  }) => Promise<{ id: string; payment_method?: { id: string } }>;
}

declare global {
  interface Window { MercadoPago: new (key: string, opts?: { locale: string }) => MercadoPagoInstance; }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [docType, setDocType] = useState('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [arsRate, setArsRate] = useState<number>(1200);
  const [mpReady, setMpReady] = useState(false);
  const [mpInstance, setMpInstance] = useState<MercadoPagoInstance | null>(null);
  const [loadingPack, setLoadingPack] = useState(true);

  const [packTitle, setPackTitle] = useState('Cargando...');
  const [packPrice, setPackPrice] = useState('0');
  const [creatorId, setCreatorId] = useState('');
  const [packId, setPackId] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorAvatar, setCreatorAvatar] = useState('');
  const [packType, setPackType] = useState<'one_time' | 'subscription'>('one_time');
  const [packSubPrice, setPackSubPrice] = useState('0');

  const displayPrice = packType === 'subscription' ? packSubPrice : packPrice;

  useEffect(() => {
    const pId = searchParams.get('packId') || '';
    const cId = searchParams.get('creatorId') || '';
    setPackId(pId);
    setCreatorId(cId);

    fetch(`/api/pack?packId=${encodeURIComponent(pId)}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          setError('Pack no encontrado');
          setLoadingPack(false);
          return;
        }
        setPackTitle(SANITIZE(d.title || 'Premium Content Pack'));
        setPackPrice(String(d.price || '29.99'));
        setCreatorId(d.creatorId || cId);
        setCreatorName(SANITIZE(d.creatorName || ''));
        setCreatorAvatar(d.creatorAvatar || '');
        setPackType(d.type || 'one_time');
        setPackSubPrice(String(d.subscriptionPrice || d.price || '9.99'));
        setLoadingPack(false);
      })
      .catch(() => {
        setError('Error al cargar el producto');
        setLoadingPack(false);
      });

    fetch('/api/rate').then(r => r.json()).then(d => setArsRate(d.rate)).catch(() => {});
    if (typeof window.MercadoPago !== 'undefined') {
      setMpInstance(new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''));
      setMpReady(true);
    }
  }, [searchParams]);

  const onMpReady = useCallback(() => {
    if (typeof window.MercadoPago !== 'undefined') {
      setMpInstance(new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''));
      setMpReady(true);
    }
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!cleanNumber || !cardExpiry || !cardCvv || !cardName || !docNumber) {
      setError('Completá todos los campos');
      return;
    }
    if (!creatorId || !packId) { setError('Error: datos del producto'); return; }
    if (!mpInstance) { setError('Cargando plataforma de pago...'); return; }

    const brand = detectCardBrand(cardNumber);
    if (!luhnCheck(cleanNumber)) { setError('Número de tarjeta inválido'); return; }
    if (!validExpiry(cardExpiry)) { setError('Fecha de vencimiento inválida o vencida'); return; }
    if (!validCvv(cardCvv, brand)) { setError('Código de seguridad inválido'); return; }

    setProcessing(true);
    setError('');

    try {
      const [expMonth, expYear] = cardExpiry.split('/');
      const fullYear = expYear?.length === 2 ? `20${expYear}` : expYear;

      const cardToken = await mpInstance.createCardToken({
        cardNumber: cleanNumber,
        cardExpirationMonth: expMonth || '12',
        cardExpirationYear: fullYear || '2026',
        securityCode: cardCvv,
        cardholderName: cardName,
        identificationType: docType,
        identificationNumber: docNumber,
      });

      const guestEmail = `guest-${crypto.randomUUID().slice(0, 8)}@drops.agency`;

      const res = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: cardToken.id,
          payment_method_id: cardToken.payment_method?.id || brand,
          amount: parseFloat(displayPrice),
          buyer_email: guestEmail,
          creator_id: creatorId,
          content_id: packId,
          title: packTitle,
          identification: { type: docType, number: docNumber },
          content_type: packType,
          idempotency_key: crypto.randomUUID(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/acceder/${data.access_token}`);
      } else {
        setError(data.error || 'Pago rechazado');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : err instanceof Object && 'cause' in err ? String(err.cause) : 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  if (loadingPack) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted animate-pulse">Cargando producto...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <meta name="referrer" content="no-referrer" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={creatorId ? `/c/${creatorId}` : "/"} className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Volver
          </Link>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <OrderSummary
                creatorName={creatorName}
                creatorAvatar={creatorAvatar}
                packTitle={packTitle}
                displayPrice={displayPrice}
                arsRate={arsRate}
                packType={packType}
              />
            </div>

            <PaymentForm
              cardNumber={cardNumber}
              setCardNumber={setCardNumber}
              cardExpiry={cardExpiry}
              setCardExpiry={setCardExpiry}
              cardCvv={cardCvv}
              setCardCvv={setCardCvv}
              cardName={cardName}
              setCardName={setCardName}
              docType={docType}
              setDocType={setDocType}
              docNumber={docNumber}
              setDocNumber={setDocNumber}
              displayPrice={displayPrice}
              arsRate={arsRate}
              packType={packType}
              processing={processing}
              mpReady={mpReady}
              error={error}
              handlePay={handlePay}
              onMpReady={onMpReady}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
