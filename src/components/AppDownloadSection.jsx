import { useEffect, useRef } from "react";
import teamPhoto from "../assets/team-training.jpg";

/**
 * AppDownloadSection
 * Sección de contenido para colocar debajo del hero (RealitySportShow).
 * Combina la foto real del entrenamiento con un mockup de celular y
 * una llamada a la acción para descargar la app.
 */
export default function AppDownloadSection() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("ads-in");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ads" ref={rootRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@500;600;700&display=swap');

        .ads {
          --bg-0: #7A2A0C;
          --bg-1: #9A3412;
          --bg-2: #C2410C;
          --ink: #FFF3E8;
          --ink-dim: #F3C9A6;
          --accent: #FFC24B;
          --dark: #2B1206;

          position: relative;
          width: 100%;
          padding: 5rem 1.5rem;
          background: linear-gradient(175deg, var(--bg-0) 0%, var(--bg-1) 100%);
          font-family: 'Barlow Condensed', system-ui, sans-serif;
          overflow: hidden;
        }

        .ads-grid {
          position: relative;
          z-index: 1;
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 3.5rem;
        }

        /* --- Copy --- */
        .ads-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.3rem;
          opacity: 0;
          transform: translateX(-24px);
        }

        .ads-in .ads-copy {
          animation: ads-slide-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes ads-slide-in {
          to { opacity: 1; transform: translateX(0); }
        }

        .ads-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }

        .ads-eyebrow::before {
          content: "";
          width: 22px;
          height: 2px;
          background: var(--accent);
        }

        .ads-title {
          font-family: 'Anton', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          font-size: clamp(2.2rem, 4.6vw, 3.4rem);
          line-height: 0.98;
          color: var(--ink);
          margin: 0;
          text-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .ads-title span {
          color: var(--accent);
        }

        .ads-text {
          margin: 0;
          font-size: clamp(1.05rem, 1.5vw, 1.2rem);
          color: var(--ink-dim);
          font-weight: 500;
          max-width: 44ch;
          line-height: 1.5;
        }

        .ads-scout {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.6rem 1rem;
          background: rgba(255, 243, 232, 0.08);
          border: 1px solid rgba(255, 194, 75, 0.35);
          border-radius: 999px;
          color: var(--ink);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .ads-scout svg {
          width: 18px;
          height: 18px;
          flex: 0 0 auto;
          color: var(--accent);
        }

        .ads-downloads {
          display: flex;
          flex-wrap: wrap;
          gap: 0.9rem;
          margin-top: 0.4rem;
        }

        .ads-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          appearance: none;
          border: none;
          cursor: pointer;
          font-family: 'Barlow Condensed', system-ui, sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          padding: 0.8rem 1.7rem;
          clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .ads-download-btn:focus-visible {
          outline: 3px solid var(--ink);
          outline-offset: 3px;
        }

        .ads-download-btn svg {
          width: 20px;
          height: 20px;
        }

        .ads-download-btn--primary {
          background: var(--accent);
          color: var(--dark);
          box-shadow: 0 10px 24px rgba(255, 194, 75, 0.25);
        }

        .ads-download-btn--primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .ads-download-btn--ghost {
          background: transparent;
          color: var(--ink);
          box-shadow: inset 0 0 0 2px rgba(255, 243, 232, 0.55);
        }

        .ads-download-btn--ghost:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 0 0 2px var(--ink);
        }

        /* --- Visual: foto + mockup de celular --- */
        .ads-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 420px;
          opacity: 0;
          transform: translateX(24px);
        }

        .ads-in .ads-visual {
          animation: ads-slide-in-r 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes ads-slide-in-r {
          to { opacity: 1; transform: translateX(0); }
        }

        .ads-photo-card {
          position: relative;
          width: min(100%, 380px);
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
          transform: rotate(-3deg);
        }

        .ads-photo-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: saturate(1.05) contrast(1.03);
        }

        .ads-photo-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(200deg, rgba(122, 42, 12, 0) 40%, rgba(43, 18, 6, 0.55) 100%);
        }

        .ads-phone {
          position: absolute;
          right: -0.5rem;
          bottom: -2.2rem;
          width: 148px;
          filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.45));
          transform: rotate(4deg);
        }

        .ads-phone-frame {
          background: var(--dark);
          border-radius: 26px;
          padding: 8px;
          box-shadow: 0 0 0 2px rgba(255, 243, 232, 0.15);
        }

        .ads-phone-screen {
          background: linear-gradient(165deg, var(--bg-2), var(--bg-0));
          border-radius: 18px;
          aspect-ratio: 9 / 19.5;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 14px 10px 10px;
        }

        .ads-phone-notch {
          width: 38%;
          height: 14px;
          background: var(--dark);
          border-radius: 0 0 10px 10px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .ads-phone-badge {
          margin-top: 22px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--dark);
          font-family: 'Anton', sans-serif;
          font-size: 1.1rem;
        }

        .ads-phone-lines {
          width: 100%;
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ads-phone-lines span {
          display: block;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 243, 232, 0.25);
        }

        .ads-phone-lines span:nth-child(1) { width: 70%; }
        .ads-phone-lines span:nth-child(2) { width: 90%; }
        .ads-phone-lines span:nth-child(3) { width: 55%; }

        .ads-phone-cta {
          margin-top: auto;
          width: 100%;
          height: 22px;
          border-radius: 999px;
          background: var(--accent);
        }

        @media (max-width: 860px) {
          .ads-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .ads-copy {
            align-items: center;
            text-align: center;
          }
          .ads-downloads {
            justify-content: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ads-copy,
          .ads-visual,
          .ads-download-btn {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="ads-grid">
        <div className="ads-copy">
          <span className="ads-eyebrow">Únete al equipo</span>
          <h2 className="ads-title">
            Descarga <span>nuestra aplicación</span>
          </h2>
          <p className="ads-text">
            Forma parte del equipo selecto de futbolistas formado por
            nosotros. Entrenamos con la mirada puesta en los cazatalentos
            que buscan al próximo crack.
          </p>
          <span className="ads-scout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Cazatalentos revisando la app cada semana
          </span>
          <div className="ads-downloads">
            <button type="button" className="ads-download-btn ads-download-btn--primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Descargar para iOS
            </button>
            <button type="button" className="ads-download-btn ads-download-btn--ghost">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Descargar para Android
            </button>
          </div>
        </div>

        <div className="ads-visual">
          <div className="ads-photo-card">
            <img src={teamPhoto} alt="Jugadores entrenando en la cancha con el equipo técnico" />
          </div>
          <div className="ads-phone">
            <div className="ads-phone-frame">
              <div className="ads-phone-screen">
                <div className="ads-phone-notch" />
                <div className="ads-phone-badge">RS</div>
                <div className="ads-phone-lines">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="ads-phone-cta" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
