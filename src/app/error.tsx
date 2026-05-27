'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Algo salió mal</h1>
        <p className="text-muted mb-8">Ocurrió un error inesperado. Ya lo estamos revisando.</p>
        <button
          onClick={reset}
          className="inline-flex px-6 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
