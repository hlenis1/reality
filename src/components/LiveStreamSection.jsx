import React from 'react';

export const LiveStreamSection = () => {
  // ID obtenido de tu emisión activa en YouTube
  const videoId = "C33gbZxIPLs";

  return (
    <section style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h2>Transmisión en Vivo ⚽</h2>
      
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%', // Formato 16:9
            height: 0,
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            backgroundColor: '#000',
          }}
        >
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0,
            }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&live=1`}
            title="Transmisión en Vivo - Reality Sport Show"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default LiveStreamSection;