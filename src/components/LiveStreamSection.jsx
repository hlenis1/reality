import React from 'react';

export default function LiveStreamSection({ onBackToHome }) {
  // Enlace directo a tu transmisión o canal en YouTube
  const youtubeWatchUrl = "https://www.youtube.com/watch?v=byxJYL6r_RE";

  return (
    <section className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      {/* Botón para volver al inicio */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={onBackToHome || (() => window.location.href = '/')}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-gray-600 cursor-pointer"
        >
          ← Ir a Inicio
        </button>
      </div>

      <div className="w-full text-center mb-6">
        <h2 className="text-3xl font-bold uppercase tracking-wide text-white">
          Transmisión en Directo
        </h2>
        <p className="text-gray-300 mt-1">
          Sigue nuestros partidos y visorías en tiempo real
        </p>
      </div>

      {/* Tarjeta principal con el botón hacia YouTube */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 sm:p-12 text-center shadow-2xl flex flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-full animate-pulse">
          <span className="text-red-500 text-3xl">🔴</span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            El evento se está transmitiendo por YouTube
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Haz clic en el botón para abrir la transmisión oficial en HD sin interrupciones.
          </p>
        </div>

        <a
          href={youtubeWatchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg text-base border border-red-500"
        >
          <span>🔴</span>
          <span>Ver Emisión en Vivo en YouTube</span>
        </a>
      </div>
    </section>
  );
}