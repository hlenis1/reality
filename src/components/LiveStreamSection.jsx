import React from 'react';

export default function LiveStreamSection({ onBackToHome }) {
  // ID activo de tu transmisión en YouTube Studio
  const liveVideoId = "a2MBWHMwdc0";
  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${liveVideoId}`;

  return (
    <section className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center">
      {/* Botón para regresar al inicio */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={onBackToHome || (() => window.location.href = '/')}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-gray-600 cursor-pointer"
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

      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col items-center justify-center p-6">
        {/* Reproductor iframe con fallback visual incorporado */}
        <iframe
          className="w-full h-full absolute inset-0 z-0"
          src={`https://www.youtube-nocookie.com/embed/${liveVideoId}?autoplay=1&mute=0`}
          title="Transmisión en Vivo - Reality Sport Show"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>

        {/* Banner flotante de acceso directo por si YouTube aplica el bloqueo de cuenta */}
        <div className="relative z-10 mt-auto mb-4 bg-black/80 backdrop-blur-md border border-red-600/50 p-4 rounded-xl text-center max-w-md shadow-2xl">
          <p className="text-xs text-gray-300 mb-2">
            ¿El video aparece bloqueado por las políticas de YouTube?
          </p>
          <a
            href={youtubeWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🔴 Ver Emisión en Vivo en YouTube
          </a>
        </div>
      </div>
    </section>
  );
}