import { useEffect, useRef } from "react";

/**
 * RealitySportShow
 * Hero de marca para "Reality Sport Show".
 * Fondo naranja oscuro tipo "cancha al atardecer", tipografía
 * condensada de marcador deportivo y dos botones de acción.
 */
export default function RealitySportShow() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.classList.add("rss-in");
  }, []);

  return (
    <div className="rss" ref={rootRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@500;600;700&display=swap');

        .rss {
          --bg-0: #7A2A0C;
          --bg-1: #9A3412;
          --bg-2: #C2410C;
          --ink: #FFF3E8;
          --ink-dim: #F3C9A6;
          --accent: #FFC24B;
          --dark: #2B1206;

          position: relative;
          isolation: isolate;
          width: 100%;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4.5rem 1.5rem;
          background:
            radial-gradient(120% 140% at 15% -10%, var(--bg-2) 0%, transparent 55%),
            linear-gradient(155deg, var(--bg-1) 0%, var(--bg-0) 100%);
          overflow: hidden;
          font-family: 'Barlow Condensed', system-ui, sans-serif;
        }

        /* Carriles diagonales tipo pista de atletismo, muy sutiles */
        .rss::before {
          content: "";
          position: absolute;
          inset: -20% -10%;
          background: repeating-linear-gradient(
            115deg,
            rgba(255, 255, 255, 0.05) 0px,
            rgba(255, 255, 255, 0.05) 2px,
            transparent 2px,
            transparent 64px
          );
          z-index: 0;
          pointer-events: none;
        }

        /* Marcador numerico gigante de fondo, apenas visible */
        .rss::after {
          content: "01";
          position: absolute;
          right: -1.5rem;
          bottom: -3.5rem;
          font-family: 'Anton', sans-serif;
          font-size: clamp(9rem, 22vw, 15rem);
          color: rgba(255, 255, 255, 0.06);
          line-height: 1;
          z-index: 0;
          user-select: none;
        }

        .rss-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.6rem;
          max-width: 640px;
          opacity: 0;
          transform: translateY(14px);
        }

        .rss-in .rss-content {
          animation: rss-rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes rss-rise {
          to { opacity: 1; transform: translateY(0); }
        }

        .rss-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }

        .rss-eyebrow::before,
        .rss-eyebrow::after {
          content: "";
          width: 22px;
          height: 2px;
          background: var(--accent);
        }

        .rss-title {
          font-family: 'Anton', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          font-size: clamp(2.6rem, 7vw, 4.6rem);
          line-height: 0.95;
          color: var(--ink);
          margin: 0;
          text-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
        }

        .rss-title span {
          color: var(--accent);
        }

        .rss-sub {
          margin: 0;
          font-size: clamp(1.05rem, 1.6vw, 1.25rem);
          color: var(--ink-dim);
          font-weight: 500;
          max-width: 46ch;
        }

        .rss-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.9rem;
          margin-top: 0.6rem;
        }

        .rss-btn {
          appearance: none;
          border: none;
          cursor: pointer;
          font-family: 'Barlow Condensed', system-ui, sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 0.85rem 2.1rem;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .rss-btn:focus-visible {
          outline: 3px solid var(--ink);
          outline-offset: 3px;
        }

        .rss-btn--primary {
          background: var(--accent);
          color: var(--dark);
          box-shadow: 0 10px 24px rgba(255, 194, 75, 0.25);
        }

        .rss-btn--primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .rss-btn--ghost {
          background: transparent;
          color: var(--ink);
          box-shadow: inset 0 0 0 2px rgba(255, 243, 232, 0.55);
        }

        .rss-btn--ghost:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 0 0 2px var(--ink);
        }

        @media (prefers-reduced-motion: reduce) {
          .rss-content,
          .rss-btn {
            animation: none !important;
            transition: none !important;
          }
          .rss-in .rss-content {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <div className="rss-content">
        <span className="rss-eyebrow">En vivo cada semana</span>
        <h1 className="rss-title">
          Reality <span>Sport</span> Show
        </h1>
        <p className="rss-sub">
          Compite, entrena y demuestra de qué estás hecho. La cancha te espera.
        </p>
        <div className="rss-actions">
          <button type="button" className="rss-btn rss-btn--primary">
            Regístrate
          </button>
          <button type="button" className="rss-btn rss-btn--ghost">
            Quiénes somos
          </button>
        </div>
      </div>
    </div>
  );
}
