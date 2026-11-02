import React from 'react';

export default function LiveStreamSection({ onBackToHome }) {
  // ID obtenido de tu transmisión activa en YouTube Studio
  const liveVideoId = "a2MBWHMwdc0";

  return (
    <section className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      {/* Botón para volver al inicio */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={onBackToHome || (() => window.location.href = '/')}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-gray-600"
        >
          ← Ir a Inicio
        </button>
      </div>

      <div className="w-full text-center mb-4">
        <h2 className="text-3xl font-bold uppercase tracking-wide text-white">
          Transmisión en Directo
        </h2>
        <p className="text-gray-300 mt-1">
          Sigue nuestros partidos y visorías en tiempo real
        </p>
      </div>

      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=1&mute=0&rel=0`}
          title="Transmisión en Vivo - Reality Sport Show"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}