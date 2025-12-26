// app/admin/loading.tsx
import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-6xl mb-4 animate-bounce">🛒</div> {/* Dog emoji with a bounce animation */}
      <p className="text-xl font-semibold">Carregando Fucinhos...</p>
      <p className="text-sm text-gray-600 mt-2">Por favor, aguarde.</p>
    </div>
  );
}
