import React from 'react';

export const LiveStreamSection = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const videoId = "C33gbZxIPLs";

  return (
    <section
      id="transmision-en-vivo"
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: '#120803',
        borderTop: '2px solid #C2410C',
      }}
    >
      <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#FFF3E8',
              backgroundColor: '#7A2A0C',
              border: '1px solid #C2410C',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ✖ Cerrar transmisión
          </button>
        </div>

        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
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
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&live=1&rel=0`}
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