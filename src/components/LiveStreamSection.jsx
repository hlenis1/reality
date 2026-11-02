import React from "react";

export default function LiveStreamSection() {
  // Tu ID de canal de YouTube
  const CHANNEL_ID = "UCGK3wNspmClgyPR6L_CNcVw";

  return (
    <section className="live-section" id="transmision-en-vivo">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@500;600;700&display=swap');

        .live-section {
          --bg-0: #7A2A0C;
          --bg-1: #9A3412;
          --ink: #FFF3E8;
          --ink-dim: #F3C9A6;
          --accent: #FFC24B;
          --dark: #2B1206;

          position: relative;
          width: 100%;
          padding: 4rem 1.5rem;
          background: linear-gradient(175deg, var(--bg-0) 0%, var(--bg-1) 100%);
          font-family: 'Barlow Condensed', system-ui, sans-serif;
          color: var(--ink);
        }

        .live-container {
          max-width: 950px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .live-header {
          text-align: center;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #DC2626;
          color: #FFF;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          margin-bottom: 0.8rem;
          box-shadow: 0 0 12px rgba(220, 38, 38, 0.5);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background-color: #FFF;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .live-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          text-transform: uppercase;
          margin: 0;
          line-height: 1;
        }

        .live-title span {
          color: var(--accent);
        }

        .live-subtitle {
          color: var(--ink-dim);
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }

        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 194, 75, 0.3);
          background: var(--dark);
        }

        .video-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>

      <div className="live-container">
        <div className="live-header">
          <div className="live-badge">
            <span className="live-dot"></span> EN VIVO
          </div>
          <h2 className="live-title">
            Transmisión <span>en Directo</span>
          </h2>
          <p className="live-subtitle">
            Sigue nuestros partidos y visorías en tiempo real
          </p>
        </div>

        <div className="video-wrapper">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=0&rel=0`}
            title="Transmisión en vivo de YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}