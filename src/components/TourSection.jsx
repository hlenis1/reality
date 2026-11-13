import { useState } from "react";
import miranda1 from "../assets/recorrido/miranda-1.jpg";
import miranda2 from "../assets/recorrido/miranda-2.jpg";
import miranda3 from "../assets/recorrido/miranda-3.jpg";
import miranda4 from "../assets/recorrido/miranda-4.jpg";

// Aquí puedes ir agregando más municipios a medida que avance el recorrido
const PARADAS_RECORRIDO = [
  {
    id: "miranda-cauca",
    municipio: "Miranda, Cauca",
    departamento: "Cauca",
    estado: "Parada #1 • Completada",
    descripcion:
      "Jornada de visorias y entrenamiento en el estadio municipal de Miranda, Cauca. Gran talento juvenil demostrando su nivel en la cancha.",
    fotos: [
      {
        src: miranda1,
        caption: "Charla técnica con los jugadores en el campo de Miranda, Cauca",
      },
      {
        src: miranda2,
        caption: "Cuerpo técnico y ojeadores evaluando el talento local",
      },
      {
        src: miranda3,
        caption: "Indicaciones tácticas antes de iniciar las pruebas",
      },
      {
        src: miranda4,
        caption: "Grupo completo de participantes en la jornada de visoria",
      },
    ],
  },
  // Ejemplo de cómo agregar el siguiente destino cuando vayan:
  // {
  //   id: "jamundi-valle",
  //   municipio: "Jamundí, Valle del Cauca",
  //   departamento: "Valle del Cauca",
  //   estado: "Próxima parada",
  //   descripcion: "Muy pronto estaremos llegando con nuestras visorias oficiales.",
  //   fotos: [],
  // },
];

export default function TourSection() {
  const [selectedId, setSelectedId] = useState(PARADAS_RECORRIDO[0].id);
  const [lightboxImg, setLightboxImg] = useState(null);

  const paradaActual =
    PARADAS_RECORRIDO.find((p) => p.id === selectedId) || PARADAS_RECORRIDO[0];

  return (
    <section className="tour-sec" id="recorrido-colombia">
      <style>{`
        .tour-sec {
          --bg-dark: #1A0A04;
          --bg-card: #2B1206;
          --accent: #FFC24B;
          --primary: #C2410C;
          --ink: #FFF3E8;
          --ink-dim: #F3C9A6;

          background: linear-gradient(180deg, #1A0A04 0%, #2B1206 100%);
          color: var(--ink);
          padding: 4.5rem 1.5rem;
          font-family: 'Barlow Condensed', system-ui, sans-serif;
          border-top: 2px solid rgba(255, 194, 75, 0.2);
        }

        .tour-container {
          max-width: 1050px;
          margin: 0 auto;
        }

        .tour-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .tour-badge {
          display: inline-block;
          background: rgba(255, 194, 75, 0.15);
          color: var(--accent);
          border: 1px solid var(--accent);
          padding: 0.3rem 1rem;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }

        .tour-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          text-transform: uppercase;
          margin: 0 0 0.6rem 0;
          line-height: 1;
          letter-spacing: 0.02em;
        }

        .tour-title span {
          color: var(--accent);
        }

        .tour-subtitle {
          color: var(--ink-dim);
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 1.8rem auto;
        }

        /* Selector desplegable estilizado */
        .tour-selector-wrap {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 1.2rem 1.8rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 194, 75, 0.3);
        }

        .tour-label {
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent);
          font-weight: 700;
        }

        .tour-select {
          appearance: none;
          background-color: #7A2A0C;
          color: #FFF3E8;
          font-family: 'Barlow Condensed', system-ui, sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 0.75rem 3rem 0.75rem 1.4rem;
          border: 2px solid var(--accent);
          border-radius: 8px;
          cursor: pointer;
          min-width: 270px;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFC24B' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.1em;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .tour-select:hover,
        .tour-select:focus {
          outline: none;
          box-shadow: 0 0 18px rgba(255, 194, 75, 0.35);
        }

        /* Tarjeta de información del municipio */
        .tour-info-box {
          background: rgba(122, 42, 12, 0.28);
          border-left: 4px solid var(--accent);
          padding: 1.4rem 1.8rem;
          border-radius: 0 12px 12px 0;
          margin-bottom: 2rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .tour-place-name {
          font-family: 'Anton', sans-serif;
          font-size: 1.9rem;
          text-transform: uppercase;
          margin: 0;
          color: #FFF;
        }

        .tour-place-status {
          background: var(--primary);
          color: #FFF;
          font-weight: 700;
          padding: 0.35rem 0.9rem;
          border-radius: 20px;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tour-place-desc {
          width: 100%;
          margin: 0.3rem 0 0 0;
          font-size: 1.15rem;
          color: var(--ink-dim);
        }

        /* Cuadrícula de fotos */
        .tour-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.2rem;
        }

        .tour-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          background: #000;
          border: 2px solid rgba(255, 194, 75, 0.2);
          cursor: pointer;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .tour-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
        }

        .tour-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .tour-card:hover img {
          transform: scale(1.05);
        }

        .tour-card-overlay {
          position: absolute;
          inset: auto 0 0 0;
          padding: 2rem 0.9rem 0.8rem 0.9rem;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.88));
          color: #FFF3E8;
          font-size: 0.98rem;
          line-height: 1.2;
        }

        /* Modal para ver la foto grande */
        .tour-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .tour-lightbox img {
          max-width: 92vw;
          max-height: 78vh;
          border-radius: 10px;
          border: 2px solid var(--accent);
        }

        .tour-lightbox p {
          color: #FFF3E8;
          font-size: 1.2rem;
          margin-top: 1rem;
          text-align: center;
        }

        .tour-lightbox-close {
          position: absolute;
          top: 1.2rem;
          right: 1.5rem;
          background: #DC2626;
          color: #FFF;
          border: none;
          padding: 0.5rem 1.1rem;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>

      <div className="tour-container">
        <div className="tour-header">
          <span className="tour-badge">🇨🇴 Gira Nacional de Visorias</span>
          <h2 className="tour-title">
            Empezó nuestro <span>recorrido</span>
          </h2>
          <p className="tour-subtitle">
            Selecciona el municipio de Colombia para ver las fotos y momentos de nuestras jornadas de selección.
          </p>

          <div className="tour-selector-wrap">
            <label htmlFor="municipio-select" className="tour-label">
              📍 Selecciona un destino del recorrido:
            </label>
            <select
              id="municipio-select"
              className="tour-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {PARADAS_RECORRIDO.map((parada) => (
                <option key={parada.id} value={parada.id}>
                  {parada.municipio}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detalle del municipio seleccionado */}
        <div className="tour-info-box">
          <h3 className="tour-place-name">📍 {paradaActual.municipio}</h3>
          <span className="tour-place-status">{paradaActual.estado}</span>
          <p className="tour-place-desc">{paradaActual.descripcion}</p>
        </div>

        {/* Galería de fotos */}
        {paradaActual.fotos.length > 0 ? (
          <div className="tour-grid">
            {paradaActual.fotos.map((foto, idx) => (
              <div
                key={idx}
                className="tour-card"
                onClick={() => setLightboxImg(foto)}
              >
                <img src={foto.src} alt={foto.caption} loading="lazy" />
                <div className="tour-card-overlay">{foto.caption}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#F3C9A6", fontSize: "1.2rem" }}>
            Próximamente publicaremos las fotos de esta parada.
          </p>
        )}
      </div>

      {/* Visor ampliado al hacer clic en una foto */}
      {lightboxImg && (
        <div className="tour-lightbox" onClick={() => setLightboxImg(null)}>
          <button
            type="button"
            className="tour-lightbox-close"
            onClick={() => setLightboxImg(null)}
          >
            ✖ Cerrar
          </button>
          <img
            src={lightboxImg.src}
            alt={lightboxImg.caption}
            onClick={(e) => e.stopPropagation()}
          />
          <p>{lightboxImg.caption}</p>
        </div>
      )}
    </section>
  );
}