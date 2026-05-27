import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
        <p className="text-muted mb-8">La página que buscás no existe o fue movida.</p>
        <Link href="/" className="inline-flex px-6 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
