import { useState, useEffect, useRef, useCallback } from "react";
import airportPhoto from "../assets/gira-aeropuerto.jpg";
import cupPhoto from "../assets/gira-copa.jpg";
import trainingPhoto from "../assets/gira-entrenamiento.jpg";

const SLIDES = [
  {
    image: airportPhoto,
    place: "Rumbo al torneo",
    caption: "Nuestros jugadores viajando para representar la cantera en el exterior.",
  },
  {
    image: cupPhoto,
    place: "Copa Cantera México",
    caption: "Subcampeones en la visoría oficial del Club América.",
  },
  {
    image: trainingPhoto,
    place: "Intercambio deportivo",
    caption: "Entrenando junto a equipos internacionales para elevar el nivel.",
  },
];

const AUTOPLAY_MS = 4500;

/**
 * GlobalReachCarousel
 * Carrusel de imágenes que muestra la proyección internacional del
 * equipo: giras, torneos e intercambios deportivos.
 */
export default function GlobalReachCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef(null);
  const timerRef = useRef(null);

  const goTo = useCallback((i) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  // pausar cuando el carrusel no está visible en pantalla
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // navegación con teclado cuando el carrusel tiene foco
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section className="grc" ref={rootRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow+Condensed:wght@500;600;700&display=swap');

        .grc {
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
          background: linear-gradient(175deg, var(--bg-1) 0%, var(--bg-0) 100%);
          font-family: 'Barlow Condensed', system-ui, sans-serif;
        }

        .grc-head {
          max-width: 720px;
          margin: 0 auto 2.6rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .grc-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
        }

        .grc-eyebrow::before,
        .grc-eyebrow::after {
          content: "";
          width: 22px;
          height: 2px;
          background: var(--accent);
        }

        .grc-title {
          font-family: 'Anton', sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          font-size: clamp(2rem, 4.4vw, 3.1rem);
          line-height: 1.02;
          color: var(--ink);
          margin: 0;
          text-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }

        .grc-title span {
          color: var(--accent);
        }

        .grc-carousel {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.4);
          outline: none;
        }

        .grc-carousel:focus-visible {
          box-shadow: 0 0 0 3px var(--accent), 0 24px 50px rgba(0, 0, 0, 0.4);
        }

        .grc-track {
          display: flex;
          transition: transform 0.55s cubic-bezier(0.65, 0, 0.35, 1);
        }

        .grc-slide {
          flex: 0 0 100%;
          position: relative;
          aspect-ratio: 16 / 9;
        }

        .grc-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .grc-slide::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(43, 18, 6, 0.85) 0%, rgba(43, 18, 6, 0) 45%);
        }

        .grc-caption {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          padding: 1.6rem 1.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .grc-caption-place {
          font-family: 'Anton', sans-serif;
          text-transform: uppercase;
          font-size: clamp(1.1rem, 2.4vw, 1.5rem);
          color: var(--accent);
          letter-spacing: 0.02em;
        }

        .grc-caption-text {
          margin: 0;
          color: var(--ink);
          font-size: 1rem;
          font-weight: 500;
          max-width: 46ch;
        }

        .grc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: rgba(43, 18, 6, 0.55);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(2px);
          transition: background 0.18s ease, transform 0.18s ease;
        }

        .grc-arrow:hover {
          background: var(--accent);
          color: var(--dark);
        }

        .grc-arrow:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        .grc-arrow svg {
          width: 20px;
          height: 20px;
        }

        .grc-arrow--prev { left: 14px; }
        .grc-arrow--next { right: 14px; }

        .grc-dots {
          display: flex;
          justify-content: center;
          gap: 0.55rem;
          margin-top: 1.4rem;
        }

        .grc-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          border: none;
          padding: 0;
          background: rgba(255, 243, 232, 0.35);
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .grc-dot:hover {
          background: rgba(255, 243, 232, 0.6);
        }

        .grc-dot--active {
          background: var(--accent);
          transform: scale(1.25);
        }

        @media (max-width: 560px) {
          .grc-caption {
            padding: 1.1rem 1.1rem;
          }
          .grc-arrow {
            width: 36px;
            height: 36px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .grc-track {
            transition: none;
          }
        }
      `}</style>

      <div className="grc-head">
        <span className="grc-eyebrow">Proyección internacional</span>
        <h2 className="grc-title">
          Nuestro equipo le da la vuelta al <span>planeta</span> transmitiendo
          conocimiento en nuestras canteras y futbolistas profesionales
        </h2>
      </div>

      <div
        className="grc-carousel"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Galería de la gira internacional del equipo"
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="grc-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div className="grc-slide" key={i} aria-hidden={i !== index}>
              <img src={slide.image} alt={slide.caption} loading="lazy" />
              <div className="grc-caption">
                <span className="grc-caption-place">{slide.place}</span>
                <p className="grc-caption-text">{slide.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="grc-arrow grc-arrow--prev"
          onClick={prev}
          aria-label="Imagen anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          className="grc-arrow grc-arrow--next"
          onClick={next}
          aria-label="Siguiente imagen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grc-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`grc-dot${i === index ? " grc-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </section>
  );
}
